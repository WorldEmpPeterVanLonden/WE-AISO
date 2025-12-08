import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const adminConfig = {
  credential: cert(JSON.parse(process.env.NEXT_SERVER_ADMIN_KEY!)),
};

export const adminApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(adminConfig);

export const adminDb = getFirestore(adminApp);
