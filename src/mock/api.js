// mock/api.js
let solicitudes = [];

/**
 * Valida que una solicitud tenga los campos mínimos requeridos
 */
const validarSolicitud = (solicitud) => {
  if (!solicitud || typeof solicitud !== 'object') {
    throw new Error('La solicitud debe ser un objeto');
  }

  const camposRequeridos = ['tipo', 'descripcion', 'usuario'];
  const camposFaltantes = camposRequeridos.filter(campo => !solicitud[campo]);

  if (camposFaltantes.length > 0) {
    throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`);
  }

  return true;
};

/**
 * Envía una nueva solicitud
 */
export const enviarSolicitud = (solicitud) => {
  try {
    validarSolicitud(solicitud);

    const nuevaSolicitud = {
      ...solicitud,
      id: Date.now(),
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      respuesta: null // Asegura que siempre exista este campo
    };

    solicitudes.push(nuevaSolicitud);
    return { success: true, data: nuevaSolicitud };
  } catch (error) {
    console.error('Error al enviar solicitud:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene todas las solicitudes con opción de filtrado
 */
export const getSolicitudes = (filtro = null) => {
  try {
    let resultado = [...solicitudes];
    
    if (filtro && typeof filtro === 'function') {
      resultado = resultado.filter(filtro);
    }

    return { success: true, data: resultado };
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return { success: false, error: 'Error al obtener solicitudes' };
  }
};

/**
 * Actualiza el estado de una solicitud
 */
export const actualizarEstado = (id, nuevoEstado) => {
  try {
    if (!id || !nuevoEstado) {
      throw new Error('ID y nuevo estado son requeridos');
    }

    const estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'resuelta'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado no válido. Use: ${estadosValidos.join(', ')}`);
    }

    const solicitudIndex = solicitudes.findIndex(sol => sol.id === id);
    if (solicitudIndex === -1) {
      throw new Error('Solicitud no encontrada');
    }

    solicitudes[solicitudIndex] = {
      ...solicitudes[solicitudIndex],
      estado: nuevoEstado
    };

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar estado:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Resuelve una solicitud con una respuesta
 */
export const resolverSolicitud = (id, respuesta) => {
  try {
    if (!id || !respuesta || typeof respuesta !== 'string') {
      throw new Error('ID y respuesta válida son requeridos');
    }

    const solicitudIndex = solicitudes.findIndex(sol => sol.id === id);
    if (solicitudIndex === -1) {
      throw new Error('Solicitud no encontrada');
    }

    solicitudes[solicitudIndex] = {
      ...solicitudes[solicitudIndex],
      respuesta,
      estado: 'resuelta',
      fechaResolucion: new Date().toISOString() // Nuevo campo para tracking
    };

    return { success: true, data: solicitudes[solicitudIndex] };
  } catch (error) {
    console.error('Error al resolver solicitud:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Limpia todas las solicitudes (útil para testing)
 */
export const limpiarSolicitudes = () => {
  solicitudes = [];
};

// Datos iniciales para desarrollo
if (process.env.NODE_ENV === 'development') {
  solicitudes = [
    {
      id: 1,
      tipo: 'Cambio de carrera',
      descripcion: 'Quiero cambiar a Ingeniería Informática',
      usuario: 'estudiante1@example.com',
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      respuesta: null
    },
    {
      id: 2,
      tipo: 'Inscripción de curso',
      descripcion: 'Necesito inscribir el curso de IA',
      usuario: 'estudiante2@example.com',
      estado: 'aprobada',
      fecha: new Date(Date.now() - 86400000).toISOString(), // Ayer
      respuesta: 'Solicitud aprobada. Ya estás inscrito.'
    }
  ];
}