import { create } from 'zustand';

interface DecalState {
  imageUrl: string | null;
  editorImageUrl: string | null;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  opacity: number;
  autoRotate: boolean;
  showHeightMap: boolean;
  heightMapDepth: number;
  exportResolution: string;
  isExporting: boolean;
  toast: string | null;
  caseColor: string;
  caseFinish: string;
  
  setImageUrl: (url: string | null) => void;
  setEditorImageUrl: (url: string | null) => void;
  setPositionX: (value: number) => void;
  setPositionY: (value: number) => void;
  setScale: (value: number) => void;
  setRotation: (value: number) => void;
  setOpacity: (value: number) => void;
  setAutoRotate: (value: boolean) => void;
  setShowHeightMap: (value: boolean) => void;
  setHeightMapDepth: (value: number) => void;
  setExportResolution: (value: string) => void;
  setIsExporting: (value: boolean) => void;
  setToast: (message: string | null) => void;
  setCaseColor: (color: string) => void;
  setCaseFinish: (finish: string) => void;
  reset: () => void;
}

export const useStore = create<DecalState>((set) => ({
  imageUrl: null,
  editorImageUrl: null,
  positionX: 0,
  positionY: 0,
  scale: 0.7,
  rotation: 0,
  opacity: 1,
  autoRotate: false,
  showHeightMap: false,
  heightMapDepth: 0.2,
  exportResolution: '2k',
  isExporting: false,
  toast: null,
  caseColor: '#DFCEEA',
  caseFinish: 'glossy',
  
  setImageUrl: (url) => set({ imageUrl: url }),
  setEditorImageUrl: (url) => set({ editorImageUrl: url }),
  setPositionX: (value) => set({ positionX: value }),
  setPositionY: (value) => set({ positionY: value }),
  setScale: (value) => set({ scale: value }),
  setRotation: (value) => set({ rotation: value }),
  setOpacity: (value) => set({ opacity: value }),
  setAutoRotate: (value) => set({ autoRotate: value }),
  setShowHeightMap: (value) => set({ showHeightMap: value }),
  setHeightMapDepth: (value) => set({ heightMapDepth: value }),
  setExportResolution: (value) => set({ exportResolution: value }),
  setIsExporting: (value) => set({ isExporting: value }),
  setToast: (message) => set({ toast: message }),
  setCaseColor: (color) => set({ caseColor: color }),
  setCaseFinish: (finish) => set({ caseFinish: finish }),
  reset: () => set({
    imageUrl: null,
    editorImageUrl: null,
    positionX: 0,
    positionY: 0,
    scale: 0.7,
    rotation: 0,
    opacity: 1,
  }),
}));