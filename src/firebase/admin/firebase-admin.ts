import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const LOCAL_SA_PATH = "./keys/sa.json";

function loadServiceAccount() {
  // 1) Local dev → keys/sa.json
  if (fs.existsSync(LOCAL_SA_PATH)) {
    console.log("[Firebase Admin] Using local service account file");
    return JSON.parse(fs.readFileSync(LOCAL_SA_PATH, "utf8"));
  }

  // 2) Firebase App Hosting → FIREBASE_SERVICE_ACCOUNT
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    throw new Error(
      "FATAL: No service account found. Expected FIREBASE_SERVICE_ACCOUNT from App Hosting."
    );
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON in FIREBASE_SERVICE_ACCOUNT:", raw);
    throw e;
  }
}

let app;

if (!getApps().length) {
  const sa = loadServiceAccount();
  app = initializeApp({ credential: cert(sa) });
  console.log("[Firebase Admin] Initialized.");
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
