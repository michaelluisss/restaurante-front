import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Cardapio from './pages/cardapio.jsx'
import Contact from './pages/contact.jsx'
import Mesas from './pages/mesas.jsx'


import{
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/cardapio",
    element: <Cardapio />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },{
    path: "/mesas",
    element: <Mesas />,
  }
]);
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>,
)
