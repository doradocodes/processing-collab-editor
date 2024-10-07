export function generateroomID() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function sanitizeFileNameForFs(fileName) {
    return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export function formatSketchName(name) {
    if (!name) {
        return 'Untitled sketch';
    }
    if (name.indexOf('sketch_') === 0) {
        const formattedTimestamp = new Date(parseInt(name.split('_')[1])).toLocaleString();
        return `Untitled sketch (${formattedTimestamp})`;
    }
    return name.replaceAll('_', ' ');
}

export function checkValidSketchName(name) {
    return name.match(/^[a-z0-9_]+$/i);
}
