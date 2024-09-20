import { create } from 'zustand';

export const useEditorStore = create((set) => ({
    currentSketch: {
        fileName: null,
        content: '',
        isCollab: false,
        isHost: false,
    },
    isLoading: false,
    setCurrentSketch: (currentSketch) => set({ currentSketch }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));
