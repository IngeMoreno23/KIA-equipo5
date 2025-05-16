import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Asegúrate de tener este archivo

function LoginForm() {
  
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('')
  
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
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Iniciar sesión</h2>
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
    </form>
  );
}

export default LoginForm;
