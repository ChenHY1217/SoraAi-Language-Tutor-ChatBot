import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { toast } from "react-toastify";
import { setCredentials } from "../../app/features/auth/authSlice";
import { toggleProfile } from "../../app/features/profile/profileSlice";
import { useProfileUpdateMutation } from "../../app/api/users";
import { motion } from "framer-motion";
import skywingsLogo from "../../assets/skywingsLogo.png";

const Profile: React.FC = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const [username, setUsername] = useState<string>(userInfo.username);
    const [email, setEmail] = useState<string>(userInfo.email);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    
    const dispatch = useAppDispatch();

    const [updateApiCall, { isLoading }] = useProfileUpdateMutation();

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.username);
            setEmail(userInfo.email);
        }
    }, [userInfo.email, userInfo.username]);

    const handleToggleProfile = () => {
        dispatch(toggleProfile());
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        } else {
            try {
                const response = await updateApiCall({ _id: userInfo._id, username, email, password }).unwrap();
                if (response.error) {
                    throw new Error(response.error.message);
                }

                dispatch(setCredentials({ ...response }));
                toast.success("Profile updated successfully");
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred");
                }
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50">
            <motion.div
                initial={{ scale: 0.75 }}
                animate={{ scale: 1 }}
                className="relative bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl rounded-2xl px-10 py-8 
                                w-[550px] transform transition-all duration-500 "
            >
                <button
                    onClick={handleToggleProfile}
                    className="absolute top-4 right-4 text-gray-900 hover:text-secondary-400 transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="grid grid-cols-10 gap-6">
                    <div className="hidden xsm:flex xsm:flex-col col-span-3 rounded-lg p-4 items-center ">
                        <img src={skywingsLogo} alt="Profile" className="w-32 h-24 rounded-full mb-4 mx-4 hover:scale-105 duration-300" />
                        <h3 className="text-gray-900 text-lg font-semibold text-center">Welcome Back!</h3>
                        <p className="text-gray-900 text-sm text-center mt-2">Update your profile information to keep your account secure and personalized.</p>
                    </div>
                    <div className="col-span-10 xsm:col-span-7">
                        <form
                            onSubmit={handleUpdate}
                        >
                            <h2 className="text-gray-900 text-3xl font-bold text-center mb-6">
                                Update Profile
                            </h2>
                            <div className="mb-4">
                                <label className="block text-gray-900 text-sm mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-gray-900 rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-900 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-gray-900 rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-900 text-sm mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-gray-900 rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-900 text-sm mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-gray-900 rounded-lg text-gray-900 placeholder-gray-900 focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-primary-400 to-secondary-400 text-gray-900 font-semibold rounded-lg hover:scale-105 hover:from-priamry-500 hover:to-secondary-500 transition-all duration-300"
                            >
                                {isLoading ? "Updating..." : "Update"}
                            </button>

                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;