'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { updateDesign } from '../../actions';
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
  ),
});

type DesignDTO = {
  id: string;
  name: string;
  caseColor: string;
  caseFinish: string;
  imageUrl: string | null;
  editorImageUrl: string | null;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  opacity: number;
};

export default function EditDesignContent({ design }: { design: DesignDTO }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

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
    toast,
    setToast,
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

  const hasImage = imageUrl || editorImageUrl;

  useEffect(() => {
    setCaseColor(design.caseColor);
    setCaseFinish(design.caseFinish);
    setImageUrl(design.imageUrl || null);
    setEditorImageUrl(design.editorImageUrl || null);
    setPositionX(design.positionX);
    setPositionY(design.positionY);
    setScale(design.scale);
    setRotation(design.rotation);
    setOpacity(design.opacity);
    setInitialized(true);
  }, [
    design,
    setCaseColor,
    setCaseFinish,
    setImageUrl,
    setEditorImageUrl,
    setPositionX,
    setPositionY,
    setScale,
    setRotation,
    setOpacity,
  ]);

  const handleResetView = useCallback(() => {}, []);

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

  useEffect(() => {
    if (!initialized) return;
    const srcUrl = imageUrl || editorImageUrl;
    if (!srcUrl) {
      router.push('/create');
      return;
    }

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 2400;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const radius = 195;
      const border = 30;

      ctx.clearRect(0, 0, 1200, 2400);
      ctx.beginPath();
      ctx.roundRect(0, 0, 1200, 2400, radius);
      ctx.fillStyle = caseColor;
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(0, 0, 1200, 2400, radius);
      ctx.strokeStyle = caseColor;
      ctx.lineWidth = border;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(border, border, 1200 - border * 2, 2400 - border * 2, radius - border / 2);
      ctx.clip();

      const availableW = 1200 - border * 2;
      const availableH = 2400 - border * 2;

      ctx.translate(border + availableW / 2 + positionX * 12, border + availableH / 2 + positionY * 24);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      const maxW = availableW * 0.8;
      const maxH = availableH * 0.7;
      const imgAspect = image.width / image.height;

      let drawW = maxW;
      let drawH = maxW / imgAspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = maxH * imgAspect;
      }

      ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setEditorImageUrl(dataUrl);
    };
    image.src = srcUrl;
  }, [
    initialized,
    imageUrl,
    editorImageUrl,
    router,
    caseColor,
    positionX,
    positionY,
    scale,
    rotation,
    opacity,
    setEditorImageUrl,
  ]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateDesign(design.id, {
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
      setToast('Design updated!');
    } catch (e) {
      console.error('Failed to update design:', e);
      setToast('Failed to update design');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="page-title">Case Maker</h1>
        <div className="header-actions">
          <Link href="/designs" className="btn btn-secondary">
            My Designs
          </Link>
          {hasImage && (
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Design'}
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
        <Viewer onResetView={handleResetView} />
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

