'use client';

import { create } from 'zustand';

interface DesignState {
  designs: Array<{
    id: string;
    name: string;
    caseColor: string;
    caseFinish: string;
    imageUrl: string | null;
    editorImageUrl: string | null;
    hasImage?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  currentDesign: string | null;
  isLoading: boolean;
  setDesigns: (designs: Array<{
    id: string;
    name: string;
    caseColor: string;
    caseFinish: string;
    imageUrl: string | null;
    editorImageUrl: string | null;
    hasImage?: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>) => void;
  setCurrentDesign: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  designs: [],
  currentDesign: null,
  isLoading: false,
  setDesigns: (designs) => set({ designs }),
  setCurrentDesign: (id) => set({ currentDesign: id }),
  setLoading: (loading) => set({ isLoading: loading }),
}));