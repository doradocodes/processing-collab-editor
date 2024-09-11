import { create } from 'zustand'

export const useEditorStore = create((set) => ({
    currentSketch: '',
    editorContent: '',
    isLoading: false,
    updateCurrentSketch: (currentSketch) => set({ currentSketch }),
    updateContent: (content) => set({ editorContent: content }),
    setIsLoading: (isLoading) => set({ isLoading }),
}))
