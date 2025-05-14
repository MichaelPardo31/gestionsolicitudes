import axios from 'axios';
import { UDEM_INFO } from '../mock/udemData';

// Datos locales de respaldo
const LOCAL_DATA = UDEM_INFO;

/**
 * Busca información en la base de datos local
 * @param {string} query - Término de búsqueda
 * @returns {Promise<{source: string, results: Array}>}
 */
export const searchUdemInfo = async (query) => {
  try {
    // Siempre usar búsqueda local
    const localResult = searchLocalData(query, LOCAL_DATA);
    if (localResult) {
      return {
        success: true,
        source: 'Base de datos local',
        results: localResult.results
      };
    }
    
    return {
      success: false,
      error: 'No se encontró información para tu consulta',
      results: []
    };
    
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return {
      success: false,
      error: 'Error al procesar la búsqueda',
      results: []
    };
  }
};

/**
 * Búsqueda local en los datos mock
 * @param {string} query 
 * @param {object} localData 
 * @returns {object|null}
 */
export const searchLocalData = (query, localData) => {
  const queryLower = query.toLowerCase();
  const results = [];
  
  // Función auxiliar para buscar coincidencias parciales
  const hasMatch = (text, keywords) => {
    if (!text) return false;
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  // Función para formatear respuestas de manera más organizada
  const formatResponse = (titulo, contenido, tipo) => {
    return {
      titulo,
      contenido: contenido.split('\n').filter(line => line.trim()).join('\n'),
      tipo,
      relevancia: 1 // Para ordenar resultados por relevancia
    };
  };

  
  // Palabras clave más específicas para cada categoría
  const keywords = {
    programas: {
      general: ['programa', 'carrera', 'estudiar', 'pregrado', 'facultad'],
      especifico: ['ingeniería', 'derecho', 'administración'],
      costos: ['costo', 'precio', 'valor', 'matrícula', 'semestre']
    },
    fechas: {
      inscripcion: ['inscripción', 'inscribir', 'inscripciones', 'cuándo inscribir', 'fecha inscripción'],
      matricula: ['matrícula', 'matricular', 'matrículas', 'cuándo matricular', 'fecha matrícula'],
      clases: ['clases', 'inicio', 'fin', 'cuándo empiezan', 'cuándo terminan'],
      periodo: ['periodo', 'semestre', 'cuándo es el periodo']
    },
    becas: {
      general: ['beca', 'becas', 'financiación', 'financiacion', 'ayuda económica', 'ayuda economica'],
      merito: ['mérito', 'merito', 'excelencia', 'icfes'],
      deportiva: ['deportiva', 'deporte', 'deportes'],
      cultural: ['cultural', 'arte', 'artística', 'artistica'],
      socioeconomica: ['socioeconómica', 'socioeconomica', 'económica', 'economica']
    },
    contactos: {
      general: ['contacto', 'teléfono', 'email'],
      ubicacion: ['dirección', 'ubicación'],
      horario: ['horario', 'atención']
    },
    faq: {
      requisitos: ['requisito', 'necesito'],
      becas: ['beca', 'financiación'],
      servicios: ['biblioteca', 'virtual', 'servicio'],
      pagos: ['pago', 'cuánto', 'precio', 'valor']
    },
    campus: {
      instalaciones: ['campus', 'instalación'],
      servicios: ['cafetería', 'gimnasio', 'parqueadero'],
      academicos: ['biblioteca', 'laboratorio', 'auditorio']
    },
    admisiones: {
      general: ['admisión', 'admisión', 'requisitos', 'ingresar', 'entrar', 'inscribir'],
      pregrado: ['pregrado', 'carrera', 'estudiar'],
      posgrado: ['posgrado', 'maestría', 'maestria', 'doctorado', 'especialización', 'especializacion'],
      icfes: ['icfes', 'prueba', 'examen', 'puntaje']
    },
    tramites: {
      certificados: ['certificado', 'constancia'],
      carnet: ['carnet', 'identificación'],
      pqrsf: ['pqrsf', 'sugerencia', 'reclamo', 'petición'],
      horario: ['horario', 'cambio']
    }
  };

  // Búsqueda en programas
  if (hasMatch(queryLower, keywords.programas.general)) {
    if (hasMatch(queryLower, keywords.programas.especifico)) {
      // Búsqueda específica de programa
      const programaEspecifico = localData.programas.pregrados.lista.find(p => 
        p.nombre.toLowerCase().includes(queryLower)
      );
      if (programaEspecifico) {
        results.push(formatResponse(
          `Programa: ${programaEspecifico.nombre}`,
          `Facultad: ${programaEspecifico.facultad}
Duración: ${programaEspecifico.duracion}
Modalidad: ${programaEspecifico.modalidad}
${programaEspecifico.enfasis ? `Énfasis: ${programaEspecifico.enfasis.join(', ')}` : ''}
${programaEspecifico.perfilEgresado ? `Perfil: ${programaEspecifico.perfilEgresado}` : ''}
${programaEspecifico.campoLaboral ? `Campo Laboral: ${programaEspecifico.campoLaboral.join(', ')}` : ''}`,
          'programa'
        ));
      }
    } else if (hasMatch(queryLower, ['especializacion', 'especialización'])) {
      results.push(formatResponse(
        'Programas de Especialización',
        `${localData.programas.especializaciones.descripcion}\n\nProgramas disponibles:\n${localData.programas.especializaciones.lista.map(p => `- ${p}`).join('\n')}`,
        'programa'
      ));
    } else if (hasMatch(queryLower, ['maestria', 'maestría'])) {
      results.push(formatResponse(
        'Programas de Maestría',
        `${localData.programas.maestrias.descripcion}\n\nProgramas disponibles:\n${localData.programas.maestrias.lista.map(p => `- ${p}`).join('\n')}`,
        'programa'
      ));
    } else if (hasMatch(queryLower, ['doctorado'])) {
      results.push(formatResponse(
        'Programas de Doctorado',
        `${localData.programas.doctorados.descripcion}\n\nProgramas disponibles:\n${localData.programas.doctorados.lista.map(p => `- ${p}`).join('\n')}`,
        'programa'
      ));
    } else {
      // Lista general de programas de pregrado
      results.push(formatResponse(
        'Programas de Pregrado',
        `${localData.programas.pregrados.descripcion}\n\nProgramas disponibles:\n${localData.programas.pregrados.lista.map(p => `- ${p.nombre} (${p.facultad})`).join('\n')}`,
        'programa'
      ));
    }
  }

  // Búsqueda en becas
  if (hasMatch(queryLower, keywords.becas.general)) {
    if (hasMatch(queryLower, keywords.becas.merito)) {
      results.push(formatResponse(
        'Beca por Mérito Académico',
        `${localData.becas.merito.descripcion}\n\n` +
        `Porcentaje de cobertura: ${localData.becas.merito.porcentaje}\n\n` +
        `Requisitos:\n${localData.becas.merito.requisitos.map(r => `- ${r}`).join('\n')}\n\n` +
        `Duración: ${localData.becas.merito.duracion}\n` +
        `Renovación: ${localData.becas.merito.renovacion}`,
        'beca'
      ));
    } else if (hasMatch(queryLower, keywords.becas.deportiva)) {
      results.push(formatResponse(
        'Beca Deportiva',
        `${localData.becas.deportiva.descripcion}\n\n` +
        `Porcentaje de cobertura: ${localData.becas.deportiva.porcentaje}\n\n` +
        `Requisitos:\n${localData.becas.deportiva.requisitos.map(r => `- ${r}`).join('\n')}\n\n` +
        `Duración: ${localData.becas.deportiva.duracion}\n` +
        `Renovación: ${localData.becas.deportiva.renovacion}`,
        'beca'
      ));
    } else if (hasMatch(queryLower, keywords.becas.cultural)) {
      results.push(formatResponse(
        'Beca Cultural',
        `${localData.becas.cultural.descripcion}\n\n` +
        `Porcentaje de cobertura: ${localData.becas.cultural.porcentaje}\n\n` +
        `Requisitos:\n${localData.becas.cultural.requisitos.map(r => `- ${r}`).join('\n')}\n\n` +
        `Duración: ${localData.becas.cultural.duracion}\n` +
        `Renovación: ${localData.becas.cultural.renovacion}`,
        'beca'
      ));
    } else if (hasMatch(queryLower, keywords.becas.socioeconomica)) {
      results.push(formatResponse(
        'Beca Socioeconómica',
        `${localData.becas.socioeconomica.descripcion}\n\n` +
        `Porcentaje de cobertura: ${localData.becas.socioeconomica.porcentaje}\n\n` +
        `Requisitos:\n${localData.becas.socioeconomica.requisitos.map(r => `- ${r}`).join('\n')}\n\n` +
        `Duración: ${localData.becas.socioeconomica.duracion}\n` +
        `Renovación: ${localData.becas.socioeconomica.renovacion}`,
        'beca'
      ));
    } else {
      // Información general de becas
      results.push(formatResponse(
        'Programa de Becas',
        `La Universidad de Medellín ofrece diferentes tipos de becas:\n\n` +
        `1. Beca por Mérito Académico (${localData.becas.merito.porcentaje})\n` +
        `2. Beca Deportiva (${localData.becas.deportiva.porcentaje})\n` +
        `3. Beca Cultural (${localData.becas.cultural.porcentaje})\n` +
        `4. Beca Socioeconómica (${localData.becas.socioeconomica.porcentaje})\n\n` +
        `Para más información sobre becas y financiación, contacta a:\n` +
        `- Teléfono: ${localData.contactos.financiera.telefono}\n` +
        `- Email: ${localData.contactos.financiera.email}\n` +
        `- Horario: ${localData.contactos.financiera.horario}`,
        'beca'
      ));
    }
  }

  // Búsqueda en fechas
  if (hasMatch(queryLower, keywords.fechas.inscripcion)) {
    results.push(formatResponse(
      'Fechas de Inscripción',
      `La Universidad de Medellín ofrece dos periodos de inscripción al año:\n\n` +
      `Primer período: ${localData.fechasImportantes.inscripciones.primerPeriodo}\n` +
      `Segundo período: ${localData.fechasImportantes.inscripciones.segundoPeriodo}\n\n` +
      `Para más información sobre el proceso de inscripción, puedes contactar a:\n` +
      `- Teléfono: ${localData.contactos.admisiones.telefono}\n` +
      `- Email: ${localData.contactos.admisiones.email}\n` +
      `- Horario: ${localData.contactos.admisiones.horario}`,
      'fechas'
    ));
  }
  if (hasMatch(queryLower, keywords.fechas.matricula)) {
    results.push(formatResponse(
      'Fechas de Matrícula',
      `La matrícula financiera se realiza en dos periodos al año:\n\n` +
      `Primer período: ${localData.fechasImportantes.matriculaFinanciera.primerPeriodo}\n` +
      `Segundo período: ${localData.fechasImportantes.matriculaFinanciera.segundoPeriodo}\n\n` +
      `Para más información sobre el proceso de matrícula, puedes contactar a:\n` +
      `- Teléfono: ${localData.contactos.financiera.telefono}\n` +
      `- Email: ${localData.contactos.financiera.email}\n` +
      `- Horario: ${localData.contactos.financiera.horario}`,
      'fechas'
    ));
  }
  if (hasMatch(queryLower, keywords.fechas.clases)) {
    results.push(formatResponse(
      'Inicio de Clases',
      `El calendario académico contempla dos periodos de clases:\n\n` +
      `Primer período: ${localData.fechasImportantes.inicioClases.primerPeriodo}\n` +
      `Segundo período: ${localData.fechasImportantes.inicioClases.segundoPeriodo}\n\n` +
      `Eventos importantes:\n` +
      `- Semana Cultural: ${localData.fechasImportantes.eventos.semanaCultural}\n` +
      `- Semana Deportiva: ${localData.fechasImportantes.eventos.semanaDeportiva}\n` +
      `- Graduación: ${localData.fechasImportantes.eventos.graduacion}`,
      'fechas'
    ));
  }

  // Búsqueda en contactos
  if (hasMatch(queryLower, keywords.contactos.general)) {
    results.push(formatResponse(
      'Información de Contacto',
      `Admisiones:
- Teléfono: ${localData.contactos.admisiones.telefono}
- Email: ${localData.contactos.admisiones.email}

General:
- Teléfono: ${localData.contactos.general.telefono}
- Email: ${localData.contactos.general.email}`,
      'contacto'
    ));
  }
  if (hasMatch(queryLower, keywords.contactos.ubicacion)) {
    results.push(formatResponse(
      'Ubicación',
      `Dirección: ${localData.contactos.general.direccion}
Horario de atención: ${localData.contactos.general.horario}`,
      'contacto'
    ));
  }

  // Búsqueda en trámites
  if (hasMatch(queryLower, keywords.tramites.certificados)) {
    results.push(formatResponse(
      'Solicitud de Certificado',
      `Pasos para obtener certificado:
${localData.tramites.solicitudCertificado.pasos.map((paso, index) => `${index + 1}. ${paso}`).join('\n')}

Costo: ${localData.tramites.solicitudCertificado.costo}
Plazo: ${localData.tramites.solicitudCertificado.plazo}`,
      'tramite'
    ));
  }
  if (hasMatch(queryLower, keywords.tramites.carnet)) {
    results.push(formatResponse(
      'Solicitud de Carné',
      `Pasos para obtener carné estudiantil:
${localData.tramites.solicitudCarnet.pasos.map((paso, index) => `${index + 1}. ${paso}`).join('\n')}

Costo: ${localData.tramites.solicitudCarnet.costo}
Plazo: ${localData.tramites.solicitudCarnet.plazo}`,
      'tramite'
    ));
  }
  if (hasMatch(queryLower, keywords.tramites.pqrsf)) {
    results.push(formatResponse(
      'Sistema PQRSF',
      `Para hacer una solicitud, sugerencia, reclamo o petición:
1. Accede al sistema PQRSF: ${localData.contactos.pqrsf.url}
2. Selecciona el tipo de solicitud
3. Completa el formulario
4. Envía tu solicitud

Contacto:
- Teléfono: ${localData.contactos.pqrsf.telefono}
- Email: ${localData.contactos.pqrsf.email}
- Horario: ${localData.contactos.pqrsf.horario}`,
      'tramite'
    ));
  }

  // Búsqueda en admisiones
  if (hasMatch(queryLower, keywords.admisiones.general)) {
    if (hasMatch(queryLower, keywords.admisiones.pregrado)) {
      results.push(formatResponse(
        'Requisitos de Admisión - Pregrado',
        `Para ingresar a un programa de pregrado en la Universidad de Medellín necesitas:\n\n` +
        `Requisitos generales:\n${localData.admisiones.pregrado.requisitos.map(r => `- ${r}`).join('\n')}\n\n` +
        `Puntaje mínimo ICFES: ${localData.admisiones.pregrado.porcentajeIcfesMinimo} puntos\n\n` +
        `Becas disponibles:\n` +
        `1. ${localData.admisiones.pregrado.becas.merito.descripcion} (${localData.admisiones.pregrado.becas.merito.porcentaje})\n` +
        `2. ${localData.admisiones.pregrado.becas.deportiva.descripcion} (${localData.admisiones.pregrado.becas.deportiva.porcentaje})\n\n` +
        `Para más información sobre el proceso de admisión, contacta a:\n` +
        `- Teléfono: ${localData.contactos.admisiones.telefono}\n` +
        `- Email: ${localData.contactos.admisiones.email}\n` +
        `- Horario: ${localData.contactos.admisiones.horario}\n` +
        `- Ubicación: ${localData.contactos.admisiones.ubicacion}`,
        'admisión'
      ));
    } else if (hasMatch(queryLower, keywords.admisiones.posgrado)) {
      results.push(formatResponse(
        'Requisitos de Admisión - Posgrado',
        `Para ingresar a un programa de posgrado en la Universidad de Medellín necesitas:\n\n` +
        `Requisitos generales:\n` +
        `- Título profesional\n` +
        `- Promedio de pregrado mínimo de 3.5/5.0\n` +
        `- Carta de motivación\n` +
        `- Hoja de vida\n` +
        `- Entrevista con el director del programa\n\n` +
        `Programas disponibles:\n` +
        `- Especializaciones: ${localData.programas.especializaciones.lista.length} programas\n` +
        `- Maestrías: ${localData.programas.maestrias.lista.length} programas\n` +
        `- Doctorados: ${localData.programas.doctorados.lista.length} programas\n\n` +
        `Para más información sobre el proceso de admisión, contacta a:\n` +
        `- Teléfono: ${localData.contactos.admisiones.telefono}\n` +
        `- Email: ${localData.contactos.admisiones.email}\n` +
        `- Horario: ${localData.contactos.admisiones.horario}\n` +
        `- Ubicación: ${localData.contactos.admisiones.ubicacion}`,
        'admisión'
      ));
    } else if (hasMatch(queryLower, keywords.admisiones.icfes)) {
      results.push(formatResponse(
        'Requisitos ICFES',
        `Para el proceso de admisión se requiere:\n\n` +
        `- Puntaje mínimo ICFES: ${localData.admisiones.pregrado.porcentajeIcfesMinimo} puntos\n` +
        `- Para beca por mérito: Puntaje superior a 350\n\n` +
        `El ICFES es un requisito fundamental para:\n` +
        `- Proceso de admisión\n` +
        `- Aplicación a becas\n` +
        `- Clasificación de programas\n\n` +
        `Para más información sobre el proceso de admisión, contacta a:\n` +
        `- Teléfono: ${localData.contactos.admisiones.telefono}\n` +
        `- Email: ${localData.contactos.admisiones.email}\n` +
        `- Horario: ${localData.contactos.admisiones.horario}`,
        'admisión'
      ));
    } else {
      // Información general de admisiones
      results.push(formatResponse(
        'Proceso de Admisión',
        `La Universidad de Medellín ofrece diferentes niveles de formación:\n\n` +
        `1. Pregrado:\n` +
        `- ${localData.programas.pregrados.lista.length} programas disponibles\n` +
        `- Puntaje mínimo ICFES: ${localData.admisiones.pregrado.porcentajeIcfesMinimo} puntos\n\n` +
        `2. Posgrado:\n` +
        `- ${localData.programas.especializaciones.lista.length} especializaciones\n` +
        `- ${localData.programas.maestrias.lista.length} maestrías\n` +
        `- ${localData.programas.doctorados.lista.length} doctorados\n\n` +
        `Para más información sobre el proceso de admisión, contacta a:\n` +
        `- Teléfono: ${localData.contactos.admisiones.telefono}\n` +
        `- Email: ${localData.contactos.admisiones.email}\n` +
        `- Horario: ${localData.contactos.admisiones.horario}\n` +
        `- Ubicación: ${localData.contactos.admisiones.ubicacion}`,
        'admisión'
      ));
    }
  }

  // Si no hay resultados específicos, buscar en preguntas frecuentes
  if (results.length === 0) {
    const faqResults = localData.preguntasFrecuentes
      .filter(faq => 
        hasMatch(faq.pregunta, [queryLower]) || 
        (faq.respuesta && hasMatch(faq.respuesta, [queryLower]))
      )
      .map(faq => {
        if (faq.mostrarRespuesta === false) {
          return formatResponse(faq.pregunta, '', 'faq');
        }
        return formatResponse(faq.pregunta, faq.respuesta, 'faq');
      });
    
    if (faqResults.length > 0) {
      results.push(...faqResults);
    } else {
      // Si aún no hay resultados, mostrar las preguntas más relevantes
      results.push(formatResponse(
        'Preguntas Frecuentes',
        `🔍 Esto encontré:\n\n` +
        `• **Preguntas Frecuentes**\n\n` +
        `Q: ¿Cuáles son los horarios de atención de la universidad?\n` +
        `A: La universidad atiende de lunes a viernes de 7:00 AM a 7:00 PM. Las oficinas específicas tienen sus propios horarios:\n\n` +
        `- Admisiones: 8:00 AM - 5:00 PM\n` +
        `- Biblioteca: 7:00 AM - 9:00 PM (L-V), 8:00 AM - 5:00 PM (S)\n` +
        `- Bienestar: 8:00 AM - 5:00 PM\n` +
        `- Financiera: 8:00 AM - 5:00 PM\n` +
        `- Cafetería: 7:00 AM - 7:00 PM\n` +
        `- Gimnasio: 6:00 AM - 9:00 PM (L-V), 8:00 AM - 5:00 PM (S)\n` +
        `- Casa del Egresado: 8:00 AM - 5:00 PM\n\n` +
        `Q: ¿Qué tipos de becas ofrecen?\n\n` +
        `Q: ¿Cuáles son los requisitos para obtener una beca?\n\n` +
        `Q: ¿Cuándo son las fechas de matrícula?\n\n` +
        `Q: ¿Cuáles son los requisitos para matricularme?\n\n` +
        `Q: ¿Cuándo son las fechas de inscripción?\n\n` +
        `Q: ¿Cómo puedo hacer una solicitud PQRSF?`,
        'faq'
      ));
    }
  }
  
  return results.length > 0 ? { results } : null;
};