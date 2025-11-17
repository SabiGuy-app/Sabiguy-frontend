// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { GoogleOAuthProvider } from '@react-oauth/google';


// createRoot(document.getElementById('root')).render(
//     <GoogleOAuthProvider clientId="438229157449-auccqvqlo5o9prvk0g09lfugjre82cf1.apps.googleusercontent.com">

//   <StrictMode>
//     <App />
//   </StrictMode>,
//   </GoogleOAuthProvider>
// )

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="438229157449-auccqvqlo5o9prvk0g09lfugjre82cf1.apps.googleusercontent.com">

  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </GoogleOAuthProvider>
)
