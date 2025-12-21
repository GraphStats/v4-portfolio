const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const crypto = require('crypto');

// Configuration Firebase (utilise les mêmes credentials que le client)
const firebaseConfig = {
    projectId: "docky-dev-fr",
    // Pour Firebase Admin, on n'a pas besoin de toutes les clés
};

// Initialiser Firebase Admin
const app = initializeApp({
    credential: cert({
        projectId: firebaseConfig.projectId,
        // Note: Pour utiliser Firebase Admin en production, vous aurez besoin d'un service account
        // Pour le développement local, on va utiliser l'émulateur ou les credentials par défaut
    })
});

const db = getFirestore(app);

async function createAdmin() {
    try {
        const email = 'graphstats.pro@gmail.com';
        const password = 'SamCloud2024';

        // Générer le hash du mot de passe
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        console.log('\n🔐 Création du compte admin...\n');
        console.log('Email:', email);
        console.log('Hash:', hashedPassword);

        // Ajouter le document dans Firestore
        const docRef = await db.collection('admins').add({
            email: email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        });

        console.log('\n✅ Compte admin créé avec succès !');
        console.log('Document ID:', docRef.id);
        console.log('\n🎉 Vous pouvez maintenant vous connecter sur /admin');
        console.log('   Email:', email);
        console.log('   Mot de passe: SamCloud2024\n');

    } catch (error) {
        console.error('\n❌ Erreur lors de la création du compte admin:');
        console.error(error.message);
        console.log('\n💡 Assurez-vous que:');
        console.log('   1. Vous êtes connecté à Firebase (firebase login)');
        console.log('   2. Vous avez les permissions nécessaires');
        console.log('   3. Firestore est activé dans votre projet\n');
    }

    process.exit(0);
}

createAdmin();
