'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
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

  const handleBack = () => {
    router.push('/designs');
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="page-title">Preview</h1>
        <div className="header-actions">
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
          <button className="btn btn-primary" onClick={handleBack}>
            Back to Designs
          </button>
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