import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode disabled for drag-and-drop libraries in some cases, 
  // but hello-pangea/dnd handles it well. Keeping it for safety in dev.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
