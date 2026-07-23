import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

try {
  const possiblePaths = [
    path.resolve(__dirname, '../serviceAccountKey.json'),
    path.resolve(process.cwd(), 'serviceAccountKey.json'),
    path.resolve(process.cwd(), 'backend', 'serviceAccountKey.json'),
  ];

  const keyPath = possiblePaths.find(p => fs.existsSync(p));

  if (keyPath) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully from:", keyPath);
    db = admin.firestore();
  } else {
    console.warn("⚠️ serviceAccountKey.json not found! Firebase Admin operations will fail.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export { admin, db };
