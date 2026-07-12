import { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Something went wrong</h2>
            <p className="text-text-secondary text-sm max-w-sm">
              {this.state.error?.message || 'An unexpected error occurred on this page.'}
            </p>
          </div>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCcw size={14} />
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
