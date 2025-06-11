import './Tablero.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GraficaBarra from '../components/GraficaBarra';
import GraficaPieArticulo from '../components/GraficaPieArticulo';
import GraficaPieResponsable from '../components/GraficaPieResponsable';
import GraficaPieResiduo from '../components/GraficaPieResiduo';
import RutaPrivada from '../components/RutaPrivada';

function TableroContent() {
  const navigate = useNavigate();
  const [maximized, setMaximized] = useState(null);

  // Add year and month filter state
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(''); // '' means all months

  const irARegistroResiduo = () => {
    navigate('/RegistrarResiduo');
  };

  const irARevisarResiduos = () => {
    navigate('/RevisarResiduos');
  };

  const irAManejarUsuarios = () => {
    navigate('/ManejarUsuarios');
  };

  const irAUnityGame = () => {
    navigate('/UnityGame');
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Helper to render each graph with its maximize button below
  const renderGrafica = (Component, label, buttonLabel) => {
    const isMax = maximized === label;
    const chartProps = {
      width: isMax ? 900 : 400,
      height: isMax ? 500 : 300,
      maximized: isMax,
      year,
      month,
    };

    return (
      <div
        className={`grafica${isMax ? ' maximized-grafica' : ''}`}
        style={{
          ...(maximized && !isMax ? { display: 'none' } : {}),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Component {...chartProps} />
        <div style={{ marginTop: 8, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn-modificar"
            style={{ fontSize: 14, padding: '2px 16px', minWidth: 0 }}
            onClick={() => setMaximized(isMax ? null : label)}
          >
            {isMax ? `Minimizar` : `Maximizar`}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="tablero-container">
      <header className="header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + '/KIA_Logo_Black.jpg'}
            alt="KIA Logo"
            style={{ height: 96 }}
          />
        </div>
        <nav className="nav">
          <button className="btn-modificar" onClick={irARevisarResiduos}>Mostrar Residuos</button>
          <button className="btn-registrar" onClick={irARegistroResiduo}>Registrar Residuo</button>
          {isAdmin && (
            <button className="btn-admin" onClick={irAManejarUsuarios}>
              {localStorage.getItem('username')}
            </button>
          )}
          <button className="btn-juego" onClick={irAUnityGame}>TriKia (Tutorial)</button>
        </nav>
      </header>

      {/* Título principal */}
      <main className="main-content">
        <h1>Gestión de Residuos</h1>

        {/* Filtro global */}
        <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center', gap: 16 }}>
          <label>
            Año:&nbsp;
            <input
              type="number"
              min="2000"
              max={currentYear}
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              style={{ width: 80, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </label>
          <label>
            Mes:&nbsp;
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
            >
              <option value="">Todos</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </label>
        </div>

        {/* Resumen de gráficas */}
        <section className="resumen">
          {renderGrafica(GraficaBarra, 'barra', 'Barra')}
          {renderGrafica(GraficaPieArticulo, 'articulo', 'Artículo')}
          {renderGrafica(GraficaPieResponsable, 'responsable', 'Responsable')}
          {renderGrafica(GraficaPieResiduo, 'residuo', 'Residuo')}
        </section>

        {/* Acceso Rápido */}
        <section className="acceso-rapido">
          <div className="filtros">
            <h2>Reportes</h2>
          </div>
          <div className="lista-bitacoras">
            {/* Lista de bitácoras */}
            <a
              href={process.env.PUBLIC_URL + '/Bitacora RPS 2024.xlsx'}
              download
              className="bitacora"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Bitácora RPS 2024
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Tablero() {
  return (
    <RutaPrivada>
      <TableroContent />
    </RutaPrivada>
  );
}

