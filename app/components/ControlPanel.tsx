'use client';

import { useStore } from '../store';
import { useRouter } from 'next/navigation';
import UploadZone from './UploadZone';
import ExportPanel from './ExportPanel';
import CaseSettings from './CaseSettings';

export default function ControlPanel() {
  const router = useRouter();
  const { imageUrl, editorImageUrl, setImageUrl, setEditorImageUrl } = useStore();
  const hasImage = imageUrl || editorImageUrl;
  const previewUrl = editorImageUrl || imageUrl;

  const handleRemove = () => {
    setImageUrl(null);
    setEditorImageUrl(null);
  };

  const handleOpenEditor = () => {
    router.push('/edit');
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
        </>
      )}
      <ExportPanel />
    </div>
  );
}