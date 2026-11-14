import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ViewButton() {

    const [view, setView] = useState({});
    const location = useLocation();

    const { readingId } = location.state;

    const handleView = async () => {
        try {
            const response = await fetch(`/api/readings/${readingId}`, {
                method: 'GET',
            });
            const jsonData = await response.json();

            if (response.ok) {
                setView(jsonData);
            }
        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    };

    return (
        <div>
            <h1>View Details</h1>

            <button onClick={handleView}>Expand</button>

            <p>Reading ID: {readingId}</p>

            {
                view.date ? (
                    <>
                        <p>Date: {view.date}</p>
                        <p>Slot: {view.slot}</p>
                        <p>Value: {view.value} mg/dL</p>
                    </>
                ) : (
                    <p>Expand Details</p>
                )
            }
        </div>
    );
}