
import { useNavigate } from 'react-router-dom';

export const useNewChat = () => {
    const navigate = useNavigate();

    const startNewChat = () => {
        navigate('/');
    };

    return { startNewChat };
};