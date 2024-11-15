import { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
import { useNavigate, useParams } from 'react-router-dom'
import IconNav from '../../components/IconNav.tsx'
import Profile from '../Auth/Profile.tsx'
import ChatSection from '../../components/ChatSection.tsx'
import Sidebar from '../../components/Sidebar.tsx'

const Home = () => {

    const { userInfo } = useAppSelector((state) => state.auth);
    const profileOn = useAppSelector((state) => state.profile);
    // Need to pass chatId from url to sidebar and chatsection components
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);

    // from-primary-100 to-secondary-100
    return (
        <div className="min-h-screen transition-colors duration-1000 bg-gradient-to-tr from-primary-300 to-secondary-300">
            {profileOn && <Profile />}
            <IconNav />
            <div className="flex flex-col md:flex-row">
                <Sidebar />
                <ChatSection />
            </div>
        </div>
    );
}

export default Home