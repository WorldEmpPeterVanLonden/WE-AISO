// src/firebase/admin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  // 1) Dev / Firebase Studio: NEXT_SERVER_ADMIN_KEY
  // 2) App Hosting: FIREBASE_SERVICE_ACCOUNT (uit apphosting.yaml)
  const serviceAccountString =
    process.env.NEXT_SERVER_ADMIN_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    throw new Error(
      "Missing service account: set NEXT_SERVER_ADMIN_KEY (dev/Studio) or FIREBASE_SERVICE_ACCOUNT (App Hosting)."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountString)),
  });
}

export const adminDb = admin.firestore();
