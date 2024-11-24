import openai from '../openai.js';
import QUIZ_PROMPT from '../prompts/quiz.js';

const generateQuizQuestions = async (pastQuizQuestions, type, language, vocabLevel, grammarLevel) => {
    try {
        const pastQuestionsString = JSON.stringify(pastQuizQuestions);
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: QUIZ_PROMPT },
                { 
                    role: "user", 
                    content: `Previous quiz questions for reference: ${pastQuestionsString}
                    Please generate a new quiz targeting ${language}. Vocabulary level: ${vocabLevel}, Grammar level: ${grammarLevel}. This should be a ${type} quiz. Repetition is allowed to test concepts but do not overdo it.`
                }
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content).questions;
    } catch (error) {
        console.error('Quiz generation error:', error);
        throw new Error('Failed to generate quiz questions');
    }
};

export default generateQuizQuestions;