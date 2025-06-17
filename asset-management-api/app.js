const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const assetRoutes = require('./routes/assets');
app.use('/api/assets', assetRoutes);

const requestRoutes = require('./routes/requests'); // ← Tambahkan ini
app.use('/api/requests', requestRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
