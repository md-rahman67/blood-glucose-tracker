import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ViewButton from './pages/ViewButton';
import EditButton from './components/Edit';
import AddForm from "./components/AddForm";
import { useState } from 'react';
import './App.css';
import Signup from './pages/Signup';

function App() {
  const [data, setData] = useState({});
  return (
    <Routes>
      <Route path="/" element={<Home data={data} setData={setData} />} />
      <Route path="/add" element={<AddForm setData={setData} />} />
      <Route path="/view" element={<ViewButton setData={setData} />} />
      <Route path="/edit" element={<EditButton />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
