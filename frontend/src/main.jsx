import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './pages/dashboard.jsx'
import './output.css'
import { AuthProvider } from '../utils/UserContext.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>
)
