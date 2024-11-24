import { useGetChatsQuery, useDeleteChatByIdMutation, useClearChatHistoryMutation } from '../../app/api/chats';
import { HiMenuAlt2, HiX, HiPlus } from 'react-icons/hi';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../../components/Modal';
import { useNewChat } from '../../hooks/useNewChat';

const Sidebar: React.FC = () => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        chatId: '',
        isClearAll: false
    });
    
    const navigate = useNavigate();

    const { data: userData, error, isLoading } = useGetChatsQuery({}, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        // pollingInterval: 3000  // Poll every 3 seconds
    });
    const [deleteChatById] = useDeleteChatByIdMutation();
    const [clearChatHistory] = useClearChatHistoryMutation();
    const { startNewChat } = useNewChat();

    const chats = userData?.chatHistory || [];

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading chats</div>;

    // Handle chat click and update chat Section
    const handleChatClick = (chat: any) => {
        navigate(`/chat/${chat._id}`);
    };

    // Update the handleDeleteChat to use a MouseEvent with HTMLButtonElement
    const handleDeleteChat = async (e: React.MouseEvent<HTMLButtonElement>, chatId: string) => {
        e.preventDefault(); // Prevent any parent handlers
        e.stopPropagation(); // Stop event from bubbling up
        setModalConfig({ isOpen: true, chatId, isClearAll: false });
    };

    // Handle clear history
    const handleClearHistory = () => {
        setModalConfig({ isOpen: true, chatId: '', isClearAll: true });
    };

    const handleConfirmDelete = async () => {
        try {
            if (modalConfig.isClearAll) {
                await clearChatHistory({}).unwrap();
                navigate('/'); // Navigate to home after clearing all chats
            } else {
                await deleteChatById(modalConfig.chatId).unwrap();
                if (window.location.pathname.includes(modalConfig.chatId)) {
                    navigate('/'); // Navigate to home if the deleted chat was active
                }
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        }
        setModalConfig({ isOpen: false, chatId: '', isClearAll: false });
    };

    return (
        <>
            <div className="group fixed left-0 top-0 h-screen z-[60] ">
                <button 
                    className="absolute top-6 left-6 p-3 rounded-xl bg-white/15 backdrop-blur-lg hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
                >
                    <HiMenuAlt2 size={20} />
                </button>
                <nav className={`fixed left-0 top-0 h-screen w-72 flex flex-col transform transition-all duration-500 ease-in-out 
                    bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-xl shadow-2xl border-r border-white/10 z-50 
                    -translate-x-full group-hover:translate-x-0`} 
                    aria-label='Chat History'
                >
                    <div className='relative flex-1 overflow-y-auto
                        scrollbar scrollbar-w-2 scrollbar-thumb-gray-400/60 scrollbar-track-transparent
                        hover:scrollbar-thumb-gray-500/80'>
                        <div className='px-6 py-8'>
                            <h2 className="text-2xl font-semibold mb-8 mt-4 text-center text-gray-800/90">Chat History</h2>
                            <button
                                onClick={startNewChat}
                                className="w-full mb-4 flex items-center justify-center gap-3 py-3 px-4 
                                    bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                                    text-white rounded-xl shadow-md hover:shadow-lg
                                    transform transition-all duration-200 hover:-translate-y-0.5
                                    group"
                            >
                                <HiPlus 
                                    size={20} 
                                    className="transform transition-all duration-300 
                                        group-hover:rotate-180"
                                />
                                <span className="font-medium">New Chat</span>
                            </button>
                            <ul className='flex flex-col gap-2'>
                                {chats.map((chat: { _id: string; title: string }) => (
                                    <li 
                                        key={chat._id} 
                                        className="rounded-xl transition-all duration-300 cursor-pointer relative group"
                                        title={chat.title}
                                    >
                                        <div 
                                            onClick={() => handleChatClick(chat)}
                                            className="relative overflow-hidden p-3 bg-white/5 hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10 shadow-sm"
                                        >
                                            <span className="block truncate text-gray-800/80 font-medium text-sm pr-8">
                                                {chat.title}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteChat(e, chat._id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <HiX className="w-4 h-4 text-gray-600 hover:text-red-500" />
                                            </button>
                                            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white/10 to-transparent" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='px-6 py-4'>
                        <button
                            onClick={handleClearHistory}
                            className="p-2 w-full rounded-xl bg-white/10 hover:bg-red-500/20 text-gray-800/80 hover:text-red-600 transition-all duration-300 text-sm font-medium"
                        >
                            Clear History
                        </button>
                    </div>
                </nav>
            </div>
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, chatId: '', isClearAll: false })}
                onConfirm={handleConfirmDelete}
                title={modalConfig.isClearAll ? "Clear All Chats" : "Delete Chat"}
                message={modalConfig.isClearAll 
                    ? "Are you sure you want to clear all chat history? This action cannot be undone."
                    : "Are you sure you want to delete this chat? This action cannot be undone."}
            />

        </>
    );
};

export default Sidebar;