import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCredentials } from "../../app/features/auth/authSlice";
import { useRegisterMutation } from "../../app/api/users";
import Loader from "../../components/Loader";
import backgroundImage from "../../../../../public/bg/skyWithClouds.webp";

const Register: React.FC = () => {
    // Form values
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const { userInfo } = useAppSelector((state) => state.auth);

    // Redux and Router hooks
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [registerApiCall, { isLoading }] = useRegisterMutation();

    // Redirect to home if already logged in
    const { search } = useLocation(); // Returns the current location object or url
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    // If logged in, redirect to home
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    // Handle Register with animation
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        } else {
            try{

                const response = await registerApiCall({username, email: email.toLocaleLowerCase(), password}).unwrap();

                // Simulate a login delay and then reset state (for the example)
                setTimeout(() => {
                    // Here you would put your actual login logic
                    // After successful login, navigate or hide component
                    dispatch(setCredentials({ ...response }));
                    navigate(redirect);
                    
                }, 500);
                
                toast.success("Registration successful");
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred");
                }
            }
        }

        setIsRegistering(true);

        // Simulate a Register delay and then reset state (for the example)
        setTimeout(() => {
            // After successful Register, navigate to login page
            navigate("/login");
        }, 1000);
    };

    return (
        <div
            className={`min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-1000`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: 'rgba(255, 255, 255, 0)', // Changed opacity from 0.8 to 0.4
                backgroundBlendMode: 'overlay'
            }}
        >
            <div className="flex flex-row items-center justify-around min-h-screen">
                {/* Register form */}
                <motion.form
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: isRegistering ? 0 : 1, y: isRegistering ? 50 : 0 }}
                    transition={{ 
                    ease: "easeInOut",
                    duration: 0.3
                    }}
                    onSubmit={handleRegister}
                    className={`relative bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-lg px-8 py-6 
                                w-96 transform transition-all duration-500 
                                ${ isRegistering ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                    <h2 className="text-gray-900 text-2xl font-semibold text-center mb-6">
                        Register
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-900 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            required
                            className="w-full px-3 py-2 bg-transparent border-b border-l border-white rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:scale-105 duration-300 transition-all"
                            placeholder="Enter your username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-900 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            required
                            className="w-full px-3 py-2 bg-transparent border-b border-l border-white rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:scale-105 duration-300 transition-all"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-900 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            required
                            className="w-full px-3 py-2 bg-transparent border-b border-l border-white rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:scale-105 duration-300 transition-all"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-900 text-sm mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            required
                            className="w-full px-3 py-2 bg-transparent border-b border-l border-white rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:scale-105 duration-300 transition-all"
                            placeholder="Enter your password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-primary-400 to-secondary-400 text-gray-900 font-semibold rounded-lg hover:scale-105 hover:from-primary-500 hover:to-secondary-500 transition-all duration-300"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    
                    {isLoading && <Loader />}

                    <div className="text-gray-900 text-left mt-4">
                        Already have an account?{" "}
                        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-secondary-500 hover:underline">
                            Login
                        </Link>
                    </div>

                </motion.form>

                {/* Potentially have a better image on the side or as background */}
                {/* <div>
                    <img 
                        src={skywingsLogo} 
                        alt="Skywings Logo"
                        className="w-96 h-96 rounded-3xl"    
                    />
                </div> */}
            </div>
        </div>
    );
};

export default Register;