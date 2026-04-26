'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useStore } from '../store';

interface ImageEditorProps {
  onClose: () => void;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 800;

export default function ImageEditor({ onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  
  const { 
    imageUrl, 
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

  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = imageUrl;
  }, [imageUrl]);

const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // iPhone border radius
    const radius = 55;
    
    // Fill background with case color (rounded rect)
    ctx.beginPath();
    ctx.roundRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, radius);
    ctx.fillStyle = caseColor;
    ctx.fill();

    // 10px border
    const border = 10;
    
    // Draw border with rounded corners
    ctx.beginPath();
    ctx.roundRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, radius);
    ctx.strokeStyle = caseColor;
    ctx.lineWidth = border;
    ctx.stroke();
    
    // Clip to area inside border (image can't overflow)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(border, border, CANVAS_WIDTH - border * 2, CANVAS_HEIGHT - border * 2, radius - border / 2);
    ctx.clip();
    
    // Apply transforms - centered within bordered area
    const availableW = CANVAS_WIDTH - (border * 2);
    const availableH = CANVAS_HEIGHT - (border * 2);
    
    ctx.translate(border + availableW / 2 + positionX * 4, border + availableH / 2 + positionY * 8);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    // Draw image centered
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

    // Save as texture
    const dataUrl = canvas.toDataURL('image/png');
    setEditorImageUrl(dataUrl);
  }, [img, caseColor, positionX, positionY, scale, rotation, opacity, setEditorImageUrl]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleApply = () => {
    draw();
    setImageUrl(null);
    onClose();
  };

  const handleCancel = () => {
    setImageUrl(null);
    setEditorImageUrl(null);
    onClose();
  };

  return (
    <div className="image-editor-overlay">
      <div className="image-editor-modal">
        <div className="image-editor-header">
          <h3>Edit Image</h3>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>
        
        <div className="image-editor-content">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="editor-canvas"
          />
          
          <div className="editor-sliders">
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-name">Position X</span>
                <span className="slider-value">{positionX}</span>
              </div>
              <input
                type="range"
                className="slider"
                min="-50"
                max="50"
                value={positionX}
                onChange={(e) => setPositionX(Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-name">Position Y</span>
                <span className="slider-value">{positionY}</span>
              </div>
              <input
                type="range"
                className="slider"
                min="-50"
                max="50"
                value={positionY}
                onChange={(e) => setPositionY(Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-name">Scale</span>
                <span className="slider-value">{scale.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="slider"
                min="0.3"
                max="1.5"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-name">Rotation</span>
                <span className="slider-value">{rotation}°</span>
              </div>
              <input
                type="range"
                className="slider"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-name">Opacity</span>
                <span className="slider-value">{opacity.toFixed(1)}</span>
              </div>
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
        
        <div className="image-editor-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          <button className="btn" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}