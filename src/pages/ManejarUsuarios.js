import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManejarUsuarios.css';
import { useNavigate } from 'react-router-dom';
import RutaPrivada from '../components/RutaPrivada';

function ManejarUsuariosContent() {
  const [usuarios, setUsuarios] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [error, setError] = useState('');
  const [editingOpcionId, setEditingOpcionId] = useState(null);
  const [editOpcionValues, setEditOpcionValues] = useState({});
  const [showAddOpcion, setShowAddOpcion] = useState(false);
  const [newOpcion, setNewOpcion] = useState({ tipo: '', valor: '', orden: '' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: '', email: '', contraseña: '' });
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

  // Fetch all opciones
  const fetchOpciones = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/opciones');
      // Ordenar primero por tipo, luego por orden
      const opcionesOrdenadas = res.data.slice().sort((a, b) => {
        if (a.tipo < b.tipo) return -1;
        if (a.tipo > b.tipo) return 1;
        // Si tipo es igual, ordenar por orden numérico
        return a.orden - b.orden;
      });
      setOpciones(opcionesOrdenadas);
    } catch (err) {
      setOpciones([]);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchOpciones();
  }, []);

  const irATablero = () => {
    navigate('/Tablero');
  };

  // Handle edit button click for opciones
  const handleEditOpcionClick = (opcion) => {
    if (editingOpcionId === opcion.id) {
      // Save changes
      axios
        .put(`http://localhost:3001/api/opciones/${opcion.id}`, editOpcionValues)
        .then(() => {
          setEditingOpcionId(null);
          setEditOpcionValues({});
          fetchOpciones();
        })
        .catch(() => {
          alert('No se pudo actualizar la opción');
        });
    } else {
      setEditingOpcionId(opcion.id);
      setEditOpcionValues({
        tipo: opcion.tipo,
        valor: opcion.valor,
        orden: opcion.orden,
      });
    }
  };

  // Handle input changes in edit mode for opciones
  const handleEditOpcionChange = (field, value) => {
    setEditOpcionValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle add new opcion
  const handleAddOpcion = async () => {
    if (!newOpcion.tipo || !newOpcion.valor || newOpcion.orden === '') {
      alert('Completa todos los campos para agregar una opción.');
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/opciones/', {
        tipo: newOpcion.tipo,
        valor: newOpcion.valor,
        orden: Number(newOpcion.orden),
      });
      setShowAddOpcion(false);
      setNewOpcion({ tipo: '', valor: '', orden: '' });
      fetchOpciones();
    } catch (err) {
      alert('No se pudo agregar la opción.');
    }
  };

  // Handle add new user
  const handleAddUser = async () => {
    if (!newUser.nombre || !newUser.email || !newUser.contraseña) {
      alert('Completa todos los campos para agregar un usuario.');
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/registro', {
        nombre: newUser.nombre,
        email: newUser.email,
        contraseña: newUser.contraseña,
      });
      setShowAddUser(false);
      setNewUser({ nombre: '', email: '', contraseña: '' });
      fetchUsuarios();
    } catch (err) {
      alert('No se pudo agregar el usuario.');
    }
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        {!showAddUser ? (
          <button
            className="btn-registrar"
            style={{
              background: '#0030b9',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
            onClick={() => setShowAddUser(true)}
          >
            Crear nuevo usuario
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Nombre"
              value={newUser.nombre}
              onChange={e => setNewUser({ ...newUser, nombre: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={newUser.contraseña}
              onChange={e => setNewUser({ ...newUser, contraseña: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button
              className="btn-modificar"
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
              onClick={handleAddUser}
            >
              Guardar
            </button>
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
              onClick={() => {
                setShowAddUser(false);
                setNewUser({ nombre: '', email: '', contraseña: '' });
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
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

      <h1>Opciones del Sistema</h1>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        {!showAddOpcion ? (
          <button
            className="btn-registrar"
            style={{
              background: '#0030b9',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
            onClick={() => setShowAddOpcion(true)}
          >
            Agregar nueva opción
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tipo"
              value={newOpcion.tipo}
              onChange={e => setNewOpcion({ ...newOpcion, tipo: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Valor"
              value={newOpcion.valor}
              onChange={e => setNewOpcion({ ...newOpcion, valor: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              placeholder="Orden"
              value={newOpcion.orden}
              onChange={e => setNewOpcion({ ...newOpcion, orden: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: 80 }}
            />
            <button
              className="btn-modificar"
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
              onClick={handleAddOpcion}
            >
              Guardar
            </button>
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
              onClick={() => {
                setShowAddOpcion(false);
                setNewOpcion({ tipo: '', valor: '', orden: '' });
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {opciones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No hay opciones</td>
              </tr>
            ) : (
              opciones.map(opcion => {
                const isEditing = editingOpcionId === opcion.id;
                return (
                  <tr key={opcion.id}>
                    <td>{opcion.id}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editOpcionValues.tipo}
                          onChange={e => handleEditOpcionChange('tipo', e.target.value)}
                        />
                      ) : (
                        opcion.tipo
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editOpcionValues.valor}
                          onChange={e => handleEditOpcionChange('valor', e.target.value)}
                        />
                      ) : (
                        opcion.valor
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editOpcionValues.orden}
                          onChange={e => handleEditOpcionChange('orden', e.target.value)}
                        />
                      ) : (
                        opcion.orden
                      )}
                    </td>
                    <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                      <button
                        className="btn-modificar"
                        style={{
                          background: isEditing ? '#4caf50' : 'var(--primary-color)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEditOpcionClick(opcion)}
                      >
                        {isEditing ? 'Guardar' : 'Editar'}
                      </button>
                      {isEditing && (
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
                          onClick={() => {
                            setEditingOpcionId(null);
                            setEditOpcionValues({});
                          }}
                        >
                          Cancelar
                        </button>
                      )}
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
                          if (window.confirm(`¿Seguro que deseas eliminar la opción "${opcion.valor}"?`)) {
                            try {
                              await axios.delete(`http://localhost:3001/api/opciones/${opcion.id}`);
                              setOpciones(opciones.filter(o => o.id !== opcion.id));
                            } catch (err) {
                              alert('No se pudo eliminar la opción.');
                            }
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
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