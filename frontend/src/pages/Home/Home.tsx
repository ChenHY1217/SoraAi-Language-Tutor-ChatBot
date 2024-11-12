import { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import Profile from '../Auth/Profile.tsx'
import ChatSection from './ChatSection.tsx'

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

            <ChatSection />
        </div>
    )
}

export default Home