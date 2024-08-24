import { create } from 'zustand'

export const useEditorStore = create((set) => ({
    editorContent: '',
    updateContent: (content) => set({ editorContent: content }),
}))
