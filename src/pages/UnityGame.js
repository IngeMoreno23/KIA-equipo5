import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnityGame = () => {
  const navigate = useNavigate();

  const irATablero = () => {
    navigate('/Tablero');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header className="header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + '/KIA_Logo_Black.png'}
            alt="KIA Logo"
            style={{ height: 96 }}
          />
        </div>
        <nav className="nav">
          <button
            className="btn-modificar"
            onClick={irATablero}
            style={{
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
            Regresar a Tablero
          </button>
        </nav>
      </header>
      <iframe
        src={`/kia-unity-build/index.html?cb=${Date.now()}`}
        width="1280"
        height="720"
        style={{ border: 'none' }}
        title="TriKia"
      />
    </div>
  );
};

export default UnityGame;