const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const coinsRouter = require('./routes/coins');
const portfolioRouter = require('./routes/portfolio');
const { cachedGet } = require('./utils/cache');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Crypto Dashboard API працює!' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api/coins', coinsRouter);
app.use('/api/portfolio', portfolioRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Прогріваємо кеш при старті — заздалегідь тягнемо популярні дані
setTimeout(async () => {
  try {
    const axios = require('axios');
    await cachedGet(axios, 'https://api.coingecko.com/api/v3/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: false,
    });
    console.log('Кеш прогрітий: топ-50 монет завантажено');
  } catch (err) {
    console.error('Не вдалося прогріти кеш:', err.message);
  }
}, 1000);