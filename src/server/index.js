const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Registro de nuevo usuario
app.post('/api/students/register', (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  // Verificar si el usuario ya existe
  const checkSql = 'SELECT * FROM students WHERE email = ?';
  db.get(checkSql, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Error al encriptar contraseña' });
      }
      const sql = 'INSERT INTO students (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)';
      const params = [nombre, email, hash, rol || 'student'];
      db.run(sql, params, function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, nombre, email, rol: rol || 'student' });
      });
    });
  });
});

// Login de usuario
app.post('/api/students/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  const sql = 'SELECT * FROM students WHERE email = ?';
  db.get(sql, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    bcrypt.compare(password, row.password_hash, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar contraseña' });
      }
      if (!result) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
      // No enviar password_hash en la respuesta
      const { password_hash, ...user } = row;
      res.json(user);
    });
  });
});

// Obtener todas las solicitudes
app.get('/api/solicitudes', (req, res) => {
  const { student_id } = req.query;
  let sql = `SELECT solicitudes.*, students.nombre as usuario FROM solicitudes 
               LEFT JOIN students ON solicitudes.student_id = students.id`;
  const params = [];
  if (student_id) {
    sql += ' WHERE solicitudes.student_id = ?';
    params.push(student_id);
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Crear nueva solicitud
app.post('/api/solicitudes', (req, res) => {
  const { 
    student_id, 
    tipo, 
    descripcion, 
    categoria, 
    numero_radicado, 
    archivos_adjuntos,
    tiene_adjuntos
  } = req.body;
  
  if (!student_id || !tipo || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  const fecha = new Date().toISOString();
  const estado = 'pendiente';
  
  // Extraer el número de radicado de la descripción si no se proporciona directamente
  let radicado = numero_radicado || '';
  if (!radicado && descripcion.includes('Radicado:')) {
    const match = descripcion.match(/Radicado:\s*(PQRSF-\d{4}-\d{2}-\d{5})/);
    if (match && match[1]) {
      radicado = match[1];
    }
  }
  
  // Crear el historial de estados inicial
  const historialEstados = JSON.stringify([{
    estado: 'pendiente',
    fecha: fecha,
    comentario: 'Solicitud radicada'
  }]);
  
  // Convertir archivos adjuntos a JSON si se proporcionan
  const archivosAdjuntosJSON = archivos_adjuntos ? JSON.stringify(archivos_adjuntos) : null;
  
  const sql = `INSERT INTO solicitudes (
    student_id, tipo, descripcion, estado, fecha, 
    categoria, numero_radicado, archivos_adjuntos, 
    tiene_adjuntos, historial_estados
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const params = [
    student_id, 
    tipo, 
    descripcion, 
    estado, 
    fecha, 
    categoria || null, 
    radicado, 
    archivosAdjuntosJSON, 
    tiene_adjuntos ? 1 : 0, 
    historialEstados
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error al crear solicitud:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Devolver la solicitud creada con todos sus campos
    db.get('SELECT * FROM solicitudes WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });
});

// Actualizar estado y respuesta de solicitud
app.put('/api/solicitudes/:id', (req, res) => {
  const { id } = req.params;
  const { estado, respuesta, comentario } = req.body;
  
  // Primero obtenemos la solicitud actual para actualizar su historial
  db.get('SELECT * FROM solicitudes WHERE id = ?', [id], (err, solicitud) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    // Obtener el historial actual o crear uno nuevo si no existe
    let historialEstados = [];
    try {
      historialEstados = solicitud.historial_estados ? JSON.parse(solicitud.historial_estados) : [];
    } catch (e) {
      console.warn('Error al parsear historial de estados:', e);
    }
    
    // Añadir nuevo estado al historial
    const fechaActual = new Date().toISOString();
    historialEstados.push({
      estado: estado || solicitud.estado,
      fecha: fechaActual,
      comentario: comentario || `Estado cambiado a ${estado || solicitud.estado}`
    });
    
    // Preparar los campos a actualizar
    let campos = {};
    let params = [];
    let sqlSet = [];
    
    // Añadir los campos que se van a actualizar
    if (estado) {
      sqlSet.push('estado = ?');
      params.push(estado);
      campos.estado = estado;
    }
    
    if (respuesta !== undefined) {
      sqlSet.push('respuesta = ?');
      params.push(respuesta || '');
      campos.respuesta = respuesta || '';
      
      // Si hay respuesta, también actualizamos la fecha de resolución
      sqlSet.push('fecha_resolucion = ?');
      params.push(fechaActual);
      campos.fecha_resolucion = fechaActual;
    }
    
    // Actualizar el historial de estados
    sqlSet.push('historial_estados = ?');
    params.push(JSON.stringify(historialEstados));
    campos.historial_estados = JSON.stringify(historialEstados);
    
    // Añadir el ID al final de los parámetros
    params.push(id);
    
    // Construir la consulta SQL
    const sql = `UPDATE solicitudes SET ${sqlSet.join(', ')} WHERE id = ?`;
    
    // Ejecutar la actualización
    db.run(sql, params, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'No se pudo actualizar la solicitud' });
      }
      
      // Devolver la solicitud actualizada
      db.get('SELECT * FROM solicitudes WHERE id = ?', [id], (err, solicitudActualizada) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // Devolver la solicitud con los campos actualizados
        res.json({
          ...solicitudActualizada,
          campos_actualizados: Object.keys(campos)
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// TEMPORALLLLLLLLL
// ...existing code...
db.all('SELECT id, nombre, email, rol FROM students', [], (err, rows) => {
  if (err) {
    console.error('Error al consultar usuarios:', err.message);
  } else {
    console.log('Usuarios registrados:', rows);
  }
});
// ...existing code...
