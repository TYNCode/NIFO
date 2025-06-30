import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class TrendsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Trends Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Check if it's a permission error
      if (this.state.error?.message?.includes('permission') || 
          this.state.error?.message?.includes('403')) {
        return (
          <div className="p-4 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Access Restricted
              </h3>
              <p className="text-yellow-700">
                You don't have permission to perform this action. Only TYN users can manage trends.
              </p>
            </div>
          </div>
        );
      }

      // Generic error fallback
      return this.props.fallback || (
        <div className="p-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-700">
              An error occurred while loading trends. Please try refreshing the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TrendsErrorBoundary; 