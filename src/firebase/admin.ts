// src/firebase/admin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const rawServiceAccountString =
    process.env.NEXT_SERVER_ADMIN_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawServiceAccountString) {
    throw new Error(
      "Missing service account: set NEXT_SERVER_ADMIN_KEY (dev/Studio) or FIREBASE_SERVICE_ACCOUNT (App Hosting)."
    );
  }

  // A more robust way to clean the service account string.
  // 1. Trim whitespace from the start and end.
  // 2. Remove potential surrounding quotes (' or ").
  // 3. Replace escaped newlines with actual newlines for the private key.
  const cleanServiceAccountString = rawServiceAccountString
    .trim()
    .replace(/^"|"$/g, "") // Remove surrounding quotes
    .replace(/\\n/g, "\n"); // Replace escaped newlines

  try {
    const serviceAccount = JSON.parse(cleanServiceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("FATAL ERROR parsing Service Account JSON. String after cleaning:", cleanServiceAccountString);
    throw new Error(`Failed to initialize Firebase Admin SDK: Check if the JSON secret is correctly formatted. Original error: ${error}`);
  }
}

export const adminDb = admin.firestore();
