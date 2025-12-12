import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 

// NOTA: No necesitamos los Providers aquí porque ya están dentro de App.jsx
// Esto facilita las pruebas unitarias y evita duplicidad de estado.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



//import React from 'react'
//import ReactDOM from 'react-dom/client'
//import App from './App'
//import './index.css'

//ReactDOM.createRoot(document.getElementById('root')).render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//)

