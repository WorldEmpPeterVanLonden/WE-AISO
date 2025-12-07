
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';

export function useFirestoreStatus() {
  const firestore = useFirestore();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!firestore) {
      setIsConnected(false);
      return;
    }

    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status from the browser's navigator object
    setIsConnected(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [firestore]);

  return isConnected;
}
