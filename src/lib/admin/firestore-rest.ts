const BASE_URL =
    'https://firestore.googleapis.com/v1/projects/mayalok-ventures/databases/risk-fortress/documents'

type FirestoreValue =
    | { stringValue: string }
    | { integerValue: string }
    | { doubleValue: number }
    | { booleanValue: boolean }
    | { nullValue: null }
    | { mapValue: { fields: Record<string, FirestoreValue> } }
    | { arrayValue: { values?: FirestoreValue[] } }

function toValue(val: unknown): FirestoreValue {
    if (val === null || val === undefined) return { nullValue: null }
    if (typeof val === 'string') return { stringValue: val }
    if (typeof val === 'boolean') return { booleanValue: val }
    if (typeof val === 'number') {
        return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val }
    }
    if (Array.isArray(val)) {
        return { arrayValue: { values: val.map(toValue) } }
    }
    if (typeof val === 'object') {
        return { mapValue: { fields: toFields(val as Record<string, unknown>) } }
    }
    return { stringValue: String(val) }
}

function fromValue(val: FirestoreValue): unknown {
    if ('stringValue' in val) return val.stringValue
    if ('integerValue' in val) return Number(val.integerValue)
    if ('doubleValue' in val) return val.doubleValue
    if ('booleanValue' in val) return val.booleanValue
    if ('nullValue' in val) return null
    if ('mapValue' in val) return fromFields(val.mapValue.fields)
    if ('arrayValue' in val) return (val.arrayValue.values ?? []).map(fromValue)
    return null
}

function toFields(obj: Record<string, unknown>): Record<string, FirestoreValue> {
    const fields: Record<string, FirestoreValue> = {}
    for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) fields[k] = toValue(v)
    }
    return fields
}

function fromFields(fields?: Record<string, FirestoreValue>): Record<string, unknown> {
    if (!fields) return {}
    const obj: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(fields)) {
        obj[k] = fromValue(v as FirestoreValue)
    }
    return obj
}

export async function restGetDoc(collection: string, docId: string): Promise<Record<string, unknown> | null> {
    const res = await fetch(`${BASE_URL}/${collection}/${docId}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Firestore GET failed: ${res.status}`)
    const doc = await res.json()
    return fromFields(doc.fields) as Record<string, unknown>
}

export async function restSetDoc(collection: string, docId: string, data: Record<string, unknown>): Promise<void> {
    const res = await fetch(`${BASE_URL}/${collection}/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toFields(data) }),
    })
    if (!res.ok) throw new Error(`Firestore SET failed: ${res.status}`)
}
