'use client';

import { Suspense, useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDesign } from '../../../actions';
import { useStore } from '../../../store';
import LoadingPage from '../../../components/LoadingPage';

const Viewer = dynamic(() => import('../../../components/Viewer'), {
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

function PreviewContent() {
  const router = useRouter();
  const params = useParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    setImageUrl,
    setEditorImageUrl,
    setCaseColor,
    setCaseFinish,
    setPositionX,
    setPositionY,
    setScale,
    setRotation,
    setOpacity,
    autoRotate,
    setAutoRotate,
  } = useStore();

  useEffect(() => {
    if (!isInitialized) {
      getDesign(params.id as string).then(design => {
        if (design) {
          setCaseColor(design.caseColor);
          setCaseFinish(design.caseFinish);
          setImageUrl(design.imageUrl || null);
          setEditorImageUrl(design.editorImageUrl || null);
          setPositionX(design.positionX);
          setPositionY(design.positionY);
          setScale(design.scale);
          setRotation(design.rotation);
          setOpacity(design.opacity);
          setIsInitialized(true);
        }
      });
    }
  }, [params.id, isInitialized, setCaseColor, setCaseFinish, setImageUrl, setEditorImageUrl, setPositionX, setPositionY, setScale, setRotation, setOpacity]);

  const handleToggleRotate = useCallback(() => {
    setAutoRotate(!autoRotate);
  }, [autoRotate, setAutoRotate]);

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

  const handleBack = () => {
    router.push('/designs');
  };

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
        <h1 className="page-title">Preview</h1>
        <div className={`header-actions ${menuOpen ? 'open' : ''}`} ref={menuRef}>
          
          <button className="btn btn-secondary" onClick={handleBack}>
            My Designs
          </button>

          
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
        </div>
      </header>

      <main className="main">
        <Viewer onResetView={() => {}} />
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage message="Loading preview..." />}>
      <PreviewContent />
    </Suspense>
  );
}