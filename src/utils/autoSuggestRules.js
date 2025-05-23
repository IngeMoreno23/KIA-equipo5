export const autoSuggestRules = [
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[0] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[4] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1], opciones.razonSocial[4]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[6] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[8] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[4]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[9] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[2]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[11] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[13] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[16] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[20] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[21] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[22] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
  {
    field: "razonSocial",
    dependsOn: "nombreResiduoEspanol",
    condition: (nombreResiduoEspanol, opciones) => opciones.nombreResiduoEspanol[23] === nombreResiduoEspanol,
    getOptions: (opciones) => [opciones.razonSocial[0], opciones.razonSocial[1]]
  },
];

export function getFilteredOptions(field, formData, opciones) {
  const rule = autoSuggestRules.find(
    r => r.field === field && r.condition(formData[r.dependsOn], opciones)
  );
  if (rule) {
    return rule.getOptions(opciones);
  }
  return opciones[field] || [];
}