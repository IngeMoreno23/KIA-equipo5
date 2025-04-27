import './Tablero.css'; // Asegúrate de tener este archivo CSS para los estilos
import React from 'react';

function Tablero() {
  return (
    <div className="tablero-container">
      
      {/* Header */}
      <header className="header">
        <div className="logo">KIA MOTORS</div>
        <nav className="nav">
          <button className="btn-modificar">Modificar Inputs</button>
          <button className="btn-registrar">Registrar Residuo</button>
        </nav>
      </header>

      {/* Título principal */}
      <main className="main-content">
        <h1>Gestión de Residuos</h1>

        {/* Resumen de gráficas */}
        <section className="resumen">
          {/* Aquí podrías mapear varias gráficas */}
          <div className="grafica">Gráfica 1</div>
          <div className="grafica">Gráfica 2</div>
          <div className="grafica">Gráfica 3</div>
          {/* etc */}
        </section>

        {/* Acceso Rápido */}
        <section className="acceso-rapido">
          <div className="filtros">
            <button>Todos</button>
            <button>Abierto Recientemente</button>
            <button>Favoritos</button>
          </div>
          <div className="lista-bitacoras">
            {/* Lista de bitácoras */}
            <div className="bitacora">Bitácora RPS 2024</div>
            <div className="bitacora">Bitácora RPS 2023</div>
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
