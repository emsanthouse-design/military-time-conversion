import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import './styles.css'

// Boring hand-rolled router: the dashboard is the only non-game route, so a
// pathname check is all we need (no react-router dependency).
const isResults = window.location.pathname.replace(/\/+$/, '') === '/results'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isResults ? <Dashboard /> : <App />}</React.StrictMode>
)
