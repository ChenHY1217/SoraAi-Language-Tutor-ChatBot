import { useState, useEffect } from "react";
import {
    AiOutlineHome,
    AiOutlineLogin,
    AiOutlineLogout,
    AiOutlineUserAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useLogoutMutation } from "../app/api/users";
import { logout } from "../app/features/auth/authSlice";
import { toggleProfile, setProfile } from "../app/features/profile/profileSlice";

const Navigation: React.FC = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const profileOn = useAppSelector((state) => state.profile);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        setDropdownOpen(false); // Reset dropdown state on mount or login
    }, [userInfo]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleToggleProfile = () => {
        dispatch(toggleProfile());
    }

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Handles logout
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall({}).unwrap();
            dispatch(logout());
            dispatch(setProfile(false));
            navigate("/login");
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <div className="fixed bottom-10 left-[30rem] transform translate-x-1/2 translate-y-1/2 z-50 bg-secondary-100 border w-[30%] px-[4rem] mb-[2rem] rounded-full">
            <nav className="flex justify-between items-center">
                {/* Section 1 */}
                <div className="flex justify-center items-center mb-[2rem]">
                    <Link
                        to={userInfo ? "/" : "/login"}
                        className="flex items-center transition-transform transform hover:scale-105"
                    >
                        <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
                        <span className="hidden nav-item-name mt-[3rem]">Home</span>
                    </Link>
                </div>
                {/* Section 2 */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="text-gray-800 focus:outline-none"
                    >
                        {userInfo ? (
                            <span className="text-white">{userInfo.username}</span>
                        ) : (
                            <></>
                        )}

                        {userInfo && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ml-1 ${
                                    dropdownOpen ? "transform rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                                />
                            </svg>
                        )}
                    </button>

                    {dropdownOpen && userInfo && (
                        <ul
                            className={`absolute right-0 mt-2 mr-14 w-[10rem] space-y-2 bg-white text-gray-600 ${
                                !userInfo.isAdmin ? "-top-20" : "-top-24"
                            }`}
                        >
                            {userInfo.isAdmin && (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/dashboard"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li>
                                <div 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleToggleProfile}    
                                >
                                    Profile
                                </div>
                            </li>

                            <li>
                                <button
                                    onClick={logoutHandler}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}

                    {!userInfo && (
                        <ul className="flex">
                            <li>
                                <Link
                                    to="/login"
                                    className="flex items-center mt-5 transition-transform transform hover:scale-105 mb-[2rem]"
                                >
                                    <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                                    <span className="hidden nav-item-name">LOGIN</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/register"
                                    className="flex items-center mt-5 transition-transform transform hover:scale-105 mb-[2rem]"
                                >
                                    <AiOutlineUserAdd size={26} />
                                    <span className="hidden nav-item-name">REGISTER</span>
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navigation;