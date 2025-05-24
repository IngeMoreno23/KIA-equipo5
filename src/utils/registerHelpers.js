import axios from 'axios';
import { formatDate } from './formUtils';

export const handleAddTransporter = async (formData) => {
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
    } else {
      transporterId = searchRes.data.transporter_id;
    }

    return transporterId;

  } catch (error) {
    alert('Error al agregar o buscar transportista');
    console.error(error);
    return null;
  }
};

export const handleAddReceptor = async (formData) => {
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
    } else {
      receptorId = searchRes.data.receptor_id;
    }

    return receptorId;

  } catch (error) {
    alert('Error al agregar o buscar receptor');
    console.error(error);
    return null;
  }
};

export const handleAddArea = async (formData) => {
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
    } else {
      areaId = searchRes.data.area_id;
    }

    return areaId;

  } catch (error) {
    alert('Error al agregar o buscar área');
    console.error(error);
    return null;
  }
};

export const handleAddContainer = async (formData) => {
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
    } else {
      containerId = searchRes.data.container_id;
    }

    return containerId;

  } catch (error) {
    alert('Error al agregar o buscar contenedor');
    console.error(error);
    return null;
  }
};

export const handleAddDangerousWaste = async (formData, etiquetasSeleccionadas) => {
  try {
    // Buscar o crear contenedor
    let containerId = await handleAddContainer(formData);
    if (!containerId) throw new Error('No se pudo obtener el ID del contenedor');

    // Buscar o crear área
    let areaId = await handleAddArea(formData);
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
    } else {
      dangerousWasteId = searchRes.data.dw_id;
    }

    return dangerousWasteId;

  } catch (error) {
    alert('Error al agregar o buscar residuo peligroso');
    console.error(error);
    return null;
  }
};

export const handleAddRegister = async (formData, etiquetasSeleccionadas) => {
  try {
    // Obtener IDs necesarios automáticamente
    const dwId = await handleAddDangerousWaste(formData, etiquetasSeleccionadas);
    if (!dwId) throw new Error('No se pudo obtener el ID del residuo peligroso');

    const transporterId = await handleAddTransporter(formData);
    if (!transporterId) throw new Error('No se pudo obtener el ID del transportista');

    const receptorId = await handleAddReceptor(formData);
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
    const username = localStorage.getItem('username');
    await axios.post('http://localhost:3001/api/logs', { username, log_action: 'Register Created', register_id: registerId });
    alert('Registro agregado correctamente. Nuevo ID: ' + registerId);
    // Aquí puedes usar registerId como necesites
  } catch (error) {
    alert('Error al agregar registro');
    console.error(error);
  }
};