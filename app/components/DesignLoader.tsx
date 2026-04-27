'use client';

import { ReactNode } from 'react';

interface DesignLoaderProps {
  message?: string;
}

export default function DesignLoader({ message = 'Loading design ...' }: DesignLoaderProps) {
  return (
    <div className="designs-page">
      <header className="designs-header">
        <h1>My Designs</h1>
      </header>

      <main className="designs-main">
        <div className="designs-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="design-card design-card-skeleton">
              <div className="design-preview skeleton-pulse"></div>
              <div className="design-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
              </div>
              <div className="design-actions">
                <div className="skeleton-btn"></div>
                <div className="skeleton-btn"></div>
                <div className="skeleton-btn"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
