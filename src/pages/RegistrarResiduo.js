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
  
  // Estado para etiquetas seleccionadas
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState({
    C: false,  // Corrosivo
    R: false,  // Reactivo
    E: false,  // Explosivo
    T: false,  // Tóxico
    Te: false, // Tóxico ecológico
    Th: false, // Tóxico humano
    Tt: false, // Tóxico terrestre
    I: false,  // Inflamable
    B: false,  // Biológico-infeccioso
    M: false   // Misceláneo
  });

  // Estado para control de validación
  const [camposInvalidos, setCamposInvalidos] = useState({});
  const [formularioTocado, setFormularioTocado] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  // Opciones para los campos desplegables
  const opciones = {
    tipoResiduo: ['Trapos y guantes contaminados con aceite hidráulico,pintura y thinner provenientes de actividades de limpieza y operación (T)', 'Sello Gastado: proveniente de la aplicación de sellos a carcazas (T)', 'Filtros contaminados con pigmentos  y agua provenientes de la Planta de pintura (T)', 'Solventes Mezclados con base de thinner  provenientes de las actividades de limpieza y/o los mantenimientos realizados a los equipos . ', 'Contenedores  vacios plasticos   contaminados de pintura de aceite y aceite hidraulico', 'Agua Contaminada con pintura proveniente de la aplicación a las carrocerías (T)'],
    tipoContenedor: ['Tambo', 'Tote', 'Tarima', 'Paca', 'Pieza'],
    areaGeneracion: ['Assembly', 'Paint', 'Wielding', "utility"],
    articulo71: ['Reciclaje', 'Confinamiento', 'Coprocesamiento'],
    razonSocial: ['Servicios Ambientales Internacionales S. de RL. De C.V.1', 'ECO SERVICIOS PARA GAS SA. DE CV.', 'CONDUGAS DEL NORESTE, S.A DE C.V.'],
    razonSocialDestino: ['SERVICIOS AMBIENTALES INTERNACIONALES S DE RL DE CV', 'ECOQUIM, S.A. DE C.V. ', 'MAQUILADORA DE LUBRICANTES, S.A. DE C.V. ']
  };

  // Definir campos requeridos
  const camposRequeridos = [
    'tipoResiduo',
    'tipoContenedor',
    'cantidadGenerada',
    'areaGeneracion',
    'fechaIngreso',
    'articulo71',
    'razonSocial',
    'autorizacionSemarnat',
    'razonSocialDestino',
    'responsableTecnico'
  ];

  // Estado para sugerencias de autocompletado
  const [sugerencias, setSugerencias] = useState([]);
  const [campoActivo, setCampoActivo] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  // Estado para controlar los dropdowns abiertos
  const [dropdownAbierto, setDropdownAbierto] = useState('');
  
  // Referencias para campos desplegables
  const dropdownRefs = useRef({});

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    let formularioValido = true;
    
    camposRequeridos.forEach(campo => {
      if (!formData[campo] || formData[campo].trim() === '') {
        nuevosErrores[campo] = true;
        formularioValido = false;
      }
    });
    
    setCamposInvalidos(nuevosErrores);
    return formularioValido;
  };
  
  // Verificar si hay al menos un campo inválido
  const hayErrores = () => {
    return Object.keys(camposInvalidos).length > 0;
  };

  // Manejador de cambios para todos los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizar el formulario
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Marcar formulario como tocado
    setFormularioTocado(true);
    
    // Si era un campo inválido, verificar si ahora es válido
    if (camposInvalidos[name] && value.trim() !== '') {
      const nuevosErrores = { ...camposInvalidos };
      delete nuevosErrores[name];
      setCamposInvalidos(nuevosErrores);
    }

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
    
    // Actualizar validación
    if (camposInvalidos[campoActivo]) {
      const nuevosErrores = { ...camposInvalidos };
      delete nuevosErrores[campoActivo];
      setCamposInvalidos(nuevosErrores);
    }
    
    setMostrarSugerencias(false);
    setFormularioTocado(true);
  };

  // Mostrar/ocultar desplegable
  const toggleDropdown = (fieldName) => {
    if (dropdownAbierto === fieldName) {
      // Si ya está abierto, cerrarlo
      setDropdownAbierto('');
    } else {
      // Si está cerrado, abrirlo (y cerrar cualquier otro)
      setDropdownAbierto(fieldName);
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
      if (dropdownAbierto && !event.target.closest('.select-container')) {
        setDropdownAbierto('');
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarSugerencias, dropdownAbierto]);

  // Validar el formulario cuando se marca como tocado
  useEffect(() => {
    if (formularioTocado) {
      validarFormulario();
    }
  }, [formData, formularioTocado]);

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar el formulario
    const esValido = validarFormulario();
    
    if (esValido) {
      console.log('Datos enviados:', formData);
      console.log('Etiquetas seleccionadas:', etiquetasSeleccionadas);
      // Aquí iría la lógica para enviar los datos al servidor
      setMostrarError(false);
    } else {
      // Mostrar error
      setMostrarError(true);
      // El overlay permanecerá visible hasta que el usuario haga clic en "Aceptar"
    }
  };
  
  // Manejar clic en etiqueta
  const toggleEtiqueta = (etiqueta) => {
    setEtiquetasSeleccionadas(prev => ({
      ...prev,
      [etiqueta]: !prev[etiqueta]
    }));
    setFormularioTocado(true);
  };

  // Renderizar campo con autocompletado
  const renderCampoAutocompletado = (nombre, label) => {
    const esRequerido = camposRequeridos.includes(nombre);
    const esInvalido = camposInvalidos[nombre];
    
    return (
      <div className={`form-group ${esInvalido ? 'invalid-field' : ''}`}>
        <label htmlFor={nombre}>
          {label}{esRequerido ? ' *' : ''}
        </label>
        <div className="autocomplete">
          <input
            type="text"
            id={nombre}
            name={nombre}
            value={formData[nombre]}
            onChange={handleChange}
            className={esInvalido ? 'input-invalid' : ''}
            onFocus={() => {
              setCampoActivo(nombre);
              setMostrarSugerencias(true);
            }}
          />
          {esInvalido && <div className="error-message">Campo requerido</div>}
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
    const esRequerido = camposRequeridos.includes(nombre);
    const esInvalido = camposInvalidos[nombre];
    
    return (
      <div className={`form-group ${esInvalido ? 'invalid-field' : ''}`}>
        <label htmlFor={nombre}>
          {label}{esRequerido ? ' *' : ''}
        </label>
        <div 
          className="select-container" 
          ref={el => dropdownRefs.current[nombre] = el}
        >
          <div 
            className={`select-selected ${esInvalido ? 'input-invalid' : ''}`}
            onClick={() => toggleDropdown(nombre)}
          >
            {formData[nombre] || 'Seleccionar'}
            <span className="dropdown-arrow"></span>
          </div>
          {esInvalido && <div className="error-message">Campo requerido</div>}
          <div className={`select-items ${dropdownAbierto === nombre ? '' : 'select-hide'}`}>
            {opciones.map((item, index) => (
              <div 
                key={index} 
                onClick={() => {
                  setFormData({...formData, [nombre]: item});
                  
                  // Actualizar validación
                  if (camposInvalidos[nombre]) {
                    const nuevosErrores = { ...camposInvalidos };
                    delete nuevosErrores[nombre];
                    setCamposInvalidos(nuevosErrores);
                  }
                  
                  setDropdownAbierto('');
                  setFormularioTocado(true);
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
    const esRequerido = camposRequeridos.includes(nombre);
    const esInvalido = camposInvalidos[nombre];
    
    return (
      <div className={`form-group ${esInvalido ? 'invalid-field' : ''}`}>
        <label htmlFor={nombre}>
          {label}{esRequerido ? ' *' : ''}
        </label>
        <input
          type="date"
          id={nombre}
          name={nombre}
          value={formData[nombre]}
          onChange={handleChange}
          className={esInvalido ? 'input-invalid' : ''}
        />
        {esInvalido && <div className="error-message">Campo requerido</div>}
      </div>
    );
  };

  // Renderizar campo de texto o número
  const renderCampo = (nombre, label, tipo = "text") => {
    const esRequerido = camposRequeridos.includes(nombre);
    const esInvalido = camposInvalidos[nombre];
    
    return (
      <div className={`form-group ${esInvalido ? 'invalid-field' : ''}`}>
        <label htmlFor={nombre}>
          {label}{esRequerido ? ' *' : ''}
        </label>
        <input
          type={tipo}
          id={nombre}
          name={nombre}
          value={formData[nombre]}
          onChange={handleChange}
          step={tipo === "number" ? "0.01" : undefined}
          className={esInvalido ? 'input-invalid' : ''}
        />
        {esInvalido && <div className="error-message">Campo requerido</div>}
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
        
        <h2>Características del residuo</h2>
        <div className="etiquetas-container">
          <p className="etiquetas-desc">Seleccione las características aplicables:</p>
          <div className="etiquetas-grid">
            {Object.keys(etiquetasSeleccionadas).map(etiqueta => (
              <div 
                key={etiqueta}
                className={`etiqueta-item ${etiquetasSeleccionadas[etiqueta] ? 'etiqueta-selected' : ''}`}
                onClick={() => toggleEtiqueta(etiqueta)}
              >
                {etiqueta}
              </div>
            ))}
          </div>
        </div>
        
        <h2>Transportista</h2>
        {renderCampoDesplegable('razonSocial', 'Nombre, denominación o razón social', opciones.razonSocial)}
        {renderCampo('autorizacionSemarnat', 'Número de autorización SEMARNAT')}
        {renderCampo('autorizacionSct', 'Número de autorización SCT')}
        
        <h2>Receptor/Destino</h2>
        {renderCampoDesplegable('razonSocialDestino', 'Nombre, denominación o razón social', opciones.razonSocialDestino)}
        {renderCampo('autorizacionDestino', 'Número de autorización destino')}
        
        <h2>Responsable</h2>
        {renderCampo('responsableTecnico', 'Nombre del responsable técnico')}
        
        <div className="submit-container">
          <button 
            type="submit" 
            className={`btn-registrar-form ${hayErrores() ? 'btn-disabled' : ''}`}
          >
            Registrar
          </button>
        </div>
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

      {/* Error Overlay - Modal Independiente */}
      {mostrarError && (
        <div className="error-overlay">
          <div className="error-modal">
            <div className="error-icon">!</div>
            <div className="error-title">Formulario Incompleto</div>
            <div className="error-message-modal">
              Por favor complete todos los campos requeridos antes de enviar.
            </div>
            <button 
              className="error-close-btn"
              onClick={() => setMostrarError(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroResiduo;