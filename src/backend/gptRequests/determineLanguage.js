import openai from '../openai.js';
import META_PROMPT from '../prompts/meta.js';

// Function to generate the language for a chat session
const determineLanguage = async (message) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: META_PROMPT },
                { role: "system", content: "Determine the target language the user is trying to learn during this chat session and return the language as one word" },
                { role: "user", content: `Language for chat: ${message}` }
            ],
            temperature: 0.7,
            max_tokens: 30
        });

        return response.choices[0].message.content.trim().toUpperCase().replace(/["']/g, '');
    } catch (error) {
        console.error('Language determination error:', error);
        return 'Chat_Session';
    }
};

export default determineLanguage;