import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const LOCAL_SA_PATH = "./keys/sa.json";

/**
 * Laadt het service account:
 * - lokaal vanuit bestand
 * - in deployment vanuit environment secret (FIREBASE_SERVICE_ACCOUNT)
 */
function loadServiceAccount() {
  // 1) Lokaal → keys/sa.json gebruiken
  if (fs.existsSync(LOCAL_SA_PATH)) {
    console.log(`[Firebase Admin] Using local service account file: ${LOCAL_SA_PATH}`);
    const file = fs.readFileSync(LOCAL_SA_PATH, "utf8");
    return JSON.parse(file);
  }

  // 2) Deployment / App Hosting → environment secret gebruiken
  const rawNext = process.env.NEXT_SERVER_ADMIN_KEY;
  const rawFirebase = process.env.FIREBASE_SERVICE_ACCOUNT;

  // ⛔ Lege strings uitsluiten
  const raw =
    (rawNext && rawNext.trim().length > 0 ? rawNext : null) ||
    (rawFirebase && rawFirebase.trim().length > 0 ? rawFirebase : null);

  if (!raw) {
    throw new Error(
      "FATAL: No service account found. Provide FIREBASE_SERVICE_ACCOUNT (App Hosting) or keys/sa.json locally."
    );
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Service Account ENV contains invalid JSON:", raw);
    throw e;
  }
}

let app;

if (!getApps().length) {
  const sa = loadServiceAccount();

  app = initializeApp({
    credential: cert(sa),
  });

  console.log("[Firebase Admin] Initialized");
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
