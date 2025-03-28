const express = require('express');
const authRoutes = require('./routes/authRoutes.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});