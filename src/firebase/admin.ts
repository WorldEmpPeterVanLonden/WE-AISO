// src/firebase/admin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  // Use FIREBASE_ADMIN_KEY for local dev, fallback to FIREBASE_SERVICE_ACCOUNT for production
  const serviceAccountString = process.env.FIREBASE_ADMIN_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountString) {
    throw new Error("A Firebase service account environment variable (FIREBASE_ADMIN_KEY or FIREBASE_SERVICE_ACCOUNT) is not set.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountString)),
  });
}

export const adminDb = admin.firestore();
