import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useNavigate } from 'react-router-dom';

export default function DeleteButton({ readingId, setData }) {
    const navigate = useNavigate();
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/readings/${readingId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData((prevData) => prevData.filter((reading) => reading.id !== readingId));
                navigate("/");
            }
        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    };

    return (
        <button onClick={handleDelete}>
            Delete
        </button>
    );
}