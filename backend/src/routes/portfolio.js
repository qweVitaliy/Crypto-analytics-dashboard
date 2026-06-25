const express = require('express');
const axios = require('axios');
const pool = require('../db');
const { cachedGet } = require('../utils/cache');
const router = express.Router();

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const { rows: assets } = await pool.query(
      'SELECT * FROM portfolio_assets ORDER BY created_at DESC'
    );

    if (assets.length === 0) {
      return res.json([]);
    }

    const uniqueCoinIds = [...new Set(assets.map((a) => a.coin_id))];

    const marketData = await cachedGet(axios, 'https://api.coingecko.com/api/v3/coins/markets', {
      vs_currency: 'usd',
      ids: uniqueCoinIds.join(','),
    });

    const priceMap = {};
    marketData.forEach((coin) => {
      priceMap[coin.id] = coin.current_price;
    });

    const result = assets.map((asset) => {
      const currentPrice = priceMap[asset.coin_id] || 0;
      const invested = parseFloat(asset.amount) * parseFloat(asset.buy_price);
      const currentValue = parseFloat(asset.amount) * currentPrice;
      const profitLoss = currentValue - invested;
      const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;

      return {
        ...asset,
        current_price: currentPrice,
        invested: invested.toFixed(2),
        current_value: currentValue.toFixed(2),
        profit_loss: profitLoss.toFixed(2),
        profit_loss_percent: profitLossPercent.toFixed(2),
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Помилка отримання портфеля:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати портфель' });
  }
});

// POST /api/portfolio
router.post('/', async (req, res) => {
  try {
    const { coin_id, amount, buy_price, buy_date } = req.body;

    if (!coin_id || !amount || !buy_price) {
      return res.status(400).json({ error: 'Заповніть всі обов\'язкові поля' });
    }

    const { rows } = await pool.query(
      `INSERT INTO portfolio_assets (coin_id, amount, buy_price, buy_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [coin_id, amount, buy_price, buy_date || new Date()]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Помилка додавання активу:', err.message);
    res.status(500).json({ error: 'Не вдалося додати актив' });
  }
});

// DELETE /api/portfolio/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM portfolio_assets WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Помилка видалення активу:', err.message);
    res.status(500).json({ error: 'Не вдалося видалити актив' });
  }
});

module.exports = router;