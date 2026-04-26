'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDesign } from '../../../actions';
import { useStore } from '../../../store';

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

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  
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
  } = useStore();

  useEffect(() => {
    async function load() {
      const id = params.id as string;
      const design = await getDesign(id);
      
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
      }
      setLoading(false);
    }
    
    if (params.id) {
      load();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/designs');
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Preview</div>
        <div className="header-actions">
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