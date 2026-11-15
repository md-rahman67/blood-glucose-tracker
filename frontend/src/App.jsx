import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ViewButton from './pages/ViewButton';
import EditButton from './components/Edit';
import AddForm from "./components/AddForm";
import { useState } from 'react';
import './App.css';
import Login from './pages/Login';

function App() {
  const [data, setData] = useState({});
  return (
    <Routes>
      <Route path="/" element={<Home data={data} setData={setData} />} />
      <Route path="/add" element={<AddForm setData={setData} />} />
      <Route path="/view" element={<ViewButton setData={setData} />} />
      <Route path="/edit" element={<EditButton />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
