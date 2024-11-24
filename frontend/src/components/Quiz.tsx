import { useState, useCallback, useMemo } from "react";
import { useGetChatByIdQuery } from "../app/api/chats";
import { useGetProgressQuery } from "../app/api/progress";
import { useGetQuizzesQuery } from "../app/api/quizzes";
import { useCreateQuizMutation, useAnswerQuizMutation } from "../app/api/quizzes";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Question from "../types/question.ts";
import ExplanationPopup from "./ExplanationPopUp";
import QuestionResultCard from "./QuestionResultCard.tsx";
import QuizHistory from "./QuizHistory.tsx";

interface QuizData {
    _id: string;
    title: string;
    questions: Question[];
}

const Quiz: React.FC = () => {
    const { chatId } = useParams();
    const [showQuiz, setShowQuiz] = useState<boolean>(false);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previousLevels, setPreviousLevels] = useState<{ vocab: number, grammar: number } | null>(null);
    const [activeExplanation, setActiveExplanation] = useState<number | null>(null);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const { data: chatData } = useGetChatByIdQuery(
        chatId ?? 'skip', 
        {
            refetchOnMountOrArgChange: true,
            skip: !chatId
        }
    );

    const { data: progress, refetch: refetchProgress } = useGetProgressQuery(
        chatData?.language ?? 'skip',
        { 
            refetchOnMountOrArgChange: true,
            skip: !chatData?.language
        }
    );

    const { data: quizHistory, isLoading: historyLoading, error: historyQueryError } = useGetQuizzesQuery(
        chatData?.language ?? 'skip',
        {
            skip: !chatData?.language
        }
    );
    
    const [createQuiz] = useCreateQuizMutation();
    const [answerQuiz] = useAnswerQuizMutation();

    const handleQuizStart = async () => {

        // console.log(chatData?.language, progress?.vocabularyProgress, progress?.grammarProgress);


        if (!chatData?.language || progress?.vocabularyProgress === undefined || progress?.grammarProgress === undefined) {
            toast.error('Unable to start quiz. Missing required data.');
            return;
        }

        try {
            setIsLoading(true);
            setSelectedAnswers([]);
            setIsSubmitted(false);
            setScore(0);

            if (progress) {
                setPreviousLevels({
                    vocab: progress.vocabularyLvl,
                    grammar: progress.grammarLvl
                });
            }

            const result = await createQuiz({
                type: Math.random() > 0.5 ? "vocab" : "grammar",
                language: chatData.language,
                vocabLvl: progress.vocabularyLvl,
                grammarLvl: progress.grammarLvl
            }).unwrap();

            if (!result || !result.questions) {
                throw new Error('Invalid quiz data received');
            }

            console.log(result); // Show the quiz data in the console

            setQuizData(result);
            setShowQuiz(true);
        } catch (error: any) {
            console.error("Failed to create quiz:", error);
            toast.error(error?.data?.message || "Failed to create quiz");
            setShowQuiz(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (questionIndex: number, choice: string) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[questionIndex] = choice;
        setSelectedAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (!quizData || !quizData.questions) {
            toast.error('Quiz data is not available');
            return;
        }

        if (selectedAnswers.length !== quizData.questions.length) {
            toast.error('Please answer all questions before submitting');
            return;
        }

        try {
            const result = await answerQuiz({
                quizId: quizData._id,
                answers: selectedAnswers
            }).unwrap();

            setScore(result.score);
            setIsSubmitted(true);
        } catch (error: any) {
            console.error("Failed to submit answers:", error);
            toast.error(error?.data?.message || "Failed to submit quiz");
        }
    };

    const handleClose = useCallback(async () => {
        await refetchProgress();
        setShowQuiz(false);
    }, [refetchProgress]);

    const handleHistoryClick = () => {
        // console.log('History button clicked');
        // console.log('Chat language:', chatData?.language);
        // console.log('Quiz history data:', quizHistory);
        // console.log('Loading state:', historyLoading);
        // console.log('Error state:', historyQueryError);

        // if (historyQueryError) {
        //     toast.error('Failed to load quiz history');
        //     return;
        // }

        setShowHistory(true);
    };

    const isReady = chatId && chatData?.language && progress;

    // Add a memoized sorted quiz history
    const sortedQuizHistory = useMemo(() => {
        if (!quizHistory) return [];
        return [...quizHistory].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [quizHistory]);

    return (
        <>
            {isReady && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        onClick={handleQuizStart}
                        disabled={showQuiz || isLoading}
                        className="group px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full 
                                border border-gray-200 shadow-md
                                transition-all duration-300 ease-in-out
                                hover:shadow-lg hover:scale-105 hover:-translate-y-0.5
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center space-x-2">
                            <span className="text-blue-500 transition-colors duration-300 group-hover:text-blue-600">
                                {isLoading ? (
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24">
                                        <path d="M9.5 16.5v-9l7 4.5-7 4.5z"/>
                                    </svg>
                                )}
                            </span>
                            <span className="text-gray-700 font-medium transition-colors duration-300 group-hover:text-blue-600">
                                {isLoading ? 'Creating Quiz...' : 'Take a Quiz'}
                            </span>
                        </div>
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        onClick={handleHistoryClick}
                        disabled={showQuiz || historyLoading}
                        className="group px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full 
                                border border-gray-200 shadow-md
                                transition-all duration-300 ease-in-out
                                hover:shadow-lg hover:scale-105 hover:-translate-y-0.5
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center space-x-2">
                            <span className="text-purple-500 transition-colors duration-300 group-hover:text-purple-600">
                                {historyLoading ? (
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </span>
                            <span className="text-gray-700 font-medium transition-colors duration-300 group-hover:text-purple-600">
                                {historyLoading ? 'Loading...' : 'History'}
                            </span>
                        </div>
                    </motion.button>
                </div>
            )}

            <AnimatePresence>
                {showQuiz && quizData && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/50"
                            onClick={() => setShowQuiz(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto pointer-events-auto">
                                <div className="border-b pb-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                                        {quizData.title}
                                    </h2>
                                </div>
                                {isSubmitted ? (
                                    <div className="text-center py-4">
                                        <h3 className="text-2xl font-bold mb-6">
                                            Your Score: {score}/{quizData.questions.length}
                                        </h3>
                                        <div className="space-y-4 mb-6">
                                            {quizData.questions.map((question: any, idx: number) => <QuestionResultCard question={question} idx={idx} selectedAnswers={selectedAnswers} setActiveExplanation={setActiveExplanation}/>)}
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {quizData.questions.map((question: any, idx: number) => (
                                            <div key={idx} className="mb-6">
                                                <p className="font-medium mb-3">
                                                    {idx + 1}. {question.question}
                                                </p>
                                                <div className="space-y-2">
                                                    {question.choices.map((choice: string, choiceIdx: number) => (
                                                        <button
                                                            key={choiceIdx}
                                                            onClick={() => handleOptionSelect(idx, choice)}
                                                            className={`w-full p-3 text-left rounded-lg transition-colors
                                                                ${selectedAnswers[idx] === choice 
                                                                    ? 'bg-blue-500 text-white' 
                                                                    : 'bg-gray-100 hover:bg-gray-200'}`}
                                                        >
                                                            {choice}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => setShowQuiz(false)}
                                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Explanation Popup */}
            <AnimatePresence>
                {activeExplanation !== null && quizData?.questions[activeExplanation]?.explanation && (
                    <ExplanationPopup
                        explanation={quizData.questions[activeExplanation].explanation!}
                        onClose={() => setActiveExplanation(null)}
                    />
                )}
            </AnimatePresence>

            {/* Quiz History Popup */}
            <AnimatePresence>
                {showHistory && quizHistory && (
                    <QuizHistory 
                        quizzes={sortedQuizHistory}
                        onClose={() => setShowHistory(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Quiz;