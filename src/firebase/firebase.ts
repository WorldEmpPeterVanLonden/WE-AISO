'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// --- INIT CLIENT APP ---
export const firebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(firebaseApp);

// FIRESTORE
export const db = getFirestore(firebaseApp);
