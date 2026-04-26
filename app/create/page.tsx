'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useStore } from '../store';
import ControlPanel from '../components/ControlPanel';

const Viewer = dynamic(() => import('../components/Viewer'), { 
  ssr: false,
  loading: () => (
    <div className="viewer-container">
      <div className="viewer-glow" />
      <div className="loading">
        <div className="loading-spinner" />
      </div>
    </div>
  )
});

export default function CreatePage() {
  const router = useRouter();
  const { autoRotate, setAutoRotate, toast, setToast, imageUrl, editorImageUrl, setImageUrl, setEditorImageUrl } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleResetView = useCallback(() => {
  }, []);

  const handleToggleRotate = useCallback(() => {
    setAutoRotate(!autoRotate);
  }, [autoRotate, setAutoRotate]);

  const handleClearImage = useCallback(() => {
    setImageUrl(null);
    setEditorImageUrl(null);
  }, [setImageUrl, setEditorImageUrl]);

  const handleSave = useCallback(() => {
    router.push('/designs');
  }, [router]);

  const hasImage = imageUrl || editorImageUrl;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Create Design</div>
        <div className="header-actions">
          <Link href="/designs" className="btn btn-secondary">
            My Designs
          </Link>
          <label className="checkbox-group">
            <input 
              type="checkbox" 
              className="checkbox"
              checked={autoRotate}
              onChange={handleToggleRotate}
            />
            <span className="checkbox-label"></span>
            <span className="checkbox-text">Auto Rotate</span>
          </label>
          {hasImage && (
            <button className="btn btn-secondary" onClick={handleClearImage}>
              Clear
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {isClient && (
          <Viewer onResetView={handleResetView} />
        )}
        <ControlPanel onSave={handleSave} />
      </main>

      {toast && (
        <div className="toast" onClick={() => setToast(null)}>
          {toast}
        </div>
      )}
    </div>
  );
}