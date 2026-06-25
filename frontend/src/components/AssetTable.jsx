import { Trash2 } from 'lucide-react';

function AssetTable({ assets, onDelete }) {
  if (assets.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
        <p className="text-slate-400">Портфель порожній. Додайте першу монету.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-900/50 text-slate-400 text-sm">
          <tr>
            <th className="px-4 py-3">Монета</th>
            <th className="px-4 py-3">Кількість</th>
            <th className="px-4 py-3">Ціна купівлі</th>
            <th className="px-4 py-3">Поточна ціна</th>
            <th className="px-4 py-3">P/L</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const isPositive = parseFloat(asset.profit_loss) >= 0;
            return (
              <tr key={asset.id} className="border-t border-slate-700">
                <td className="px-4 py-3 text-white font-medium uppercase">
                  {asset.coin_id}
                </td>
                <td className="px-4 py-3 text-slate-300">{asset.amount}</td>
                <td className="px-4 py-3 text-slate-300">
                  ${parseFloat(asset.buy_price).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  ${parseFloat(asset.current_price).toLocaleString()}
                </td>
                <td className={`px-4 py-3 font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}${asset.profit_loss} ({asset.profit_loss_percent}%)
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(asset.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTable;