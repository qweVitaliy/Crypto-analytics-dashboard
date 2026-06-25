function StatCard({ label, value, valueColor = 'text-white' }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function CoinStats({ details }) {
  if (!details) return null;

  const fmt = (n) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const fmtBig = (n) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return fmt(n);
  };

  const change24h = details.price_change_24h;
  const isPositive24h = change24h >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard label="Поточна ціна" value={fmt(details.current_price)} />
      <StatCard
        label="Зміна за 24г"
        value={`${isPositive24h ? '+' : ''}${change24h?.toFixed(2)}%`}
        valueColor={isPositive24h ? 'text-green-400' : 'text-red-400'}
      />
      <StatCard label="Максимум 24г" value={fmt(details.high_24h)} />
      <StatCard label="Мінімум 24г" value={fmt(details.low_24h)} />
      <StatCard label="Ринкова капіталізація" value={fmtBig(details.market_cap)} />
      <StatCard label="Обʼєм торгів (24г)" value={fmtBig(details.total_volume)} />
      <StatCard label="Ринковий ранг" value={`#${details.market_cap_rank}`} />
      <StatCard
        label="ATH (історичний максимум)"
        value={fmt(details.ath)}
        valueColor="text-amber-400"
      />
    </div>
  );
}

export default CoinStats;