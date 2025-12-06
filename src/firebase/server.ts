import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export async function getFirebase() {
  if (getApps().length === 0) {
    // In this environment, the service account is automatically discovered.
    // We don't need to manually parse the service account JSON.
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    auth = getAuth(app);
    firestore = getFirestore(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return { app, auth, firestore };
}
