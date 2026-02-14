import React from 'react';

interface Props {
  children: React.ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI.
 * 
 * Usage:
 * <ErrorBoundary fallbackMessage="Something went wrong in Listening">
 *   <ListeningPractice />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('🔴 Component Stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🐛</span>
              <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
                {this.props.fallbackMessage || 'Something went wrong'}
              </h2>
            </div>

            <div className="bg-red-100 dark:bg-red-900/40 rounded-md p-4 mb-4">
              <p className="text-sm font-mono text-red-800 dark:text-red-200 break-all">
                <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            {this.state.errorInfo && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400 hover:underline">
                  Show Component Stack Trace
                </summary>
                <pre className="mt-2 text-xs bg-slate-800 text-green-400 p-3 rounded overflow-auto max-h-48">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
