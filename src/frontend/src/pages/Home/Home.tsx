import { useEffect, useState } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import IconNav from './IconNav.tsx'
import Profile from '../Auth/Profile.tsx'
import ChatSection from './ChatSection.tsx'
import Sidebar from './Sidebar.tsx'
import NewChatIcon from '../../components/NewChatIcon'
import backgroundImage from '../../../../../public/bg/skyWithClouds.webp'
import ProgressBar from './ProgressBar.tsx'

const Home: React.FC = () => {

    const { userInfo } = useAppSelector((state) => state.auth);
    const profileOn = useAppSelector((state) => state.profile);
    const [showCookieModal, setShowCookieModal] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            setShowCookieModal(true);
        }
    }, [userInfo, navigate]);

    const handleCookieAccept = () => {
        setShowCookieModal(false);
        // Logic to enable cookies
    };

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

            {/* Cookie Modal */}
            <AnimatePresence>
                {showCookieModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    >
                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                            <h2 className="text-xl font-bold mb-4">Enable Cookies</h2>
                            <p className="mb-4">Please enable cookies for authentication to work properly.</p>
                            <button
                                onClick={handleCookieAccept}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home