'use client';

import { useState, useCallback } from 'react';
import { useStore } from '../store';
import { useRouter } from 'next/navigation';
import UploadZone from './UploadZone';
import ExportPanel from './ExportPanel';
import CaseSettings from './CaseSettings';

interface ControlPanelProps {
  onOpenEditor?: () => void;
}

export default function ControlPanel({ onOpenEditor }: ControlPanelProps) {
  const router = useRouter();
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
  } = useStore();
  const hasImage = imageUrl || editorImageUrl;
  const previewUrl = editorImageUrl || imageUrl;

  const handleOpenEditor = useCallback(() => {
    if (onOpenEditor) {
      onOpenEditor();
    }
  }, [onOpenEditor]);

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
                Edit Image
              </button>
              <button className="btn btn-secondary" onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
        </>
      )}
      <ExportPanel />
    </div>
  );
}