import { createRoot } from 'react-dom/client'
import './index.css'
import store from './app/store.ts'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import Home from './pages/Home/Home.tsx'
import Login from './pages/Auth/Login.tsx'
import Register from './pages/Auth/Register.tsx'
import ForgotPassword from './pages/Auth/ForgotPassword.tsx'

// Authorization

// Restricted

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path='/' element={<Home/>}/>
      <Route path='/chat/:chatId' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/forgot' element={<ForgotPassword/>} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)