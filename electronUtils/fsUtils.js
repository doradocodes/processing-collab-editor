const path = require('node:path');
const fs = require('node:fs');
const os = require('os');

const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing Collaborative Sketches');

/**
 * Creates a new sketch file with the given name and content.
 * @param {string} fileName - The name of the sketch file. If not provided, a timestamp-based name will be used.
 * @param {string} fileContent - The content to be written to the sketch file.
 * @returns {Promise<string>} A promise that resolves with the path of the created folder.
 */
const createSketchFile = (fileName, fileContent) => {
    let fn = fileName;
    let folderPath = path.join(documentsFolderPath, fileName);
    if (!fileName) {
        fn = `sketch_${new Date().getTime()}`;
        folderPath = path.join(documentsFolderPath, 'temp', fn);
    }

    const filePath = path.join(folderPath, `${fn}.pde`);

    return new Promise((resolve, reject) => {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
            fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
            resolve(folderPath);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Deletes a sketch folder and its contents.
 * @param {string} folderName - The name of the folder to delete.
 * @returns {Promise<string>} A promise that resolves with the name of the deleted folder.
 */
const deleteSketchFile = (folderName) => {
    const folderPath = path.join(documentsFolderPath, folderName);

    return new Promise((resolve, reject) => {
        fs.rmdir(folderPath, { recursive: true }, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(folderName);
        });
    });
};

/**
 * Retrieves a list of sketch folders.
 * @returns {Promise<string[]>} A promise that resolves with an array of folder names.
 */
const getSketchFolders = async () => {
    try {
        const entries = await fs.promises.readdir(documentsFolderPath, { withFileTypes: true });
        const folders = entries
            .filter(entry => entry.isDirectory())
            .map(dir => dir.name)
            .reverse();
        return folders;
    } catch (error) {
        console.error('Error getting sketch folders:', error);
        throw error;
    }
};

/**
 * Retrieves the content of a sketch file.
 * @param {string} folderName - The name of the folder containing the sketch file.
 * @returns {Promise<string>} A promise that resolves with the content of the sketch file.
 */
const getSketchFile = (folderName) => {
    const folderPath = path.join(documentsFolderPath, folderName);
    const filePath = path.join(folderPath, `${folderName}.pde`);

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};

module.exports = {
    createSketchFile,
    deleteSketchFile,
    getSketchFolders,
    getSketchFile,
};
