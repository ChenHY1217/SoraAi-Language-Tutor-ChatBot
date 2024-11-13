import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    useCreateChatMutation,
    useContinueChatMutation,
    useGetChatByIdQuery,
} from '../app/api/chats';

interface Message {
    sender: 'user' | 'bot',
    text: string,
}

function ChatComponent() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

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

    // Send user message to the chat and receive response from AI
    // Creates new chat if there are no previous messages
    // Continues chat if there are previous messages
    const handleSendMessage = async () => {

        if (input.trim() === '') return;

        // Add user message to the chat
        setMessages([...messages, { sender: 'user', text: input }]);

        // If there are no previous messages, create a new chat
        if (messages.length == 1 && !chatId) {
            try {
                const aiResponse = await createChat(input).unwrap();
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: aiResponse.messages[1].message },
                ]);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.data?.message || "Failed to receive response from AI");
            }
        }

        // If there are previous messages, continue the chat
        if (messages.length > 1 && chatId) {
            try {
                const aiResponse = await continueChat({ chatId, body: { message: input } }).unwrap();
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: aiResponse.messages[aiResponse.messages.length - 1].message },
                ]);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.data?.message || "Failed to receive response from AI");
            }
        }

        // Clear input field
        setInput('');
    };

    return (
        <div className="flex flex-col h-full border rounded-lg shadow-lg">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${
                            msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                    >
                        <div
                            className={`inline-block px-3 py-2 rounded-md ${
                                msg.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-black'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex p-2 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-l-md outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatComponent;
