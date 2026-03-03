import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Orders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import Users from './pages/admin/Users'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Contato } from './pages/Contato'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { ProductDetails } from './pages/ProductDetails'
import { Products } from './pages/Products'
import { Profile } from './pages/Profile'
import { Register } from './pages/Register'
import './styles/global.css'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/products/:id',
        element: <ProductDetails />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/contato',
        element: <Contato />,
      },
      {
        path: '/contact',
        element: <Navigate to="/contato" replace />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
)
