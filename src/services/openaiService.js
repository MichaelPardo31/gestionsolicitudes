// En services/geminiService.js
const callGemini = async (query, context) => {
  // Verificación mejorada de API Key
  if (!process.env.REACT_APP_GEMINI_API_KEY) {
    console.error('Error: API Key no configurada');
    return {
      content: "Disculpa, el servicio no está configurado correctamente. Por favor contacta al soporte técnico.",
      error: true
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Eres un asistente de ${context.nombreUniversidad}. 
              Información institucional: ${JSON.stringify(context, null, 2)}
              Responde únicamente sobre temas universitarios.`
            }, {
              text: query
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      error: false
    };
    
  } catch (error) {
    console.error('Error en callGemini:', error);
    
    // Respuesta local de respaldo
    const localResponse = handleLocalQuery(query);
    if (localResponse) {
      return {
        content: localResponse.answer,
        error: false
      };
    }
    
    return {
      content: "Disculpa, estoy teniendo dificultades técnicas. Aquí tienes información útil:\n\n" +
               `- Programas: ${context.programas.slice(0, 3).map(p => p.nombre).join(', ')}...\n` +
               `- Contacto: ${context.contactos.telefonos.admisiones}`,
      error: true
    };
  }
};