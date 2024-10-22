const path = require('node:path');
const fs = require('node:fs');

/**
 * Creates a new sketch file with the given name and content.
 * @param {string} fileName - The name of the sketch file. If not provided, a timestamp-based name will be used.
 * @param {string} fileContent - The content to be written to the sketch file.
 * @returns {Promise<string>} A promise that resolves with the path of the created folder.
 */
const createSketchFile = (folderPath, fileName, fileContent) => {
    let fn = fileName;
    let newPath = path.join(folderPath, fileName);
    if (!fileName) {
        fn = `sketch_${new Date().getTime()}`;
        newPath = path.join(folderPath, 'temp', fn);
    }

    const filePath = path.join(newPath, `${fn}.pde`);

    return new Promise((resolve, reject) => {
        try {
            fs.mkdirSync(newPath, { recursive: true });
            fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
            resolve(newPath);
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
const deleteSketchFile = (folderPath, folderName) => {
    const newPath = path.join(folderPath, folderName);

    return new Promise((resolve, reject) => {
        fs.rmdir(newPath, { recursive: true }, (error) => {
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
const getSketchFolders = async (folderPath) => {
    try {
        const entries = await fs.promises.readdir(folderPath, { withFileTypes: true });
        const folders = entries
            .filter(entry => entry.isDirectory())
            .map(dir => dir.name);
        return folders;
    } catch (error) {
        console.error('Error getting sketch folders:', error);
        throw error;
    }
};

/**
 * Retrieves a list of sketch folders sorted by last updated time.
 * @param folderPath
 * @returns {any[]}
 */
function getSketchFoldersByLastUpdated(folderPath) {
    // Read all items in the parent directory
    const directories = fs.readdirSync(folderPath).map((dirName) => {
        const dirFullPath = path.join(folderPath, dirName);

        // Ensure it's a directory
        if (!fs.statSync(dirFullPath).isDirectory()) {
            return null;
        }

        // Find the .pde file in the directory (assuming there's only one .pde file per directory)
        const pdeFiles = fs.readdirSync(dirFullPath).filter(file => file.endsWith('.pde'));

        // If there are no .pde files, we skip this directory
        if (pdeFiles.length === 0) {
            return null;
        }

        const pdeFilePath = path.join(dirFullPath, pdeFiles[0]);
        const pdeFileStats = fs.statSync(pdeFilePath);

        return {
            name: dirName,
            fullPath: dirFullPath,
            pdeFilePath: pdeFilePath,
            mtime: pdeFileStats.mtimeMs  // Get the modification time of the .pde file
        };
    }).filter(Boolean); // Remove null values (directories without .pde files)

    // Sort directories by the mtime of the .pde file in descending order (most recent first)
    directories.sort((a, b) => b.mtime - a.mtime);

    console.log(directories);

    return directories.map((dir) => dir.name);
}

/**
 * Retrieves the content of a sketch file.
 * @param {string} folderName - The name of the folder containing the sketch file.
 * @returns {Promise<string>} A promise that resolves with the content of the sketch file.
 */
const getSketchFile = (folderPath, folderName) => {
    const newPath = path.join(folderPath, folderName);
    const filePath = path.join(newPath, `${folderName}.pde`);

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
    getSketchFoldersByLastUpdated,
};
