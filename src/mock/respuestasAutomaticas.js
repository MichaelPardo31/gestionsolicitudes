/**
 * Respuestas automáticas predeterminadas para diferentes tipos de PQRSF
 */

const respuestasAutomaticas = {
  // Respuestas para solicitudes académicas
  'Cambio de carrera': [
    'Su solicitud de cambio de carrera ha sido recibida. Le informamos que este proceso requiere una evaluación académica que puede tomar hasta 5 días hábiles. Se le notificará la decisión a través de su correo institucional.',
    'Hemos registrado su solicitud de cambio de carrera. Para continuar con el proceso, debe agendar una cita con su decano actual y el decano de la carrera a la que desea ingresar. Puede programar estas citas a través del portal estudiantil.'
  ],
  'Inscripción de curso': [
    'Su solicitud de inscripción al curso ha sido recibida. Le informamos que verificaremos la disponibilidad de cupos y requisitos previos. Recibirá respuesta en un plazo máximo de 48 horas.',
    'Hemos registrado su solicitud de inscripción al curso. Para completar el proceso, verifique que no existan cruces de horario con sus otras materias y que cumpla con los prerrequisitos establecidos.'
  ],
  'Cancelación de materia': [
    'Su solicitud de cancelación de materia ha sido recibida. Recuerde que puede cancelar materias sin penalización hasta la fecha límite establecida en el calendario académico (semana 8 del semestre).',
    'Hemos registrado su solicitud de cancelación de materia. Le recordamos que esta acción no genera devolución de dinero y puede afectar su promedio académico si ya ha presentado evaluaciones.'
  ],
  'Certificado académico': [
    'Su solicitud de certificado académico ha sido recibida. El documento estará disponible en su portal estudiantil en un plazo de 3 días hábiles.',
    'Hemos registrado su solicitud de certificado académico. El documento será enviado a su correo institucional en formato PDF con firma digital válida.'
  ],
  
  // Respuestas para solicitudes administrativas
  'Problema de pago': [
    'Su reporte sobre problemas de pago ha sido recibido. Un asesor de la oficina financiera se pondrá en contacto con usted en las próximas 24 horas para resolver su caso.',
    'Hemos registrado su reporte sobre problemas de pago. Para agilizar la solución, le recomendamos adjuntar el comprobante de pago o captura de pantalla del error en el sistema.'
  ],
  'Actualización de datos': [
    'Su solicitud de actualización de datos ha sido recibida. Los cambios se verán reflejados en el sistema en un plazo máximo de 48 horas.',
    'Hemos registrado su solicitud de actualización de datos. Recuerde que algunos cambios (como documento de identidad) requieren presentar documentación de soporte en la oficina de registro.'
  ],
  'Carné estudiantil': [
    'Su solicitud de carné estudiantil ha sido recibida. Puede recogerlo en la oficina de registro a partir del próximo lunes en horario de 8:00 AM a 5:00 PM.',
    'Hemos registrado su solicitud de carné estudiantil. El documento estará listo en 5 días hábiles y se le notificará a través de su correo institucional cuando pueda recogerlo.'
  ],
  
  // Respuestas para quejas y reclamos
  'Inconveniente con profesor': [
    'Su reporte sobre inconvenientes con un profesor ha sido recibido. La coordinación académica analizará su caso y se comunicará con usted en un plazo máximo de 3 días hábiles.',
    'Hemos registrado su reporte sobre inconvenientes con un profesor. Le recomendamos también dialogar directamente con el docente durante sus horarios de atención para buscar una solución conjunta.'
  ],
  'Problema con instalaciones': [
    'Su reporte sobre problemas con las instalaciones ha sido recibido. El departamento de infraestructura atenderá su solicitud en las próximas 48 horas.',
    'Hemos registrado su reporte sobre problemas con las instalaciones. Agradecemos su colaboración para mantener en óptimas condiciones nuestra universidad.'
  ],
  'Inconveniente con servicio': [
    'Su reporte sobre inconvenientes con un servicio ha sido recibido. El área responsable evaluará su caso y tomará las medidas correctivas necesarias.',
    'Hemos registrado su reporte sobre inconvenientes con un servicio. Su retroalimentación es muy importante para mejorar continuamente nuestros procesos.'
  ],
  
  // Respuestas generales (para tipos no específicos)
  'general': [
    'Su solicitud ha sido recibida y será atendida por el departamento correspondiente. Le responderemos en un plazo máximo de 5 días hábiles.',
    'Hemos registrado su solicitud. Un miembro de nuestro equipo la revisará y se pondrá en contacto con usted a la brevedad posible.',
    'Gracias por comunicarse con nosotros. Su solicitud ha sido asignada al área correspondiente para su pronta atención y resolución.'
  ]
};

/**
 * Obtiene respuestas automáticas según el tipo de solicitud
 * @param {string} tipoSolicitud - El tipo de solicitud
 * @returns {Array} - Array de posibles respuestas automáticas
 */
export const obtenerRespuestasAutomaticas = (tipoSolicitud) => {
  // Si existe una respuesta específica para este tipo, la devolvemos
  if (respuestasAutomaticas[tipoSolicitud]) {
    return respuestasAutomaticas[tipoSolicitud];
  }
  
  // Si no hay respuesta específica, devolvemos las respuestas generales
  return respuestasAutomaticas['general'];
};

/**
 * Obtiene todos los tipos de solicitudes disponibles con respuestas automáticas
 * @returns {Array} - Array de tipos de solicitudes
 */
export const obtenerTiposSolicitudes = () => {
  return Object.keys(respuestasAutomaticas).filter(tipo => tipo !== 'general');
};

export default {
  obtenerRespuestasAutomaticas,
  obtenerTiposSolicitudes
};
