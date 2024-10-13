import { create } from 'zustand';
import {getSketchFolders} from "../utils/localStorageUtils.js";

export const useSketchesStore = create((set) => ({
    files: [],
    setFiles: (files) => set({ files }),
    updateFilesFromLocalStorage: async () => {
        const files = await getSketchFolders();
        set({ files });
        return files;
    }
}));
