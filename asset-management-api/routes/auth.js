const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Login endpoint
router.post('/login', (req, res) => {
  const { user_id, user_password } = req.body;

  if (!user_id || !user_password) {
    return res.status(400).json({ error: 'user_id dan user_password wajib diisi' });
  }

  const sql = 'SELECT * FROM tb_user WHERE user_id = ? LIMIT 1';
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('🔥 ERROR QUERY:', err);
      return res.status(500).json({ error: 'Kesalahan server' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    const user = results[0];
    
    const hashedPassword = bcrypt.hashSync(user_password, 10);

    

    const passwordMatch = bcrypt.compareSync(user_password, user.user_password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password salah' });
    }

    const token = jwt.sign({ user_id: user.user_id }, 'SECRET_KEY', { expiresIn: '1h' });

    res.json({ message: 'Login berhasil', token });
  });
});

module.exports = router;
