import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getCoinHistory } from '../api/client';

const PERIODS = [
  { label: '24г', days: 1 },
  { label: '7д', days: 7 },
  { label: '30д', days: 30 },
  { label: '1р', days: 365 },
];

const COINS = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'solana', label: 'Solana' },
];

function PriceChart() {
  const [coinId, setCoinId] = useState('bitcoin');
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const { data } = await getCoinHistory(coinId, days);
        const formatted = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            ...(days <= 1 ? { hour: '2-digit', minute: '2-digit' } : {}),
          }),
          price: parseFloat(price.toFixed(2)),
        }));
        setChartData(formatted);
      } catch (err) {
        console.error('Помилка завантаження графіка:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [coinId, days]);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex gap-2">
          {COINS.map((coin) => (
            <button
              key={coin.id}
              onClick={() => setCoinId(coin.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                coinId === coin.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {coin.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              onClick={() => setDays(period.days)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                days === period.days
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-slate-400">
          Завантаження графіка...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Ціна']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PriceChart;