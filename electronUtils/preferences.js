const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const preferencesFilePath = path.join(app.getPath('userData'), 'pce_preferences.json');
console.log(preferencesFilePath);

function loadPreferences() {
    try {
        // Check if preferences.json exists
        if (!fs.existsSync(preferencesFilePath)) {
            console.log('Preferences file not found, creating new');
            // If the file doesn't exist, create it with default preferences
            const defaultPreferences = {
                theme: 'light',
            };
            fs.writeFileSync(preferencesFilePath, JSON.stringify(defaultPreferences, null, 2));
            return defaultPreferences;
        }

        // If it exists, read and return the preferences
        const data = fs.readFileSync(preferencesFilePath);
        return JSON.parse(data);
    } catch (error) {
        // Return default preferences if file doesn't exist or there is an error
        return {
            theme: 'light',
        };
    }
}

function savePreferences(preferences) {
    try {
        fs.writeFileSync(preferencesFilePath, JSON.stringify(preferences, null, 2));
    } catch (error) {
        console.error('Failed to save preferences:', error);
    }
}

module.exports = {
    loadPreferences,
    savePreferences,
};
