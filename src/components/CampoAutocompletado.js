import React from "react";

export default function CampoAutocompletado({
  nombre, label, opcionesCampo, esRequerido, esInvalido,
  value, onChange, onFocus, sugerencias, mostrarSugerencias, campoActivo, seleccionarSugerencia
}) {
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
          value={value}
          onChange={onChange}
          className={esInvalido ? 'input-invalid' : ''}
          onFocus={onFocus}
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
}