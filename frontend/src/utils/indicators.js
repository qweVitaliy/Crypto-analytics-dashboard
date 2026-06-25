// Просте ковзне середнє (SMA)
export function calculateSMA(data, period) {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, d) => sum + d.close, 0) / period;
    result.push({ time: data[i].time, value: avg });
  }
  return result;
}

// Експоненційне ковзне середнє (EMA)
export function calculateEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);
  let emaPrev = data[0].close;

  data.forEach((d, i) => {
    const ema = i === 0 ? d.close : d.close * k + emaPrev * (1 - k);
    emaPrev = ema;
    if (i >= period - 1) {
      result.push({ time: d.time, value: ema });
    }
  });

  return result;
}

// Індекс відносної сили (RSI)
export function calculateRSI(data, period = 14) {
  const result = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    result.push({ time: data[i].time, value: rsi });
  }

  return result;
}