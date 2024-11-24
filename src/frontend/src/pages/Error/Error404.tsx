import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Error404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-400 to-secondary-400">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white mb-8">Oops! Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
        >
          Go Home
        </button>
      </motion.div>
    </div>
  );
};

export default Error404;