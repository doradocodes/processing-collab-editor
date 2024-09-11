export const getSketchFolders = async () => {
    const folders = await window.electronAPI.getSketchFolders();
    return folders;
};

export const createNewSketch = async () => {
    const content = `
void setup() {

}

void draw() {

}
        `;
    const fileName = `sketch_${new Date().getTime()}`;
    const folder = await window.electronAPI.createNewSketch(fileName, content);
    return folder;
};

export const updateSketch = async (folder, content) => {
    try {
        await window.electronAPI.createNewSketch(folder, content);
    } catch(error) {
        console.error('Error updating sketch:', error);
    }
}

export const getSketchFile = async (folder) => {
    const fileContent = await window.electronAPI.getSketchFile(folder);
    console.log('fileContent', fileContent);
    return fileContent;
}
