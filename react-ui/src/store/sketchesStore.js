import { create } from 'zustand';

export const useSketchesStore = create((set) => ({
    files: [],
    setFiles: (files) => set({ files }),
}));
