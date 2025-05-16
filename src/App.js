import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrarResiduo from './pages/RegistrarResiduo';
import Tablero from './pages/Tablero';
import Home from './pages/Home';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tablero" element={<Tablero />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/RegistrarResiduo" element={<RegistrarResiduo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
