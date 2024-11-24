import Question from '../types/question.ts';

interface QuestionResultCardProps {
    question: Question;
    idx: number;
    selectedAnswers: string[];
    setActiveExplanation: (idx: number) => void;
}

const renderQuestionResult: React.FC<QuestionResultCardProps> = ({ question, idx, selectedAnswers, setActiveExplanation }) => {
    
    return (
        <div key={idx} className="p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between mb-2">
            <p className="font-medium text-left">
                {idx + 1}. {question.question}
            </p>
            <span className="ml-2">
                {selectedAnswers[idx] === question.answer ? '✅' : '❌'}
            </span>
        </div>
        <div className="text-left text-sm space-y-1">
            <p className="text-gray-600">Your answer: 
                <span className={selectedAnswers[idx] === question.answer ? 
                    "text-green-600 ml-2 font-medium" : 
                    "text-red-600 ml-2 font-medium"}>
                    {selectedAnswers[idx]}
                </span>
            </p>
            {selectedAnswers[idx] !== question.answer && (
                <p className="text-gray-600">Correct answer: 
                    <span className="text-green-600 ml-2 font-medium">
                        {question.answer}
                    </span>
                </p>
            )}
            {question.explanation && (
                <button
                    onClick={() => setActiveExplanation(idx)}
                    className="mt-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full
                            hover:bg-blue-100 transition-colors"
                >
                    View Explanation
                </button>
            )}
        </div>
    </div>
    )
};

export default renderQuestionResult;