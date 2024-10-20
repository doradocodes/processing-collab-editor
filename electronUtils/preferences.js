const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * Path to the preferences file in the user's data directory.
 * @constant {string}
 */
const preferencesFilePath = path.join(app.getPath('userData'), 'pce_preferences.json');

/**
 * Loads user preferences from the file system.
 * If the preferences file doesn't exist, it creates one with default settings.
 * @returns {Object} The user preferences object.
 */
function loadPreferences() {
    try {
        if (!fs.existsSync(preferencesFilePath)) {
            console.log('Preferences file not found, creating new');
            const defaultPreferences = {
                theme: 'light',
            };
            fs.writeFileSync(preferencesFilePath, JSON.stringify(defaultPreferences, null, 2));
            return defaultPreferences;
        }

        const data = fs.readFileSync(preferencesFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading preferences:', error);
        return {
            theme: 'light',
        };
    }
}

/**
 * Saves the given preferences to the file system.
 * @param {Object} preferences - The preferences object to save.
 */
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
