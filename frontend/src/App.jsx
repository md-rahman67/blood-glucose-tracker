import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ViewButton from './pages/ViewButton';
import EditButton from './components/Edit';
import AddForm from "./components/AddForm";
import { useState } from 'react';
import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useEffect } from 'react';
import Success from './components/Success';

function App() {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [data, setData] = useState({});
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/curr-user");
        const jsonData = await response.json();

        setCurrUser(jsonData.user);
        // console.log(jsonData.user);
      } catch (error) {
        // console.log(error)
      }
    }

    fetchUser();
  }, []);


  //* remove succes alert after few sec and reset success state
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);


  return (
    <>
      <Success success={success} />

      <Routes>
        <Route path="/"
          element={<Home
            data={data}
            setData={setData}
            currUser={currUser}
            setCurrUser={setCurrUser}
          />} />

        <Route path="/add"
          element={<AddForm
            data={data}
            setData={setData}
            setSuccess={setSuccess}
          />}
        />

        <Route path="/view"
          element={<ViewButton
            setData={setData}
          />}
        />

        <Route path="/edit"
          element={<EditButton
            setSuccess={setSuccess} />}
        />

        <Route path="/signup"
          element={<Signup
            setCurrUser={setCurrUser}
            setSuccess={setSuccess}
          />}
        />

        <Route path="/login"
          element={<Login
            setCurrUser={setCurrUser}
            setSuccess={setSuccess}
          />}
        />
      </Routes>
    </>
  );
}

export default App;
