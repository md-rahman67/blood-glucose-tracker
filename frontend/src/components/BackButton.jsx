import { useNavigate } from 'react-router-dom';
import './BackButton.css';

export default function BackButton({ fallbackTo = '/' }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate(fallbackTo);
        }
    };

    return (
        <button className="back-button" type="button" onClick={handleBack}>
            Back
        </button>
    );
}
