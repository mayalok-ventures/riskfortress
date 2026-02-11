#!/usr/bin/env node
/**
 * RiskFortress Migration Script: Cloudflare D1 + KV -> Firebase Firestore
 * 
 * This script fetches all content from the old Cloudflare API endpoints
 * and writes them to the Firebase Firestore 'risk-fortress' database.
 * 
 * Prerequisites:
 *   - The old Cloudflare site must still be accessible (or use a backup)
 *   - Firebase Firestore 'risk-fortress' database must exist with open rules
 * 
 * Usage:
 *   node scripts/migrate-d1-to-firebase.js
 *   node scripts/migrate-d1-to-firebase.js --source=https://riskfortress.in
 *   node scripts/migrate-d1-to-firebase.js --file=backup.json
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDocs, collection } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: 'AIzaSyCwJTYBxGlTdIxxowpt5sMpJHJBikneYOE',
    authDomain: 'mayalok-ventures.firebaseapp.com',
    projectId: 'mayalok-ventures',
    storageBucket: 'mayalok-ventures.firebasestorage.app',
    messagingSenderId: '6750906250',
    appId: '1:6750906250:web:c4fa192df9fc18beee0a73',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'risk-fortress');

const fs = require('fs');
const path = require('path');

function stripUndefined(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
    );
}

async function fetchFromCloudflare(sourceUrl) {
    console.log(`\nFetching content from ${sourceUrl}/api/content ...`);
    try {
        const response = await fetch(`${sourceUrl}/api/content`);
        if (!response.ok) {
            console.error(`HTTP ${response.status}: ${response.statusText}`);
            return [];
        }
        const items = await response.json();
        console.log(`Found ${items.length} items from Cloudflare.`);
        return items;
    } catch (error) {
        console.error(`Failed to fetch from Cloudflare: ${error.message}`);
        return [];
    }
}

function loadFromFile(filePath) {
    console.log(`\nLoading content from file: ${filePath}`);
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        const items = Array.isArray(data) ? data : data.items || data.content || [];
        console.log(`Found ${items.length} items in file.`);
        return items;
    } catch (error) {
        console.error(`Failed to load file: ${error.message}`);
        return [];
    }
}

async function migrateToFirestore(items) {
    console.log(`\nMigrating ${items.length} items to Firestore...`);
    let success = 0;
    let failed = 0;

    for (const item of items) {
        try {
            const docId = item.id;
            if (!docId) {
                console.warn(`  Skipping item without id: ${item.title || 'unknown'}`);
                failed++;
                continue;
            }

            const docData = stripUndefined({
                id: item.id,
                type: item.type || 'article',
                title: item.title || '',
                slug: item.slug || '',
                content: item.content || '',
                summary: item.summary || '',
                thumbnail: item.thumbnail,
                images: item.images,
                author: item.author || 'RiskFortress Intelligence Team',
                keywords: item.keywords || [],
                status: item.status || 'draft',
                createdAt: item.createdAt || item.created_at || new Date().toISOString(),
                updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
                publishedAt: item.publishedAt || item.published_at,
                sector: item.sector,
                threatLevel: item.threatLevel || item.threat_level,
                confidence: item.confidence,
                location: item.location,
                caseStatus: item.caseStatus || item.case_status,
            });

            await setDoc(doc(db, 'content', docId), docData);
            console.log(`  Migrated: ${item.title} (${docId})`);
            success++;
        } catch (error) {
            console.error(`  Failed: ${item.title || item.id} - ${error.message}`);
            failed++;
        }
    }

    return { success, failed };
}

async function verifyMigration() {
    console.log('\nVerifying migration...');
    const snapshot = await getDocs(collection(db, 'content'));
    console.log(`Firestore 'content' collection now has ${snapshot.size} documents.`);

    if (snapshot.size > 0) {
        console.log('\nDocuments:');
        snapshot.docs.forEach(d => {
            const data = d.data();
            console.log(`  - [${data.type}] ${data.title} (${data.status})`);
        });
    }

    return snapshot.size;
}

async function main() {
    const args = process.argv.slice(2);
    let sourceUrl = 'https://riskfortress.in';
    let filePath = null;

    for (const arg of args) {
        if (arg.startsWith('--source=')) {
            sourceUrl = arg.split('=')[1];
        } else if (arg.startsWith('--file=')) {
            filePath = arg.split('=')[1];
        }
    }

    console.log('='.repeat(60));
    console.log('RiskFortress Migration: D1/KV -> Firebase Firestore');
    console.log('='.repeat(60));

    let items = [];

    if (filePath) {
        items = loadFromFile(filePath);
    } else {
        items = await fetchFromCloudflare(sourceUrl);
    }

    if (items.length === 0) {
        console.log('\nNo items to migrate.');
        console.log('\nIf the old API is no longer available, you can:');
        console.log('  1. Export data from Cloudflare D1 Dashboard as JSON');
        console.log('  2. Save it as a file (e.g., backup.json)');
        console.log('  3. Run: node scripts/migrate-d1-to-firebase.js --file=backup.json');
        process.exit(0);
    }

    const { success, failed } = await migrateToFirestore(items);

    console.log('\n' + '='.repeat(60));
    console.log(`Migration complete: ${success} succeeded, ${failed} failed`);
    console.log('='.repeat(60));

    await verifyMigration();

    process.exit(0);
}

main().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
