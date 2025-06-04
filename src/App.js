import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrarResiduo from './pages/RegistrarResiduo';
import Tablero from './pages/Tablero';
import Home from './pages/Home';
import RevisarResiduos from './pages/RevisarResiduos';
import ManejarUsuarios from './pages/ManejarUsuarios';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tablero" element={<Tablero />} />
          <Route path="/RegistrarResiduo" element={<RegistrarResiduo />} />
          <Route path="/RevisarResiduos" element={<RevisarResiduos />} />
          <Route path="/ManejarUsuarios" element={<ManejarUsuarios />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
