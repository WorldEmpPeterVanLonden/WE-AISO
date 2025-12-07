
import { initializeApp, getApps, getApp, type FirebaseApp, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import serviceAccount from '@/../keys/service-account.json';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export async function getFirebase() {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: {
        projectId: (serviceAccount as ServiceAccount).project_id,
        clientEmail: (serviceAccount as ServiceAccount).client_email,
        privateKey: (serviceAccount as ServiceAccount).private_key,
      },
      projectId: serviceAccount.project_id,
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
