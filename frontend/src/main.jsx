import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './pages/dashboard.jsx'
import './output.css'
import { AuthProvider } from '../utils/UserContext.jsx'
import { ChatProvider } from '../utils/ChatContext.jsx'
import ProtectedRoute from '../utils/ProtectRoute.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router}/>
        </ChatProvider>
    </AuthProvider>
  </React.StrictMode>
)
