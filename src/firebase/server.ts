import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function getServiceAccount() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  return JSON.parse(serviceAccount);
}

export async function getFirebase() {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: credential.cert(getServiceAccount())
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
