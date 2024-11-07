import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../app/api/users";
import { setCredentials } from "../../app/features/auth/authSlice";
import { toggleProfile, setProfile } from "../../app/features/profile/profileSlice";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { userInfo } = useAppSelector((state) => state.auth);

  // Redux and Router hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginApiCall, { isLoading }] = useLoginMutation();
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

  // Handle login with animation
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    dispatch(setProfile(false));
    
    try{
      const response = await loginApiCall({ email, password }).unwrap();
    
      // Simulate a login delay and then reset state (for the example)
      setTimeout(() => {
        // Here you would put your actual login logic
        // After successful login, navigate or hide component
        dispatch(setCredentials({ ...response }));
        navigate(redirect);
        
      }, 500);

      toast.success("Logged in successfully");
    } catch (error: any) {
      setIsLoggingIn(false);
      toast.error(error?.data?.message || "An error occurred");
    }

  };

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 bg-gradient-to-tr from-blue-500 to-purple-600`}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Title */}
        <div
          className={`font-bold font-mono text-4xl text-white mb-10 transform duration-500 transition-all ${
            isLoggingIn ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          SoraAi
        </div>

        {/* Login form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isLoggingIn ? 0 : 1, scale: isLoggingIn ? 0.95 : 1 }}
          transition={{ 
            ease: "easeInOut",
            duration: 0.3
          }}
          onSubmit={handleLogin}
          className={`relative bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg px-10 py-8 
                        w-96 transform transition-all duration-500`}
          style={{
            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-white text-3xl font-semibold text-center mb-8">
            Login
          </h2>
          <div className="mb-6">
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              required
              className="w-full px-4 py-3 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              required
              className="w-full px-4 py-3 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Login
          </button>
          
          <div className="text-white mt-6 text-left">
            Don't have an account?{" "}
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-secondary-100 hover:underline">
              Register
            </Link>
          </div>
          <div className="text-white text-left mt-4">
            Forgot your password?{" "}
            <Link to={redirect ? `/forgot?redirect=${redirect}` : "/forgot"} className="text-secondary-100 hover:underline">
              Click Here
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
