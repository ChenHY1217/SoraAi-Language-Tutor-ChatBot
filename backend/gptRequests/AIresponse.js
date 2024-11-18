import asyncHandler from '../middlewares/asyncHandler.js';
import openai from '../openai.js';
import META_PROMPT from '../prompts/meta.js';

// Function to test the GPT model
const testGPT = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: META_PROMPT },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        res.json({
            message: response.choices[0].message,
            response
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// define a function that waits for the OpenAI's GPT response
const waitingForAIResponse = async (message, previousMessages = []) => {
    try {
        // Only include last 5 messages for context to reduce tokens
        const recentMessages = previousMessages.slice(-5);
        
        const formattedMessages = [
            { role: "system", content: META_PROMPT },
            ...recentMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.message
            })),
            { role: "user", content: message }
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: formattedMessages,
            temperature: 0.7,
            presence_penalty: 0.1
        });

        return {
            sender: 'bot',
            message: response.choices[0].message.content,
            timestamp: Date.now(),
        };

    } catch (error) {
        console.error('AI response error:', error);
        return {
            sender: 'bot',
            message: 'Sorry, I am unable to respond at the moment.',
            timestamp: Date.now(),
        };
    }
};

export { waitingForAIResponse, testGPT };