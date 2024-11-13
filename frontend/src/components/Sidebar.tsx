import { useGetChatsQuery } from '../app/api/chats';
import { useState } from 'react';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import Loader from './Loader';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { data: userData, error, isLoading } = useGetChatsQuery({});

    const chats = userData?.chatHistory || [];

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading chats</div>;

    const handleSidebarToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button 
                onClick={handleSidebarToggle}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 shadow-sm"
            >
                {isOpen ? <HiX size={24} /> : <HiMenuAlt2 size={24} />}
            </button>
            <nav className={`fixed left-0 top-0 h-screen w-64 flex flex-col px-4 py-6 transform transition-all duration-500 bg-white bg-opacity-10 backdrop-blur-md shadow-lg ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
                }`} aria-label='Chat History'>
                <div className='relative flex-1 overflow-y-auto pt-8'>
                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Past Chats</h2>
                    <ul className='flex flex-col gap-3'>
                        {chats.map((chat: { _id: string; title: string }) => (
                            <li key={chat._id} className="p-1 text-gray-800 rounded-lg transition-all duration-200 cursor-pointer relative group">
                                <div className="relative overflow-hidden whitespace-nowrap p-1 bg-transparent group-hover:bg-white/10 group-hover:backdrop-blur-sm group-hover:shadow-sm rounded-lg">
                                    <span className="truncate">{chat.title}</span>
                                    <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white/10 to-transparent group-hover:from-white/10 group-hover:to-transparent" />
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