'use client';

import UploadZone from './UploadZone';
import AdjustmentSliders from './AdjustmentSliders';
import ExportPanel from './ExportPanel';
import CaseSettings from './CaseSettings';

interface ControlPanelProps {
  onOpenEditor: () => void;
}

export default function ControlPanel({ onOpenEditor }: ControlPanelProps) {
  return (
    <div className="control-panel">
      <CaseSettings />
      <UploadZone onOpenEditor={onOpenEditor} />
      <AdjustmentSliders />
      <ExportPanel />
    </div>
  );
}