import { createRoot } from 'react-dom/client'
import store from './app/store.ts'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import './index.css'

import App from './App.tsx'
import Home from './pages/Home/Home.tsx'
import Login from './pages/Auth/Login.tsx'
import Register from './pages/Auth/Register.tsx'
import ForgotPassword from './pages/Auth/ForgotPassword.tsx'
import ResetPassword from './pages/Auth/ResetPassword.tsx'
import Error404 from './pages/Error/Error404.tsx'
import ErrorBoundary from './pages/Error/ErrorBoundary.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
      <Route index={true} path='/' element={<Home/>}/>
      <Route path='/chat/:chatId' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<Error404 />} />
    </Route>
    
  )
)

disableReactDevTools();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)