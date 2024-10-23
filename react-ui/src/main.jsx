/**
 * Main entry point for the React application.
 * This file sets up the root React component and initializes the app.
 */

// Import dependencies
import ReactDOM from 'react-dom/client'

// Import components
import App from './App'

// Import styles
import '@radix-ui/themes/styles.css';
import './index.css';

// Initialize the app
const initializeApp = () => {
  // Create a root and render the App component
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  )

  // Send a message to remove the loading indicator
  postMessage({ payload: 'removeLoading' }, '*')
}

// Run the initialization
initializeApp();
