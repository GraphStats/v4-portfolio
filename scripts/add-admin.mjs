import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import crypto from 'crypto';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAjmXMMafuPYkYi1GzrnucNJSjxypN2gYQ",
    authDomain: "docky-dev-fr.firebaseapp.com",
    projectId: "docky-dev-fr",
    storageBucket: "docky-dev-fr.firebasestorage.app",
    messagingSenderId: "548202839817",
    appId: "1:548202839817:web:832f713ae5135e41809dd8",
    measurementId: "G-KLXHVFYQYY"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createAdmin() {
    try {
        const email = 'graphstats.pro@gmail.com';
        const password = 'SamCloud2024';

        // Générer le hash du mot de passe (même méthode que dans auth.ts)
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        console.log('\n🔐 Création du compte admin...\n');
        console.log('Email:', email);
        console.log('Hash:', hashedPassword);

        // Ajouter le document dans Firestore
        const docRef = await addDoc(collection(db, 'admins'), {
            email: email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        });

        console.log('\n✅ Compte admin créé avec succès !');
        console.log('Document ID:', docRef.id);
        console.log('\n🎉 Vous pouvez maintenant vous connecter sur /admin');
        console.log('   Email:', email);
        console.log('   Mot de passe: SamCloud2024\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erreur lors de la création du compte admin:');
        console.error(error);
        console.log('\n💡 Vérifiez que:');
        console.log('   1. Firestore est activé dans Firebase Console');
        console.log('   2. Les règles de sécurité permettent l\'écriture');
        console.log('   3. La configuration Firebase est correcte\n');
        process.exit(1);
    }
}

createAdmin();
