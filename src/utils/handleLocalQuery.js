import { UDEM_INFO } from '../mock/udemData';


const localFAQs = [
  {
    question: "¿Cuál es el correo de admisiones?",
    answer: `El correo de admisiones es: ${UDEM_INFO.contactos.correos.admisiones}`,
  },
  {
    question: "¿Dónde queda la universidad?",
    answer: `La universidad está ubicada en: ${UDEM_INFO.ubicacion}`,
  },
  // Agrega más preguntas frecuentes aquí
];

export default function handleLocalQuery(query) {
  const normalized = query.toLowerCase();

  const match = localFAQs.find(faq =>
    normalized.includes(faq.question.toLowerCase())
  );

  return match || null;
}
