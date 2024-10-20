import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

export const useEditorStore = create(devtools((set) => ({
    currentSketch: {
        fileName: null,
        content: `void setup() {
    size(400, 400);
}

void draw() {
    background(0);
}`,
    },
    isLoading: false,
    setIsLoading: (isLoading) => set({isLoading}),
    setCurrentSketch: (currentSketch) => set({currentSketch}),
    isFocused: false,
    setIsFocused: (isFocused) => set({isFocused}),
})));
