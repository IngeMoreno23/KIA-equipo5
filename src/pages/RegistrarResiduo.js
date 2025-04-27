import React, { useState } from 'react';
import './RegistrarResiduo.css';

function RegistrarResiduo() {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a tu API
    console.log('Datos del residuo:', formData);
    
    // Opcional: Resetear el formulario después de enviar
    setFormData({
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
  };

  return (
    <div className="registro-container">
      <header>
        <div className="header-top">
          <h1>Gestión de Residuos - KIA</h1>
        </div>
      </header>

      <main>
        <section className="card">
          <h2>Registrar Residuo</h2>
          <form id="formulario-residuo" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tipoContenedor">Tipo de contenedor ❔</label>
                <input 
                  type="text" 
                  id="tipoContenedor" 
                  name="tipoContenedor" 
                  value={formData.tipoContenedor}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="cantidadGenerada">Cantidad generada (toneladas) ❔</label>
                <input 
                  type="number" 
                  id="cantidadGenerada" 
                  name="cantidadGenerada" 
                  step="0.01"
                  value={formData.cantidadGenerada}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="areaGeneracion">Área o proceso de generación ❔</label>
                <input 
                  type="text" 
                  id="areaGeneracion" 
                  name="areaGeneracion"
                  value={formData.areaGeneracion}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaIngreso">Fecha de ingreso ❔</label>
                <input 
                  type="date" 
                  id="fechaIngreso" 
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaSalida">Fecha de salida ❔</label>
                <input 
                  type="date" 
                  id="fechaSalida" 
                  name="fechaSalida"
                  value={formData.fechaSalida}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="articulo71">Artículo 71 fracción I inciso (e) ❔</label>
                <input 
                  type="text" 
                  id="articulo71" 
                  name="articulo71"
                  value={formData.articulo71}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="razonSocial">Nombre, denominación o razón social ❔</label>
                <input 
                  type="text" 
                  id="razonSocial" 
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="autorizacionSemarnat">Número de autorización SEMARNAT ❔</label>
                <input 
                  type="text" 
                  id="autorizacionSemarnat" 
                  name="autorizacionSemarnat"
                  value={formData.autorizacionSemarnat}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="autorizacionSct">Número de autorización SCT ❔</label>
                <input 
                  type="text" 
                  id="autorizacionSct" 
                  name="autorizacionSct"
                  value={formData.autorizacionSct}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="razonSocialDestino">Nombre, denominación o razón social (Destino) ❔</label>
                <input 
                  type="text" 
                  id="razonSocialDestino" 
                  name="razonSocialDestino"
                  value={formData.razonSocialDestino}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="autorizacionDestino">Número de autorización destino ❔</label>
                <input 
                  type="text" 
                  id="autorizacionDestino" 
                  name="autorizacionDestino"
                  value={formData.autorizacionDestino}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="responsableTecnico">Nombre del responsable técnico ❔</label>
                <input 
                  type="text" 
                  id="responsableTecnico" 
                  name="responsableTecnico"
                  value={formData.responsableTecnico}
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-submit">
                <button type="submit">Registrar Residuo</button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default RegistrarResiduo;