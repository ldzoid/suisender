'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sui-bg px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-sui-text-primary mb-2">
          Something went wrong
        </h1>
        
        <p className="text-sui-text-secondary mb-6">
          An unexpected error occurred. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-sui-primary hover:bg-sui-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-sui-text-primary font-medium rounded-lg border border-sui-border transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
