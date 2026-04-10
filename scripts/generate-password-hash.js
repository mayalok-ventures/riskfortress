#!/usr/bin/env node
/**
 * RiskFortress Password Hash Generator
 * 
 * This script generates a SHA-256 hash of your admin password.
 * Store the generated hash in Cloudflare environment variables (ENCRYPTED).
 * 
 * Usage:
 *   node scripts/generate-password-hash.js "your-secure-password"
 * 
 * Then add to Cloudflare Dashboard:
 *   Workers & Pages > Your Project > Settings > Environment Variables
 *   Name: ADMIN_PASSWORD_HASH
 *   Value: [the generated hash]
 *   Type: Encrypted
 */

const crypto = require('crypto');

function generateHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const password = process.argv[2];

if (!password) {
    console.error('\\n❌ Error: No password provided\\n');
    console.log('Usage: node scripts/generate-password-hash.js "your-secure-password"\\n');
    console.log('Example: node scripts/generate-password-hash.js "MySecureP@ssw0rd123"\\n');
    process.exit(1);
}

if (password.length < 12) {
    console.warn('\\n⚠️  Warning: Password is shorter than 12 characters. Consider using a stronger password.\\n');
}

const hash = generateHash(password);

console.log('\\n' + '='.repeat(60));
console.log('🔐 RiskFortress Password Hash Generator');
console.log('='.repeat(60) + '\\n');

console.log('Password:', '*'.repeat(password.length));
console.log('Hash Algorithm: SHA-256');
console.log('\\n📋 Generated Hash:\\n');
console.log(hash);

console.log('\\n' + '='.repeat(60));
console.log('📝 SETUP INSTRUCTIONS');
console.log('='.repeat(60));
console.log('\\n1. Go to Cloudflare Dashboard');
console.log('2. Navigate to: Workers & Pages > riskfortress > Settings');
console.log('3. Click "Environment Variables"');
console.log('4. Add new variable:');
console.log('   - Name: ADMIN_PASSWORD_HASH');
console.log('   - Value: ' + hash);
console.log('   - Type: Select "Encrypted"');
console.log('5. Click Save\\n');

console.log('⚠️  SECURITY NOTES:');
console.log('   - Never commit the password or hash to git');
console.log('   - Use different passwords for production and staging');
console.log('   - Rotate passwords periodically');
console.log('   - Store the original password securely (password manager)\\n');
