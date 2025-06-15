const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Andi' },
    { id: 2, name: 'Budi' }
  ]);
});

// POST new user
router.post('/', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ id: 3, name });
});

module.exports = router;
