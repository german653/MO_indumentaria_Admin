import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      <Toaster
        position="top-center" // Centrado arriba queda mejor para notificaciones importantes
        toastOptions={{
          duration: 4000,
          className: '!bg-white !text-gray-900 !shadow-2xl !rounded-xl !border !border-gray-100 !px-6 !py-4 !font-medium',
          style: {
            // Estilos basenpm run
          },
          success: {
            iconTheme: {
              primary: '#10B981', // Verde esmeralda lindo
              secondary: '#fff',
            },
            style: {
               borderLeft: '4px solid #10B981',
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
             style: {
               borderLeft: '4px solid #EF4444',
            }
          },
        }}
      />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)