import {sanitizeFileNameForFs} from "./utils.js";

export const getSketchFolders = async () => {
    const folders = await window.electronAPI.getSketchFolders();
    console.log('Sketch folders:', folders);
    return folders;
};

export const updateSketch = async (fileName, content) => {
    try {
        const sanitizedFileName = sanitizeFileNameForFs(fileName);
        const folderPath = await window.electronAPI.createNewSketch(sanitizedFileName, content);
        console.log('Saved sketch:', folderPath);
        return folderPath;
    } catch(error) {
        console.error('Error updating sketch:', error);
    }
}

export const getSketchFile = async (folder) => {
    const fileContent = await window.electronAPI.getSketchFile(folder);
    console.log('File content of ', folder, ':\n', fileContent);
    return fileContent;
}

export const renameSketch = async (oldName, newName) => {
    try {
        const sanitizedFileName = sanitizeFileNameForFs(newName);
        await window.electronAPI.renameSketch(oldName, sanitizedFileName);
        console.log('Renamed sketch:', oldName, '->', sanitizedFileName);
    } catch(error) {
        console.error('Error renaming sketch:', error);
    }
}
