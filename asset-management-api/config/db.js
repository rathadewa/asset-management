// config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // ganti jika user MySQL kamu berbeda
  password: '',         // ganti dengan password MySQL kamu
  database: 'db_asset_management'
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
  } else {
    console.log('Terhubung ke database MySQL');
  }
});

module.exports = connection;
