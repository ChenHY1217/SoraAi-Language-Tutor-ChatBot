import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { toast } from "react-toastify";
import { setCredentials } from "../../app/features/auth/authSlice";
import { useProfileUpdateMutation } from "../../app/api/users";
import { motion } from "framer-motion";
import skywingsLogo from "../../assets/skywingsLogo.png";

const Profile = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const [username, setUsername] = useState<string>(userInfo.username);
    const [email, setEmail] = useState<string>(userInfo.email);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    
    const dispatch = useAppDispatch();
    const [updateApiCall, { isLoading}] = useProfileUpdateMutation();

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.username);
            setEmail(userInfo.email);
        }
    }, [userInfo.email, userInfo.username]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        } else {
            setIsUpdating(true);
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
            setIsUpdating(false);
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
                <div className="grid grid-cols-10 gap-6">
                    <div className="col-span-3 rounded-lg p-4 flex flex-col items-center">
                        <img src={skywingsLogo} alt="Profile" className="w-32 h-24 rounded-full mb-4 mx-4 hover:scale-105 duration-300" />
                        <h3 className="text-white text-lg font-semibold text-center">Welcome Back!</h3>
                        <p className="text-white text-sm text-center mt-2">Update your profile information to keep your account secure and personalized.</p>
                    </div>
                    <div className="col-span-7">
                        <form
                            onSubmit={handleUpdate}
                        >
                            <h2 className="text-white text-3xl font-bold text-center mb-6">
                                Update Profile
                            </h2>
                            <div className="mb-4">
                                <label className="block text-white text-sm mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    className="w-full px-4 py-2 bg-transparent border-b border-l border-white rounded-lg text-white placeholder-white focus:border-none focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:scale-105 duration-300 transition-all"
                                    placeholder="Enter your password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
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