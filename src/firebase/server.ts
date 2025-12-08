import * as admin from 'firebase-admin';
import serviceAccount from '../../keys/service-account.json';

const initializeAdminApp = () => {
    if (admin.apps.length > 0) {
        return admin.apps[0]!;
    }
    
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: serviceAccount.project_id,
    });
};

const adminApp = initializeAdminApp();
const auth = admin.auth(adminApp);
const firestore = admin.firestore(adminApp);

export async function getFirebase() {
  return { auth, firestore };
}
