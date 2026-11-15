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

            <p className="reading-id"><span>Reading ID</span><span>{readingId}</span></p>

            {
                view.date ? (
                    <>
                        <div className="reading-details">
                            <p><span>Date</span><span>{view.date.split("T")[0]}</span></p>
                            <p><span>Time slot</span><span>{view.slot}</span></p>
                            <p><span>Glucose</span><span>{view.value} mg/dL</span></p>
                        </div>
                        <div className="reading-detail-actions">
                            <DeleteButton readingId={readingId} setData={setData} />
                        </div>
                    </>
                ) : (
                    <p>Expand Details</p>
                )
            }
        </div>
    );
}
