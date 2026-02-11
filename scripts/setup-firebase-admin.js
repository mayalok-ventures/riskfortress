#!/usr/bin/env node
/**
 * RiskFortress Firebase Admin Setup
 * 
 * Sets up the admin_config document in Firestore with the password hash
 * and other configuration needed for the admin panel.
 * 
 * Usage:
 *   node scripts/setup-firebase-admin.js "your-admin-password"
 * 
 * This will:
 *   1. Hash the password with SHA-256
 *   2. Create/update the secrets/admin_config document in Firestore
 *   3. Set the ADMIN_PASSWORD_HASH field
 */

const crypto = require('crypto');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: 'AIzaSyCwJTYBxGlTdIxxowpt5sMpJHJBikneYOE',
    authDomain: 'mayalok-ventures.firebaseapp.com',
    projectId: 'mayalok-ventures',
    storageBucket: 'mayalok-ventures.firebasestorage.app',
    messagingSenderId: '6750906250',
    appId: '1:6750906250:web:c4fa192df9fc18beee0a73',
    measurementId: 'G-68BYZ14PBC',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'risk-fortress');

function generateHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
    const password = process.argv[2];

    if (!password) {
        console.error('\nError: No password provided\n');
        console.log('Usage: node scripts/setup-firebase-admin.js "your-admin-password"\n');
        process.exit(1);
    }

    const hash = generateHash(password);
    
    console.log('\n' + '='.repeat(60));
    console.log('RiskFortress Firebase Admin Setup');
    console.log('='.repeat(60) + '\n');

    try {
        const configRef = doc(db, 'secrets', 'admin_config');
        const existing = await getDoc(configRef);
        
        const configData = existing.exists() ? existing.data() : {};
        
        await setDoc(configRef, {
            ...configData,
            ADMIN_PASSWORD_HASH: hash,
            updatedAt: new Date().toISOString(),
        }, { merge: true });

        console.log('Admin password hash saved to Firestore successfully.');
        console.log('Password:', '*'.repeat(password.length));
        console.log('Hash:', hash);
        console.log('\nDocument: secrets/admin_config');
        console.log('Database: risk-fortress');
        console.log('\nYou can now log in to the admin panel at /rfadmin\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Failed to save to Firestore:', error.message);
        process.exit(1);
    }
}

main();
