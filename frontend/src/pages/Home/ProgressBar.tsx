import { useGetChatByIdQuery } from "../../app/api/chats";
import { useGetProgressQuery } from "../../app/api/progress";
import { useParams, useLocation } from "react-router";
import Loader from "../../components/Loader";

const ProgressBar = () => {
    const { chatId } = useParams();
    const location = useLocation();
    const isNewChat = !chatId || location.pathname === '/';

    if (isNewChat) {
        return null;
    };

    const { data: chatData, isLoading: isChatLoading } = useGetChatByIdQuery(
        chatId ?? 'skip',
        { skip: !chatId }
    );
    
    const { data: progress, isLoading: isProgressLoading } = useGetProgressQuery(
        chatData?.language ?? 'skip',
        { skip: !chatData?.language }
    );

    if (isChatLoading || isProgressLoading) {
        return <Loader />;
    }

    if (!chatData || !progress) {
        return null;
    }

    return (
        <div className="fixed top-24 right-4 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 rounded-xl p-4 w-64 hidden md:block">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 capitalize">
                {chatData.language}
            </h3>
            <div className="space-y-4">
                {/* Vocabulary Progress */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Vocabulary</span>
                        <span className="text-sm font-semibold text-blue-600">Lvl {progress.vocabularyLvl}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative group">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
                            style={{ 
                                width: `${progress.vocabularyProgress * 100}%`,
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs transition-opacity">
                            {Math.round(progress.vocabularyProgress * 100)}%
                        </div>
                    </div>
                </div>

                {/* Grammar Progress */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Grammar</span>
                        <span className="text-sm font-semibold text-blue-600">Lvl {progress.grammarLvl}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative group">
                        <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                            style={{ 
                                width: `${progress.grammarProgress * 100}%`,
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs transition-opacity">
                            {Math.round(progress.grammarProgress * 100)}%
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .8;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProgressBar;