const crypto = require('crypto');

const password = 'SamCloud2024';
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n=== COMPTE ADMIN ===\n');
console.log('Email: graphstats.pro@gmail.com');
console.log('Mot de passe: SamCloud2024');
console.log('Hash SHA-256:', hash);
console.log('\n=== DOCUMENT FIRESTORE ===\n');
console.log(JSON.stringify({
    email: 'graphstats.pro@gmail.com',
    password: hash,
    created_at: new Date().toISOString()
}, null, 2));
console.log('\n');
