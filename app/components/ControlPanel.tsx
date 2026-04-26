'use client';

import UploadZone from './UploadZone';
import AdjustmentSliders from './AdjustmentSliders';
import ExportPanel from './ExportPanel';
import CaseSettings from './CaseSettings';

interface ControlPanelProps {}

export default function ControlPanel({}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <CaseSettings />
      <UploadZone />
      <AdjustmentSliders />
      <ExportPanel />
    </div>
  );
}