import { create } from 'zustand';
import {devtools, redux} from 'zustand/middleware'


export const useEditorStore = create(devtools((set) => ({
    currentSketch: {
        fileName: null,
        content: '',
        isCollab: false,
        isHost: false,
        roomID: null,
    },
    isLoading: false,
    setCurrentSketch: (currentSketch) => set({ currentSketch }),
    setIsLoading: (isLoading) => set({ isLoading }),
})));
