const express = require('express');
const axios = require('axios');
const { cachedGet } = require('../utils/cache');
const router = express.Router();

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// GET /api/coins/prices?ids=bitcoin,ethereum,...
router.get('/prices', async (req, res) => {
  try {
    const ids = req.query.ids || 'bitcoin,ethereum,solana,cardano,ripple,dogecoin,polkadot,litecoin,chainlink,avalanche-2';

    const data = await cachedGet(axios, `${COINGECKO_BASE}/coins/markets`, {
      vs_currency: 'usd',
      ids,
      order: 'market_cap_desc',
      sparkline: true,
      price_change_percentage: '1h,24h,7d',
    });

    res.json(data);
  } catch (err) {
    console.error('Помилка отримання цін:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати ціни' });
  }
});

// GET /api/coins/top?limit=50
router.get('/top', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const data = await cachedGet(axios, `${COINGECKO_BASE}/coins/markets`, {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: 1,
      sparkline: false,
    });
    res.json(data);
  } catch (err) {
    console.error('Помилка отримання топ монет:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати список монет' });
  }
});

// GET /api/coins/:id/history?days=7
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const days = req.query.days || 7;

    const data = await cachedGet(axios, `${COINGECKO_BASE}/coins/${id}/market_chart`, {
      vs_currency: 'usd',
      days,
    });

    res.json(data);
  } catch (err) {
    console.error('Помилка отримання історії:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати історію цін' });
  }
});

// GET /api/coins/:id/ohlc?days=7
router.get('/:id/ohlc', async (req, res) => {
  try {
    const { id } = req.params;
    const days = req.query.days || 7;

    const rawData = await cachedGet(axios, `${COINGECKO_BASE}/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days,
    });

    const formatted = rawData.map(([time, open, high, low, close]) => ({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Помилка отримання OHLC:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати дані свічок' });
  }
});

// GET /api/coins/:id/details
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cachedGet(axios, `${COINGECKO_BASE}/coins/${id}`, {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
    });

    res.json({
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image.large,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
      total_volume: data.market_data.total_volume.usd,
      high_24h: data.market_data.high_24h.usd,
      low_24h: data.market_data.low_24h.usd,
      price_change_24h: data.market_data.price_change_percentage_24h,
      price_change_7d: data.market_data.price_change_percentage_7d,
      price_change_30d: data.market_data.price_change_percentage_30d,
      ath: data.market_data.ath.usd,
      ath_change_percentage: data.market_data.ath_change_percentage.usd,
      atl: data.market_data.atl.usd,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
    });
  } catch (err) {
    console.error('Помилка отримання деталей монети:', err.message);
    res.status(500).json({ error: 'Не вдалося отримати деталі монети' });
  }
});

module.exports = router;