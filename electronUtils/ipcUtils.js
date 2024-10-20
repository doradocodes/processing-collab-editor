const { ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { createSketchFile, deleteSketchFile, getSketchFile, getSketchFolders } = require("./fsUtils");
const os = require("os");

const isPackaged = app.isPackaged;
const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing Collaborative Sketches');
const processingJavaPath = isPackaged
    ? path.join(process.resourcesPath, 'tools', 'processing-java')
    : 'processing-java';

let processingProcess = null; // To store the reference to the process

/**
 * Loads all IPC (Inter-Process Communication) functions for the application.
 * This function sets up handlers for various IPC events related to sketch management and Processing execution.
 */
function loadIpcFunctions() {
    /**
     * Retrieves a list of sketch folders.
     * @returns {Promise<string[]>} A promise that resolves with an array of folder names.
     */
    ipcMain.handle('get-sketch-folders', async (event) => {
        try {
            return await getSketchFolders();
        } catch (error) {
            console.error('Error getting sketch folders:', error);
            throw error;
        }
    });

    /**
     * Retrieves the content of a specific sketch file.
     * @param {string} folderName - The name of the folder containing the sketch.
     * @returns {Promise<string>} A promise that resolves with the content of the sketch file.
     */
    ipcMain.handle('get-sketch-file', async (event, folderName) => {
        try {
            return await getSketchFile(folderName);
        } catch (error) {
            console.error('Error getting sketch file:', error);
            throw error;
        }
    });

    /**
     * Creates a new sketch file with the given name and content.
     * @param {string} fileName - The name of the new sketch file.
     * @param {string} content - The content of the new sketch file.
     * @returns {Promise<string>} A promise that resolves with the path of the created folder.
     */
    ipcMain.handle('create-new-sketch', async (event, fileName, content) => {
        try {
            const folderPath = await createSketchFile(fileName, content);
            console.log('Sketch created successfully', folderPath);
            return folderPath;
        } catch (error) {
            console.error('Error creating sketch:', error);
            throw error;
        }
    });

    /**
     * Renames an existing sketch folder and file.
     * @param {string} oldName - The current name of the sketch.
     * @param {string} newName - The new name for the sketch.
     * @returns {Promise<string>} A promise that resolves with the path of the renamed folder.
     */
    ipcMain.handle('rename-sketch', async (event, oldName, newName) => {
        const oldFolderPath = path.join(documentsFolderPath, oldName);
        const newFolderPath = path.join(documentsFolderPath, newName);
        const oldFilePath = path.join(newFolderPath, `${oldName}.pde`);
        const newFilePath = path.join(newFolderPath, `${newName}.pde`);

        return new Promise((resolve, reject) => {
            fs.rename(oldFolderPath, newFolderPath, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                fs.rename(oldFilePath, newFilePath, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(newFolderPath);
                });
            });
        });
    });

    /**
     * Deletes a sketch folder and its contents.
     * @param {string} folderName - The name of the folder to delete.
     * @returns {Promise<string>} A promise that resolves with the name of the deleted folder.
     */
    ipcMain.handle('delete-sketch', async (event, folderName) => {
        try {
            const deletedFolder = await deleteSketchFile(folderName);
            console.log('Sketch deleted successfully:', deletedFolder);
            return deletedFolder;
        } catch (error) {
            console.error('Error deleting sketch:', error);
            throw error;
        }
    });

    /**
     * Runs a Processing sketch.
     * @param {string} folderPath - The path to the folder containing the sketch.
     * @returns {Promise<string>} A promise that resolves when the sketch execution is complete.
     */
    ipcMain.handle('run-processing', (event, folderPath) => {
        return new Promise((resolve, reject) => {
            console.log('Running Processing sketch:', processingJavaPath, folderPath);

            processingProcess = exec(`"${processingJavaPath}" --sketch="${folderPath}" --run`);

            processingProcess.stdout.on('data', (data) => {
                console.log('stdout:', data.toString());
                event.sender.send('processing-output', data.toString());
            });

            processingProcess.stderr.on('data', (data) => {
                processingProcess = null;
                console.error('stderr:', data.toString());
                event.sender.send('processing-output-error', data.toString());
            });

            processingProcess.on('close', (code) => {
                processingProcess = null;
                resolve(`Process exited with code ${code}`);
            });

            processingProcess.on('error', (error) => {
                processingProcess = null;
                reject(`error: ${error.message}`);
            });
        });
    });

    /**
     * Stops the currently running Processing sketch.
     * @returns {Promise<string>} A promise that resolves when the sketch is stopped.
     */
    ipcMain.handle('stop-processing', () => {
        return new Promise((resolve, reject) => {
            if (processingProcess) {
                processingProcess.kill(); // Terminate the process
                resolve('Processing sketch stopped');
                processingProcess = null; // Reset the reference after termination
            } else {
                reject('No running process to stop');
            }
        });
    });
}

module.exports = { loadIpcFunctions };
