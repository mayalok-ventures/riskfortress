const BASE_URL =
  'https://firestore.googleapis.com/v1/projects/mayalok-ventures/databases/risk-fortress/documents'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DocSnapshot {
  exists: boolean
  id: string
  data(): Record<string, unknown> | undefined
}

export interface QuerySnapshot {
  empty: boolean
  docs: Array<{ id: string; data(): Record<string, unknown> }>
}

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { timestampValue: string }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values?: FirestoreValue[] } }

// ---------------------------------------------------------------------------
// Value conversion helpers
// ---------------------------------------------------------------------------

export function toFirestoreValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) {
    return { nullValue: null }
  }
  if (typeof val === 'string') {
    return { stringValue: val }
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val }
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) }
    }
    return { doubleValue: val }
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } }
  }
  if (typeof val === 'object') {
    return { mapValue: { fields: toFirestoreFields(val as Record<string, unknown>) } }
  }
  return { stringValue: String(val) }
}

export function fromFirestoreValue(val: FirestoreValue): unknown {
  if ('stringValue' in val) return val.stringValue
  if ('integerValue' in val) return Number(val.integerValue)
  if ('doubleValue' in val) return val.doubleValue
  if ('booleanValue' in val) return val.booleanValue
  if ('nullValue' in val) return null
  if ('timestampValue' in val) return val.timestampValue
  if ('mapValue' in val) return fromFirestoreFields(val.mapValue.fields)
  if ('arrayValue' in val) return (val.arrayValue.values ?? []).map(fromFirestoreValue)
  return null
}

export function toFirestoreFields(
  obj: Record<string, unknown>
): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {}
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = toFirestoreValue(value)
  }
  return fields
}

export function fromFirestoreFields(
  fields: Record<string, FirestoreValue> | undefined
): Record<string, unknown> {
  if (!fields) return {}
  const obj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(fields)) {
    obj[key] = fromFirestoreValue(value as FirestoreValue)
  }
  return obj
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function extractDocId(name: string): string {
  const parts = name.split('/')
  return parts[parts.length - 1]
}

function docUrl(collectionName: string, docId: string): string {
  return `${BASE_URL}/${collectionName}/${docId}`
}

// ---------------------------------------------------------------------------
// CRUD operations
// ---------------------------------------------------------------------------

export async function getDoc(
  collectionName: string,
  docId: string
): Promise<DocSnapshot> {
  const res = await fetch(docUrl(collectionName, docId))

  if (res.status === 404) {
    return { exists: false, id: docId, data: () => undefined }
  }

  if (!res.ok) {
    throw new Error(`Firestore getDoc failed: ${res.status} ${await res.text()}`)
  }

  const doc = (await res.json()) as { name: string; fields?: Record<string, FirestoreValue> }
  const data = fromFirestoreFields(doc.fields)

  return {
    exists: true,
    id: extractDocId(doc.name),
    data: () => data,
  }
}

export async function setDoc(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const url = docUrl(collectionName, docId)
  const body = JSON.stringify({ fields: toFirestoreFields(data) })

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Firestore setDoc failed: ${res.status} ${await res.text()}`)
  }
}

export async function updateDoc(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const fieldPaths = Object.keys(data)
  const params = fieldPaths
    .map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`)
    .join('&')
  const url = `${docUrl(collectionName, docId)}?${params}`
  const body = JSON.stringify({ fields: toFirestoreFields(data) })

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Firestore updateDoc failed: ${res.status} ${await res.text()}`)
  }
}

export async function deleteDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  const res = await fetch(docUrl(collectionName, docId), { method: 'DELETE' })

  if (!res.ok && res.status !== 404) {
    throw new Error(`Firestore deleteDoc failed: ${res.status} ${await res.text()}`)
  }
}

export async function addDoc(
  collectionName: string,
  data: Record<string, unknown>
): Promise<string> {
  const url = `${BASE_URL}/${collectionName}`
  const body = JSON.stringify({ fields: toFirestoreFields(data) })

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Firestore addDoc failed: ${res.status} ${await res.text()}`)
  }

  const doc = (await res.json()) as { name: string }
  return extractDocId(doc.name)
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

interface WhereFilter {
  field: string
  op: '==' | '<' | '<=' | '>' | '>=' | '!=' | 'array-contains' | 'in'
  value: unknown
}

const OP_MAP: Record<string, string> = {
  '==': 'EQUAL',
  '!=': 'NOT_EQUAL',
  '<': 'LESS_THAN',
  '<=': 'LESS_THAN_OR_EQUAL',
  '>': 'GREATER_THAN',
  '>=': 'GREATER_THAN_OR_EQUAL',
  'array-contains': 'ARRAY_CONTAINS',
  in: 'IN',
}

function buildFieldFilter(filter: WhereFilter) {
  return {
    fieldFilter: {
      field: { fieldPath: filter.field },
      op: OP_MAP[filter.op] || 'EQUAL',
      value: toFirestoreValue(filter.value),
    },
  }
}

export async function queryDocs(
  collectionName: string,
  filters: WhereFilter[],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc'
): Promise<QuerySnapshot> {
  const url = `${BASE_URL}:runQuery`

  const structuredQuery: Record<string, unknown> = {
    from: [{ collectionId: collectionName }],
  }

  if (filters.length === 1) {
    structuredQuery.where = buildFieldFilter(filters[0])
  } else if (filters.length > 1) {
    structuredQuery.where = {
      compositeFilter: {
        op: 'AND',
        filters: filters.map(buildFieldFilter),
      },
    }
  }

  if (orderByField) {
    structuredQuery.orderBy = [
      {
        field: { fieldPath: orderByField },
        direction: orderDirection === 'asc' ? 'ASCENDING' : 'DESCENDING',
      },
    ]
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery }),
  })

  if (!res.ok) {
    throw new Error(`Firestore queryDocs failed: ${res.status} ${await res.text()}`)
  }

  const results = (await res.json()) as Array<{
    document?: { name: string; fields?: Record<string, FirestoreValue> }
    readTime?: string
  }>

  const docs = results
    .filter((r) => r.document)
    .map((r) => {
      const d = r.document!
      const data = fromFirestoreFields(d.fields)
      return {
        id: extractDocId(d.name),
        data: () => data,
      }
    })

  return {
    empty: docs.length === 0,
    docs,
  }
}
