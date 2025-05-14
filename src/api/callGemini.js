const API_KEY = 'AIzaSyDQrIfncm5wS9JoRh6vwuXcmf20UWWA8kU';  // 👈 Reemplaza esto por tu clave real

export async function callGemini(query, contextData) {
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Contexto: ${JSON.stringify(contextData)}\n\nPregunta: ${query}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (data.candidates && data.candidates.length > 0) {
      return { content: data.candidates[0].content.parts[0].text };
    } else {
      return { content: 'No pude encontrar una respuesta.', error: true };
    }

  } catch (err) {
    console.error('Error llamando a Gemini:', err);
    return { content: 'Error interno al contactar a Gemini.', error: true };
  }
}
