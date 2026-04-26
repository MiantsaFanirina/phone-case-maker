'use client';

import { useState, useCallback } from 'react';
import { useStore } from '../store';
import { useRouter } from 'next/navigation';
import { createDesign } from '../actions';
import UploadZone from './UploadZone';
import ExportPanel from './ExportPanel';
import CaseSettings from './CaseSettings';

export default function ControlPanel() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { 
    imageUrl, 
    editorImageUrl, 
    caseColor, 
    caseFinish,
    positionX,
    positionY,
    scale,
    rotation,
    opacity,
    setImageUrl, 
    setEditorImageUrl,
    setToast,
  } = useStore();
  const hasImage = imageUrl || editorImageUrl;
  const previewUrl = editorImageUrl || imageUrl;

  const handleOpenEditor = () => {
    router.push('/edit');
  };

  const handleSaveAs = useCallback(async () => {
    const name = prompt('Enter a name for this design:');
    if (!name) return;
    
    setSaving(true);
    try {
      const safeImageUrl = imageUrl || undefined;
    const safeEditorImageUrl = editorImageUrl || undefined;
    
    await createDesign({
      name,
      caseColor,
      caseFinish,
      imageUrl: safeImageUrl,
      editorImageUrl: safeEditorImageUrl,
      positionX,
      positionY,
      scale,
      rotation,
      opacity,
    });
      setToast('Design saved!');
      router.push('/designs');
    } catch (error) {
      setToast('Failed to save design');
    } finally {
      setSaving(false);
    }
  }, [hasImage, imageUrl, editorImageUrl, caseColor, caseFinish, positionX, positionY, scale, rotation, opacity, router, setToast]);

  const handleRemove = () => {
    setImageUrl(null);
    setEditorImageUrl(null);
  };

  return (
    <div className="control-panel">
      <CaseSettings />
      {!hasImage ? (
        <UploadZone onOpenEditor={handleOpenEditor} />
      ) : (
        <>
          <div className="panel-section">
            <div className="section-title">Design</div>
            <div className="upload-preview">
              <img src={previewUrl || ''} alt="Design preview" />
              <button className="btn" onClick={handleOpenEditor}>
                Edit Design
              </button>
              <button className="btn btn-secondary" onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
          
          <div className="panel-section">
            <button className="btn btn-primary" onClick={handleSaveAs} disabled={saving}>
              {saving ? 'Saving...' : 'Save as Design'}
            </button>
          </div>
        </>
      )}
      <ExportPanel />
    </div>
  );
}