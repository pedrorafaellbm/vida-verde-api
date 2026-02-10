import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Home } from './pages/Home.jsx';
import { Contato } from './pages/Contato.jsx';

/* const router = createBrowserRouter([
  {
    path: "/",
    //element: <div>Hello world!</div>,
    element: <Home />,
  },
]); */

const router2 = createBrowserRouter([
  {
    element: <Layout />, // todas as rotas dentro terão Navbar + Footer
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contato",
        element: <Contato />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />, // sem Navbar e Footer
  },
  {
    path: "/register",
    element: <Register />, // sem Navbar e Footer
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router2} />
  </StrictMode>,
)
