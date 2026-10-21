import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  canRetry?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Products',
  message = 'We encountered an unexpected connection issue. Please check your network and try again.',
  onRetry,
  canRetry = true,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-rose-50/50 border border-rose-200/80 shadow-2xs max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-4 text-rose-600">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2 font-display">{title}</h3>
      <p className="text-sm text-stone-600 mb-6 max-w-sm leading-relaxed">{message}</p>

      {canRetry && onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
