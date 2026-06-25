import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries, ColorType } from 'lightweight-charts';
import { calculateSMA, calculateEMA, calculateRSI } from '../utils/indicators';

function CandlestickChart({ data }) {
  const containerRef = useRef(null);
  const rsiContainerRef = useRef(null);
  const chartRef = useRef(null);
  const rsiChartRef = useRef(null);
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(true);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    // основний графік свічок
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1e293b' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: containerRef.current.clientWidth,
      height: 350,
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    candleSeries.setData(data);

    if (showSMA) {
      const smaData = calculateSMA(data, 14);
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#f59e0b',
        lineWidth: 2,
        title: 'SMA 14',
      });
      smaSeries.setData(smaData);
    }

    if (showEMA) {
      const emaData = calculateEMA(data, 14);
      const emaSeries = chart.addSeries(LineSeries, {
        color: '#3b82f6',
        lineWidth: 2,
        title: 'EMA 14',
      });
      emaSeries.setData(emaData);
    }

    chart.timeScale().fitContent();

    // окремий графік RSI під основним
    let rsiChart;
    if (showRSI && rsiContainerRef.current) {
      rsiChart = createChart(rsiContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1e293b' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#334155' },
          horzLines: { color: '#334155' },
        },
        width: rsiContainerRef.current.clientWidth,
        height: 120,
        timeScale: { timeVisible: true, secondsVisible: false },
      });
      rsiChartRef.current = rsiChart;

      const rsiData = calculateRSI(data, 14);
      const rsiSeries = rsiChart.addSeries(LineSeries, {
        color: '#a855f7',
        lineWidth: 2,
        title: 'RSI 14',
      });
      rsiSeries.setData(rsiData);
      rsiChart.timeScale().fitContent();

      // синхронізація скролу/зуму між графіками
      chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range) rsiChart.timeScale().setVisibleLogicalRange(range);
      });
    }

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
      if (rsiChart) rsiChart.applyOptions({ width: rsiContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (rsiChart) rsiChart.remove();
    };
  }, [data, showSMA, showEMA, showRSI]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowSMA(!showSMA)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            showSMA ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-900 text-slate-500 border border-slate-700'
          }`}
        >
          SMA 14
        </button>
        <button
          onClick={() => setShowEMA(!showEMA)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            showEMA ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-900 text-slate-500 border border-slate-700'
          }`}
        >
          EMA 14
        </button>
        <button
          onClick={() => setShowRSI(!showRSI)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            showRSI ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-slate-900 text-slate-500 border border-slate-700'
          }`}
        >
          RSI 14
        </button>
      </div>

      <div ref={containerRef} />
      {showRSI && (
        <div className="mt-2">
          <p className="text-xs text-slate-500 mb-1">RSI (14)</p>
          <div ref={rsiContainerRef} />
        </div>
      )}
    </div>
  );
}

export default CandlestickChart;