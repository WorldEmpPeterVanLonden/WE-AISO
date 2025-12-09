import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function loadServiceAccount() {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    process.env.NEXT_SERVER_ADMIN_KEY;

  if (!raw) {
    throw new Error(
      "FATAL: FIREBASE_SERVICE_ACCOUNT (App Hosting) or NEXT_SERVER_ADMIN_KEY (local) is missing."
    );
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Service account JSON failed to parse:", raw);
    throw new Error("Invalid JSON in FIREBASE_SERVICE_ACCOUNT");
  }
}

let adminApp;

if (!getApps().length) {
  const sa = loadServiceAccount();
  adminApp = initializeApp({
    credential: cert(sa),
  });
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
