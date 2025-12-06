
'use client';

import { useState, useEffect } from 'react';
import { healthCheck } from '@/ai/flows/health-check';

type AiStatus = 'checking' | 'connected' | 'disconnected';

export function useAiStatus() {
  const [status, setStatus] = useState<AiStatus>('checking');

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      if (!isMounted) return;
      try {
        const result = await healthCheck();
        if (isMounted) {
            setStatus(result.status === 'ok' ? 'connected' : 'disconnected');
        }
      } catch (error) {
        console.error("AI health check failed:", error);
        if (isMounted) {
            setStatus('disconnected');
        }
      }
    };

    // Initial check
    checkStatus();

    // Periodically check status every 30 seconds
    const intervalId = setInterval(checkStatus, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return status;
}
