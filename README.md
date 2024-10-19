# Processing Collaborative Code Editor

## Description
Prototype for a new collaborative code editor for Processing (2024 pr05).

## Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Download JDK 17.0.8 from https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html and unzip it into /tools/PlugIns.
4. Run `npm run start` to start the development version of the Electron app.

## Build
### Build for MacOS
1. Create a .env file with your credentials by copying the .env.example file and filling in the necessary information from your Apple Developer account.
2. Run `npm run sign_processing` to sign the Processing library for notarization (macOS builds only). You only need to run this when packaging the app for the first time.
3. Run `npm run make:mac` (for Apple Silicon Chip) or `npm run make:mac64` (for 64-bit Intel Chip) to package the app for macOS.
4. The packaged app will be in the /out folder.

## Scripts
- `npm run build` - Builds the front-end React app
- `npm run dev` - Starts the Electron and React app in development mode
- `npm run dev:react` - Starts the React app in development mode (used for `npm run dev`)
- `npm run dev:electron` - Starts the Electron app in development mode (used for `npm run dev`)
- `npm run package` - Package the Electron app
- `npm run make` - Uses Electron Forge to package the app (in your default OS) into /out folder (Note: process takes a while--it takes a while to copy the Processing library into the package).
- `npm run make:win` - Uses Electron Forge to package the app for Windows
- `npm run make:mac` - Uses Electron Forge to package the app for macOS (Apple Silicon Chip)
- `npm run make:mac64` - Uses Electron Forge to package the app for macOS 64-bit (Intel Chip)
- `npm run make:linux` - Uses Electron Forge to package the app for Linux
- `npm run sign_processing` - Signs the Processing library for notarization (macOS builds only). You only need to run this when packaging the app for the first time.

