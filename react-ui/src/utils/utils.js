export function generateroomID() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function sanitizeFileNameForFs(fileName) {
    return fileName.replace(/[^a-z0-9]/gi, '_');
}

export function formatSketchName(name) {
    if (!name) {
        return 'Untitled sketch';
    }
    if (name.indexOf('sketch_') === 0) {
        const formattedTimestamp = new Date(parseInt(name.split('_')[1])).toLocaleString();
        return `Untitled sketch (${formattedTimestamp})`;
    }
    if (name.indexOf('collab_') === 0) {
        return name.replace('collab_', '') + ' (copy)';
    }
    return name.replaceAll('_', ' ');
}

export function checkValidSketchName(name) {
    // allow only letters, numbers, and underscores and spaces
    return /^[a-zA-Z0-9_ ]+$/.test(name);
}

export const sketchTemplate = `void setup() {
    size(400, 400);
}

void draw() {
    background(0);
}`
