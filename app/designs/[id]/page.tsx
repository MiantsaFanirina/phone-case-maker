'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDesign, updateDesign } from '../../actions';
import { useStore } from '../../store';
import ControlPanel from '../../components/ControlPanel';

const Viewer = dynamic(() => import('../../components/Viewer'), { 
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

export default function EditDesignPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
    caseColor,
    caseFinish,
    imageUrl,
    editorImageUrl,
    positionX,
    positionY,
    scale,
    rotation,
    opacity,
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

  const handleSave = async () => {
    setIsSaving(true);
    const id = params.id as string;
    
    await updateDesign(id, {
      caseColor,
      caseFinish,
      imageUrl,
      editorImageUrl,
      positionX,
      positionY,
      scale,
      rotation,
      opacity,
    });
    
    setIsSaving(false);
    router.push('/designs');
  };

  const handleCancel = () => {
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
        <div className="logo">Edit Design</div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <main className="main">
        <Viewer onResetView={() => {}} />
        <ControlPanel />
      </main>
    </div>
  );
}