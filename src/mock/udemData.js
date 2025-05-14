export const UDEM_INFO = {
  nombre: "Universidad de Medellín",
  fundacion: 1950,
  acreditacion: "Alta Calidad Multicampus",
  campus: {
    principal: {
      nombre: "Campus Vivo",
      direccion: "Carrera 87 N° 30-65, Medellín, Antioquia",
      area: "120.000 m²",
      caracteristicas: [
        "Más de 40 edificios",
        "Zonas verdes y jardines",
        "Instalaciones deportivas",
        "Biblioteca central",
        "Laboratorios especializados",
        "Auditorios y salas de conferencias"
      ],
      servicios: {
        cafeteria: {
          horario: "Lunes a Viernes 7:00 AM - 7:00 PM",
          ubicacion: "Edificio 1, primer piso"
        },
        gimnasio: {
          horario: "Lunes a Viernes 6:00 AM - 9:00 PM, Sábados 8:00 AM - 5:00 PM",
          ubicacion: "Edificio 15",
          servicios: ["Gimnasio", "Piscina", "Canchas", "Salas de entrenamiento"]
        },
        parqueadero: {
          capacidad: "1,200 vehículos",
          horario: "24 horas",
          tarifa: "Según tipo de usuario"
        }
      }
    }
  },
  programas: {
    descripcion: "La Universidad de Medellín ofrece una amplia variedad de programas académicos en diferentes niveles de formación: pregrados, especializaciones, maestrías y doctorados.",
    pregrados: {
      descripcion: "La universidad cuenta con más de 25 programas de pregrado en diversas áreas del conocimiento.",
      lista: [
    { 
      nombre: "Administración de Empresas", 
          facultad: "Facultad de Ciencias Económicas y Administrativas",
          duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Finanzas", "Mercadeo", "Gestión Empresarial"],
          perfilEgresado: "Profesional con visión estratégica y capacidad de gestión empresarial",
          campoLaboral: ["Gestión Empresarial", "Consultoría", "Emprendimiento", "Sector Financiero"],
          costos: {
            matricula: "Depende del estrato socioeconómico",
            semestre: "Depende del estrato socioeconómico"
          }
    },
    { 
      nombre: "Ciencia Política", 
          facultad: "Facultad de Ciencias Sociales y Humanas",
          duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Análisis Político", "Relaciones Internacionales", "Gestión Pública"],
          perfilEgresado: "Profesional con capacidad de análisis político y social",
          campoLaboral: ["Sector Público", "Organizaciones Internacionales", "Consultoría Política"]
        },
        {
          nombre: "Comunicación y Entretenimiento Digital",
          facultad: "Facultad de Comunicación",
          duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Producción Digital", "Marketing Digital", "Gestión de Contenidos"],
          perfilEgresado: "Profesional en comunicación digital y entretenimiento",
          campoLaboral: ["Medios Digitales", "Marketing Digital", "Producción de Contenidos"]
    },
    { 
      nombre: "Derecho", 
          facultad: "Facultad de Derecho",
          duracion: "10 semestres",
          modalidad: "Presencial",
          enfasis: ["Derecho Público", "Derecho Privado", "Derecho Internacional"],
          perfilEgresado: "Profesional con sólida formación jurídica y capacidad de análisis crítico",
          campoLaboral: ["Abogacía", "Consultoría Jurídica", "Sector Público", "Organismos Internacionales"]
    },
    { 
      nombre: "Diseño y Gestión de la Moda y el Textil", 
          facultad: "Facultad de Diseño",
          duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Diseño de Moda", "Gestión Textil", "Marketing de Moda"],
          perfilEgresado: "Profesional en diseño y gestión de la industria de la moda",
          campoLaboral: ["Diseño de Moda", "Gestión Textil", "Marketing de Moda"]
    },
    { 
      nombre: "Ingeniería Ambiental", 
          facultad: "Facultad de Ingenierías",
      duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Gestión Ambiental", "Sostenibilidad", "Recursos Naturales"],
          perfilEgresado: "Profesional en gestión ambiental y sostenibilidad",
          campoLaboral: ["Consultoría Ambiental", "Gestión de Recursos", "Sostenibilidad"]
    },
    { 
      nombre: "Ingeniería de Sistemas", 
          facultad: "Facultad de Ingenierías",
      duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Desarrollo de Software", "Inteligencia Artificial", "Ciberseguridad"],
          perfilEgresado: "Profesional capaz de diseñar, desarrollar e implementar soluciones tecnológicas innovadoras",
          campoLaboral: ["Desarrollo de Software", "Consultoría TI", "Ciberseguridad", "Análisis de Datos"]
        },
        {
          nombre: "Investigación Criminal",
          facultad: "Facultad de Derecho",
      duracion: "10 semestres",
          modalidad: ["Presencial", "Virtual"],
          enfasis: ["Criminología", "Criminalística", "Seguridad"],
          perfilEgresado: "Profesional en investigación criminal y seguridad",
          campoLaboral: ["Investigación Criminal", "Seguridad", "Consultoría"]
        },
        {
          nombre: "Negocios Internacionales",
          facultad: "Facultad de Ciencias Económicas y Administrativas",
      duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Comercio Internacional", "Logística", "Mercadeo Internacional"],
          perfilEgresado: "Profesional en negocios internacionales y comercio exterior",
          campoLaboral: ["Comercio Internacional", "Logística", "Mercadeo Internacional"]
    },
    { 
          nombre: "Psicología",
          facultad: "Facultad de Ciencias Sociales y Humanas",
      duracion: "10 semestres",
      modalidad: "Presencial",
          enfasis: ["Psicología Clínica", "Psicología Organizacional", "Psicología Educativa"],
          perfilEgresado: "Profesional en psicología con enfoque integral",
          campoLaboral: ["Salud Mental", "Recursos Humanos", "Educación"]
        }
      ]
    },
    especializaciones: {
      descripcion: "La universidad ofrece más de 30 programas de especialización en diversas áreas.",
      lista: [
        "Alta Gerencia",
        "Ciencia de Datos e Inteligencia Artificial",
        "Comunicación Estratégica para la Web",
        "Contratación Estatal (presencial y virtual)",
        "Derecho Administrativo",
        "Derecho Penal",
        "Gestión del Talento Humano y la Productividad",
        "Ingeniería de Recursos Hídricos",
        "Mercadeo Gerencial",
        "Riesgos Financieros"
      ]
    },
    maestrias: {
      descripcion: "La universidad ofrece más de 15 programas de maestría en diversas disciplinas.",
      lista: [
        "Maestría en Administración (MBA)",
        "Maestría en Comunicación de Marca",
        "Maestría en Derecho Penal",
        "Maestría en Educación",
        "Maestría en Finanzas",
        "Maestría en Ingeniería Ambiental",
        "Maestría en Ingeniería de Software",
        "Maestría en Mercadeo",
        "Maestría en Tributación y Política Fiscal"
      ]
    },
    doctorados: {
      descripcion: "La universidad ofrece programas de doctorado en diversas áreas.",
      lista: [
        "Doctorado en Comunicación",
        "Doctorado en Derecho",
        "Doctorado en Derecho Procesal Contemporáneo",
        "Doctorado en Ingeniería",
        "Doctorado en Modelación y Computación Científica"
      ]
    }
  },
  fechasImportantes: {
    inscripciones: {
      primerPeriodo: "Octubre - Diciembre",
      segundoPeriodo: "Marzo - Mayo"
    },
    matriculaFinanciera: {
      primerPeriodo: "Enero",
      segundoPeriodo: "Julio"
    },
    inicioClases: {
      primerPeriodo: "Febrero",
      segundoPeriodo: "Agosto"
    },
    eventos: {
      semanaCultural: "Septiembre",
      semanaDeportiva: "Octubre",
      graduacion: "Diciembre"
    }
  },
  contactos: {
    admisiones: {
      telefono: "(604) 590 45 00",
      email: "admisiones@udem.edu.co",
      horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
      ubicacion: "Edificio 1, primer piso",
      redes: {
        whatsapp: "300 123 4567",
        instagram: "@udem_admisiones",
        facebook: "Admisiones UdeM"
      }
    },
    general: {
      telefono: "(604) 590 45 00",
      email: "info@udem.edu.co",
      direccion: "Carrera 87 N° 30-65, Medellín, Antioquia",
      horario: "Lunes a Viernes 7:00 AM - 7:00 PM",
      redes: {
        instagram: "@universidaddemedellin",
        facebook: "Universidad de Medellín",
        twitter: "@udem",
        youtube: "Universidad de Medellín"
      }
    },
    biblioteca: {
      telefono: "(604) 590 45 00 ext. 1234",
      email: "biblioteca@udem.edu.co",
      horario: "Lunes a Viernes 7:00 AM - 9:00 PM, Sábados 8:00 AM - 5:00 PM",
      servicios: [
        "Préstamo de libros",
        "Acceso a bases de datos",
        "Salas de estudio",
        "Asesoría en investigación",
        "Préstamo de computadores",
        "Zona wifi"
      ]
    },
    bienestar: {
      telefono: "(604) 590 45 00 ext. 2345",
      email: "bienestar@udem.edu.co",
      ubicacion: "Edificio 15",
      horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
      servicios: [
        "Salud física y mental",
        "Deportes y recreación",
        "Cultura y arte",
        "Desarrollo personal",
        "Asesoría psicológica",
        "Actividades recreativas"
      ]
    },
    pqrsf: {
      telefono: "(604) 590 45 00 ext. 3456",
      email: "pqrsf@udem.edu.co",
      horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
      url: "https://www.udem.edu.co/pqrsf",
      tipos: [
        "Petición",
        "Queja",
        "Reclamo",
        "Sugerencia",
        "Felicitación"
      ]
    },
    financiera: {
      telefono: "(604) 590 45 00 ext. 4567",
      email: "financiera@udem.edu.co",
      horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
      ubicacion: "Edificio 1, primer piso",
      servicios: [
        "Pago de matrícula",
        "Financiación",
        "Becas",
        "Convenios bancarios",
        "Facturación"
      ]
    },
    egresados: {
      telefono: "(604) 590 45 00 ext. 5678",
      email: "egresados@udem.edu.co",
      horario: "Lunes a Viernes 8:00 AM - 5:00 PM",
      ubicacion: "Edificio 20",
      servicios: [
        "Bolsa de empleo",
        "Actualización de datos",
        "Certificados",
        "Eventos de networking",
        "Programas de educación continua"
      ]
    }
  },
  residencias: {
    casaEgresado: {
      nombre: "Casa del Egresado UdeM",
      direccion: "Carrera 87 N° 30-65, Medellín, Antioquia",
      telefono: "(604) 590 45 00 ext. 5678",
      email: "casaegresado@udem.edu.co",
      servicios: [
        "Habitaciones individuales y compartidas",
        "Zona wifi",
        "Área de estudio",
        "Sala de estar",
        "Cafetería",
        "Lavandería",
        "Seguridad 24/7"
      ],
      convenios: [
        "Residencias Estudiantiles Medellín",
        "Student Housing Colombia",
        "Campus Life"
      ]
    }
  },
  servicios: {
    academicos: {
      biblioteca: {
        nombre: "Biblioteca Central",
        ubicacion: "Edificio 5",
        horario: "Lunes a Viernes 7:00 AM - 9:00 PM, Sábados 8:00 AM - 5:00 PM",
        servicios: [
          "Préstamo de libros",
          "Acceso a bases de datos",
          "Salas de estudio",
          "Asesoría en investigación",
          "Préstamo de computadores",
          "Zona wifi"
        ]
      },
      laboratorios: {
        ubicacion: "Edificios 10, 11 y 12",
        tipos: [
          "Laboratorios de computación",
          "Laboratorios de física",
          "Laboratorios de química",
          "Laboratorios de biología",
          "Laboratorios de electrónica"
        ]
      }
    },
    deportivos: {
      gimnasio: {
        nombre: "Centro Deportivo UdeM",
        ubicacion: "Edificio 15",
        horario: "Lunes a Viernes 6:00 AM - 9:00 PM, Sábados 8:00 AM - 5:00 PM",
        servicios: [
          "Gimnasio",
          "Piscina",
          "Canchas múltiples",
          "Salas de entrenamiento",
          "Clases grupales",
          "Asesoría deportiva"
        ]
      }
    },
    bienestar: {
      ubicacion: "Edificio 15",
      servicios: [
        "Salud física y mental",
        "Deportes y recreación",
        "Cultura y arte",
        "Desarrollo personal",
        "Asesoría psicológica",
        "Actividades recreativas"
      ]
    }
  },
  becas: {
    merito: {
      descripcion: "Beca por excelencia académica",
      porcentaje: "Hasta 100%",
      requisitos: [
        "Puntaje ICFES superior a 350",
        "Promedio de bachillerato superior a 4.5",
        "Sostener el promedio semestral"
      ],
      duracion: "Todo el programa",
      renovacion: "Semestral"
    },
    deportiva: {
      descripcion: "Beca por excelencia deportiva",
      porcentaje: "Hasta 50%",
      requisitos: [
        "Ser deportista de alto rendimiento",
        "Mantener promedio académico mínimo de 3.5",
        "Participar en competencias universitarias"
      ],
      duracion: "Todo el programa",
      renovacion: "Semestral"
    },
    cultural: {
      descripcion: "Beca por talento cultural",
      porcentaje: "Hasta 30%",
      requisitos: [
        "Demostrar talento en áreas artísticas",
        "Mantener promedio académico mínimo de 3.5",
        "Participar en actividades culturales"
      ],
      duracion: "Todo el programa",
      renovacion: "Semestral"
    },
    socioeconomica: {
      descripcion: "Beca por situación económica",
      porcentaje: "Hasta 50%",
      requisitos: [
        "Demostrar necesidad económica",
        "Mantener promedio académico mínimo de 3.5",
        "No tener otras becas"
      ],
      duracion: "Todo el programa",
      renovacion: "Semestral"
    }
  },
  admisiones: {
    pregrado: {
      requisitos: [
        "Diligenciar formulario de inscripción",
        "Presentar prueba de admisión",
        "Puntaje mínimo ICFES: 250 puntos",
        "Documentos de identidad",
        "Diploma de bachiller",
        "Fotocopia de notas de bachillerato"
      ],
      porcentajeIcfesMinimo: 250,
      becas: {
        merito: {
          descripcion: "Beca por excelencia académica",
          porcentaje: "Hasta 100%",
          requisitos: [
            "Puntaje ICFES superior a 350",
            "Promedio de bachillerato superior a 4.5",
            "Sostener el promedio semestral"
          ]
        },
        deportiva: {
          descripcion: "Beca por excelencia deportiva",
          porcentaje: "Hasta 50%",
          requisitos: [
            "Ser deportista de alto rendimiento",
            "Mantener promedio académico mínimo de 3.5",
            "Participar en competencias universitarias"
          ]
        }
      }
    }
  },
  tramites: {
    solicitudHorario: {
      pasos: [
        "Acceder al sistema académico",
        "Seleccionar 'Solicitud de cambio de horario'",
        "Completar el formulario con la justificación",
        "Adjuntar soportes necesarios",
        "Enviar solicitud"
      ],
      plazo: "5 días hábiles",
      contacto: "coordinacion@udem.edu.co"
    },
    solicitudCertificado: {
      pasos: [
        "Acceder al sistema académico",
        "Seleccionar 'Solicitud de certificado'",
        "Especificar tipo de certificado",
        "Realizar pago correspondiente",
        "Recoger certificado en ventanilla"
      ],
      costo: "Depende del tipo de certificado",
      plazo: "3 días hábiles"
    },
    solicitudCarnet: {
      pasos: [
        "Acceder al sistema académico",
        "Seleccionar 'Solicitud de carné'",
        "Subir foto reciente",
        "Realizar pago correspondiente",
        "Recoger carné en ventanilla"
      ],
      costo: "Depende del tipo de carné",
      plazo: "5 días hábiles"
    }
  },
  preguntasFrecuentes: [
    {
      pregunta: "¿Cuáles son los horarios de atención de la universidad?",
      respuesta: "La universidad atiende de lunes a viernes de 7:00 AM a 7:00 PM. Las oficinas específicas tienen sus propios horarios:\n\n- Admisiones: 8:00 AM - 5:00 PM\n- Biblioteca: 7:00 AM - 9:00 PM (L-V), 8:00 AM - 5:00 PM (S)\n- Bienestar: 8:00 AM - 5:00 PM\n- Financiera: 8:00 AM - 5:00 PM\n- Cafetería: 7:00 AM - 7:00 PM\n- Gimnasio: 6:00 AM - 9:00 PM (L-V), 8:00 AM - 5:00 PM (S)\n- Parqueadero: 24 horas\n- PQRSF: 8:00 AM - 5:00 PM\n- Casa del Egresado: 8:00 AM - 5:00 PM"
    },
    {
      pregunta: "¿Qué tipos de becas ofrecen?",
      mostrarRespuesta: false
    },
    {
      pregunta: "¿Cuáles son los requisitos para obtener una beca?",
      mostrarRespuesta: false
    },
    {
      pregunta: "¿Cuándo son las fechas de matrícula?",
      mostrarRespuesta: false
    },
    {
      pregunta: "¿Cuáles son los requisitos para matricularme?",
      mostrarRespuesta: false
    },
    {
      pregunta: "¿Cuándo son las fechas de inscripción?",
      mostrarRespuesta: false
    },
    {
      pregunta: "¿Cómo puedo hacer una solicitud PQRSF?",
      mostrarRespuesta: false
    }
  ],
  mensajeInicial: {
    saludo: "¡Hola! Soy el asistente virtual de la Universidad de Medellín. ¿En qué puedo ayudarte?",
    sugerencias: [
      "💰 Información sobre becas",
      "📝 Proceso de matrícula",
      "📅 Fechas de inscripción",
      "📋 Sistema PQRSF",
      "⏰ Horarios de atención",
      "📞 Información de contacto",
      "🏫 Información general",
      "❓ Preguntas frecuentes"
    ]
  }
};