
# Processing Collaborative Code Editor - React UI

## Overview
This directory contains the React-based user interface for the Processing Collaborative Code Editor. It's designed to work in conjunction with the Electron app to provide a seamless and interactive coding experience for Processing users.

## Structure
- `src/`: Contains the source code for the React application
  - `assets/`: Image assets for the React application
  - `components/`: React components used throughout the application
  - `store/`: State managment files using Zustand
  - `utils/`: Utility functions and helpers
  - `views/`: React components for each application route

## Development
To start developing the React UI:

1. Ensure you're in the `react-ui` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

This will launch the React app in development mode, usually accessible at `http://localhost:5173`.

## Building
To build the React app for production:

1. Run the build command:
   ```
   npm run build
   ```
2. The built files will be in the `build/` directory, ready to be integrated with the Electron app
