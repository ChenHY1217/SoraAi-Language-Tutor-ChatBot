import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useSendVerificationEmailMutation } from '../../app/api/users'; // Assuming you have this API hook

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

    // const [sendVerificationEmail] = useSendVerificationEmailMutation();

    // const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setIsSubmitting(true);

    //     try {
    //         await sendVerificationEmail({ email }).unwrap();
    //         setIsEmailSent(true);
    //         toast.success("Verification email sent successfully");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to send verification email");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    return (
        <div className={`min-h-screen transition-colors duration-1000 bg-gradient-to-tr from-primary-100 to-secondary-100`}>
            <div className="flex flex-col items-center justify-center min-h-screen">
                {isEmailSent ? (
                    <div className="text-white text-center">
                        <h2 className="text-2xl font-semibold mb-6">Check your email</h2>
                        <p className="mb-4">We have sent a password reset link to your email address.</p>
                        <Link to="/login" className="text-secondary-100 hover:underline">
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form
                        onSubmit={handleForgotPassword}
                        className={`relative bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg px-8 py-6 
                            w-80 transform transition-all duration-500 ${
                            isSubmitting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                        style={{
                            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 className="text-white text-2xl font-semibold text-center mb-6">Forgot Password</h2>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                required
                                className="w-full px-3 py-2 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>

                        <div className="text-white mt-4 text-left">
                            Remembered your password?{" "}
                            <Link to={`/login`} className="text-secondary-100 hover:underline">
                                Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;