import { useEffect } from 'react';
// import DeleteButton from '../components/DeleteButton';
import { Link } from 'react-router-dom';
import './Home.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



export default function Home({ data, setData }) {

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/readings');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Link className="home-add-link" to="/add">
                <button className="home-add-button">Add Readings</button>
            </Link>

            <Link className="home-add-link" to="/signup">
                <button className="home-add-button">signup</button>
            </Link>
            <div className="App home-page">
                <h1>Blood Glucose Readings</h1>

                <ul className="reading-list">
                    {data.length > 0 ? (
                        data.map((reading) => (
                            <li className="reading-row" key={reading._id}>
                                <span className="reading-field">
                                    <span className="reading-label">Date</span>
                                    <span>{reading.date.split("T")[0]}</span>
                                </span>
                                <span className="reading-field">
                                    <span className="reading-label">Time slot</span>
                                    <span>{reading.slot}</span>
                                </span>
                                <span className="reading-field">
                                    <span className="reading-label">Glucose</span>
                                    <span>{reading.value} mg/dL</span>
                                </span>
                                <span className="reading-actions">
                                    <Link to="/view" state={{ readingId: reading._id }}>
                                        <button className="reading-action">View</button>
                                    </Link>
                                    <Link to="/edit" state={{ readingId: reading._id, data: data }}>
                                        <button className="reading-action reading-action--edit">Edit</button>
                                    </Link>
                                </span>
                            </li>
                        ))
                    ) : (
                        <li>Loading...</li>
                    )}
                </ul>
            </div>
        </>
    )
}
