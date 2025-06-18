// routes/request.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// GET: Ambil semua data dari tb_request
router.get('/',verifyToken, (req, res) => {
  const sql = 'SELECT * FROM tb_request';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data request:', err);
      return res.status(500).json({ error: 'Gagal mengambil data request' });
    }

    res.json(results);
  });
});

// POST: Tambah data request baru
router.post('/', verifyToken, (req, res) => {
  const { asset_id, request_date, created_by, updated_by } = req.body;

  if (!asset_id || !request_date || !created_by || !updated_by) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const prefix = 'REQ';
  const getLastIdSql = `
    SELECT request_id FROM tb_request
    WHERE request_id LIKE '${prefix}%'
    ORDER BY request_id DESC
    LIMIT 1
  `;

  db.query(getLastIdSql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil request_id terakhir:', err);
      return res.status(500).json({ error: 'Gagal mengambil request_id terakhir' });
    }

    let nextNumber = 1;

    if (results.length > 0 && results[0].request_id) {
      const lastId = results[0].request_id;
      const match = lastId.match(/^REQ(\d{4})$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const request_id = `${prefix}${String(nextNumber).padStart(4, '0')}`; // REQ0001, REQ0002, ...

    const insertSql = `
      INSERT INTO tb_request (request_id, asset_id, request_date, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [request_id, asset_id, request_date, created_by, updated_by];

    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Gagal menambahkan data request:', err);
        return res.status(500).json({ error: 'Gagal menambahkan data request' });
      }

      res.status(201).json({
        message: 'Data request berhasil ditambahkan',
        request_id
      });
    });
  });
});



// DELETE request by request_id (dari JSON body)
router.delete('/',verifyToken, (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ error: 'request_id wajib disertakan' });
  }

  const sql = 'DELETE FROM tb_request WHERE request_id = ?';
  db.query(sql, [request_id], (err, result) => {
    if (err) {
      console.error('Gagal menghapus request:', err);
      return res.status(500).json({ error: 'Gagal menghapus request' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request tidak ditemukan' });
    }

    res.json({ message: 'Request berhasil dihapus' });
  });
});

router.put('/',verifyToken, (req, res) => {
  const { request_id, asset_id, request_date, created_by, updated_by } = req.body;

  if (!request_id || !asset_id || !request_date || !created_by || !updated_by) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const sql = `
    UPDATE tb_request 
    SET asset_id = ?, 
        request_date = ?, 
        created_by = ?, 
        updated_by = ?
    WHERE request_id = ?
  `;

  const values = [asset_id, request_date, created_by, updated_by, request_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Gagal mengupdate data request:', err);
      return res.status(500).json({ error: 'Gagal mengupdate data request' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request tidak ditemukan' });
    }

    res.json({ message: 'Request berhasil diperbarui' });
  });
});

// GET request berdasarkan request_id dari JSON body
router.post('/get',verifyToken, (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ error: 'request_id wajib dikirim' });
  }

  const sql = 'SELECT * FROM tb_request WHERE request_id = ?';
  db.query(sql, [request_id], (err, results) => {
    if (err) {
      console.error('Gagal mengambil data request:', err);
      return res.status(500).json({ error: 'Gagal mengambil data request' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Request tidak ditemukan' });
    }

    res.json({ request: results[0] });
  });
});

module.exports = router;
