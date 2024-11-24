import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../../app/api/users';
import backgroundImage from '../../../../public/bg/skyWithClouds.webp';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const [resetPassword] = useResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (!token) {
            return toast.error('Invalid token');
        }

        try {
            setIsLoading(true);
            await resetPassword({ token, password }).unwrap();
            toast.success('Password reset successful!');
            navigate('/login');
        } catch (error) {
            toast.error('Error resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-1000 flex items-center justify-center"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundColor: 'rgba(255, 255, 255, 0)',
                 backgroundBlendMode: 'overlay'
             }}>
            <div className="max-w-md w-full mx-4 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Set New Password
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Please enter your new password below.
                </p>

                <motion.form 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      ease: "easeOut",
                      duration: 0.3
                    }}
                    onSubmit={handleSubmit} 
                    className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 border border-transparent rounded-lg text-white 
                            ${isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            transition duration-200`}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default ResetPassword;