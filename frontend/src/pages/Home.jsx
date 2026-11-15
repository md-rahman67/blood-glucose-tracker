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
            <div className="App home-page">
                <h1>Blood Glucose Readings</h1>
                <ul className="reading-list">
                    {data.length > 0 ? (
                        data.map((reading) => (
                            <li className="reading-card" key={reading._id} style={{ marginBottom: '10px' }}>
                                Date: {reading.date}, Slot: {reading.slot}, Value: {reading.value}

                                &nbsp;&nbsp;

                                <Link to="/view" state={{ readingId: reading._id }}>
                                    <button className="reading-action">View</button>
                                </Link>

                                &nbsp;&nbsp;

                                {/* <DeleteButton readingId={reading._id} setData={setData} /> */}

                                &nbsp;&nbsp;

                                <Link to="/edit" state={{ readingId: reading._id, data: data }}>
                                    <button className="reading-action reading-action--edit">Edit</button>
                                </Link>
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
