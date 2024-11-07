import React, { useEffect } from 'react'
import { useAppSelector } from '../app/hooks'
import { useNavigate } from 'react-router-dom'
import Navigation from './Auth/Navigation.tsx'
import Profile from './Auth/Profile.tsx'

const Home = () => {

    const { userInfo } = useAppSelector((state) => state.auth);
    const profileOn = useAppSelector((state) => state.profile);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);


    return (
        <div
            className={`min-h-screen transition-colors duration-1000 bg-gradient-to-tr from-primary-100 to-secondary-100`}
        >
            <h1 className="text-4xl text-center pt-10">Welcome to the Home Page</h1>
            
            {profileOn && <Profile/>}
        </div>
    )
}

export default Home