import './Tablero.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GraficaBarra from '../components/GraficaBarra';
import GraficaPieArticulo from '../components/GraficaPieArticulo';
import GraficaPieResponsable from '../components/GraficaPieResponsable';

function Tablero() {
  const navigate = useNavigate();

  // Check admin status from localStorage
  // const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Función para manejar la navegación al registro de residuos
  const irARegistroResiduo = () => {
    navigate('/RegistrarResiduo');
  };

  const irARevisarResiduos = () => {
    navigate('/RevisarResiduos');
  }

  return (
    <div className="tablero-container">
      {/* Header */}
      <header className="header">
        <div className="logo">KIA MOTORS</div>
        <nav className="nav">
          <button className="btn-modificar" onClick={irARevisarResiduos}>Mostrar Residuos</button>
          <button className="btn-registrar" onClick={irARegistroResiduo}>Registrar Residuo</button>
          {(
            <button className="btn-admin">
              {localStorage.getItem('username')}
            </button>
          )}
        </nav>
      </header>

      {/* Título principal */}
      <main className="main-content">
        <h1>Gestión de Residuos</h1>

        {/* Resumen de gráficas */}
        <section className="resumen">
          {/* Aquí podrías mapear varias gráficas */}
          <div className="grafica">
            <GraficaBarra />
          </div>
          <div className="grafica">
            <GraficaPieArticulo />
          </div>
          <div className="grafica">
            <GraficaPieResponsable />
          </div>
          {/* etc */}
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

      {/* Footer */}
      <footer className="footer">
        <div className="site-name">Site name</div>
        <div className="topics">
          <div>Topic</div>
          <div>Topic</div>
          <div>Topic</div>
        </div>
      </footer>

    </div>
  );
}

export default Tablero;
