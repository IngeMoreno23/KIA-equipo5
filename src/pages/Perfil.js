import { useEffect, useState } from 'react';
import axios from 'axios';

function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUsuario(res.data.usuario))
    .catch(() => alert('No autorizado'));
  }, []);

  if (!usuario) return <p>Cargando...</p>;
  return (
    <div>
      <h2>Bienvenido, {usuario.email}</h2>
    </div>
  );
}

export default Perfil;