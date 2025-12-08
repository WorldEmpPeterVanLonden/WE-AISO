
'use client';

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

// Re-export hooks
export { useUser } from './auth/useUser';
export { useFirestore, useAuth, useFirebaseApp } from './provider';

// Re-export providers
export { FirebaseProvider } from './provider';
export { FirebaseClientProvider } from './client-provider';


let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function getFirebase() {
  if (!firebaseApp) {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(firebaseConfig);
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }

  return { firebaseApp, auth, firestore };
}
