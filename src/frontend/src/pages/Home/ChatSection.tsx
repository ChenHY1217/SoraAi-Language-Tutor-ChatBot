import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    useCreateChatMutation,
    useContinueChatMutation,
    useGetChatByIdQuery,
} from '../../app/api/chats';
import { IoSendSharp } from 'react-icons/io5';
import Loader from '../../components/Loader';
import Quiz from '../../components/Quiz';

interface Message {
    sender: 'user' | 'bot',
    text: string,
    isTyping?: boolean
}

const ChatComponent: React.FC = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [inputHeight, setInputHeight] = useState<number>(0);
    const [isAIResponding, setIsAIResponding] = useState<boolean>(false);    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const currentChatRef = useRef<string | undefined>(chatId);

    const location = useLocation();
    const navigate = useNavigate();

    const [createChat] = useCreateChatMutation();
    const [continueChat] = useContinueChatMutation();
    const { data: chatData, isLoading: isChatLoading } = useGetChatByIdQuery(
        chatId ?? 'skip',
        { 
            skip: !chatId,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        }
    );

    const isNewChat = (!chatId || location.pathname === '/') && messages.length === 0;

    // Update currentChatRef when chatId changes
    useEffect(() => {
        currentChatRef.current = chatId;
        // Reset states when navigating to home
        if (!chatId || location.pathname === '/') {
            setMessages([]);
        }
        // Cleanup: abort any ongoing typing animation
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [chatId, location.pathname]);

    useEffect(() => {
        // Reset messages when navigating to a new chat
        if (chatId && chatData?.messages) {
            const formattedMessages = chatData.messages.map((msg: any) => ({
                sender: msg.sender,
                text: msg.message
            }));
            setMessages(formattedMessages);
        } else {
            setMessages([]); // Clear messages if no chat data
        }
    }, [chatId, chatData]); // Add chatId as dependency

    // Typing animation for bot messages
    const typeMessage = async (text: string, targetChatId: string | undefined) => {
        // Create new abort controller for this typing session
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const delay = (ms: number) => new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, ms);
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Typing aborted'));
            });
        });

        let currentText = '';
        
        try {
            for (let i = 0; i < text.length; i++) {
                if (signal.aborted || currentChatRef.current !== targetChatId) {
                    throw new Error('Typing aborted');
                }
                await delay(10);
                currentText += text[i];
                setMessages(prev => [
                    ...prev.slice(0, -1),
                    { sender: 'bot', text: currentText, isTyping: true }
                ]);
            }
            
            setMessages(prev => [
                ...prev.slice(0, -1),
                { sender: 'bot', text: currentText }
            ]);
        } catch (error: any) {
            if (error.message === 'Typing aborted') {
                // Typing was cancelled, do nothing
                console.log('Typing animation cancelled');
            }
        }
    };

    // Update textarea height based on content
    const updateTextareaHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
        setInputHeight(element.scrollHeight);
    };

    // Handle Enter key press to send message
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isAIResponding) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    };

    // Send user message to the chat and receive response from AI
    // Creates new chat if there are no previous messages
    // Continues chat if there are previous messages
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentInput = input.trim();
        if (currentInput === '') return;
        
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '48px';
            setInputHeight(48);
        }

        // If there are no previous messages, create a new chat
        if (messages.length === 0 && !chatId) {
            try {
                setMessages([{ sender: 'user', text: currentInput }]);
                setIsAIResponding(true);
                
                const aiResponse = await createChat({message: currentInput}).unwrap();
                const newChatId = aiResponse._id;
                
                currentChatRef.current = newChatId;

                // Add empty bot message first
                setMessages(prev => [...prev, { sender: 'bot', text: '', isTyping: true }]);
                
                // Get the bot's response and animate it
                const botMessage = aiResponse.messages[aiResponse.messages.length - 1].message;
                await typeMessage(botMessage, newChatId);
                setIsAIResponding(false);

                navigate(`/chat/${newChatId}`);  // Replace window.history.pushState with this

            } catch (error: any) {
                console.error(error);
                toast.error(error?.data?.message || "Failed to receive response from AI");
                setIsAIResponding(false);
            }
        }

        // If there are previous messages, continue the chat
        if (messages.length > 0 && chatId) {
            try {
                setMessages(prev => [...prev, { sender: 'user', text: currentInput }]);
                setIsAIResponding(true);

                const aiResponse = await continueChat({ chatId, body: { message: currentInput } }).unwrap();
                const botMessage = aiResponse.messages[aiResponse.messages.length - 1].message;
                setMessages(prev => [...prev, { sender: 'bot', text: '', isTyping: true }]);
                await typeMessage(botMessage, chatId);
                setIsAIResponding(false);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.data?.message || "Failed to receive response from AI");
            }
        }
    };

    // Auto-scroll to bottom of chat on new message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Add this new useEffect for auto-scrolling
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Error handling
    if (isChatLoading) {
        return <Loader />;
    }
      
    if (!chatData && chatId) {
        return <div>Failed to load chat messages</div>;
    }

    return (
        <div key={`${chatId}-${location.key}`} className="relative flex flex-col h-screen w-full pt-28 z-0">
            <Quiz />
            {isNewChat ? (
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="max-w-2xl w-full space-y-8 text-center p-8">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Welcome to SoraAi
                        </h1>
                        <p className="text-xl text-gray-600">
                            Your AI-powered language learning companion. Start a conversation to begin practicing!
                        </p>
                        <form 
                            onSubmit={handleSendMessage}
                            className="w-full"
                        >
                            <div className={`flex items-end bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 
                                ${inputHeight > 48 ? 'rounded-xl' : 'rounded-full'} 
                                transition-all duration-200`}
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onInput={(e) => updateTextareaHeight(e.currentTarget)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message to start learning..."
                                    className="flex-1 px-6 py-3 bg-transparent outline-none resize-none max-h-[200px] min-h-[48px]"
                                    rows={1}
                                />
                                <button
                                    type='submit'
                                    disabled={isAIResponding}
                                    className={`p-3 my-1 text-white ${isAIResponding ? 'bg-blue-400' : 'bg-blue-500'} 
                                        ${inputHeight > 48 ? 'rounded-lg m-2' : 'rounded-full mx-3'} 
                                        hover:bg-blue-600 transition-all duration-200 group`}
                                    aria-label="Send message"
                                >
                                    {isAIResponding ? (
                                        <Loader color='gray-900' />
                                    ) : (
                                        <IoSendSharp 
                                            size={20} 
                                            className="transform transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12" 
                                        />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto w-full 
                        scrollbar scrollbar-w-2 scrollbar-thumb-gray-400/60 scrollbar-track-gray-100/10
                        hover:scrollbar-thumb-gray-500/80">
                        <div className="max-w-4xl mx-auto px-4 pb-24">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 flex ${
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] ${
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                                : 'bg-white/90 text-gray-800'
                                        } px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm
                                        ${msg.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}
                                        whitespace-pre-wrap`}
                                    >
                                        {msg.text}
                                        {msg.isTyping && <Loader />}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <form 
                        onSubmit={handleSendMessage}
                        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4"
                    >
                        <div className={`flex items-end bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 
                            ${inputHeight > 48 ? 'rounded-xl' : 'rounded-full'} 
                            transition-all duration-200`}
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onInput={(e) => updateTextareaHeight(e.currentTarget)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 px-6 py-3 bg-transparent outline-none resize-none max-h-[200px] min-h-[48px]"
                                rows={1}
                            />
                            <button
                                type='submit'
                                disabled={isAIResponding}
                                className={`p-3 my-1 text-white ${isAIResponding ? 'bg-blue-400' : 'bg-blue-500'} 
                                    ${inputHeight > 48 ? 'rounded-lg m-2' : 'rounded-full mx-3'} 
                                    hover:bg-blue-600 transition-all duration-200 group`}
                                aria-label="Send message"
                            >
                                {isAIResponding ? (
                                    <Loader color='gray-900' />
                                ) : (
                                    <IoSendSharp 
                                        size={20} 
                                        className="transform transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12" 
                                    />
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default ChatComponent;
