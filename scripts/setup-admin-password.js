const crypto = require('crypto');

const PASSWORD = 'Mflica2026pswriskfortress@';
const hash = crypto.createHash('sha256').update(PASSWORD).digest('hex');

const BASE_URL =
  'https://firestore.googleapis.com/v1/projects/mayalok-ventures/databases/riskfortress/documents';

console.log('=== RiskFortress Admin Password Setup ===\n');
console.log('Password:', PASSWORD);
console.log('SHA-256 Hash:', hash);
console.log('\n--- Firestore REST API curl command ---\n');
console.log(
  `curl -X PATCH "${BASE_URL}/secrets/admin_config" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
    fields: {
      ADMIN_PASSWORD_HASH: { stringValue: hash },
    },
  })}'`
);
console.log('\nRun the curl command above to store the hash in Firestore.');
