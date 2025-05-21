const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DBSOURCE = path.resolve(__dirname, 'database.sqlite');

// Función para crear la tabla de solicitudes
const crearTablaSolicitudes = () => {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS solicitudes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      tipo TEXT,
      descripcion TEXT,
      estado TEXT CHECK(estado IN ('pendiente', 'aprobada', 'rechazada', 'resuelta', 'en revisión')) NOT NULL DEFAULT 'pendiente',
      fecha TEXT,
      respuesta TEXT,
      numero_radicado TEXT,
      categoria TEXT,
      archivos_adjuntos TEXT,
      tiene_adjuntos INTEGER DEFAULT 0,
      historial_estados TEXT,
      fecha_resolucion TEXT,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )`, (err) => {
      if (err) {
        console.error('Error al crear tabla solicitudes:', err.message);
        reject(err);
      } else {
        console.log('Tabla solicitudes creada o ya existente');
        resolve();
      }
    });
  });
};

// Función para insertar usuario base con hash
const insertUser = (id, nombre, email, password, rol) => {
  return new Promise((resolve, reject) => {
    const insert = 'INSERT OR IGNORE INTO students (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)';
    const saltRounds = 10;
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      else {
        db.run(insert, [id, nombre, email, hash, rol], (err) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
};

// Función para insertar solicitudes de ejemplo
const insertarSolicitudesEjemplo = () => {
  return new Promise((resolve, reject) => {
    const fecha = new Date().toISOString();
    const historialEstados = JSON.stringify([{
      estado: 'pendiente',
      fecha: fecha,
      comentario: 'Solicitud radicada'
    }]);
    
    const solicitudes = [
      {
        student_id: 2,
        tipo: 'Petición',
        descripcion: 'Solicito información sobre el proceso de matrícula para el próximo semestre',
        estado: 'pendiente',
        fecha: fecha,
        numero_radicado: 'PQRSF-2025-05-00001',
        categoria: 'Académico',
        historial_estados: historialEstados
      },
      {
        student_id: 2,
        tipo: 'Queja',
        descripcion: 'Queja formal por problemas con el sistema de inscripción de materias',
        estado: 'en revisión',
        fecha: fecha,
        numero_radicado: 'PQRSF-2025-05-00002',
        categoria: 'Sistemas',
        historial_estados: historialEstados
      },
      {
        student_id: 2,
        tipo: 'Reclamo',
        descripcion: 'Reclamo por calificación incorrecta en la materia de Cálculo III',
        estado: 'pendiente',
        fecha: fecha,
        numero_radicado: 'PQRSF-2025-05-00003',
        categoria: 'Académico',
        historial_estados: historialEstados
      }
    ];
    
    const insertSql = `INSERT INTO solicitudes 
      (student_id, tipo, descripcion, estado, fecha, numero_radicado, categoria, historial_estados) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // Insertar las solicitudes una por una
    const insertarSolicitud = (index) => {
      if (index >= solicitudes.length) {
        console.log('Solicitudes de ejemplo insertadas correctamente');
        resolve();
        return;
      }
      
      const sol = solicitudes[index];
      db.run(insertSql, [
        sol.student_id,
        sol.tipo,
        sol.descripcion,
        sol.estado,
        sol.fecha,
        sol.numero_radicado,
        sol.categoria,
        sol.historial_estados
      ], (err) => {
        if (err) {
          console.error('Error al insertar solicitud de ejemplo:', err);
          // Continuamos con la siguiente solicitud aunque haya error
        }
        insertarSolicitud(index + 1);
      });
    };
    
    insertarSolicitud(0);
  });
};

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos SQLite:', err.message);
    throw err;
  } else {
    console.log('Conectado a la base de datos SQLite.');

    // Crear tabla students
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      rol TEXT CHECK(rol IN ('student', 'admin')) NOT NULL DEFAULT 'student'
    )`, async (err) => {
      if (err) {
        console.error('Error al crear tabla students:', err.message);
      } else {
        console.log('Tabla students creada o ya existente');
        
        try {
          // Insertar usuarios base
          await insertUser(1, 'Admin Base', 'admin@example.com', 'admin123', 'admin');
          await insertUser(2, 'Estudiante Base', 'student@example.com', 'student123', 'student');
          console.log('Usuarios base insertados correctamente');
          
          // Crear tabla de solicitudes
          await crearTablaSolicitudes();
          
          // Insertar solicitudes de ejemplo
          await insertarSolicitudesEjemplo();
          
          // Verificar que todo se ha creado correctamente
          db.all('SELECT * FROM students', [], (err, rows) => {
            if (err) {
              console.error('Error al consultar usuarios:', err.message);
            } else {
              console.log('Usuarios registrados:', rows);
            }
          });
          
          db.all('SELECT * FROM solicitudes', [], (err, rows) => {
            if (err) {
              console.error('Error al consultar solicitudes:', err.message);
            } else {
              console.log(`Total de solicitudes: ${rows.length}`);
            }
          });
        } catch (error) {
          console.error('Error durante la inicialización de la base de datos:', error);
        }
      }
    });
  }
});

module.exports = db;
