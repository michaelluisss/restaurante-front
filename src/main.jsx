import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Cardapio from './pages/cardapio.jsx'
import Contact from './pages/contact.jsx'
import Mesas from './pages/mesas.jsx'
import Pedidos from './pages/pedidos.jsx'
import Cozinha from './pages/cozinha.jsx'


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
  },{
    path: "/pedidos",
    element: <Pedidos />,
  },{
    path: "/cozinha",
    element: <Cozinha />,
  }
]);
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>,
)
