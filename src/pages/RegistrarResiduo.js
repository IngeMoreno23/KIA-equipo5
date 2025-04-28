import React, { useState, useEffect, useRef } from 'react';
import './RegistrarResiduo.css';

function RegistroResiduo() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    tipoResiduo: '',
    tipoContenedor: '',
    cantidadGenerada: '',
    areaGeneracion: '',
    fechaIngreso: '',
    fechaSalida: '',
    articulo71: '',
    razonSocial: '',
    autorizacionSemarnat: '',
    autorizacionSct: '',
    razonSocialDestino: '',
    autorizacionDestino: '',
    responsableTecnico: ''
  });

  // Opciones para los campos desplegables
  const opciones = {
    tipoResiduo: ['Residuo 1', 'Residuo 2', 'Residuo 3', 'Residuo 4', 'Residuo 5', 'Residuo 6'],
    tipoContenedor: ['Contenedor 1', 'Contenedor 2', 'Contenedor 3'],
    areaGeneracion: ['Área 1', 'Área 2', 'Área 3', 'Área 4'],
    articulo71: ['Opción 1', 'Opción 2', 'Opción 3'],
    razonSocial: ['Empresa 1', 'Empresa 2', 'Empresa 3'],
    razonSocialDestino: ['Destino 1', 'Destino 2', 'Destino 3']
  };

  // Estado para sugerencias de autocompletado
  const [sugerencias, setSugerencias] = useState([]);
  const [campoActivo, setCampoActivo] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  // Referencias para campos desplegables
  const dropdownRefs = useRef({});

  // Manejador de cambios para todos los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Si es un campo con autocompletado, actualizar sugerencias
    if (opciones[name]) {
      const filtradas = opciones[name].filter(
        opcion => opcion.toLowerCase().includes(value.toLowerCase())
      );
      setSugerencias(filtradas);
      setCampoActivo(name);
      setMostrarSugerencias(true);
    }
  };

  // Seleccionar una sugerencia
  const seleccionarSugerencia = (sugerencia) => {
    setFormData({
      ...formData,
      [campoActivo]: sugerencia
    });
    setMostrarSugerencias(false);
  };

  // Mostrar/ocultar desplegable
  const toggleDropdown = (fieldName) => {
    Object.keys(dropdownRefs.current).forEach(key => {
      if (key !== fieldName && dropdownRefs.current[key].classList.contains('select-active')) {
        dropdownRefs.current[key].classList.remove('select-active');
      }
    });

    if (dropdownRefs.current[fieldName]) {
      dropdownRefs.current[fieldName].classList.toggle('select-active');
    }
  };

  // Cerrar desplegables al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      // Cerrar sugerencias
      if (mostrarSugerencias && !event.target.closest('.autocomplete')) {
        setMostrarSugerencias(false);
      }
      
      // Cerrar desplegables
      Object.keys(dropdownRefs.current).forEach(key => {
        if (
          dropdownRefs.current[key] && 
          dropdownRefs.current[key].classList.contains('select-active') &&
          !dropdownRefs.current[key].contains(event.target)
        ) {
          dropdownRefs.current[key].classList.remove('select-active');
        }
      });
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarSugerencias]);

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    // Aquí iría la lógica para enviar los datos al servidor
  };

  // Renderizar campo con autocompletado
  const renderCampoAutocompletado = (nombre, label) => {
    return (
      <div className="form-group">
        <label htmlFor={nombre}>{label}</label>
        <div className="autocomplete">
          <input
            type="text"
            id={nombre}
            name={nombre}
            value={formData[nombre]}
            onChange={handleChange}
            onFocus={() => {
              setCampoActivo(nombre);
              setMostrarSugerencias(true);
            }}
          />
          {mostrarSugerencias && campoActivo === nombre && sugerencias.length > 0 && (
            <div className="autocomplete-items">
              {sugerencias.map((item, index) => (
                <div key={index} onClick={() => seleccionarSugerencia(item)}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar campo desplegable
  const renderCampoDesplegable = (nombre, label, opciones) => {
    return (
      <div className="form-group">
        <label htmlFor={nombre}>{label}</label>
        <div 
          className="select-container" 
          ref={el => dropdownRefs.current[nombre] = el}
        >
          <div 
            className="select-selected"
            onClick={() => toggleDropdown(nombre)}
          >
            {formData[nombre] || 'Seleccionar'}
          </div>
          <div className="select-items select-hide">
            {opciones.map((item, index) => (
              <div 
                key={index} 
                onClick={() => {
                  setFormData({...formData, [nombre]: item});
                  toggleDropdown(nombre);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar campo de fecha
  const renderCampoFecha = (nombre, label) => {
    return (
      <div className="form-group">
        <label htmlFor={nombre}>{label}</label>
        <input
          type="date"
          id={nombre}
          name={nombre}
          value={formData[nombre]}
          onChange={handleChange}
        />
      </div>
    );
  };

  // Renderizar campo de texto o número
  const renderCampo = (nombre, label, tipo = "text") => {
    return (
      <div className="form-group">
        <label htmlFor={nombre}>{label}</label>
        <input
          type={tipo}
          id={nombre}
          name={nombre}
          value={formData[nombre]}
          onChange={handleChange}
          step={tipo === "number" ? "0.01" : undefined}
        />
      </div>
    );
  };

  return (
    <div className="registro-container">
      <header className="header">
        <div className="logo">KIA MOTORS</div>
        <nav className="nav">
          <button className="btn-modificar">Modificar Inputs</button>
          <button className="btn-registrar">Registrar Residuo</button>
        </nav>
      </header>

      <h1>Registro de Residuos</h1>

      <form className="formulario-residuo" onSubmit={handleSubmit}>
        <h2>Residuo</h2>
        
        {renderCampoAutocompletado('tipoResiduo', 'Tipo de residuo')}
        {renderCampoDesplegable('tipoContenedor', 'Tipo de contenedor', opciones.tipoContenedor)}
        {renderCampo('cantidadGenerada', 'Cantidad generada (toneladas)', 'number')}
        {renderCampoDesplegable('areaGeneracion', 'Área o proceso de generación', opciones.areaGeneracion)}
        {renderCampoFecha('fechaIngreso', 'Fecha de ingreso')}
        {renderCampoFecha('fechaSalida', 'Fecha de salida')}
        {renderCampoDesplegable('articulo71', 'Artículo 71 fracción I inciso (e)', opciones.articulo71)}
        
        <h2>Transportista</h2>
        {renderCampoDesplegable('razonSocial', 'Nombre, denominación o razón social', opciones.razonSocial)}
        {renderCampo('autorizacionSemarnat', 'Número de autorización SEMARNAT')}
        {renderCampo('autorizacionSct', 'Número de autorización SCT')}
        
        <h2>Receptor/Destino</h2>
        {renderCampoDesplegable('razonSocialDestino', 'Nombre, denominación o razón social', opciones.razonSocialDestino)}
        {renderCampo('autorizacionDestino', 'Número de autorización destino')}
        
        <h2>Responsable</h2>
        {renderCampo('responsableTecnico', 'Nombre del responsable técnico')}
        
        <button type="submit" className="btn-registrar-form">Registrar</button>
      </form>

      <footer className="footer">
        <div className="site-name">Site name</div>
        <div className="topics">
          <div className="topic-column">
            <div>Topic</div>
            <div>Page</div>
            <div>Page</div>
            <div>Page</div>
          </div>
          <div className="topic-column">
            <div>Topic</div>
            <div>Page</div>
            <div>Page</div>
            <div>Page</div>
          </div>
          <div className="topic-column">
            <div>Topic</div>
            <div>Page</div>
            <div>Page</div>
            <div>Page</div>
          </div>
        </div>
      </footer>
      
      <div className="social-icons">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-youtube"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </div>
    </div>
  );
}

export default RegistroResiduo;