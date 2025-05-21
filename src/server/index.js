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
  const { student_id, tipo, descripcion } = req.body;
  if (!student_id || !tipo || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  const fecha = new Date().toISOString();
  const sql = 'INSERT INTO solicitudes (student_id, tipo, descripcion, estado, fecha) VALUES (?, ?, ?, ?, ?)';
  const params = [student_id, tipo, descripcion, 'pendiente', fecha];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, student_id, tipo, descripcion, estado: 'pendiente', fecha });
  });
});

// Actualizar estado y respuesta de solicitud
app.put('/api/solicitudes/:id', (req, res) => {
  const { id } = req.params;
  const { estado, respuesta } = req.body;
  const sql = 'UPDATE solicitudes SET estado = ?, respuesta = ? WHERE id = ?';
  const params = [estado, respuesta || '', id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    // Devolver la solicitud actualizada
    const sqlSelect = 'SELECT * FROM solicitudes WHERE id = ?';
    db.get(sqlSelect, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
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
