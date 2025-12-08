'use client';

import { FirebaseProvider } from './provider';
import { firebaseApp, auth, db as firestore } from './firebase';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
