import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../../public/bg/skyWithClouds.webp';
import { useSendPasswordResetEmailMutation } from '../../app/api/users';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const [sendPasswordResetEmail] = useSendPasswordResetEmailMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await sendPasswordResetEmail(email).unwrap();
            toast.success('Password reset email sent! Please check your inbox.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to send reset email, User not found');
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
                    Reset Password
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Enter your email address and we'll send you instructions to reset your password.
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
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
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                        >
                            Remembered your password? Login
                        </Link>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default ForgotPassword;
