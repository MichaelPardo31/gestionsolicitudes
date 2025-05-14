const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Permitir peticiones desde tu app de React
app.use(cors());

// Simulamos una base de datos
const data = require('./noticiasEventos.json');

// Ruta para obtener noticias y eventos
app.get('/api/noticias-eventos', (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
