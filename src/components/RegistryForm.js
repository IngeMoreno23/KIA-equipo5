import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistryForm.css'; // Asegúrate de tener este archivo

function RegistryForm() {
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('')

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/registro', { nombre: nombre,email:email, contraseña: contraseña });
      localStorage.setItem('token', res.data.token);
      navigate('/perfil');
    } catch (err) {
      setError('A ocurrido un error.  ' + err);
    }
  };

  return (
    <form className="login-form" onSubmit={handleRegister}>
      <h2>Registro de nuevo usuario</h2>
            <input
        className="login-input"
        type="text"
        placeholder="Name"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
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
      <button className="registry-button" type="submit">Registrar</button>
       {error && <div className="error-message">{error}</div>}
    </form>
  );
}

export default RegistryForm;
