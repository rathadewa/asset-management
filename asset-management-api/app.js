const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
