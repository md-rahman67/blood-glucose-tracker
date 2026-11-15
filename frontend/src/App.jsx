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

function App() {
  const [data, setData] = useState({});
  const [currUser, setCurrUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/curr-user");
        const jsonData = await response.json();

        setCurrUser(jsonData.user);
        console.log(jsonData.user);
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home data={data} setData={setData} currUser={currUser} />} />
      <Route path="/add" element={<AddForm setData={setData} />} />
      <Route path="/view" element={<ViewButton setData={setData} />} />
      <Route path="/edit" element={<EditButton />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
