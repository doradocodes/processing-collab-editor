# Processing Collaborative Code Editor

## Description
This project is a prototype for a new collaborative code editor designed for the Processing Foundation (2024 pr05). It aims to enhance the coding experience for Processing users by providing a platform for real-time collaboration.

## Installation
1. Clone the repository to your local machine.
2. Install dependencies by running `npm install` in the project directory.
3. Download JDK 17.0.8 from the [Oracle Archive](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) and extract it into the `/tools/PlugIns` directory.
4. Launch the development version of the Electron app by executing `npm run start`.

## Build Instructions
### Building for macOS
1. Create a `.env` file with your credentials by copying the `.env.example` file and populating it with the necessary information from your Apple Developer account.
2. Execute `npm run sign_processing` to sign the Processing library for notarization (required for macOS builds only). This step is only necessary when packaging the app for the first time.
3. Package the app for macOS by running:
   - `npm run make:mac` for Apple Silicon chips
   - `npm run make:mac64` for 64-bit Intel chips
4. The packaged application will be available in the `/out` folder.

## Available Scripts
- `npm run build`: Compiles the front-end React app
- `npm run dev`: Launches both the Electron and React apps in development mode
- `npm run dev:react`: Starts only the React app in development mode (used as part of `npm run dev`)
- `npm run dev:electron`: Launches only the Electron app in development mode (used as part of `npm run dev`)
- `npm run package`: Packages the Electron app
- `npm run make`: Uses Electron Forge to package the app for your default OS into the `/out` folder (Note: This process may take some time due to the inclusion of the Processing library)
- `npm run make:win`: Packages the app for Windows using Electron Forge
- `npm run make:mac`: Packages the app for macOS (Apple Silicon) using Electron Forge
- `npm run make:mac64`: Packages the app for macOS 64-bit (Intel) using Electron Forge
- `npm run make:linux`: Packages the app for Linux using Electron Forge
- `npm run sign_processing`: Signs the Processing library for notarization (macOS builds only). This script needs to be run only once, when packaging the app for the first time.
