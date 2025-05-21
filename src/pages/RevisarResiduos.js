import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RevisarResiduos.css';
import { useNavigate } from 'react-router-dom';

function RevisarResiduos() {
  const [registers, setRegisters] = useState([]);
  const [dwInfo, setDwInfo] = useState({});
  const [containerInfo, setContainerInfo] = useState({});
  const [areaInfo, setAreaInfo] = useState({});
  const [transporterInfo, setTransporterInfo] = useState({});
  const [receptorInfo, setReceptorInfo] = useState({});
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  // Fetch all registers, dangerous waste info, container info, area info, and transporter info
  useEffect(() => {
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

    fetchRegisters();

    const intervalId = setInterval(fetchRegisters, 60000);
    return () => clearInterval(intervalId);

  }, []);

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
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="table-container">
        <table className="residuos-table">
          <thead>
            <tr>
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
            {registers.length === 0 ? (
              <tr>
                <td colSpan="28" style={{ textAlign: 'center' }}>No hay registros</td>
              </tr>
            ) : (
              registers.map(reg => {
                const dw = dwInfo[reg.dw_id] || {};
                const containerId = dw.container_id ?? '-';
                const container = containerInfo[containerId] || {};
                const areaId = dw.area_id ?? '-';
                const area = areaInfo[areaId] || {};
                const transporterId = reg.transporter_id ?? '-';
                const transporter = transporterInfo[transporterId] || {};
                const receptorId = reg.receptor_id ?? '-';
                const receptor = receptorInfo[receptorId] || {};
                return (
                  <tr key={reg.register_id || reg.id}>
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
                    <td>{reg.quantity}</td>
                    <td>{transporter.transporter_name || '-'}</td>
                    <td>{transporter.authorization_semarnat || '-'}</td>
                    <td>{transporter.authorization_sct || '-'}</td>
                    <td>{receptor.name_reason || '-'}</td>
                    <td>{receptor.auth || '-'}</td>
                    <td>{reg.date_in}</td>
                    <td>{reg.date_out}</td>
                    <td>{reg.responsible}</td>
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