
'use client';

import { useFirestoreStatus } from '@/hooks/use-firestore-status';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function FirestoreStatusIndicator() {
  const isConnected = useFirestoreStatus();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-3 w-3 rounded-full animate-pulse',
                isConnected ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            <span className="text-sm text-muted-foreground sr-only sm:not-sr-only">
              {isConnected ? 'FS Connected' : 'Disconnected'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isConnected
              ? 'Real-time connection to the database is active.'
              : 'Connection to the database is lost. Changes will not be saved.'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
