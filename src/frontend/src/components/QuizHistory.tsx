import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

interface Quiz {
    _id: string;
    title: string;
    score?: number;
    createdAt: string;
    type: string;
    level: number;
}

interface QuizHistoryProps {
    quizzes: Quiz[];
    onClose: () => void;
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ quizzes, onClose }) => {
    // Take only the 10 most recent quizzes
    const recentQuizzes = quizzes.slice(0, 10);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
                <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto pointer-events-auto">
                    <div className="border-b pb-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">Recent Quiz History</h2>
                        <p className="text-center text-gray-500 mt-2">Your last {recentQuizzes.length} quizzes</p>
                    </div>
                    <div className="space-y-4">
                        {recentQuizzes.length > 0 ? (
                            recentQuizzes.map((quiz) => (
                                <div 
                                    key={quiz._id} 
                                    className="p-5 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg text-gray-800">{quiz.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            quiz.score !== undefined
                                                ? quiz.score === 3 ? 'bg-green-100 text-green-800'
                                                : quiz.score === 2 ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {quiz.score !== undefined ? `${quiz.score}/3` : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="inline-flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            </svg>
                                            {quiz.type}
                                        </span>
                                        <span className="inline-flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                            </svg>
                                            Level {quiz.level}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                                <p className="mt-4 text-gray-500">No quizzes found</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:shadow-md active:transform active:translate-y-0.5"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default QuizHistory;