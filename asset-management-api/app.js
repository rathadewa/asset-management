const express = require('express');
const authRoutes = require('./routes/auth');
const app = express();
const port = 3009;

app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const assetRoutes = require('./routes/assets');
app.use('/api/assets', assetRoutes);

const requestRoutes = require('./routes/requests'); // ← Tambahkan ini
app.use('/api/requests', requestRoutes);

app.use(express.json());
app.use('/api/auth', authRoutes);

app.use(cors({
    origin: 'http://34.101.34.165:3001'  // sesuaikan IP public frontend kamu
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
