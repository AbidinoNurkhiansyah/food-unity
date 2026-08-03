import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

try {
  let serviceAccount = null;

  // 1. Coba baca dari Environment Variable (Untuk Production di Railway)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    serviceAccount = JSON.parse(decoded);
    console.log("Firebase Admin initialized successfully from Environment Variable (Base64)");
  } else {
    // 2. Fallback baca dari file lokal (Untuk Development)
    const possiblePaths = [
      path.resolve(__dirname, '../serviceAccountKey.json'),
      path.resolve(process.cwd(), 'serviceAccountKey.json'),
      path.resolve(process.cwd(), 'backend', 'serviceAccountKey.json'),
    ];

    const keyPath = possiblePaths.find(p => fs.existsSync(p));
    if (keyPath) {
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      console.log("Firebase Admin initialized successfully from:", keyPath);
    } else {
      console.warn("⚠️ serviceAccountKey.json not found! Firebase Admin operations will fail.");
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export { admin, db };
