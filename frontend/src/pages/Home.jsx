import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Logout from '../components/Logout';



export default function Home({ data, setData, currUser, setCurrUser, setError }) {

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/readings');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.log('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <>


            <nav className="home-toolbar">
                <span className="brand-logo">
                    sw<span className="brand-logo__accent">EE</span>ty
                </span>
                {currUser ? (
                    <>
                        <Link className="home-add-link" to="/add">
                            <button className="home-add-button home-action-button home-action-button--add">Add Readings</button>
                        </Link>

                        <Link className="home-add-link" to="/daily-reports">
                            <button className="home-add-button home-action-button home-action-button--daily">Daily report</button>
                        </Link>

                        <Link className="home-add-link" to="/month-to-date-report">
                            <button className="home-add-button home-action-button home-action-button--month-to-date">Month-To-Date Report</button>
                        </Link>

                        <Link className="home-add-link" to="/previous-month-report">
                            <button className="home-add-button home-action-button home-action-button--previous-month">Previous Month Report</button>
                        </Link>

                        <Logout setCurrUser={setCurrUser} setData={setData} setError={setError} />
                    </>
                ) : (
                    <>
                        <Link className="home-add-link" to="/login">
                            <button className="home-add-button home-action-button home-action-button--login">login</button>
                        </Link>

                        <Link className="home-add-link" to="/signup">
                            <button className="home-add-button home-action-button home-action-button--signup">signup</button>
                        </Link>
                    </>
                )}
            </nav>


            <div className="App home-page">
                <h1>Blood Glucose Readings</h1>

                <ul className="reading-list">
                    {data.length > 0 ? (
                        data.map((reading) => (
                            <li className="reading-row" key={reading._id}>

                                <span className="reading-field">
                                    <span className="reading-label">username</span>
                                    <span>{reading.recordedBy.username}</span>
                                </span>

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
