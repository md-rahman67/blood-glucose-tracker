import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ViewButton from './pages/ViewButton';
import EditButton from './components/Edit';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view" element={<ViewButton />} />
      <Route path="/edit" element={<EditButton />} />
    </Routes>
  );
}

export default App;