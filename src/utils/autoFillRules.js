export const autoFillRules = [
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[1] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[2] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[3] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[4]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[5] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[7] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[10] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[4]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[12] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[14] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[3]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[15] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[3]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[17] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[4]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[18] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[19] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "nombreResiduoEspanol",
    condition: (value, opciones) => opciones.nombreResiduoEspanol[24] === value,
    apply: (prev, opciones) => ({
      ...prev,
      razonSocial: opciones.razonSocial[0]
    })
  },
  {
    field: "razonSocial",
    condition: (value, opciones) => {
      const idx = opciones.razonSocial.indexOf(value);
      return idx !== -1 && opciones.autorizacionSemarnat[idx] !== undefined;
    },
    apply: (prev, opciones) => {
      const idx = opciones.razonSocial.indexOf(prev.razonSocial);
      return {
        ...prev,
        autorizacionSemarnat: opciones.autorizacionSemarnat[idx] || ""
      };
    }
  }
];

export function applyAutoFillRules(field, value, prev, opciones) {
  let updated = { ...prev };
  autoFillRules.forEach(rule => {
    if (rule.field === field && rule.condition(value, opciones)) {
      updated = rule.apply(updated, opciones);
    }
  });
  return updated;
}