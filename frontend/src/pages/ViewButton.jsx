import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DeleteButton from '../components/DeleteButton';
import './ViewButton.css';

export default function ViewButton({ setData }) {

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
        <div className="reading-detail-page">
            <h1>View Details</h1>

            <button className="detail-expand-button" onClick={handleView}>Expand</button>

            <p className="reading-id">Reading ID: {readingId}</p>

            {
                view.date ? (
                    <>
                        <p>Date: {view.date}</p>
                        <p>Slot: {view.slot}</p>
                        <p>Value: {view.value} mg/dL</p>
                        <DeleteButton readingId={readingId} setData={setData} />
                    </>
                ) : (
                    <p>Expand Details</p>
                )
            }
        </div>
    );
}
