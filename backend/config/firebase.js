import admin from 'firebase-admin';
import fs from 'fs';

let db = null;

try {
  if (fs.existsSync('./serviceAccountKey.json')) {
    const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
    db = admin.firestore();
  } else {
    console.warn("⚠️ serviceAccountKey.json not found! Firebase Admin operations will fail.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export { admin, db };
