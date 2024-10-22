import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {sketchTemplate} from "../utils/utils.js";

export const useEditorStore = create(devtools((set) => ({
    currentSketch: {
        fileName: null,
        content: sketchTemplate,
    },
    isLoading: false,
    setIsLoading: (isLoading) => set({isLoading}),
    setCurrentSketch: (currentSketch) => set({currentSketch}),
    isFocused: false,
    setIsFocused: (isFocused) => set({isFocused}),
})));
