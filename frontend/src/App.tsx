import React, { useState } from 'react';
import Login from './pages/Auth/Login.tsx';
import MainContent from './pages/MainContent.tsx';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './pages/Auth/Navigation.tsx';
import Home from './pages/Home/Home.tsx';

function App() {

    return (
        
        <div>
            <Outlet />
            <ToastContainer />
            <Navigation/>
        </div>
    );
}

export default App;