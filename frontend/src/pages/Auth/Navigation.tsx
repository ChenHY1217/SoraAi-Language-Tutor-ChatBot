import { useState } from "react"
import { AiOutlineHome, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useLoginMutation } from "../../app/api/users"
import { logout } from "../../app/features/auth/authSlice"

const Navigation = () => {

    const {userInfo} = useAppSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLoginMutation();



    return (
        <div className="fixed bottom-10 left-[30rem] transform translate-x-1/2 translate-y-1/2 z-50 bg-[#0f0f0f] border w-[30%] px-[4rem] mb-[2rem] rounded">
            <section className="flex justify-between items-center">
                {/* Section 1 */}
                <div className="flex justify-center items-center mb-[2rem]">
                    <Link
                        to="/login"
                        className="flex items-center transition-transform transform hover:translate-x-2"
                    >
                        <AiOutlineHome className="mr-2 mt-[3rem] " size={26} />
                        <span className="text-white nav-item-name mt-[3rem]">Home</span>
                    </Link>   
                </div>
                <div className="text-white">
                    {userInfo ? userInfo.username : "Guest"}
                </div>
            </section>


        </div>
    )
}

export default Navigation