import { useState } from 'react';
import { X } from 'lucide-react';
import { addAsset } from '../api/client';

const POPULAR_COINS = [
  { id: 'bitcoin', label: 'Bitcoin (BTC)' },
  { id: 'ethereum', label: 'Ethereum (ETH)' },
  { id: 'solana', label: 'Solana (SOL)' },
  { id: 'cardano', label: 'Cardano (ADA)' },
  { id: 'ripple', label: 'XRP' },
  { id: 'dogecoin', label: 'Dogecoin (DOGE)' },
];

function AddAssetModal({ onClose, onAdded }) {
  const [coinId, setCoinId] = useState('bitcoin');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !buyPrice) {
      setError('Заповніть всі поля');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await addAsset({
        coin_id: coinId,
        amount: parseFloat(amount),
        buy_price: parseFloat(buyPrice),
      });
      onAdded();
      onClose();
    } catch (err) {
      setError('Не вдалося додати актив. Спробуйте ще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Додати актив</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Монета</label>
            <select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              {POPULAR_COINS.map((coin) => (
                <option key={coin.id} value={coin.id}>{coin.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Кількість</label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.5"
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Ціна купівлі (USD)</label>
            <input
              type="number"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="50000"
              className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 font-medium transition"
          >
            {submitting ? 'Додавання...' : 'Додати'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAssetModal;