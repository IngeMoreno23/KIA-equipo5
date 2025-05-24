import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RevisarResiduos.css';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function RevisarResiduos() {
  const [registers, setRegisters] = useState([]);
  const [dwInfo, setDwInfo] = useState({});
  const [containerInfo, setContainerInfo] = useState({});
  const [areaInfo, setAreaInfo] = useState({});
  const [transporterInfo, setTransporterInfo] = useState({});
  const [receptorInfo, setReceptorInfo] = useState({});
  const [error, setError] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Función para manejar la navegación al registro de residuos
  const irARegistroResiduo = () => {
    navigate('/RegistrarResiduo');
  };

  const irARevisarResiduos = () => {
    navigate('/RevisarResiduos');
  }

  const irATablero = () => {
    navigate('/Tablero');
  };

  // Move fetchRegisters outside useEffect for reuse
  const fetchRegisters = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/register');
      setRegisters(res.data);
      setError('');

      // Get unique dw_ids
      const uniqueDwIds = [...new Set(res.data.map(r => r.dw_id))];
      // Fetch all dangerous waste info in parallel
      const dwResponses = await Promise.all(
        uniqueDwIds.map(id =>
          axios.get(`http://localhost:3001/api/dangerous_waste/${id}`).then(r => [id, r.data])
        )
      );
      // Build a map: dw_id -> info
      const dwMap = {};
      dwResponses.forEach(([id, data]) => {
        dwMap[id] = data;
      });
      setDwInfo(dwMap);

      // Get unique container_ids from dangerous waste info
      const uniqueContainerIds = [
        ...new Set(
          dwResponses
            .map(([, data]) => data.container_id)
            .filter(id => id !== undefined && id !== null)
        ),
      ];
      // Fetch all container info in parallel
      const containerResponses = await Promise.all(
        uniqueContainerIds.map(id =>
          axios.get(`http://localhost:3001/api/container/${id}`).then(r => [id, r.data])
        )
      );
      // Build a map: container_id -> info
      const containerMap = {};
      containerResponses.forEach(([id, data]) => {
        containerMap[id] = data;
      });
      setContainerInfo(containerMap);

      // Get unique area_ids from dangerous waste info
      const uniqueAreaIds = [
        ...new Set(
          dwResponses
            .map(([, data]) => data.area_id)
            .filter(id => id !== undefined && id !== null)
        ),
      ];
      // Fetch all area info in parallel
      const areaResponses = await Promise.all(
        uniqueAreaIds.map(id =>
          axios.get(`http://localhost:3001/api/area/${id}`).then(r => [id, r.data])
        )
      );
      // Build a map: area_id -> info
      const areaMap = {};
      areaResponses.forEach(([id, data]) => {
        areaMap[id] = data;
      });
      setAreaInfo(areaMap);

      // Get unique transporter_ids from registers
      const uniqueTransporterIds = [
        ...new Set(
          res.data
            .map(r => r.transporter_id)
            .filter(id => id !== undefined && id !== null)
        ),
      ];
      // Fetch all transporter info in parallel
      const transporterResponses = await Promise.all(
        uniqueTransporterIds.map(id =>
          axios.get(`http://localhost:3001/api/transporter/${id}`).then(r => [id, r.data])
        )
      );
      // Build a map: transporter_id -> info
      const transporterMap = {};
      transporterResponses.forEach(([id, data]) => {
        transporterMap[id] = data;
      });
      setTransporterInfo(transporterMap);

      // Get unique receptor_ids from registers
      const uniqueReceptorIds = [
        ...new Set(
          res.data
            .map(r => r.receptor_id)
            .filter(id => id !== undefined && id !== null)
        ),
      ];
      // Fetch all receptor info in parallel
      const receptorResponses = await Promise.all(
        uniqueReceptorIds.map(id =>
          axios.get(`http://localhost:3001/api/receptor/${id}`).then(r => [id, r.data])
        )
      );
      // Build a map: receptor_id -> info
      const receptorMap = {};
      receptorResponses.forEach(([id, data]) => {
        receptorMap[id] = data;
      });
      setReceptorInfo(receptorMap);

    } catch (err) {
      setError('No se pudieron cargar los registros');
    }
  };

  useEffect(() => {
    fetchRegisters();
    const intervalId = setInterval(fetchRegisters, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter and order registers by waste_date (oldest first)
  const filteredRegisters = registers
    .filter(reg => {
      if (!startDate && !endDate) return true;
      const regDate = reg.waste_date ? new Date(reg.waste_date) : null;
      if (!regDate) return false;
      if (startDate && regDate < new Date(startDate)) return false;
      if (endDate && regDate > new Date(endDate)) return false;
      return true;
    })
    .sort((a, b) => {
      // Oldest first: compare dates ascending
      const dateA = a.waste_date ? new Date(a.waste_date) : new Date(0);
      const dateB = b.waste_date ? new Date(b.waste_date) : new Date(0);
      return dateA - dateB;
    });

  // Function to export table to Excel
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = filteredRegisters.map(reg => {
      const dw = dwInfo[reg.dw_id] || {};
      const containerId = dw.container_id ?? '-';
      const container = containerInfo[containerId] || {};
      const areaId = dw.area_id ?? '-';
      const area = areaInfo[areaId] || {};
      const transporterId = reg.transporter_id ?? '-';
      const transporter = transporterInfo[transporterId] || {};
      const receptorId = reg.receptor_id ?? '-';
      const receptor = receptorInfo[receptorId] || {};
      return {
        ID: reg.register_id ?? reg.id,
        'Register Date': reg.waste_date,
        name_spanish: dw.name_spanish || '-',
        name_english: dw.name_english || '-',
        article: dw.article || '-',
        container_type: container.type || '-',
        area: area.area || '-',
        C: dw.field_c ? '✔️' : '-',
        R: dw.field_r ? '✔️' : '-',
        E: dw.field_e ? '✔️' : '-',
        T: dw.field_t ? '✔️' : '-',
        Te: dw.field_te ? '✔️' : '-',
        Th: dw.field_th ? '✔️' : '-',
        Tt: dw.field_tt ? '✔️' : '-',
        I: dw.field_i ? '✔️' : '-',
        B: dw.field_b ? '✔️' : '-',
        M: dw.field_m ? '✔️' : '-',
        quantity: reg.quantity,
        transporter_name: transporter.transporter_name || '-',
        authorization_semarnat: transporter.authorization_semarnat || '-',
        authorization_sct: transporter.authorization_sct || '-',
        receptor_name: receptor.name_reason || '-',
        receptor_auth: receptor.auth || '-',
        date_in: reg.date_in,
        date_out: reg.date_out,
        Responsible: reg.responsible
      };
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Residuos');

    // Download Excel file
    XLSX.writeFile(wb, 'registros_residuos.xlsx');
  };

  // Function to handle edit button click
  const handleEditClick = async (reg) => {
    if (editingId === reg.register_id || editingId === reg.id) {
      // Save changes
      const registerId = reg.register_id ?? reg.id;
      const updatedFields = { ...editValues, register_id: registerId };
      try {
        await axios.put(`http://localhost:3001/api/register/actualizar/${registerId}`, updatedFields);
        // Log the edit action
        const username = localStorage.getItem('username') || 'unknown';
        await axios.post('http://localhost:3001/api/logs', {
          username,
          log_action: 'Register Edited',
          register_id: registerId
        });
        setEditingId(null);
        setEditValues({});
        // Refresh table
        fetchRegisters();
      } catch (err) {
        if (err.response && err.response.data) {
          setError('No se pudo actualizar el registro: ' + JSON.stringify(err.response.data));
        } else {
          setError('No se pudo actualizar el registro');
        }
      }
    } else {
      // Enter edit mode
      setEditingId(reg.register_id ?? reg.id);
      setEditValues({
        dw_id: reg.dw_id,
        quantity: reg.quantity,
        transporter_id: reg.transporter_id,
        receptor_id: reg.receptor_id,
        date_in: reg.date_in,
        date_out: reg.date_out,
        responsible: reg.responsible
      });
    }
  };

  // Handle input changes in edit mode
  const handleEditChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  // Function to handle delete button click
  const handleDeleteClick = (reg) => {
    const registerId = reg.register_id ?? reg.id;
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      axios.delete(`http://localhost:3001/api/register/eliminar/${registerId}`)
        .then(async () => {
          // Log the delete action
          const username = localStorage.getItem('username') || 'unknown';
          await axios.post('http://localhost:3001/api/logs', {
            username,
            log_action: 'Register Eliminated',
            register_id: registerId
          });
          fetchRegisters();
        })
        .catch(err => {
          if (err.response && err.response.data) {
            setError('No se pudo eliminar el registro: ' + JSON.stringify(err.response.data));
          } else {
            setError('No se pudo eliminar el registro');
          }
        });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header className="header">
        <div className="logo">KIA MOTORS</div>
        <nav className="nav">
          <button className="btn-modificar" onClick={irARevisarResiduos}>Mostrar Residuos</button>
          <button className="btn-registrar" onClick={irARegistroResiduo}>Registrar Residuo</button>
          <button className="btn-modificar" onClick={irATablero}>Regresar a Tablero</button>
        </nav>
      </header>
      <h1>Registros de Residuos</h1>
      {/* Download button */}
      <button
        onClick={exportToExcel}
        style={{
          marginBottom: '1rem',
          background: 'var(--primary-color)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 22px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          transition: 'background 0.2s'
        }}
        onMouseOver={e => (e.target.style.background = '#001e6c')}
        onMouseOut={e => (e.target.style.background = 'var(--primary-color)')}
      >
        Descargar Excel
      </button>
      {/* Date filter controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>
          Fecha inicio:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="table-container">
        <table className="residuos-table">
          <thead>
            <tr>
              {isAdmin && <th>Acción</th>}
              <th>ID</th>
              <th>Register Date</th>
              <th>name_spanish</th>
              <th>name_english</th>
              <th>article</th>
              <th>container_type</th>
              <th>area</th>
              <th>C</th>
              <th>R</th>
              <th>E</th>
              <th>T</th>
              <th>Te</th>
              <th>Th</th>
              <th>Tt</th>
              <th>I</th>
              <th>B</th>
              <th>M</th>
              <th>quantity</th>
              <th>transporter_name</th>
              <th>authorization_semarnat</th>
              <th>authorization_sct</th>
              <th>receptor_name</th>
              <th>receptor_auth</th>
              <th>date_in</th>
              <th>date_out</th>
              <th>Responsible</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegisters.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 29 : 28} style={{ textAlign: 'center' }}>No hay registros</td>
              </tr>
            ) : (
              filteredRegisters.map(reg => {
                const dw = dwInfo[reg.dw_id] || {};
                const containerId = dw.container_id ?? '-';
                const container = containerInfo[containerId] || {};
                const areaId = dw.area_id ?? '-';
                const area = areaInfo[areaId] || {};
                const transporterId = reg.transporter_id ?? '-';
                const transporter = transporterInfo[transporterId] || {};
                const receptorId = reg.receptor_id ?? '-';
                const receptor = receptorInfo[receptorId] || {};
                const isEditing = editingId === (reg.register_id ?? reg.id);

                return (
                  <tr key={reg.register_id || reg.id}>
                    {isAdmin && (
                      <td style={{ minWidth: 70, padding: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <button
                            onClick={() => handleEditClick(reg)}
                            style={{
                              background: isEditing ? '#4caf50' : 'var(--primary-color)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            {isEditing ? 'Guardar' : 'Editar'}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(reg)}
                            style={{
                              background: '#e53935',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                    <td>{reg.register_id ?? reg.id}</td>
                    <td>{reg.waste_date}</td>
                    <td>{dw.name_spanish || '-'}</td>
                    <td>{dw.name_english || '-'}</td>
                    <td>{dw.article || '-'}</td>
                    <td>{container.type || '-'}</td>
                    <td>{area.area || '-'}</td>
                    <td>{dw.field_c ? '✔️' : '-'}</td>
                    <td>{dw.field_r ? '✔️' : '-'}</td>
                    <td>{dw.field_e ? '✔️' : '-'}</td>
                    <td>{dw.field_t ? '✔️' : '-'}</td>
                    <td>{dw.field_te ? '✔️' : '-'}</td>
                    <td>{dw.field_th ? '✔️' : '-'}</td>
                    <td>{dw.field_tt ? '✔️' : '-'}</td>
                    <td>{dw.field_i ? '✔️' : '-'}</td>
                    <td>{dw.field_b ? '✔️' : '-'}</td>
                    <td>{dw.field_m ? '✔️' : '-'}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.quantity}
                          onChange={e => handleEditChange('quantity', e.target.value)}
                        />
                      ) : reg.quantity}
                    </td>
                    <td>{transporter.transporter_name || '-'}</td>
                    <td>{transporter.authorization_semarnat || '-'}</td>
                    <td>{transporter.authorization_sct || '-'}</td>
                    <td>{receptor.name_reason || '-'}</td>
                    <td>{receptor.auth || '-'}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.date_in ? editValues.date_in.slice(0, 10) : ''}
                          onChange={e => handleEditChange('date_in', e.target.value)}
                        />
                      ) : reg.date_in}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.date_out ? editValues.date_out.slice(0, 10) : ''}
                          onChange={e => handleEditChange('date_out', e.target.value)}
                        />
                      ) : reg.date_out}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.responsible}
                          onChange={e => handleEditChange('responsible', e.target.value)}
                        />
                      ) : reg.responsible}
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

export default RevisarResiduos;