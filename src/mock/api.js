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
 * Genera un número de radicado único para una solicitud
 * Formato: PQRSF-AÑO-MES-SECUENCIAL (ej. PQRSF-2025-05-00001)
 */
const generarNumeroRadicado = () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  
  // Obtener el último secuencial usado
  let ultimoSecuencial = 0;
  try {
    const ultimoRadicado = localStorage.getItem('ultimoRadicado') || '0';
    ultimoSecuencial = parseInt(ultimoRadicado, 10);
  } catch (error) {
    console.warn('Error al obtener el último número de radicado:', error);
  }
  
  // Incrementar el secuencial
  const nuevoSecuencial = ultimoSecuencial + 1;
  
  // Guardar el nuevo secuencial
  try {
    localStorage.setItem('ultimoRadicado', nuevoSecuencial.toString());
  } catch (error) {
    console.warn('Error al guardar el nuevo número de radicado:', error);
  }
  
  // Formatear el secuencial con ceros a la izquierda (5 dígitos)
  const secuencialFormateado = String(nuevoSecuencial).padStart(5, '0');
  
  // Crear el número de radicado completo
  return `PQRSF-${año}-${mes}-${secuencialFormateado}`;
};

/**
 * Envía una nueva solicitud
 */
export const enviarSolicitud = async (solicitud) => {
  try {
    validarSolicitud(solicitud);

    // Procesar archivos adjuntos si existen
    const archivosAdjuntos = solicitud.archivosAdjuntos || [];
    
    // Generar número de radicado único
    const numeroRadicado = generarNumeroRadicado();
    
    // Determinar si es una PQRSF basado en la categoría o tipo
    const esPQRSF = solicitud.esPQRSF || 
                   solicitud.categoria === 'PQRSF' || 
                   (solicitud.tipo && ['peticion', 'petición', 'queja', 'reclamo', 'sugerencia', 'felicitacion', 'felicitación'].includes(solicitud.tipo.toLowerCase()));
    
    const nuevaSolicitud = {
      ...solicitud,
      id: Date.now(),
      numeroRadicado,
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      respuesta: null, // Asegura que siempre exista este campo
      archivosAdjuntos: archivosAdjuntos, // Incluir archivos adjuntos en la solicitud
      tieneAdjuntos: archivosAdjuntos.length > 0, // Flag para indicar si tiene adjuntos
      esPQRSF: esPQRSF, // Marcar explícitamente como PQRSF si corresponde
      categoria: esPQRSF && !solicitud.categoria ? 'PQRSF' : solicitud.categoria, // Asegurar que tenga categoría PQRSF si corresponde
      historial: [
        {
          estado: 'pendiente',
          fecha: new Date().toISOString(),
          comentario: 'Solicitud radicada'
        }
      ], // Historial de estados para trazabilidad (nuevo formato)
      historialEstados: [
        {
          estado: 'pendiente',
          fecha: new Date().toISOString(),
          comentario: 'Solicitud radicada'
        }
      ] // Mantener compatibilidad con el formato anterior
    };

    solicitudes.push(nuevaSolicitud);
    
    // Guardar en localStorage
    try {
      const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      solicitudesGuardadas.push(nuevaSolicitud);
      localStorage.setItem('solicitudes', JSON.stringify(solicitudesGuardadas));
      
      console.log('Solicitud guardada en localStorage correctamente:', nuevaSolicitud);
      
      // Emitir evento personalizado para notificar a otros componentes
      const syncEvent = new CustomEvent('solicitudesUpdated', { 
        detail: { 
          action: 'create', 
          solicitud: nuevaSolicitud 
        } 
      });
      window.dispatchEvent(syncEvent);
      console.log('Evento de sincronización emitido:', syncEvent);
    } catch (storageError) {
      console.error('Error al guardar en localStorage:', storageError);
    }
    
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
    // Intentar obtener solicitudes del localStorage para asegurar sincronización
    let todasSolicitudes = [...solicitudes];
    try {
      const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      if (solicitudesGuardadas.length > 0) {
        // Combinar solicitudes locales con las del estado
        const idsExistentes = new Set(todasSolicitudes.map(s => s.id));
        for (const sol of solicitudesGuardadas) {
          if (!idsExistentes.has(sol.id)) {
            todasSolicitudes.push(sol);
          }
        }
      }
    } catch (storageError) {
      console.warn('Error al sincronizar con localStorage:', storageError);
    }
    
    let resultado = todasSolicitudes;
    
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
 * Obtiene las solicitudes de un usuario específico
 */
export const getSolicitudesByUsuario = async (email) => {
  try {
    if (!email) {
      throw new Error('Email de usuario requerido');
    }
    
    // Obtener todas las solicitudes locales (incluidas las del localStorage)
    const { success, data, error } = getSolicitudes();
    if (!success) {
      throw new Error(error);
    }
    
    // Filtrar por el email del usuario
    let solicitudesUsuario = data.filter(sol => sol.email === email || sol.usuario === email);
    
    // Intentar obtener solicitudes del servidor
    try {
      // Obtener el ID del usuario del localStorage
      const usuarioActual = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const student_id = usuarioActual.id;
      
      if (student_id) {
        // Hacer la petición al servidor
        const response = await fetch(`http://localhost:5000/api/solicitudes?student_id=${student_id}`);
        
        if (response.ok) {
          const solicitudesServidor = await response.json();
          
          // Convertir las solicitudes del servidor al formato esperado por el frontend
          const solicitudesFormateadas = solicitudesServidor.map(sol => {
            // Intentar parsear los campos JSON
            let archivosAdjuntos = [];
            let historialEstados = [];
            let tieneAdjuntos = sol.tiene_adjuntos === 1;
            
            try {
              if (sol.archivos_adjuntos) {
                archivosAdjuntos = JSON.parse(sol.archivos_adjuntos);
              }
            } catch (e) {
              console.warn('Error al parsear archivos adjuntos:', e);
            }
            
            try {
              if (sol.historial_estados) {
                historialEstados = JSON.parse(sol.historial_estados);
              }
            } catch (e) {
              console.warn('Error al parsear historial de estados:', e);
            }
            
            return {
              id: sol.id,
              tipo: sol.tipo,
              descripcion: sol.descripcion,
              estado: sol.estado,
              fecha: sol.fecha,
              respuesta: sol.respuesta,
              email: email, // Asignamos el email del usuario actual
              usuario: usuarioActual.nombre || 'Usuario',
              numeroRadicado: sol.numero_radicado,
              categoria: sol.categoria,
              archivosAdjuntos: archivosAdjuntos,
              tieneAdjuntos: tieneAdjuntos,
              historialEstados: historialEstados,
              fechaResolucion: sol.fecha_resolucion
            };
          });
          
          // Combinar con las solicitudes ya obtenidas, evitando duplicados
          const idsExistentes = new Set(solicitudesUsuario.map(sol => sol.id));
          for (const sol of solicitudesFormateadas) {
            if (!idsExistentes.has(sol.id)) {
              solicitudesUsuario.push(sol);
              idsExistentes.add(sol.id);
            }
          }
          
          // Actualizar el localStorage con las solicitudes del servidor para mantener sincronización
          try {
            const todasSolicitudes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
            
            // Agregar o actualizar las solicitudes del servidor en el localStorage
            for (const sol of solicitudesFormateadas) {
              const index = todasSolicitudes.findIndex(s => s.id === sol.id);
              if (index >= 0) {
                todasSolicitudes[index] = sol;
              } else {
                todasSolicitudes.push(sol);
              }
            }
            
            localStorage.setItem('solicitudes', JSON.stringify(todasSolicitudes));
          } catch (e) {
            console.warn('Error al actualizar localStorage con solicitudes del servidor:', e);
          }
        }
      }
    } catch (serverError) {
      console.warn('Error al obtener solicitudes del servidor:', serverError);
      // No interrumpimos el flujo si falla la consulta al servidor
    }
    
    // Ordenar las solicitudes por fecha, las más recientes primero
    solicitudesUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    return { 
      success: true, 
      data: solicitudesUsuario
    };
  } catch (error) {
    console.error('Error al obtener solicitudes del usuario:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualiza el estado de una solicitud
 */
export const actualizarEstado = async (id, nuevoEstado, comentario = '') => {
  try {
    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'resuelta', 'en revisión'];
    if (!estadosValidos.includes(nuevoEstado.toLowerCase())) {
      throw new Error(`Estado inválido: ${nuevoEstado}. Los estados válidos son: ${estadosValidos.join(', ')}`);
    }
    
    // Buscar la solicitud por ID
    const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    const index = solicitudesGuardadas.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`No se encontró la solicitud con ID: ${id}`);
    }
    
    const solicitud = solicitudesGuardadas[index];
    const estadoAnterior = solicitud.estado;
    
    // Actualizar el estado
    solicitud.estado = nuevoEstado.toLowerCase();
    
    // Añadir entrada al historial de estados
    if (!solicitud.historialEstados) {
      solicitud.historialEstados = [];
    }
    
    // Si el historial está en formato string (JSON), convertirlo a array
    if (typeof solicitud.historialEstados === 'string') {
      try {
        solicitud.historialEstados = JSON.parse(solicitud.historialEstados);
      } catch (e) {
        solicitud.historialEstados = [];
      }
    }
    
    // Añadir nueva entrada al historial
    solicitud.historialEstados.push({
      estado: nuevoEstado.toLowerCase(),
      fecha: new Date().toISOString(),
      comentario: comentario || `Estado cambiado de ${estadoAnterior} a ${nuevoEstado.toLowerCase()}`
    });
    
    // Si el estado es 'resuelta', establecer fecha de resolución
    if (nuevoEstado.toLowerCase() === 'resuelta' && !solicitud.fechaResolucion) {
      solicitud.fechaResolucion = new Date().toISOString();
    }
    
    // Actualizar en localStorage
    solicitudesGuardadas[index] = solicitud;
    localStorage.setItem('solicitudes', JSON.stringify(solicitudesGuardadas));
    
    // Emitir evento de sincronización para notificar a otros componentes
    const syncEvent = new CustomEvent('solicitudesUpdated', { 
      detail: { 
        action: 'update', 
        solicitud: solicitud 
      } 
    });
    window.dispatchEvent(syncEvent);
    console.log('Evento de sincronización emitido para actualización de estado:', syncEvent);
    
    // Si el cambio de estado es a 'resuelta' o similar, crear notificación para el usuario
    if (['resuelta', 'aprobada', 'rechazada'].includes(nuevoEstado.toLowerCase())) {
      try {
        // Crear notificación
        const notificacion = {
          id: Date.now(),
          usuario: solicitud.email,
          titulo: `Solicitud ${nuevoEstado.toLowerCase()}`,
          mensaje: `Su solicitud ${solicitud.tipo} ha sido ${nuevoEstado.toLowerCase()}. ${comentario || ''}`,
          fecha: new Date().toISOString(),
          leida: false,
          solicitudId: id
        };
        
        // Guardar notificación en localStorage
        const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
        notificaciones.push(notificacion);
        localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
        
        console.log('Notificación creada:', notificacion);
        
        // Emitir evento de notificación
        const notifEvent = new CustomEvent('notificacionesUpdated', { 
          detail: { 
            action: 'create', 
            notificacion: notificacion 
          } 
        });
        window.dispatchEvent(notifEvent);
        console.log('Evento de notificación emitido:', notifEvent);
      } catch (notifError) {
        console.warn('Error al crear notificación:', notifError);
      }
    }
    
    return { success: true, data: solicitud };
  } catch (error) {
    console.error('Error al actualizar estado:', error.message);
  }
};

/**
 * Responde a una solicitud
 */
export const responderSolicitud = async (id, respuesta, comentario = '') => {
  try {
    if (!id || !respuesta) {
      throw new Error('ID y respuesta son requeridos');
    }

    // Obtener solicitudes actuales
    const solicitudesActuales = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    
    // Buscar la solicitud por ID
    const solicitudIndex = solicitudesActuales.findIndex(sol => sol.id === id);
    
    if (solicitudIndex === -1) {
      throw new Error(`No se encontró la solicitud con ID: ${id}`);
    }
    
    // Obtener la solicitud actual
    const solicitudActual = solicitudesActuales[solicitudIndex];
    
    // Crear nuevo registro en el historial de estados
    const fechaActual = new Date().toISOString();
    const nuevoRegistroHistorial = {
      estado: 'resuelta',
      fecha: fechaActual,
      comentario: comentario || 'Solicitud respondida'
    };

    // Procesar historial de estados
    if (!solicitudActual.historial) {
      solicitudActual.historial = [];
    }
    
    // Actualizar la solicitud
    solicitudActual.estado = 'resuelta';
    solicitudActual.respuesta = respuesta;
    solicitudActual.fechaResolucion = fechaActual;
    solicitudActual.historial.push(nuevoRegistroHistorial);

    // Actualizar el array de solicitudes
    solicitudesActuales[solicitudIndex] = solicitudActual;
    
    // Guardar en localStorage
    localStorage.setItem('solicitudes', JSON.stringify(solicitudesActuales));
    
    // Emitir evento de sincronización para notificar a otros componentes
    const syncEvent = new CustomEvent('solicitudesUpdated', { 
      detail: { 
        action: 'update', 
        solicitud: solicitudActual 
      } 
    });
    window.dispatchEvent(syncEvent);
    console.log('Evento de sincronización emitido para respuesta de solicitud:', syncEvent);
    
    // Crear notificación para el usuario
    try {
      // Crear notificación con información detallada
      const notificacion = {
        id: Date.now(),
        usuario: solicitudActual.email,
        titulo: `Respuesta a su ${solicitudActual.tipo || 'solicitud'} - ${solicitudActual.numeroRadicado || 'Sin radicado'}`,
        mensaje: `Su ${solicitudActual.tipo || 'solicitud'} con número de radicado ${solicitudActual.numeroRadicado || 'Sin radicado'} ha sido respondida. Respuesta: ${respuesta.substring(0, 50)}${respuesta.length > 50 ? '...' : ''}`,
        fecha: fechaActual,
        leida: false,
        solicitudId: id,
        numeroRadicado: solicitudActual.numeroRadicado || 'Sin radicado'
      };
      
      // Guardar notificación en localStorage usando la clave específica del usuario
      const notificacionesKey = `notifications_${solicitudActual.email}`;
      const notificacionesUsuario = JSON.parse(localStorage.getItem(notificacionesKey) || '[]');
      notificacionesUsuario.unshift(notificacion); // Agregar al inicio para que aparezca primero
      localStorage.setItem(notificacionesKey, JSON.stringify(notificacionesUsuario));
      
      console.log('Notificación creada:', notificacion);
      
      // Emitir evento de notificación
      const notifEvent = new CustomEvent('notificacionesUpdated', {
        detail: {
          action: 'create',
          notificacion
        }
      });
      window.dispatchEvent(notifEvent);
    } catch (notifError) {
      console.warn('Error al crear notificación:', notifError);
    }
    
    return { 
      success: true, 
      solicitud: solicitudActual
    };
  } catch (error) {
    console.error('Error al responder solicitud:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Limpia todas las solicitudes (útil para testing)
 */
export const limpiarSolicitudes = () => {
  localStorage.removeItem('solicitudes');
  // Emitir evento de sincronización
  const syncEvent = new CustomEvent('solicitudesUpdated', { 
    detail: { 
      action: 'clear'
    } 
  });
  window.dispatchEvent(syncEvent);
  console.log('Todas las solicitudes han sido eliminadas');
};