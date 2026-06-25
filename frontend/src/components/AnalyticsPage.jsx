import { useState, useEffect } from 'react';
import { getCoinOHLC, getCoinDetails, getTopCoins } from '../api/client';
import CandlestickChart from './CandlestickChart';
import CoinStats from './CoinStats';

const PERIODS = [
  { label: '7д', days: 7 },
  { label: '30д', days: 30 },
  { label: '90д', days: 90 },
  { label: '1р', days: 365 },
];

function AnalyticsPage() {
  const [coins, setCoins] = useState([]);
  const [coinId, setCoinId] = useState('bitcoin');
  const [days, setDays] = useState(30);
  const [ohlcData, setOhlcData] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // завантажуємо список монет один раз
  useEffect(() => {
    getTopCoins(50).then(({ data }) => setCoins(data)).catch(console.error);
  }, []);

  // завантажуємо дані для вибраної монети
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ohlcRes, detailsRes] = await Promise.all([
          getCoinOHLC(coinId, days),
          getCoinDetails(coinId),
        ]);
        setOhlcData(ohlcRes.data);
        setDetails(detailsRes.data);
      } catch (err) {
        console.error('Помилка завантаження аналітики:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [coinId, days]);

  const filteredCoins = coins.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Пошук монети..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 text-sm focus:outline-none focus:border-blue-500 w-48"
        />
        <select
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 text-sm focus:outline-none focus:border-blue-500"
        >
          {filteredCoins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <div className="flex gap-1 ml-auto">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              onClick={() => setDays(period.days)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                days === period.days
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Завантаження аналітики...</p>
      ) : (
        <>
          <div className="mb-4">
            <CoinStats details={details} />
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <CandlestickChart data={ohlcData} />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;