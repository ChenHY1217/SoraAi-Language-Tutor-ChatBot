import { useGetChatsQuery } from '../app/api/chats';
import { useState } from 'react';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data: userData, error, isLoading } = useGetChatsQuery({});
    const navigate = useNavigate();

    const chats = userData?.chatHistory || [];

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading chats</div>;

    const handleSidebarToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleChatClick = (chatId: string) => {
        navigate(`/chat/${chatId}`);
        setIsOpen(false); // Close sidebar on mobile after selection
    };

    return (
        <>
            <button 
                onClick={handleSidebarToggle}
                className="fixed top-6 left-6 z-[60] p-3 rounded-xl bg-white/15 backdrop-blur-lg hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
            >
                {isOpen ? <HiX size={20} /> : <HiMenuAlt2 size={20} />}
            </button>
            <nav className={`fixed left-0 top-0 h-screen w-72 flex flex-col px-6 py-8 transform transition-all duration-500 ease-in-out 
                bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-xl shadow-2xl border-r border-white/10 z-50 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
                aria-label='Chat History'
            >
                <div className='relative flex-1 overflow-y-auto pt-10'>
                    <h2 className="text-2xl font-semibold mb-8 mt-2 text-center text-gray-800/90">Chat History</h2>
                    <ul className='flex flex-col gap-2'>
                        {chats.map((chat: { _id: string; title: string }) => (
                            <li 
                                key={chat._id} 
                                className="rounded-xl transition-all duration-300 cursor-pointer relative group"
                                title={chat.title}
                                onClick={() => handleChatClick(chat._id)}
                            >
                                <div className="relative overflow-hidden p-3 bg-white/5 hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10 shadow-sm">
                                    <span className="block truncate text-gray-800/80 font-medium">{chat.title}</span>
                                    <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white/10 to-transparent" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;