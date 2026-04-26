'use client';

import { useStore } from '../store';

interface AdjustmentSlidersProps {}

export default function AdjustmentSliders({}: AdjustmentSlidersProps) {
  const { 
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
    imageUrl
  } = useStore();

  if (!imageUrl) return null;

  return (
    <div className="panel-section">
      <div className="section-title">Adjustments</div>
      
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
  );
}