import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sui-bg px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sui-primary/10 mb-6">
          <FileQuestion className="w-8 h-8 text-sui-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-sui-text-primary mb-2">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-sui-text-primary mb-2">
          Page not found
        </h2>
        
        <p className="text-sui-text-secondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-sui-primary hover:bg-sui-primary-dark text-white font-medium rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
