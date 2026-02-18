import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'

import Layout from './components/Layout.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Home } from './pages/Home.jsx'
import { Contato } from './pages/Contato.jsx'

/* 🔒 Proteção de rota */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/register" replace />,
  },
  {
    path: '/login',
    element: <Login />, // ❌ sem NavBar e Footer
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/contato',
        element: <Contato />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
