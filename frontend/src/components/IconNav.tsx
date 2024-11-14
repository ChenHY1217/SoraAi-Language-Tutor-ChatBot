import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useLogoutMutation } from "../app/api/users";
import { logout } from "../app/features/auth/authSlice";
import { toggleProfile, setProfile } from "../app/features/profile/profileSlice";
import { FiSettings, FiUser, FiLogOut } from 'react-icons/fi';

const IconNav: React.FC = () => {

    const { userInfo } = useAppSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setDropdownOpen(false); // Reset dropdown state on mount or login
    }, [userInfo]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleToggleProfile = () => {
        dispatch(toggleProfile());
    }

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
        <div className="fixed top-6 right-6 z-50">
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className="w-12 h-12 rounded-full bg-secondary-400 flex items-center justify-center hover:bg-secondary-500 transition-colors"
                >
                    {userInfo?.username?.[0]?.toUpperCase() || 'G'}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <button
                            onClick={handleToggleProfile}
                            className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-100 transition-colors"
                        >
                            <FiUser className="mr-2" />
                            Profile
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-100 transition-colors"
                        >
                            <FiSettings className="mr-2" />
                            Settings
                        </button>
                        <hr className="my-2 border-gray-200" />
                        <button
                            onClick={logoutHandler}
                            className="w-full px-4 py-2 text-left flex items-center text-red-600 hover:bg-gray-100 transition-colors"
                        >
                            <FiLogOut className="mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IconNav;