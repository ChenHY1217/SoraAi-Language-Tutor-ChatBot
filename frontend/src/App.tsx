import React, { useState } from 'react';
import Login from './pages/Auth/Login.tsx';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './components/Navigation.tsx';
import Home from './pages/Home/Home.tsx';

function App() {

    return (
        <div>
            <ToastContainer />
            <Outlet />
        </div>
    );
}

export default App;