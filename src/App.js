import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrarResiduo from './pages/RegistrarResiduo';
import Tablero from './pages/Tablero';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Tablero />} />
          <Route path="/RegistrarResiduo" element={<RegistrarResiduo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
