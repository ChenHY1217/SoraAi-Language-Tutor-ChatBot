import { useEffect, useState } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
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

    const checkIfCookiesEnabled = () => {
        try {
            document.cookie = "testCookie=1";
            const cookieEnabled = document.cookie.indexOf("testCookie") !== -1;
            document.cookie = "testCookie=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return cookieEnabled;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            const cookiesEnabled = checkIfCookiesEnabled();
            const cookieConsent = localStorage.getItem('cookieConsent');
            
            if (!cookiesEnabled) {
                toast.error('Please enable cookies in your browser settings to use this application.');
            } else if (!cookieConsent) {
                setShowCookieModal(true);
            }
        }
    }, [userInfo, navigate]);

    const handleCookieAccept = () => {
        setShowCookieModal(false);
        localStorage.setItem('cookieConsent', 'true');
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
                            
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">How to enable cookies:</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Open your browser settings (⚙️)</li>
                                    <li>Go to Privacy & Security</li>
                                    <li>Look for Cookie settings</li>
                                    <li>Enable cookies or select "Accept all cookies"</li>
                                </ol>
                                
                                <div className="mt-4 text-xs text-gray-500">
                                    <p className="font-medium">Quick links for popular browsers:</p>
                                    <ul className="mt-1 space-y-1">
                                        <li>Chrome: chrome://settings/cookies</li>
                                        <li>Firefox: about:preferences#privacy</li>
                                        <li>Safari: Preferences → Privacy</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={handleCookieAccept}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    I've Enabled Cookies
                                </button>
                                <a 
                                    href="https://www.cookiesandyou.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-blue-500 hover:text-blue-600"
                                >
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home