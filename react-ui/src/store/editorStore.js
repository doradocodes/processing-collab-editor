import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

export const useEditorStore = create(devtools((set) => ({
    currentSketch: {
        fileName: null,
        content: '',
    },
    isLoading: false,
    setIsLoading: (isLoading) => set({isLoading}),
    setCurrentSketch: (currentSketch) => set({currentSketch}),
    isFocused: false,
    setIsFocused: (isFocused) => set({isFocused}),
})));
