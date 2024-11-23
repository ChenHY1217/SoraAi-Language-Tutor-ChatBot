import { useNavigate } from 'react-router-dom';

const useNewChat = () => {
    const navigate = useNavigate();

    const startNewChat = () => {
        // Force navigate to home and trigger state reset
        navigate('/');
    };

    return { startNewChat };
};

export { useNewChat };