import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './RegistrarResiduo.css';
import { useNavigate } from 'react-router-dom';
import CampoAutocompletado from '../components/CampoAutocompletado';
import { applyAutoFillRules } from '../utils/autoFillRules';
import { getFilteredOptions } from '../utils/autoSuggestRules';
import {
  handleAddRegister
} from '../utils/registerHelpers';
import RutaPrivada from '../components/RutaPrivada'; // <-- Importa RutaPrivada

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

  // Opciones para los campos desplegables (inicialmente vacías)
  const [opciones, setOpciones] = useState({
    nombreResiduoEspanol: [],
    nombreResiduoIngles: [],
    tipoContenedor: [],
    areaGeneracion: [],
    articulo71: [],
    razonSocial: [],
    autorizacionSemarnat: [],
    autorizacionSct: [],
    razonSocialDestino: [],
    autorizacionDestino: [],
    responsableTecnico: []
  });

  // Lista de categorías a cargar
  const categoriasOpciones = useMemo(() => [
    'nombreResiduoEspanol',
    'nombreResiduoIngles',
    'tipoContenedor',
    'areaGeneracion',
    'articulo71',
    'razonSocial',
    'autorizacionSemarnat',
    'autorizacionSct',
    'razonSocialDestino',
    'autorizacionDestino',
    'responsableTecnico'
  ], []);

  // Cargar opciones dinámicamente al montar el componente
  useEffect(() => {
    const fetchOpciones = async () => {
      const nuevasOpciones = {};
      for (const categoria of categoriasOpciones) {
        try {
          const response = await fetch(`http://localhost:3001/api/opciones/tipo/${categoria}`);
          if (response.ok) {
            const data = await response.json();
            const valoresOrdenados = data
              .sort((a, b) => a.orden - b.orden)
              .map(item => item.valor);
            nuevasOpciones[categoria] = valoresOrdenados;
          } else {
            nuevasOpciones[categoria] = [];
          }
        } catch (error) {
          nuevasOpciones[categoria] = [];
        }
      }
      setOpciones(nuevasOpciones);
    };

    fetchOpciones();
  }, [categoriasOpciones]); // Ahora la referencia es estable

  // Definir campos requeridos
  
  const camposRequeridos = useMemo(() => [
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
  ], []);

  // Estado para sugerencias de autocompletado
  const [sugerencias, setSugerencias] = useState([]);
  const [campoActivo, setCampoActivo] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  // Estado para controlar los dropdowns abiertos
  const [dropdownAbierto, setDropdownAbierto] = useState('');
  
  // Referencias para campos desplegables
  const dropdownRefs = useRef({});

  // Validar formulario (usando useCallback para evitar warning en useEffect)
  const validarFormulario = useCallback(() => {
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
  }, [formData, camposRequeridos, setCamposInvalidos]);
  
  // Verificar si hay al menos un campo inválido
  const hayErrores = () => {
    return Object.keys(camposInvalidos).length > 0;
  };

  // Manejador de cambios para todos los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si se selecciona un nombre en español, autoseleccionar el inglés correspondiente
    if (name === "nombreResiduoEspanol") {
      const index = opciones.nombreResiduoEspanol.findIndex(
        (opcion) => opcion === value
      );
      setFormData((prev) => {
        let next = {
          ...prev,
          [name]: value,
          nombreResiduoIngles: index !== -1 ? opciones.nombreResiduoIngles[index] : "",
        };
        next = applyAutoFillRules(name, value, next, opciones);
        return next;
      });
      setFormularioTocado(true);
      if (camposInvalidos[name] && value.trim() !== "") {
        const nuevosErrores = { ...camposInvalidos };
        delete nuevosErrores[name];
        setCamposInvalidos(nuevosErrores);
      }
      if (opciones[name]) {
        const filtradas = opciones[name].filter(
          (opcion) => opcion.toLowerCase().includes(value.toLowerCase())
        );
        setSugerencias(filtradas);
        setCampoActivo(name);
        setMostrarSugerencias(true);
      }
      return;
    }

    // Si se selecciona razonSocial, autocompletar autorizacionSemarnat
    if (name === "razonSocial") {
      setFormData((prev) => {
        let next = {
          ...prev,
          [name]: value,
        };
        next = applyAutoFillRules(name, value, next, opciones);
        return next;
      });
      setFormularioTocado(true);
      if (camposInvalidos[name] && value.trim() !== "") {
        const nuevosErrores = { ...camposInvalidos };
        delete nuevosErrores[name];
        setCamposInvalidos(nuevosErrores);
      }
      if (opciones[name]) {
        const filtradas = opciones[name].filter(
          (opcion) => opcion.toLowerCase().includes(value.toLowerCase())
        );
        setSugerencias(filtradas);
        setCampoActivo(name);
        setMostrarSugerencias(true);
      }
      return;
    }

    // Actualizar el formulario
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormularioTocado(true);
    if (camposInvalidos[name] && value.trim() !== "") {
      const nuevosErrores = { ...camposInvalidos };
      delete nuevosErrores[name];
      setCamposInvalidos(nuevosErrores);
    }
    if (opciones[name]) {
      const filtradas = opciones[name].filter(
        (opcion) => opcion.toLowerCase().includes(value.toLowerCase())
      );
      setSugerencias(filtradas);
      setCampoActivo(name);
      setMostrarSugerencias(true);
    }
  };

  // Seleccionar una sugerencia
  const seleccionarSugerencia = (sugerencia) => {
    // Si se selecciona un nombre en español, autoseleccionar el inglés correspondiente
    if (campoActivo === "nombreResiduoEspanol") {
      const index = opciones.nombreResiduoEspanol.findIndex(
        (opcion) => opcion === sugerencia
      );
      setFormData((prev) => {
        let next = {
          ...prev,
          [campoActivo]: sugerencia,
          nombreResiduoIngles: index !== -1 ? opciones.nombreResiduoIngles[index] : "",
        };
        next = applyAutoFillRules(campoActivo, sugerencia, next, opciones);
        return next;
      });
      if (camposInvalidos[campoActivo]) {
        const nuevosErrores = { ...camposInvalidos };
        delete nuevosErrores[campoActivo];
        setCamposInvalidos(nuevosErrores);
      }
      setMostrarSugerencias(false);
      setFormularioTocado(true);
      return;
    }

    // Si se selecciona razonSocial, autocompletar autorizacionSemarnat
    if (campoActivo === "razonSocial") {
      setFormData((prev) => {
        let next = {
          ...prev,
          [campoActivo]: sugerencia,
        };
        next = applyAutoFillRules(campoActivo, sugerencia, next, opciones);
        return next;
      });
      if (camposInvalidos[campoActivo]) {
        const nuevosErrores = { ...camposInvalidos };
        delete nuevosErrores[campoActivo];
        setCamposInvalidos(nuevosErrores);
      }
      setMostrarSugerencias(false);
      setFormularioTocado(true);
      return;
    }

    setFormData({
      ...formData,
      [campoActivo]: sugerencia,
    });
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
  }, [formData, formularioTocado, validarFormulario]);

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

  // Renderizar campo con autocompletado
  const renderCampoAutocompletado = (nombre, label, opcionesCampo) => {
    const esRequerido = camposRequeridos.includes(nombre);
    const esInvalido = camposInvalidos[nombre];

    // Use filtered options if a rule applies
    const opcionesFiltradas = getFilteredOptions(nombre, formData, opciones);

    return (
      <CampoAutocompletado
        nombre={nombre}
        label={label}
        opcionesCampo={opcionesCampo}
        esRequerido={esRequerido}
        esInvalido={esInvalido}
        value={formData[nombre]}
        onChange={handleChange}
        onFocus={() => {
          setCampoActivo(nombre);
          if (opcionesFiltradas.length > 0) {
            setSugerencias(opcionesFiltradas);
          } else if (opcionesCampo) {
            setSugerencias(opcionesCampo);
          } else {
            setSugerencias([]);
          }
          setMostrarSugerencias(true);
        }}
        sugerencias={sugerencias}
        mostrarSugerencias={mostrarSugerencias}
        campoActivo={campoActivo}
        seleccionarSugerencia={seleccionarSugerencia}
      />
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
        {renderCampoDesplegable(
          'autorizacionSct',
          'Número de autorización SCT',
          getFilteredOptions('autorizacionSct', formData, opciones)
        )}
        
        <h2>Receptor/Destino</h2>
        {renderCampoAutocompletado('razonSocialDestino', 'Nombre, denominación o razón social', opciones.razonSocialDestino)}
        {renderCampoDesplegable('autorizacionDestino', 'Número de autorización destino', opciones.autorizacionDestino)}
        
        <h2>Responsable</h2>
        {renderCampoAutocompletado('responsableTecnico', 'Nombre del responsable técnico', opciones.responsableTecnico)}
        
        <div className="submit-container">
          <button 
            type="button" 
            className={`btn-registrar-form ${hayErrores() ? 'btn-disabled' : ''}`}
            onClick={() => handleAddRegister(formData, etiquetasSeleccionadas)}
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

export default function RegistrarResiduo() {
  return (
    <RutaPrivada>
      <RegistroResiduo />
    </RutaPrivada>
  );
}