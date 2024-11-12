import React, { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import Navigation from '../../components/Navigation.tsx'
import Profile from '../Auth/Profile.tsx'
import Main from './Main.tsx'

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
            {profileOn && <Profile/>}
            <Main />
        </div>
    )
}

export default Home