import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'
import { Button } from './Button'

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary caught error]', error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-amber-700">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-stone-900 mb-2 font-display">
              We Encountered a Hiccup
            </h2>

            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              An unexpected display issue occurred in our storefront. Our team has been notified.
              Please reload to restore the session.
            </p>

            <Button
              variant="primary"
              onClick={this.handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
