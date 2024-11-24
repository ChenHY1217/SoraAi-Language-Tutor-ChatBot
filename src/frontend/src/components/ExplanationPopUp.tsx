import { motion } from "framer-motion";

interface ExplanationPopupProps {
    explanation: string;
    onClose: () => void;
}

const ExplanationPopup: React.FC<ExplanationPopupProps> = ({ explanation, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
        onClick={onClose}
    >
        <div 
            className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
        >
            <p className="text-sm leading-relaxed text-gray-700">{explanation}</p>
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
                Close
            </button>
        </div>
    </motion.div>
);

export default ExplanationPopup;