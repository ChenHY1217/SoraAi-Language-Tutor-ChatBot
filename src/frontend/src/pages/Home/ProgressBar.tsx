import { useGetChatByIdQuery } from "../../app/api/chats";
import { useGetProgressQuery } from "../../app/api/progress";
import { useLocation } from "react-router";
import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaLevelUpAlt } from 'react-icons/fa';

const ProgressBar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [levelUpAnimation, setLevelUpAnimation] = useState<{
        vocab: boolean;
        grammar: boolean;
    }>({ vocab: false, grammar: false });
    
    const location = useLocation();

    const { data: chatData, isLoading: isChatLoading } = useGetChatByIdQuery(
        currentChatId ?? 'skip',
        { skip: !currentChatId }
    );
    
    const { data: progress, isLoading: isProgressLoading } = useGetProgressQuery(
        chatData?.language ?? 'skip',
        { skip: !chatData?.language }
    );

    // Update currentChatId when URL changes
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const chatIdIndex = pathParts.indexOf('chat') + 1;
        if (chatIdIndex > 0 && chatIdIndex < pathParts.length) {
            setCurrentChatId(pathParts[chatIdIndex]);
        } else {
            setCurrentChatId(null);
        }
    }, [location.pathname]);

    // Improved level change tracking
    useEffect(() => {
        if (progress && chatData?.language) {
            const storageKey = `${chatData.language}_levels`;
            const storedLevels = localStorage.getItem(storageKey);
            
            // Initialize levels if they don't exist
            if (!storedLevels) {
                localStorage.setItem(storageKey, JSON.stringify({
                    vocabularyLvl: progress.vocabularyLvl,
                    grammarLvl: progress.grammarLvl
                }));
                return;
            }

            const { vocabularyLvl: oldVocabLvl, grammarLvl: oldGrammarLvl } = JSON.parse(storedLevels);

            if (oldVocabLvl < progress.vocabularyLvl) {
                setLevelUpAnimation(prev => ({ ...prev, vocab: true }));
                setTimeout(() => setLevelUpAnimation(prev => ({ ...prev, vocab: false })), 2000);
            }
            if (oldGrammarLvl < progress.grammarLvl) {
                setLevelUpAnimation(prev => ({ ...prev, grammar: true }));
                setTimeout(() => setLevelUpAnimation(prev => ({ ...prev, grammar: false })), 2000);
            }

            // Only update stored levels if there's a change
            if (oldVocabLvl !== progress.vocabularyLvl || oldGrammarLvl !== progress.grammarLvl) {
                localStorage.setItem(storageKey, JSON.stringify({
                    vocabularyLvl: progress.vocabularyLvl,
                    grammarLvl: progress.grammarLvl
                }));
            }
        }
    }, [progress, chatData?.language]);

    // Early return if conditions aren't met
    if (!currentChatId || isChatLoading || isProgressLoading || !chatData || !progress) {
        return null;
    }

    return (
        <>
            <div className={`fixed top-24 right-10 transition-all duration-300 ease-in-out z-30 group
                ${isVisible ? 'translate-x-0' : 'translate-x-[calc(100%+40px)]'} hidden lg:block`}
            >
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className={`absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2
                        bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 rounded-l-lg p-2
                        hover:bg-gray-50 transition-all cursor-pointer 
                        group-hover:opacity-100 ${isVisible ? 'opacity-0' : 'opacity-100'}`}
                    aria-label={isVisible ? "Hide progress" : "Show progress"}
                >
                    {isVisible ? <IoChevronForward /> : <IoChevronBack />}
                </button>
                
                <div className="bg-white/90 backdrop-blur-sm shadow-xl 
                    border border-gray-200 rounded-xl p-4 w-64 hidden lg:block
                    animate-fade-in opacity-0 z-40">
                    <div className="relative">
                        <h3 className="text-sm font-bold text-gray-800 mb-3 capitalize">
                            {chatData.language} Progress
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {/* Vocabulary Progress */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Vocabulary</span>
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold text-blue-600">Lvl {progress.vocabularyLvl}</span>
                                    {levelUpAnimation.vocab && (
                                        <FaLevelUpAlt className={`ml-1 text-yellow-500 ${levelUpAnimation.vocab ? 'level-up-icon' : ''}`} />                                    )}
                                </div>
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
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold text-green-600">Lvl {progress.grammarLvl}</span>
                                    {levelUpAnimation.grammar && (
                                        <FaLevelUpAlt className={`ml-1 text-yellow-500 ${levelUpAnimation.grammar ? 'level-up-icon' : ''}`} />                                    )}
                                </div>
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
                </div>
            </div>

            {/* Mobile version */}
            <div className="fixed top-20 left-0 right-0 lg:hidden z-20"> {/* Changed from bottom-20 to top-20 */}
                <div className={`mx-4 transition-all duration-300 ease-in-out
                    ${isVisible ? 'translate-y-0' : 'translate-y-[-calc(100%+80px)]'}`} // Changed from translate-y to -translate-y
                >
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
                            bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 
                            rounded-t-lg px-4 py-2 hover:bg-gray-50 transition-all cursor-pointer
                            opacity-0 group-hover:opacity-100 z-50"
                        aria-label={isVisible ? "Hide progress" : "Show progress"}
                    >
                        {isVisible ? <IoChevronForward className="rotate-90" /> : <IoChevronBack className="-rotate-90" />}
                    </button>
                    
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl 
                        border border-gray-200 rounded-xl p-4
                        animate-fade-in opacity-0">
                        <div className="relative">
                            <h3 className="text-sm font-bold text-gray-800 mb-3 capitalize">
                                {chatData.language} Progress
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Vocabulary Progress */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Vocabulary</span>
                                    <div className="flex items-center">
                                        <span className="text-sm font-semibold text-blue-600">Lvl {progress.vocabularyLvl}</span>
                                        {levelUpAnimation.vocab && (
                                            <FaLevelUpAlt className={`ml-1 text-yellow-500 ${levelUpAnimation.vocab ? 'level-up-icon' : ''}`} />                                    )}
                                    </div>
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
                                    <div className="flex items-center">
                                        <span className="text-sm font-semibold text-green-600">Lvl {progress.grammarLvl}</span>
                                        {levelUpAnimation.grammar && (
                                            <FaLevelUpAlt className={`ml-1 text-yellow-500 ${levelUpAnimation.grammar ? 'level-up-icon' : ''}`} />                                    )}
                                    </div>
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

                @keyframes fadeIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(-20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out 0.2s forwards;
                }

                @keyframes levelUp {
                    0% {
                        transform: translateY(0) scale(1);
                        color: inherit;
                    }
                    25% {
                        transform: translateY(-10px) scale(1.2);
                        color: #FFD700;
                    }
                    50% {
                        transform: translateY(-5px) scale(1.1);
                        color: #FFD700;
                    }
                    75% {
                        transform: translateY(-8px) scale(1.15);
                        color: #FFD700;
                    }
                    100% {
                        transform: translateY(0) scale(1);
                        color: inherit;
                    }
                }

                .level-up-icon {
                    animation: levelUp 2s ease-in-out;
                }
            `}</style>
        </>
    );
};

export default ProgressBar;