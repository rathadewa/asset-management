const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST: Tambah asset
router.post('/', (req, res) => {
  const {
    asset_id,
    asset_name,
    category,
    status,
    location,
    created_by,
    updated_by
  } = req.body;

  // Validasi field wajib
  if (!asset_id || !asset_name || !category || !status || !location || !created_by) {
    return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
  }

  const sql = `
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
    updated_by || created_by // Jika updated_by kosong, gunakan created_by
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Gagal menambahkan asset:', err);
      return res.status(500).json({ error: 'Gagal menambahkan asset' });
    }

    res.status(201).json({
      message: 'Asset berhasil ditambahkan',
      asset_id: asset_id
    });
  });
});

// GET: Ambil semua data aset
router.get('/', (req, res) => {
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

// PUT: Update data asset berdasarkan asset_id
router.put('/', (req, res) => {
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
router.delete('/', (req, res) => {
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
