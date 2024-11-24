import { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import IconNav from './IconNav.tsx'
import Profile from '../Auth/Profile.tsx'
import ChatSection from './ChatSection.tsx'
import Sidebar from './Sidebar.tsx'
import NewChatIcon from '../../components/NewChatIcon'
import backgroundImage from '../../../../public/bg/skyWithClouds.webp'
import ProgressBar from './ProgressBar.tsx'

const Home: React.FC = () => {

    const { userInfo } = useAppSelector((state) => state.auth);
    const profileOn = useAppSelector((state) => state.profile);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);

    // from-primary-100 to-secondary-100
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-1000"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundColor: 'rgba(255, 255, 255, 0)', // Changed opacity from 0.8 to 0.4
                 backgroundBlendMode: 'overlay'
             }}>
            {profileOn && <Profile />}
            <IconNav />
            <ProgressBar />
            <div className="flex flex-col md:flex-row">
                <Sidebar />
                <ChatSection />
            </div>
            <NewChatIcon />
        </div>
    );
}

export default Home