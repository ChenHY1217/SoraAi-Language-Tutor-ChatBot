import openai from '../openai.js';
import META_PROMPT from '../prompt.js';

// Function to generate a summary title for a chat session
const generateSummaryTitle = async (messages) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: META_PROMPT },
                { role: "system", content: "Generate a brief, one-line title for this chat session." },
                { role: "user", content: `Title for chat about: ${messages[0]}` }
            ],
            temperature: 0.7,
            max_tokens: 30
        });

        return response.choices[0].message.content.trim().toUpperCase();
    } catch (error) {
        console.error('Title generation error:', error);
        return "Chat Session";
    }
};

export default generateSummaryTitle;