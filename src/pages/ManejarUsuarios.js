import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManejarUsuarios.css';
import { useNavigate } from 'react-router-dom';
import RutaPrivada from '../components/RutaPrivada';

function ManejarUsuariosContent() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const irARegistroResiduo = () => {
    navigate('/RegistrarResiduo');
  };

  const irARevisarResiduos = () => {
    navigate('/RevisarResiduos');
  };

  // Fetch all users
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/usuarios');
      setUsuarios(res.data);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const irATablero = () => {
    navigate('/Tablero');
  };

  return (
    <div className="tablero-container">
      <header className="header">
        <div className="logo">KIA MOTORS</div>
        <nav className="nav">
          <button className="btn-modificar" onClick={irARevisarResiduos}>Mostrar Residuos</button>
          <button className="btn-registrar" onClick={irARegistroResiduo}>Registrar Residuo</button>
          <button className="btn-modificar" onClick={irATablero}>Regresar a Tablero</button>
        </nav>
      </header>
      <h1>Usuarios del Sistema</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Fecha de Creacion</th>
              <th>Admin?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No hay usuarios</td>
              </tr>
            ) : (
              usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.email}</td>
                  <td>{usuario.nombre}</td>
                  <td>
                    {usuario.createdAt
                      ? new Date(usuario.createdAt).toISOString().slice(0, 10)
                      : ''}
                  </td>
                  <td>{usuario.is_admin ? 'Sí' : 'No'}</td>
                  <td>
                    {!usuario.is_admin && (
                      <button
                        className="btn-eliminar"
                        style={{
                          background: '#e53935',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}
                        onClick={async () => {
                          if (window.confirm(`¿Seguro que deseas eliminar al usuario ${usuario.nombre}?`)) {
                            try {
                              await axios.delete(`http://localhost:3001/api/usuarios/${usuario.id}`);
                              setUsuarios(usuarios.filter(u => u.id !== usuario.id));
                            } catch (err) {
                              alert('No se pudo eliminar el usuario.');
                            }
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManejarUsuarios() {
  return (
    <RutaPrivada>
      <ManejarUsuariosContent />
    </RutaPrivada>
  );
}