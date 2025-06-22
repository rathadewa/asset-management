const express = require('express');
const authRoutes = require('./routes/auth');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors({
  origin: 'http://34.101.248.202:3001',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const assetRoutes = require('./routes/assets');
app.use('/api/assets', assetRoutes);

const requestRoutes = require('./routes/requests'); // ← Tambahkan ini
app.use('/api/requests', requestRoutes);

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});