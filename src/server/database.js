const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const DBSOURCE = path.resolve(__dirname, 'database.sqlite');

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
    )`, (err) => {
      if (err) {
        console.error('Error al crear tabla students:', err.message);
      } else {
        // Insertar usuarios base si no existen
        const insert = 'INSERT OR IGNORE INTO students (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)';
        const saltRounds = 10;

        // Función para insertar usuario base con hash
        const insertUser = (id, nombre, email, password, rol) => {
          return new Promise((resolve, reject) => {
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

        // Insertar usuarios base secuencialmente
        (async () => {
          try {
            await insertUser(1, 'Admin Base', 'admin@example.com', 'admin123', 'admin');
            await insertUser(2, 'Estudiante Base', 'student@example.com', 'student123', 'student');
            console.log('Usuarios base insertados correctamente.');
          } catch (error) {
            console.error('Error al insertar usuarios base:', error);
          }
        })();
      }
    });

    // Crear tabla solicitudes
    db.run(`CREATE TABLE IF NOT EXISTS solicitudes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      tipo TEXT,
      descripcion TEXT,
      estado TEXT CHECK(estado IN ('pendiente', 'aprobada', 'rechazada', 'respondida')) NOT NULL DEFAULT 'pendiente',
      fecha TEXT,
      respuesta TEXT,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )`, (err) => {
      if (err) {
        console.error('Error al crear tabla solicitudes:', err.message);
      }
    });
  }
});

module.exports = db;
