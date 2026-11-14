import { useState, useEffect } from 'react';
import Form from './Form';

function App() {
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
              <li key={reading.id}>
                Date: {reading.date}, Slot: {reading.slot}, Value: {reading.value}
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

export default App
