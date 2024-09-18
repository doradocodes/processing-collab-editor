import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@radix-ui/themes/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)

postMessage({ payload: 'removeLoading' }, '*')
