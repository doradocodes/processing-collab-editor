
export const getSketchFolders = async () => {
    const folders = await window.electronAPI.getSketchFolders();
    return folders;
};

export const updateSketch = async (fileName, content) => {
    try {
        const folderPath = await window.electronAPI.createNewSketch(fileName, content);
        return folderPath;
    } catch(error) {
        console.error('Error updating sketch:', error);
    }
}

export const getSketchFile = async (folder) => {
    const fileContent = await window.electronAPI.getSketchFile(folder);
    console.log('fileContent', fileContent);
    return fileContent;
}
