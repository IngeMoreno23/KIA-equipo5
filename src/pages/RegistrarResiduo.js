import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './RegistrarResiduo.css';
import { useNavigate } from 'react-router-dom';

function RegistroResiduo() {
  const [submittedData, setSubmittedData] = useState(null); // 1. Add this line
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombreResiduoEspanol: '',
    nombreResiduoIngles: '', // <-- Added here
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

  const navigate = useNavigate();

  const irARegistroResiduo = () => {
    navigate('/RegistrarResiduo');
  };

  const irARevisarResiduos = () => {
    navigate('/RevisarResiduos');
  };

  const irATablero = () => {
    navigate('/Tablero');
  };
  
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
    nombreResiduoEspanol: ['Trapos y guantes contaminados con aceite hidráulico,pintura y thinner provenientes de actividades de limpieza y operación (T)', 'Sello Gastado: proveniente de la aplicación de sellos a carcazas (T)', 'Filtros contaminados con pigmentos  y agua provenientes de la Planta de pintura (T)', 'Solventes Mezclados con base de thinner  provenientes de las actividades de limpieza y/o los mantenimientos realizados a los equipos . ', 'Contenedores  vacios plasticos   contaminados de pintura de aceite y aceite hidraulico', 'Agua Contaminada con pintura proveniente de la aplicación a las carrocerías (T)'],
    nombreResiduoIngles: [
    'Rags and gloves contaminated with hydraulic oil, paint, and thinner from cleaning and operation activities (T)',
    'Used seal: from the application of seals to casings (T)',
    'Filters contaminated with pigments and water from the Paint Plant (T)',
    'Mixed solvents based on thinner from cleaning activities and/or maintenance performed on equipment.',
    'Empty plastic containers contaminated with oil paint and hydraulic oil',
    'Water contaminated with paint from application to car bodies (T)'
    ],
    tipoContenedor: ['Tambo', 'Tote', 'Tarima', 'Paca', 'Pieza'],
    areaGeneracion: ['Assembly', 'Paint', 'Wielding', "utility", "Stamping"],
    articulo71: ['Reciclaje', 'Confinamiento', 'Coprocesamiento'],
    razonSocial: ['Servicios Ambientales Internacionales S. de RL. De C.V.1', 'ECO SERVICIOS PARA GAS SA. DE CV.', 'CONDUGAS DEL NORESTE, S.A DE C.V.'],
    autorizacionSemarnat: ["19-I-030-D-19", "19-I-009D-18", "19-I-031D-19"],
    autorizacionSct: ["1938SAI07062011230301029", "1938NACL29052015073601001", "1938ESG28112011230301000", "1938CNO08112011230301036"],
    razonSocialDestino: ['SERVICIOS AMBIENTALES INTERNACIONALES S DE RL DE CV', 'ECOQUIM, S.A. DE C.V. ', 'MAQUILADORA DE LUBRICANTES, S.A. DE C.V. '],
    autorizacionDestino: ["19-II-004D-2020", "19-21-PS-V-04-94", "19-IV-69-16"],
    responsableTecnico: ['Yolanda Martinez', 'Juan Perez','Maria Lopez',"Yamileth Cuellar"],

  };

  // Definir campos requeridos
  const camposRequeridos = [
    'nombreResiduoEspanol',
    'nombreResiduoIngles',
    'tipoContenedor',
    'cantidadGenerada',
    'areaGeneracion',
    'fechaIngreso',
    'articulo71',
    'razonSocial',
    'autorizacionSemarnat',
    "autorizacionSct",
    'razonSocialDestino',
    "autorizacionDestino",
    'responsableTecnico',
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
      setSubmittedData(formData); // 2. Save all entries
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

  const handleAddTransporter = async () => {
    try {
      const searchPayload = { transporter_name: formData.razonSocial };
      const searchRes = await axios.post('http://localhost:3001/api/transporter/buscar', searchPayload);

      let transporterId;

      if (searchRes.data === 0) {
        const createPayload = {
          transporter_name: formData.razonSocial,
          authorization_semarnat: formData.autorizacionSemarnat,
          authorization_sct: formData.autorizacionSct,
          active: true
        };
        const createRes = await axios.post('http://localhost:3001/api/transporter', createPayload);
        transporterId = createRes.data.id ?? createRes.data.transporter_id ?? createRes.data;
        // No confirmation alert
      } else {
        transporterId = searchRes.data.transporter_id;
        // No confirmation alert
      }

      return transporterId;

    } catch (error) {
      alert('Error al agregar o buscar transportista');
      console.error(error);
      return null;
    }
  };

  const handleAddReceptor = async () => {
    try {
      const searchPayload = { name_reason: formData.razonSocialDestino };
      let searchRes;
      try {
        searchRes = await axios.post('http://localhost:3001/api/receptor/buscar', searchPayload);
      } catch (searchError) {
        alert('Error al buscar receptor. Intente de nuevo.');
        console.error('Error en búsqueda de receptor:', searchError);
        return null;
      }

      let receptorId;

      if (searchRes.data === 0) {
        const createPayload = {
          name_reason: formData.razonSocialDestino,
          auth: formData.autorizacionDestino,
          active: true
        };
        const createRes = await axios.post('http://localhost:3001/api/receptor', createPayload);
        receptorId = createRes.data.id ?? createRes.data.receptor_id ?? createRes.data;
        // No confirmation alert
      } else {
        receptorId = searchRes.data.receptor_id;
        // No confirmation alert
      }

      return receptorId;

    } catch (error) {
      alert('Error al agregar o buscar receptor');
      console.error(error);
      return null;
    }
  };

  const handleAddArea = async () => {
    try {
      const searchPayload = { area: formData.areaGeneracion };
      const searchRes = await axios.post('http://localhost:3001/api/area/buscar', searchPayload);

      let areaId;

      if (searchRes.data === 0) {
        const createPayload = {
          area: formData.areaGeneracion
        };
        const createRes = await axios.post('http://localhost:3001/api/area', createPayload);
        areaId = createRes.data.id ?? createRes.data.area_id ?? createRes.data;
        // No confirmation alert
      } else {
        areaId = searchRes.data.area_id;
        // No confirmation alert
      }

      return areaId;

    } catch (error) {
      alert('Error al agregar o buscar área');
      console.error(error);
      return null;
    }
  };

  const handleAddContainer = async () => {
    try {
      const searchPayload = { type: formData.tipoContenedor };
      const searchRes = await axios.post('http://localhost:3001/api/container/buscar', searchPayload);

      let containerId;

      if (searchRes.data === 0) {
        const createPayload = {
          type: formData.tipoContenedor
        };
        const createRes = await axios.post('http://localhost:3001/api/container', createPayload);
        containerId = createRes.data.id ?? createRes.data.container_id ?? createRes.data;
        // No confirmation alert
      } else {
        containerId = searchRes.data.container_id;
        // No confirmation alert
      }

      return containerId;

    } catch (error) {
      alert('Error al agregar o buscar contenedor');
      console.error(error);
      return null;
    }
  };

  const handleAddDangerousWaste = async () => {
    try {
      // Buscar o crear contenedor
      let containerId = await handleAddContainer();
      if (!containerId) throw new Error('No se pudo obtener el ID del contenedor');

      // Buscar o crear área
      let areaId = await handleAddArea();
      if (!areaId) throw new Error('No se pudo obtener el ID del área');

      const searchPayload = {
        name_spanish: formData.nombreResiduoEspanol,
        article: formData.articulo71,
        container_id: containerId,
        area_id: areaId,
      };
      const searchRes = await axios.post('http://localhost:3001/api/dangerous_waste/buscar', searchPayload);

      let dangerousWasteId;

      if (searchRes.data === 0) {
        const createPayload = {
          name_spanish: formData.nombreResiduoEspanol,
          name_english: formData.nombreResiduoIngles,
          article: formData.articulo71,
          container_id: containerId,
          area_id: areaId,
          field_c: etiquetasSeleccionadas.C,
          field_r: etiquetasSeleccionadas.R,
          field_e: etiquetasSeleccionadas.E,
          field_t: etiquetasSeleccionadas.T,
          field_te: etiquetasSeleccionadas.Te,
          field_th: etiquetasSeleccionadas.Th,
          field_tt: etiquetasSeleccionadas.Tt,
          field_i: etiquetasSeleccionadas.I,
          field_b: etiquetasSeleccionadas.B,
          field_m: etiquetasSeleccionadas.M
        };
        const createRes = await axios.post('http://localhost:3001/api/dangerous_waste', createPayload);
        dangerousWasteId = createRes.data.id ?? createRes.data.dw_id ?? createRes.data;
        // No confirmation alert
      } else {
        dangerousWasteId = searchRes.data.dw_id;
        // No confirmation alert
      }

      return dangerousWasteId;

    } catch (error) {
      alert('Error al agregar o buscar residuo peligroso');
      console.error(error);
      return null;
    }
  };

  // Utilidad para formatear fechas a 'YYYY-MM-DD'
  function formatDate(dateStr) {
    if (!dateStr) return null;
    // Si ya está en formato correcto, regresa igual
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Handler para agregar registro a la tabla registers
  const handleAddRegister = async () => {
    try {
      // Obtener IDs necesarios automáticamente
      const dwId = await handleAddDangerousWaste();
      if (!dwId) throw new Error('No se pudo obtener el ID del residuo peligroso');

      const transporterId = await handleAddTransporter();
      if (!transporterId) throw new Error('No se pudo obtener el ID del transportista');

      const receptorId = await handleAddReceptor();
      if (!receptorId) throw new Error('No se pudo obtener el ID del receptor');

      const payload = {
        waste_date: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
        responsible: formData.responsableTecnico,
        dw_id: dwId,
        transporter_id: transporterId,
        receptor_id: receptorId,
        quantity: parseFloat(formData.cantidadGenerada),
        date_in: formatDate(formData.fechaIngreso),
        date_out: formatDate(formData.fechaSalida)
      };

      const res = await axios.post('http://localhost:3001/api/register', payload);
      const registerId = res.data.id ?? res.data.register_id ?? res.data;
      alert('Registro agregado correctamente. Nuevo ID: ' + registerId);
      // Aquí puedes usar registerId como necesites
    } catch (error) {
      alert('Error al agregar registro');
      console.error(error);
    }
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
              if (opciones[nombre]) {
                setSugerencias(opciones[nombre]);
              } else {
                setSugerencias([]);
              }
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
          <button className="btn-modificar" onClick={irARevisarResiduos}>Mostrar Residuos</button>
          <button className="btn-registrar" onClick={irARegistroResiduo}>Registrar Residuo</button>
          <button className="btn-modificar" onClick={irATablero}>Regresar a Tablero</button>
        </nav>
      </header>

      <h1>Registro de Residuos</h1>

      <form className="formulario-residuo" onSubmit={handleSubmit}>
        <h2>Residuo</h2>
        
        {renderCampoAutocompletado('nombreResiduoEspanol', 'Nombre del Residuo (Español)', opciones.nombreResiduoEspanol)}
        {/* New field for English name */}
        {renderCampoAutocompletado('nombreResiduoIngles', 'Nombre del residuo (Inglés)', opciones.nombreResiduoIngles)}
        {renderCampoAutocompletado('tipoContenedor', 'Tipo de contenedor', opciones.tipoContenedor)}
        {renderCampo('cantidadGenerada', 'Cantidad generada (toneladas)', 'number')}
        {renderCampoAutocompletado('areaGeneracion', 'Área o proceso de generación', opciones.areaGeneracion)}
        {renderCampoFecha('fechaIngreso', 'Fecha de ingreso')}
        {renderCampoFecha('fechaSalida', 'Fecha de salida')}
        {renderCampoAutocompletado('articulo71', 'Artículo 71 fracción I inciso (e)', opciones.articulo71)}
        
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
        {renderCampoAutocompletado('razonSocial', 'Nombre, denominación o razón social', opciones.razonSocial)}
        {renderCampoDesplegable('autorizacionSemarnat', 'Número de autorización SEMARNAT', opciones.autorizacionSemarnat)}
        {renderCampoDesplegable('autorizacionSct', 'Número de autorización SCT', opciones.autorizacionSct)}
        
        <h2>Receptor/Destino</h2>
        {renderCampoAutocompletado('razonSocialDestino', 'Nombre, denominación o razón social', opciones.razonSocialDestino)}
        {renderCampoDesplegable('autorizacionDestino', 'Número de autorización destino', opciones.autorizacionDestino)}
        
        <h2>Responsable</h2>
        {renderCampoAutocompletado('responsableTecnico', 'Nombre del responsable técnico', opciones.responsableTecnico)}
        
        <div className="submit-container">
          <button 
            type="button" 
            className={`btn-registrar-form ${hayErrores() ? 'btn-disabled' : ''}`}
            onClick={handleAddRegister}
          >
            Registrar
          </button>
        </div>
      </form>

      <footer className="footer">
        <div className="site-name">
          Site name
          {submittedData && (
            <div className="submitted-entries">
              <h3>Entradas del formulario:</h3>
              <ul>
                {Object.entries(submittedData).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
                <li>
                  etiquetasSeleccionadas: {
                    Object.entries(etiquetasSeleccionadas)
                      .filter(([_, v]) => v)
                      .map(([k]) => k)
                      .join(', ') || 'Ninguna'
                  }
                </li>
              </ul>
            </div>
          )}
          </div>
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