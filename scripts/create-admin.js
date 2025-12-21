// Script pour créer un compte admin
// Usage: node scripts/create-admin.js <email> <password>

const crypto = require('crypto');

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error('Usage: node scripts/create-admin.js <email> <password>');
        process.exit(1);
    }

    const hashedPassword = await hashPassword(password);
    const created_at = new Date().toISOString();

    console.log('\n=== Admin Account Details ===\n');
    console.log('Email:', email);
    console.log('Password Hash:', hashedPassword);
    console.log('Created At:', created_at);
    console.log('\n=== Firestore Document ===\n');
    console.log(JSON.stringify({
        email,
        password: hashedPassword,
        created_at
    }, null, 2));
    console.log('\n=== Instructions ===\n');
    console.log('1. Allez sur https://console.firebase.google.com/');
    console.log('2. Sélectionnez votre projet: docky-dev-fr');
    console.log('3. Allez dans Firestore Database');
    console.log('4. Créez ou ouvrez la collection "admins"');
    console.log('5. Cliquez sur "Ajouter un document"');
    console.log('6. Laissez l\'ID auto-généré');
    console.log('7. Copiez-collez les données JSON ci-dessus');
    console.log('\n');
}

main().catch(console.error);
