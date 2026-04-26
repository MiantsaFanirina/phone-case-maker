'use client';

import { useState, useCallback, useEffect } from 'react';
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

  const handleDesignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignName(e.target.value);
  };

  const hasImage = imageUrl || editorImageUrl;

  const handleSaveDesign = useCallback(async () => {
    if (!hasImage) {
      setToast('Please upload an image first');
      return;
    }
    if (!designName) {
      setToast('Please enter a design name');
      return;
    }
    
    setSaving(true);
    
    try {
      const state = useStore.getState();
      const safeEditorImageUrl = state.editorImageUrl || undefined;
      
      await createDesign({
        name: designName,
        caseColor: state.caseColor,
        caseFinish: state.caseFinish,
        editorImageUrl: safeEditorImageUrl,
        positionX: state.positionX,
        positionY: state.positionY,
        scale: state.scale,
        rotation: state.rotation,
        opacity: state.opacity,
      });
      
      setToast('Design saved!');
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
        <div className="logo">Miantsa iPhone Case Maker</div>
        <div className="header-actions">
          <Link href="/designs" className="btn btn-secondary">
            My Designs
          </Link>
          <input
            type="text"
            className="name-input"
            placeholder="Design name"
            value={designName}
            onChange={handleDesignNameChange}
          />
          {hasImage && (
            <button className="btn btn-primary" onClick={handleSaveDesign} disabled={saving}>
              {saving ? 'Saving...' : 'Save Design'}
            </button>
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