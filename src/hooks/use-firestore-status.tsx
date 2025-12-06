
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useFirestoreStatus() {
  const firestore = useFirestore();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    // The .info/connected path is a special metadata document in Firestore.
    // It is not a real document but a listener that reports connection status.
    const metadataRef = doc(firestore, '.info/connected');

    const unsubscribe = onSnapshot(metadataRef, 
        (snapshot) => {
            // According to some SDK versions, checking a value might not be reliable.
            // The recommended approach is to see if we can get a snapshot without it being from the cache.
            // However, the most straightforward implementation that works across many versions is to
            // just get the event. The event itself indicates a status change.
            // We'll rely on the online/offline events of the browser as a more robust check.
        },
        (error) => {
            setIsConnected(false);
        }
    );

    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status
    setIsConnected(navigator.onLine);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [firestore]);

  return isConnected;
}
