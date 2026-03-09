import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Banners from './pages/admin/Banners'
import Orders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import StoreInfo from './pages/admin/StoreInfo'
import Users from './pages/admin/Users'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Contato } from './pages/Contato'
import { Favorites } from './pages/Favorites'
import { FeaturedProducts } from './pages/FeaturedProducts'
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
        element: <Navigate to="/inicio" replace />,
      },
      {
        path: '/inicio',
        element: <Home />,
      },
      {
        path: '/home',
        element: <Navigate to="/inicio" replace />,
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
        path: '/carrinho',
        element: <Cart />,
      },
      {
        path: '/cart',
        element: <Navigate to="/carrinho" replace />,
      },
      {
        path: '/curtidos',
        element: <Favorites />,
      },
      {
        path: '/destaques',
        element: <FeaturedProducts />,
      },
      {
        path: '/endereco',
        element: <Checkout />,
      },
      {
        path: '/checkout',
        element: <Navigate to="/endereco" replace />,
      },
      {
        path: '/perfil',
        element: <Profile />,
      },
      {
        path: '/profile',
        element: <Navigate to="/perfil" replace />,
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
      {
        path: 'banners',
        element: <Banners />,
      },
      {
        path: 'store-info',
        element: <StoreInfo />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/inicio" replace />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)
