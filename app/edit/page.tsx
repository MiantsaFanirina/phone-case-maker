'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 2400;

export default function EditImagePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  
  const { 
    imageUrl,
    editorImageUrl,
    caseColor,
    positionX, 
    positionY, 
    scale, 
    rotation, 
    opacity,
    setPositionX,
    setPositionY,
    setScale,
    setRotation,
    setOpacity,
    setEditorImageUrl,
    setImageUrl,
  } = useStore();

  useEffect(() => {
    const srcUrl = imageUrl || editorImageUrl;
    if (!srcUrl) {
      router.push('/create');
      return;
    }
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = srcUrl;
  }, [imageUrl, editorImageUrl, router]);

const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = 195;
    const border = 30;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.beginPath();
    ctx.roundRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, radius);
    ctx.fillStyle = caseColor;
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, radius);
    ctx.strokeStyle = caseColor;
    ctx.lineWidth = border;
    ctx.stroke();
    
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(border, border, CANVAS_WIDTH - border * 2, CANVAS_HEIGHT - border * 2, radius - border / 2);
    ctx.clip();
    
    const availableW = CANVAS_WIDTH - (border * 2);
    const availableH = CANVAS_HEIGHT - (border * 2);
    
    ctx.translate(border + availableW / 2 + positionX * 12, border + availableH / 2 + positionY * 24);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    const maxW = availableW * 0.8;
    const maxH = availableH * 0.7;
    const imgAspect = img.width / img.height;
    
    let drawW = maxW;
    let drawH = maxW / imgAspect;
    if (drawH > maxH) {
      drawH = maxH;
      drawW = maxH * imgAspect;
    }
    
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Compress to 70% quality JPEG
    setEditorImageUrl(dataUrl);
  }, [img, caseColor, positionX, positionY, scale, rotation, opacity, setEditorImageUrl]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleApply = () => {
    draw();
    router.push('/create');
  };

  const handleCancel = () => {
    setImageUrl(null);
    setEditorImageUrl(null);
    router.push('/create');
  };

  const handleReset = () => {
    setPositionX(0);
    setPositionY(0);
    setScale(0.7);
    setRotation(0);
    setOpacity(1);
  };

  return (
    <div className="edit-page">
      <header className="edit-header">
        <h1>Edit Design</h1>
        <div className="edit-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          <button className="btn" onClick={handleApply}>Done</button>
        </div>
      </header>
      
      <div className="edit-main">
        <div className="edit-canvas-area">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="edit-canvas"
          />
        </div>
        
        <div className="edit-controls">
          <div className="control-section">
            <div className="control-header">
              <span>Adjustments</span>
              <button className="reset-btn" onClick={handleReset}>Reset</button>
            </div>
            
            <div className="slider-control">
              <span className="slider-label">Position X</span>
              <div className="slider-input-group">
                <input
                  type="number"
                  className="slider-input"
                  min="-100"
                  max="100"
                  value={positionX}
                  onChange={(e) => setPositionX(Number(e.target.value))}
                />
                <input
                  type="range"
                  className="slider"
                  min="-100"
                  max="100"
                  value={positionX}
                  onChange={(e) => setPositionX(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="slider-control">
              <span className="slider-label">Position Y</span>
              <div className="slider-input-group">
                <input
                  type="number"
                  className="slider-input"
                  min="-100"
                  max="100"
                  value={positionY}
                  onChange={(e) => setPositionY(Number(e.target.value))}
                />
                <input
                  type="range"
                  className="slider"
                  min="-100"
                  max="100"
                  value={positionY}
                  onChange={(e) => setPositionY(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="slider-control">
              <span className="slider-label">Scale</span>
              <div className="slider-input-group">
                <input
                  type="number"
                  className="slider-input"
                  min="0.3"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
                <input
                  type="range"
                  className="slider"
                  min="0.3"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="slider-control">
              <span className="slider-label">Rotation</span>
              <div className="slider-input-group">
                <input
                  type="number"
                  className="slider-input"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
                <input
                  type="range"
                  className="slider"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="slider-control">
              <span className="slider-label">Opacity</span>
              <div className="slider-input-group">
                <input
                  type="number"
                  className="slider-input"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                />
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}