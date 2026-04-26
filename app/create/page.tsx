'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useStore } from '../store';
import { createDesign } from '../actions';
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

  const hasImage = imageUrl || editorImageUrl;

  const handleSave = useCallback(async () => {
    if (!hasImage) return;
    
    const name = prompt('Enter a name for this design:');
    if (!name) return;
    
    const state = useStore.getState();
    const safeImageUrl = state.imageUrl || undefined;
    const safeEditorImageUrl = state.editorImageUrl || undefined;
    
    await createDesign({
      name,
      caseColor: state.caseColor,
      caseFinish: state.caseFinish,
      imageUrl: safeImageUrl,
      editorImageUrl: safeEditorImageUrl,
      positionX: state.positionX,
      positionY: state.positionY,
      scale: state.scale,
      rotation: state.rotation,
      opacity: state.opacity,
    });
    
    state.setToast('Design saved!');
    router.push('/designs');
  }, [hasImage, router]);

  const handleResetView = useCallback(() => {
  }, []);

  const handleToggleRotate = useCallback(() => {
    setAutoRotate(!autoRotate);
  }, [autoRotate, setAutoRotate]);

  const handleClearImage = useCallback(() => {
    setImageUrl(null);
    setEditorImageUrl(null);
  }, [setImageUrl, setEditorImageUrl]);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Create Design</div>
        <div className="header-actions">
          {hasImage && (
            <>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Design
              </button>
              <Link href="/designs" className="btn btn-secondary">
                My Designs
              </Link>
            </>
          )}
          {!hasImage && (
            <Link href="/designs" className="btn btn-secondary">
              My Designs
            </Link>
          )}
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