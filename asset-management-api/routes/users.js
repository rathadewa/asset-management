// routes/user.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET semua user (opsional, tidak menampilkan password jika perlu)
router.get('/', (req, res) => {
  db.query('SELECT user_id FROM tb_user', (err, results) => {
    if (err) {
      console.error('Gagal mengambil data:', err);
      res.status(500).json({ error: 'Gagal mengambil data user' });
    } else {
      res.json(results);
    }
  });
});

// POST tambah user
router.post('/', (req, res) => {
  const { user_id, user_password } = req.body;

  if (!user_id || !user_password) {
    return res.status(400).json({ error: 'user_id dan user_password wajib diisi' });
  }

  const sql = 'INSERT INTO tb_user (user_id, user_password) VALUES (?, ?)';
  db.query(sql, [user_id, user_password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'User sudah terdaftar' });
      }
      console.error('Gagal menambahkan user:', err);
      res.status(500).json({ error: 'Gagal menambahkan user' });
    } else {
      res.status(201).json({
        message: 'User berhasil ditambahkan',
        user_id: user_id
      });
    }
  });
});

// DELETE user dari body (bukan dari URL)
router.delete('/', (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id wajib diisi' });
  }

  const sql = 'DELETE FROM tb_user WHERE user_id = ?';
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error('Gagal menghapus user:', err);
      return res.status(500).json({ error: 'Gagal menghapus user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil dihapus', user_id });
  });
});

// UPDATE password user berdasarkan user_id
router.put('/', (req, res) => {
  const { user_id, user_password } = req.body;

  if (!user_id || !user_password) {
    return res.status(400).json({ error: 'user_id dan user_password wajib diisi' });
  }

  const sql = 'UPDATE tb_user SET user_password = ? WHERE user_id = ?';
  db.query(sql, [user_password, user_id], (err, result) => {
    if (err) {
      console.error('Gagal mengupdate user:', err);
      return res.status(500).json({ error: 'Gagal mengupdate user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({
      message: 'Password user berhasil diperbarui',
      user_id
    });
  });
});


module.exports = router;
