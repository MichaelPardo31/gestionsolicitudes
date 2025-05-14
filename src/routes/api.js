// En tu archivo de rutas (ej: routes/api.js)
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Ruta para búsquedas en la web
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    // 1. Primero busca en la base de datos local
    const localResult = await searchLocalDatabase(query);
    if (localResult) return res.json(localResult);
    
    // 2. Si no hay resultados locales, buscar en la API externa
    const apiResponse = await axios.get('https://api.udemedellin.edu.co/buscar', {
      params: {
        termino: query,
        key: process.env.UDEM_API_KEY
      }
    });
    
    // Procesar la respuesta de la API
    const formattedResults = apiResponse.data.resultados.map(item => ({
      titulo: item.titulo,
      contenido: item.descripcion,
      url: item.enlace,
      fecha: item.fecha_publicacion
    }));
    
    res.json({
      source: 'UDEM API',
      results: formattedResults.slice(0, 3) // Limitar a 3 resultados
    });
    
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
});

async function searchLocalDatabase(query) {
  // Implementa tu lógica de búsqueda local aquí
  // Retorna null si no hay resultados
}

module.exports = router;