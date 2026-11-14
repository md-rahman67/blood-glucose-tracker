import { useState, useEffect } from 'react';
import DeleteButton from '../components/DeleteButton';
import Form from '../components/Form';
import { Link } from 'react-router-dom';


export default function Home() {
    const [data, setData] = useState({});

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
            <Form setData={setData} />
            <div className="App">
                <h1>Blood Glucose Readings</h1>
                <ul>
                    {data.length > 0 ? (
                        data.map((reading) => (
                            <li key={reading.id} style={{ marginBottom: '10px' }}>
                                Date: {reading.date}, Slot: {reading.slot}, Value: {reading.value}

                                &nbsp;&nbsp;

                                <Link to="/view" state={{ readingId: reading.id, data: data }}>
                                    <button>View</button>
                                </Link>

                                &nbsp;&nbsp;

                                <DeleteButton readingId={reading.id} setData={setData} />

                                &nbsp;&nbsp;

                                {/* <ViewButton /> */}
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