const {ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const {createSketchFile, deleteSketchFile, getSketchFile, getSketchFolders} = require("./fsUtils");
const os = require("os");

const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing Collaborative Sketches');

function loadIpcFunctions() {
    ipcMain.handle('get-sketch-folders', async (event) => {
        try {
            const folders = await getSketchFolders();
            return folders;
        } catch (error) {
            console.error('Error getting sketch folders:', error);
            throw error;
        }
    });

    ipcMain.handle('get-sketch-file', async (event, folderName) => {
        try {
            const fileContent = await getSketchFile(folderName);
            return fileContent;
        } catch (error) {
            console.error('Error getting sketch file:', error);
            throw error;
        }
    });

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

    ipcMain.handle('rename-sketch', async (event, oldName, newName) => {
        // rename folder and file name
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

    let processingProcess = null; // To store the reference to the process

    ipcMain.handle('run-processing', (event, folderPath) => {
        return new Promise(async (resolve, reject) => {
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

module.exports = {loadIpcFunctions};
