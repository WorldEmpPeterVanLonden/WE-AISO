'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase'; // vaste client Firestore instance

export function useFirestoreStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // db bestaat altijd zodra firebase.ts is geladen
    if (!db) {
      setIsConnected(false);
      return;
    }

    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // initial browser state
    setIsConnected(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isConnected;
}
