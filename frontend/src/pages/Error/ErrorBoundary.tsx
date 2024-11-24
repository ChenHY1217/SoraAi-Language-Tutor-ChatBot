import { useRouteError, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-2xl text-white mb-4">Something went wrong</p>
        <p className="text-white mb-8">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <Link 
          to="/"
          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorBoundary;