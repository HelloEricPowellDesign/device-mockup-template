import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CaptureApp from './CaptureApp'
import './index.css'

const capture = new URLSearchParams(window.location.search).has('capture')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {capture ? <CaptureApp /> : <App />}
  </React.StrictMode>,
)
