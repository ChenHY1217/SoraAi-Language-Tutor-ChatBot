import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    useCreateChatMutation,
    useContinueChatMutation,
    useGetChatByIdQuery,
} from '../app/api/chats';
import { IoSendSharp } from 'react-icons/io5';
import Loader from './Loader';

interface Message {
    sender: 'user' | 'bot',
    text: string,
    isTyping?: boolean
}

const ChatComponent: React.FC = () => {

    let { chatId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [inputHeight, setInputHeight] = useState<number>(0);
    const [isAIResponding, setIsAIResponding] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [createChat] = useCreateChatMutation();
    const [continueChat] = useContinueChatMutation();
    const { data: chatData, isLoading: isChatLoading } = useGetChatByIdQuery(
        chatId ?? 'skip',
        { skip: !chatId }
    );

    // Load chat messages into state
    useEffect(() => {
        if (chatData && chatData.messages) {
            const formattedMessages = chatData.messages.map((msg: any) => ({
                sender: msg.sender,
                text: msg.message
            }));
            setMessages(formattedMessages);
        }
    }, [chatData]);

    const typeMessage = async (text: string) => {
        let currentText = '';
        for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            setMessages(prev => [
                ...prev.slice(0, -1),
                { sender: 'bot', text: currentText, isTyping: true }
            ]);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        setMessages(prev => [
            ...prev.slice(0, -1),
            { sender: 'bot', text: currentText, isTyping: false }
        ]);
    };

    // Update textarea height based on content
    const updateTextareaHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
        setInputHeight(element.scrollHeight);
    };

    // Send user message to the chat and receive response from AI
    // Creates new chat if there are no previous messages
    // Continues chat if there are previous messages
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        const currentInput = input.trim();
        if (currentInput === '') return;
        
        // Clear input immediately
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
                chatId = newChatId;
                window.history.pushState({}, '', `/chat/${newChatId}`);

                const botMessage = aiResponse.messages[aiResponse.messages.length - 1].message;
                setMessages(prev => [...prev, { sender: 'bot', text: '', isTyping: true }]);
                await typeMessage(botMessage);
                setIsAIResponding(false);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.data?.message || "Failed to receive response from AI");
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
                await typeMessage(botMessage);
                setIsAIResponding(false);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.data?.message || "Failed to receive response from AI");
            }
        }
    };

    

    return (
        <div className="relative flex flex-col h-screen w-full">
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 flex ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {msg.isTyping ? (
                            <div className="flex items-center space-x-2">
                                <Loader />
                            </div>
                        ) : (
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
                            </div>
                        )}
                    </div>
                ))}
                {isAIResponding && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white/90 px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm">
                            <Loader />
                        </div>
                    </div>
                )}
            </div>
            <form 
                onSubmit={handleSendMessage}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4"
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
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-transparent outline-none resize-none max-h-[200px] min-h-[48px]"
                        rows={1}
                    />
                    <button
                        type='submit'
                        className={`p-3 my-1 text-white bg-blue-500 
                            ${inputHeight > 48 ? 'rounded-lg m-2' : 'rounded-full mx-3'} 
                            hover:bg-blue-600 transition-all duration-200 group`}
                        aria-label="Send message"
                    >
                        <IoSendSharp 
                            size={20} 
                            className="transform transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12" 
                        />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatComponent;
