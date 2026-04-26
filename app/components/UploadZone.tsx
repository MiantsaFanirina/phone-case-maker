'use client';

import { useState, useRef, useCallback } from 'react';
import { useStore } from '../store';

interface UploadZoneProps {
  onOpenEditor: () => void;
}

export default function UploadZone({ onOpenEditor }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageUrl, setImageUrl, setToast } = useStore();

  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      setToast('Please upload a PNG or JPG image');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setToast('File size must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      onOpenEditor();
    };
    reader.readAsDataURL(file);
  }, [setImageUrl, setToast, onOpenEditor]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setImageUrl]);

  return (
    <div className="panel-section">
      <div className="section-title">Upload Design</div>
      
      {!imageUrl ? (
        <div
          className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 16V4M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="upload-text">
            <strong>Drop image here</strong> or click to browse
          </div>
          <div className="upload-hint">PNG, JPG up to 10MB</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="upload-preview">
          <img src={imageUrl} alt="Uploaded design" />
          <button className="btn" onClick={handleClear}>
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}