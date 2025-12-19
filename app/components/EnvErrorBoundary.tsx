'use client';

/**
 * EnvErrorBoundary Component
 *
 * React Error Boundary that catches environment validation errors
 * and displays a helpful error message to developers.
 *
 * This ensures that if environment variables are missing, developers
 * see a clear, actionable error message instead of a cryptic stack trace.
 */

import React, { Component, ReactNode } from 'react';
import { EnvErrorDisplay } from './EnvErrorDisplay';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class EnvErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Environment Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Check if it's an environment validation error
    const isEnvError = error.message.includes('Environment Variable Validation Failed');

    if (isEnvError) {
      console.error('\n' + '='.repeat(70));
      console.error('ENVIRONMENT CONFIGURATION ERROR');
      console.error('='.repeat(70));
      console.error('\n' + error.message + '\n');
      console.error('='.repeat(70) + '\n');
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Show custom error UI
      return <EnvErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}
