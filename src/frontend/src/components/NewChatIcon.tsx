import { HiPlus } from 'react-icons/hi';
import { useNewChat } from '../hooks/useNewChat.ts';

const NewChatIcon: React.FC = () => {
    const { startNewChat } = useNewChat();

    return (
        <button 
            onClick={startNewChat}
            className="group fixed bottom-6 right-6 z-[60] p-3 rounded-full 
                bg-gradient-to-br from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                text-white shadow-lg border border-white/10
                transform hover:scale-110 hover:-translate-y-1
                transition-all duration-200 ease-out
                hidden md:block"
            title="Start New Chat"
        >
            <HiPlus 
                size={24} 
                className="transform transition-all duration-200 group-hover:rotate-90"
            />
        </button>
    );
};

export default NewChatIcon;