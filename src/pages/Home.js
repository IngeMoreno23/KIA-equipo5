import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const videoRef = useRef(null);
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/login', { email, contraseña });
      localStorage.setItem('token', res.data.token);
      navigate('/tablero');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div>
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          id="background-video"
        >
          <source src="/kiavideo.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>
      <div className="overlay"></div>

      <div className="login-container">
        <div className="login-header">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={e => setContraseña(e.target.value)}
            required
          />
          <button className="login-button" type="submit">Entrar</button>
          {error && <div className="error-message">{error}</div>}
          <div className="signup-link">
            ¿No tienes una cuenta? <a href="#">Regístrate ahora</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;