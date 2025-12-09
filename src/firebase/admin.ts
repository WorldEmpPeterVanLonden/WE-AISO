// src/firebase/admin.ts
import * as admin from "firebase-admin";
import * as fs from 'fs'; // Importeer de file system module

const FIREBASE_LOCAL_SA_PATH = './keys/sa.json'; // Ons lokale bestandspad

/**
 * Laadt het Service Account: Eerst proberen we het lokale bestand te lezen
 * (om .env/shell-escapingsproblemen te omzeilen), dan vallen we terug op de environment variable (PROD/deployment).
 */
const loadServiceAccount = () => {
    // 1. Probeer lokaal bestand te lezen (betrouwbaarst voor lokale JSON met \n)
    if (fs.existsSync(FIREBASE_LOCAL_SA_PATH)) {
        console.log(`[Firebase Admin] Laadt Service Account van lokaal bestand: ${FIREBASE_LOCAL_SA_PATH}`);
        try {
            const fileContent = fs.readFileSync(FIREBASE_LOCAL_SA_PATH, 'utf-8');
            // De content is al geldige JSON uit het bestand, geen cleanup nodig
            return JSON.parse(fileContent);
        } catch (e) {
            console.error(`[Firebase Admin] Fout bij parsen van lokaal bestand ${FIREBASE_LOCAL_SA_PATH}:`, e);
            // We gooien hier GEEN fout, we vallen terug naar de .env check
        }
    }

    // 2. Als lokaal bestand niet werkt, val terug op de environment variable (NODIG VOOR DEPLOYMENT)
    const rawServiceAccountString =
        process.env.NEXT_SERVER_ADMIN_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!rawServiceAccountString) {
        throw new Error(
            "Missing service account: Set NEXT_SERVER_ADMIN_KEY (local .env) or ensure sa.json exists locally."
        );
    }

    // 3. Probeer de environment string te parsen (met cleanup voor deployment)
    const cleanString = rawServiceAccountString.trim().replace(/^['"]|['"]$/g, ''); 
    
    try {
        return JSON.parse(cleanString);
    } catch (e) {
        // Dit vangt de hardnekkige "Bad control character" fout op in de .env string
        console.error("FATAL ERROR: Environment Variable Service Account JSON is incorrect/badly escaped.", cleanString);
        throw new Error(`Failed to initialize Firebase Admin SDK: Check JSON secret. Original error: ${e}`);
    }
};

if (!admin.apps.length) {
    const serviceAccountData = loadServiceAccount();

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountData),
    });
}

export const adminDb = admin.firestore();
