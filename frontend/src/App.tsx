import React, { useState } from 'react';
import Login from './pages/Auth/Login.tsx';
import MainContent from './pages/MainContent.tsx';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './pages/Auth/Navigation.tsx';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        // <div className={`min-h-screen transition-colors duration-1000 bg-gradient-to-br from-blue-500 to-indigo-600`}>
        //     {!isLoggedIn ? (
        //         <Login onLogin={handleLogin} />
        //     ) : (
        //         <MainContent />
        //     )}
        // </div>
        
        <div>
            <Outlet />
            <ToastContainer />
            {/* <Navigation /> */}
        </div>
    );
}

export default App;