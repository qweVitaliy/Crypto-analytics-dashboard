import { TrendingUp, TrendingDown } from 'lucide-react';

function PortfolioSummary({ assets }) {
  const totalInvested = assets.reduce((sum, a) => sum + parseFloat(a.invested), 0);
  const totalCurrentValue = assets.reduce((sum, a) => sum + parseFloat(a.current_value), 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0
    ? (totalProfitLoss / totalInvested) * 100
    : 0;

  const isPositive = totalProfitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400 text-sm mb-1">Загальна вартість</p>
        <p className="text-3xl font-bold text-white">
          ${totalCurrentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400 text-sm mb-1">Інвестовано</p>
        <p className="text-3xl font-bold text-white">
          ${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400 text-sm mb-1">Прибуток / Збиток</p>
        <div className="flex items-center gap-2">
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}${totalProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          {isPositive ? (
            <TrendingUp className="text-green-400" size={24} />
          ) : (
            <TrendingDown className="text-red-400" size={24} />
          )}
        </div>
        <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default PortfolioSummary;