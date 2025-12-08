"use client";

import { ReactNode } from "react";
import { FirebaseProvider } from "./provider";
import { getFirebase } from "./";

// This is a client-side-only wrapper that initializes Firebase on the client.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { firebaseApp, auth, firestore } = getFirebase();

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
