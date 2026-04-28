'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [saving, setSaving] = useState(false);
  const [designName, setDesignName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const storedName = sessionStorage.getItem('newDesignName');
    if (storedName) {
      setDesignName(storedName);
    }
  }, []);

  useEffect(() => {
    if (designName) {
      sessionStorage.setItem('newDesignName', designName);
    }
  }, [designName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const menuToggle = document.querySelector('.menu-toggle');
      if (menuToggle && menuToggle.contains(target)) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);


  const hasImage = imageUrl || editorImageUrl;

  const handleSaveDesign = useCallback(async () => {
    if (!hasImage) {
      setToast('Please upload an image first');
      return;
    }
    if (!designName.trim()) {
      setToast('Please enter a design name');
      return;
    }
    
    setSaving(true);
    
    try {
      const state = useStore.getState();
      const { isDataUrl } = await import('../store');
      let { imageUrl, editorImageUrl } = state;
      
      // Convert data URLs to file URLs via server action
      if (imageUrl && isDataUrl(imageUrl)) {
        const { saveBase64Image } = await import('../actions');
        imageUrl = await saveBase64Image(imageUrl);
        state.setImageUrl(imageUrl);
      }
      if (editorImageUrl && isDataUrl(editorImageUrl)) {
        const { saveBase64Image } = await import('../actions');
        editorImageUrl = await saveBase64Image(editorImageUrl);
        state.setEditorImageUrl(editorImageUrl);
      }
      
      await createDesign({
        name: designName.trim(),
        caseColor: state.caseColor,
        caseFinish: state.caseFinish,
        imageUrl: imageUrl || undefined,
        editorImageUrl: editorImageUrl || undefined,
        positionX: state.positionX,
        positionY: state.positionY,
        scale: state.scale,
        rotation: state.rotation,
        opacity: state.opacity,
      });
      
      setToast('Design saved!');
      // Clear the stored name after successful save
      sessionStorage.removeItem('newDesignName');
    } catch (error) {
      console.error('Failed to save design:', error);
      setToast('Failed to save design');
    } finally {
      setSaving(false);
    }
  }, [hasImage, designName, setToast]);

  const handleResetView = useCallback(() => {
  }, []);

  const handleToggleRotate = useCallback(() => {
    setAutoRotate(!autoRotate);
  }, [autoRotate, setAutoRotate]);

  const handleClearImage = useCallback(() => {
    setImageUrl(null);
    setEditorImageUrl(null);
  }, [setImageUrl, setEditorImageUrl]);

  const handleOpenEditor = useCallback(() => {
    router.push('/edit');
  }, [router]);

  return (
    <div className="app">
      <header className="header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </>
            )}
          </svg>
        </button>
        <h1 className="page-title">Case Maker</h1>
        <div className={`header-actions ${menuOpen ? 'open' : ''}`} ref={menuRef}>
          <Link href="/designs" className="btn btn-secondary">
            My Designs
          </Link>
          {hasImage && (
            <button className="btn btn-primary" onClick={handleSaveDesign} disabled={saving}>
              {saving ? (
                <>
                  <svg className="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Saving
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17,21 17,13 7,13 7,21" />
                    <polyline points="7,3 7,8 15,8" />
                  </svg>
                  Save
                </>
              )}
            </button>
          )}
          <button 
            className={`btn btn-icon-only ${autoRotate ? 'active' : ''}`}
            onClick={handleToggleRotate}
            title={autoRotate ? 'Stop rotation' : 'Auto rotate'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={autoRotate ? 'spin' : ''}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </button>
          <label className="checkbox-group mobile-only">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {isClient && (
          <Viewer onResetView={handleResetView} />
        )}
        <ControlPanel onOpenEditor={handleOpenEditor} />
      </main>

      {toast && (
        <div className="toast" onClick={() => setToast(null)}>
          {toast}
        </div>
      )}
    </div>
  );
}