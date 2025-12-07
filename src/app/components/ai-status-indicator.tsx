
'use client';

import { useAiStatus } from '@/hooks/use-ai-status';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bot, Loader2, AlertTriangle } from 'lucide-react';

export function AiStatusIndicator() {
  const status = useAiStatus();

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-500',
          text: 'AI Connected',
          tooltip: 'Connection to the AI service is active.',
          icon: <Bot className="h-4 w-4 text-green-500" />
        };
      case 'disconnected':
        return {
          color: 'bg-red-500',
          text: 'AI Disconnected',
          tooltip: 'Connection to the AI service is lost.',
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />
        };
      case 'checking':
      default:
        return {
          color: 'bg-yellow-500',
          text: 'AI Status...',
          tooltip: 'Checking connection to the AI service...',
          icon: <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
        };
    }
  };

  const { color, text, tooltip, icon } = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-3 w-3 rounded-full',
                status === 'connected' && 'animate-pulse',
                color
              )}
            />
            <span className="text-sm text-muted-foreground sr-only sm:not-sr-only">
              {text}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
            <div className="flex items-center gap-2">
                {icon}
                <p>{tooltip}</p>
            </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
