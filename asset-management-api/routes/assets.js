const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// POST: Tambah asset
router.post('/', verifyToken, (req, res) => {
  const {
    asset_name,
    category,
    status,
    location,
    created_by,
    updated_by
  } = req.body;

  // Validasi field wajib
  if (!asset_name || !category || !status || !location || !created_by) {
    return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
  }

  // Generate asset_id otomatis
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const datePart = dd + mm + yy;
  const prefix = `A${datePart}`;

  // Ambil asset_id terakhir yang pakai prefix sama
  const getLastIdSql = `
    SELECT asset_id FROM tb_assets
    WHERE asset_id LIKE '${prefix}%'
    ORDER BY asset_id DESC
    LIMIT 1
  `;

  db.query(getLastIdSql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil asset_id terakhir:', err);
      return res.status(500).json({ error: 'Gagal mengambil asset_id terakhir' });
    }

    let nextNumber = 1;
    if (results.length > 0 && results[0].asset_id) {
      const lastId = results[0].asset_id; // contoh: A1806250009
      const match = lastId.match(/^A\d{6}(\d{4})$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const increment = String(nextNumber).padStart(4, '0');
    const asset_id = `${prefix}${increment}`; // Contoh: A1806250001

    const insertSql = `
      INSERT INTO tb_assets 
      (asset_id, asset_name, category, status, location, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      asset_id,
      asset_name,
      category,
      status,
      location,
      created_by,
      updated_by || created_by
    ];

    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Gagal menambahkan asset:', err);
        return res.status(500).json({ error: 'Gagal menambahkan asset' });
      }

      res.status(201).json({
        message: 'Asset berhasil ditambahkan',
        asset_id
      });
    });
  });
});



// GET: Ambil semua data aset
router.get('/', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM tb_assets';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data assets:', err);
      return res.status(500).json({ error: 'Gagal mengambil data assets' });
    }

    res.json({
      message: 'Data assets berhasil diambil',
      data: results
    });
  });
});

// GET asset berdasarkan asset_id dari JSON body
router.post('/get', verifyToken, (req, res) => {
  const { asset_id } = req.body;

  if (!asset_id) {
    return res.status(400).json({ error: 'asset_id wajib dikirim' });
  }

  const sql = 'SELECT * FROM tb_assets WHERE asset_id = ?';
  db.query(sql, [asset_id], (err, results) => {
    if (err) {
      console.error('Gagal mengambil data asset:', err);
      return res.status(500).json({ error: 'Gagal mengambil data asset' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Asset tidak ditemukan' });
    }

    res.json({ asset: results[0] });
  });
});

// PUT: Update data asset berdasarkan asset_id
router.put('/', verifyToken, (req, res) => {
  const {
    asset_id,
    asset_name,
    category,
    status,
    location,
    updated_by
  } = req.body;

  // Validasi input wajib
  if (!asset_id || !asset_name || !category || !status || !location || !updated_by) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const sql = `
    UPDATE tb_assets 
    SET asset_name = ?, category = ?, status = ?, location = ?, updated_by = ?
    WHERE asset_id = ?
  `;

  const values = [
    asset_name,
    category,
    status,
    location,
    updated_by,
    asset_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Gagal mengupdate asset:', err);
      return res.status(500).json({ error: 'Gagal mengupdate asset' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asset tidak ditemukan' });
    }

    res.json({
      message: 'Asset berhasil diperbarui',
      asset_id
    });
  });
});

// DELETE: Hapus asset berdasarkan asset_id dari body JSON
router.delete('/', verifyToken, (req, res) => {
  const { asset_id } = req.body;

  if (!asset_id) {
    return res.status(400).json({ error: 'asset_id wajib dikirim dalam body' });
  }

  const sql = 'DELETE FROM tb_assets WHERE asset_id = ?';

  db.query(sql, [asset_id], (err, result) => {
    if (err) {
      console.error('Gagal menghapus asset:', err);
      return res.status(500).json({ error: 'Gagal menghapus asset' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asset tidak ditemukan' });
    }

    res.json({
      message: 'Asset berhasil dihapus',
      asset_id
    });
  });
});


module.exports = router;
