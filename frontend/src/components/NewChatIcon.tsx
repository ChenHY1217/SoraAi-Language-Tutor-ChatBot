
import { HiPlus } from 'react-icons/hi';
import { useNewChat } from '../hooks/useNewChat';

const NewChatIcon = () => {
    const { startNewChat } = useNewChat();

    return (
        <button 
            onClick={startNewChat}
            className="fixed bottom-6 right-6 z-[60] p-3 rounded-full bg-white/15 backdrop-blur-lg hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
            title="Start New Chat"
        >
            <HiPlus size={24} />
        </button>
    );
};

export default NewChatIcon;