import axios from 'axios';

/**
 * Registro de usuario
 * @param {object} userData - { nombre, email, password, rol }
 * @returns {Promise<object>}
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/students/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error en el registro' };
  }
};

/**
 * Login de usuario
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>}
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:5000/api/students/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error en el login' };
  }
};

/**
 * Obtener todas las solicitudes
 * @returns {Promise<Array>}
 */
export const fetchSolicitudes = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/solicitudes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener solicitudes' };
  }
};

/**
 * Crear nueva solicitud
 * @param {object} solicitudData - { student_id, tipo, descripcion }
 * @returns {Promise<object>}
 */
export const createSolicitud = async (solicitudData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/solicitudes', solicitudData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al crear solicitud' };
  }
};

/**
 * Actualizar solicitud
 * @param {number} id - ID de la solicitud
 * @param {object} updateData - { estado, respuesta }
 * @returns {Promise<object>}
 */
export const updateSolicitud = async (id, updateData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/solicitudes/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al actualizar solicitud' };
  }
};
