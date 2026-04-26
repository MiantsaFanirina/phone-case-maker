'use client';

import { useState, useCallback, useRef } from 'react';
import { useStore } from '../store';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

interface ExportPanelProps {}

export default function ExportPanel({}: ExportPanelProps) {
  const { 
    exportResolution, 
    setExportResolution,
    showHeightMap, 
    setShowHeightMap,
    heightMapDepth,
    setHeightMapDepth,
    imageUrl,
    setIsExporting,
    setToast,
    isExporting
  } = useStore();
  const [exportMenu, setExportMenu] = useState(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const getResolution = useCallback(() => {
    switch (exportResolution) {
      case '1080p': return { width: 1920, height: 1080 };
      case '2k': return { width: 2560, height: 1440 };
      case '4k': return { width: 3840, height: 2160 };
      default: return { width: 2560, height: 1440 };
    }
  }, [exportResolution]);

  const captureScreenshot = useCallback(async () => {
    const canvas = document.querySelector('.viewer-canvas canvas') as HTMLCanvasElement;
    if (!canvas) {
      setToast('Canvas not found');
      return;
    }

    setIsExporting(true);
    setExportMenu(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const { width, height } = getResolution();
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d')!;

      ctx.drawImage(canvas, 0, 0, width, height);

      const link = document.createElement('a');
      link.download = 'phone-case-preview.png';
      link.href = tempCanvas.toDataURL('image/png', 1.0);
      link.click();

      setToast('PNG exported successfully!');
    } catch (error) {
      setToast('Export failed');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  }, [getResolution, setIsExporting, setToast]);

  const exportSTL = useCallback(async () => {
    const canvas = document.querySelector('.viewer-canvas canvas') as HTMLCanvasElement;
    if (!canvas) {
      setToast('Canvas not found');
      return;
    }

    if (!canvas) {
      setToast('No model to export');
      return;
    }

    setIsExporting(true);
    setExportMenu(false);

    try {
      setToast('STL export coming soon - requires full model integration');
    } catch (error) {
      setToast('Export failed');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  }, [setIsExporting, setToast]);

  return (
    <div className="panel-section">
      <div className="section-title">Export</div>
      
      <div className="export-options">
        <button 
          className="btn btn-primary" 
          onClick={captureScreenshot}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export PNG'}
        </button>
        
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Resolution</span>
          </div>
          <select 
            className="select"
            value={exportResolution}
            onChange={(e) => setExportResolution(e.target.value)}
          >
            <option value="1080p">1080p (1920×1080)</option>
            <option value="2k">2K (2560×1440)</option>
            <option value="4k">4K (3840×2160)</option>
          </select>
        </div>
        
        <label className="checkbox-group">
          <input 
            type="checkbox" 
            className="checkbox"
            checked={showHeightMap}
            onChange={(e) => setShowHeightMap(e.target.checked)}
          />
          <span className="checkbox-label"></span>
          <span className="checkbox-text">Height map (for 3D printing)</span>
        </label>
        
        {showHeightMap && (
          <div className="slider-group">
            <div className="slider-label">
              <span className="slider-name">Extrusion Depth</span>
              <span className="slider-value">{heightMapDepth}mm</span>
            </div>
            <input
              type="range"
              className="slider"
              min="0.1"
              max="1.0"
              step="0.1"
              value={heightMapDepth}
              onChange={(e) => setHeightMapDepth(Number(e.target.value))}
            />
          </div>
        )}
        
        <button 
          className="btn" 
          onClick={exportSTL}
          disabled={isExporting || !imageUrl}
        >
          Export STL
        </button>
      </div>
    </div>
  );
}