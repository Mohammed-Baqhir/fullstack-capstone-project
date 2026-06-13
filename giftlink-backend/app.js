const express = require('express');
const cors = require('cors');
require('dotenv').config();

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3060;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'GiftLink backend is running' });
});

app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`GiftLink backend running on port ${PORT}`);
});

module.exports = app;
