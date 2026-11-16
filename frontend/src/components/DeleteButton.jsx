import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useNavigate } from 'react-router-dom';
import './DeleteButton.css';

export default function DeleteButton({ readingId, setData, setError }) {
    const navigate = useNavigate();
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/readings/${readingId}`, {
                method: 'DELETE',
            });

            const result = await response.json()

            if (response.ok) {
                setData((prevData) => prevData.filter((reading) => reading.id !== readingId));
                navigate("/");
                setError(result.message);
            }

        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    };

    return (
        <button className="delete-reading-button" onClick={handleDelete}>
            Delete
        </button>
    );
}
