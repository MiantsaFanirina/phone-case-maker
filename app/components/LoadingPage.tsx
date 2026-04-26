'use client';

import { ReactNode } from 'react';

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="app">
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <span className="loading-dots">...</span>
            <span className="loading-message">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
