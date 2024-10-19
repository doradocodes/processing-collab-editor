require('dotenv').config();

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const extractZip = require('extract-zip');
const AdmZip = require('adm-zip'); // For repacking .jar files

// Read the Developer ID Application signature from environment variable
const SIGNING_IDENTITY = process.env.APPLE_DEVELOPER_IDENTITY;

if (!SIGNING_IDENTITY) {
    console.error('SIGNING_IDENTITY environment variable is not set.');
    process.exit(1);
}

// Function to sign a .jnilib file
const signFile = (filePath) => {
    try {
        execSync(`codesign --deep --force --verbose --options runtime --sign "${SIGNING_IDENTITY}" "${filePath}"`);
    } catch (error) {
        console.error(`Failed to sign ${filePath}: ${error.message}`);
    }
};

const signAllJnilibFiles = async (dir) => {
    const files = await fs.readdir(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
            await signAllJnilibFiles(fullPath);
        } else if (file.endsWith('.jnilib')) {
            console.log(`Found .jnilib: ${fullPath}`);
            signFile(fullPath);
        }
    }
};

const processJarFile = async (jarPath) => {
    try {
        console.log(`Extracting ${jarPath}`);
        const jarExtractPath = path.join(path.dirname(jarPath), `${path.basename(jarPath)}_extracted`);

        await extractZip(jarPath, { dir: jarExtractPath });

        await signAllJnilibFiles(jarExtractPath);

        const zip = new AdmZip();
        zip.addLocalFolder(jarExtractPath);
        zip.writeZip(jarPath);

        console.log(`Repacked and signed ${jarPath}`);
        await fs.remove(jarExtractPath);
    } catch (err) {
        console.error(`Error processing ${jarPath}: ${err.message}`);
    }
};

const processAllJarFiles = async (dir) => {
    try {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                await processAllJarFiles(fullPath);
            } else if (file.endsWith('.jar')) {
                await processJarFile(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}: ${error.message}`);
    }
};

const folderToProcess = process.argv[2];

if (!folderToProcess) {
    console.error('Please provide the folder to process as an argument.');
    process.exit(1);
}

(async () => {
    console.log(`Starting to process all .jar files in ${folderToProcess}`);
    await processAllJarFiles(path.resolve(folderToProcess));
    console.log('Completed processing of all .jar files.');
})();
