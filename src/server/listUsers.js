const db = require('./database');

db.all('SELECT id, nombre, email, rol FROM students', [], (err, rows) => {
  if (err) {
    console.error('Error al consultar usuarios:', err.message);
  } else {
    console.log('Usuarios registrados:');
    rows.forEach(row => {
      console.log(`${row.id} | ${row.nombre} | ${row.email} | ${row.rol}`);
    });
  }
  process.exit();
});
