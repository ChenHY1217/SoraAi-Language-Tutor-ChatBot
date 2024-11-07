import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { toast } from "react-toastify"
import { setCredentials } from "../../app/features/auth/authSlice"
import { useProfileUpdateMutation } from "../../app/api/users"

const Profile = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const { userInfo } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const [updateApiCall, { isLoading, error }] = useProfileUpdateMutation();

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.username);
            setEmail(userInfo.email);
        }
    }, [userInfo.email, userInfo.username]);



    return (
        <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50">
            <div className="relative bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg px-4 py-3  
                w-80 transform transition-all duration-500 ">
                <div className="grid grid-cols-10 gap-4">
                    <div className="col-span-3 border rounded-lg">
                        Hello
                    </div>
                    <div className="col-span-7">
                        World
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile