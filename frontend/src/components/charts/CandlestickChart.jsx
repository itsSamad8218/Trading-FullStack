import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ data, symbol, timeframe = '1D' }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candlestickSeriesRef = useRef();
  const volumeSeriesRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#1e293b' },
        textColor: '#e2e8f0',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#3b82f6',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#3b82f6',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: '#334155',
        textColor: '#e2e8f0',
      },
      timeScale: {
        borderColor: '#334155',
        textColor: '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeriesRef.current = volumeSeries;

    // Set data
    const candlestickData = data.map(item => ({
      time: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    const volumeData = data.map(item => ({
      time: item.date,
      value: item.volume,
      color: item.close >= item.open ? '#10b981' : '#ef4444',
    }));

    candlestickSeries.setData(candlestickData);
    volumeSeries.setData(volumeData);

    // Fit content
    chart.timeScale().fitContent();

    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  // Add technical indicators
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current || !data || data.length === 0) return;

    const chart = chartRef.current;
    const candlestickSeries = candlestickSeriesRef.current;

    // Calculate and add Moving Averages
    const calculateSMA = (period) => {
      const smaData = [];
      for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
        const sma = sum / period;
        smaData.push({
          time: data[i].date,
          value: sma,
        });
      }
      return smaData;
    };

    // Add 20-day SMA
    const sma20Data = calculateSMA(20);
    if (sma20Data.length > 0) {
      const sma20Series = chart.addLineSeries({
        color: '#f59e0b',
        lineWidth: 2,
        title: 'SMA 20',
      });
      sma20Series.setData(sma20Data);
    }

    // Add 50-day SMA
    const sma50Data = calculateSMA(50);
    if (sma50Data.length > 0) {
      const sma50Series = chart.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'SMA 50',
      });
      sma50Series.setData(sma50Data);
    }

    // Calculate RSI
    const calculateRSI = (period = 14) => {
      const rsiData = [];
      for (let i = period; i < data.length; i++) {
        let gains = 0;
        let losses = 0;
        
        for (let j = i - period + 1; j <= i; j++) {
          const change = data[j].close - data[j - 1].close;
          if (change > 0) {
            gains += change;
          } else {
            losses -= change;
          }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        rsiData.push({
          time: data[i].date,
          value: rsi,
        });
      }
      return rsiData;
    };

    // Add RSI panel
    const rsiData = calculateRSI();
    if (rsiData.length > 0) {
      const rsiPane = chart.addPane(150, {
        background: { color: '#1e293b' },
        textColor: '#e2e8f0',
      });

      const rsiSeries = rsiPane.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
        title: 'RSI',
      });

      rsiSeries.setData(rsiData);

      // Add RSI overbought/oversold lines
      const overboughtSeries = rsiPane.addLineSeries({
        color: '#ef4444',
        lineWidth: 1,
        lineStyle: 2,
        title: 'Overbought (70)',
      });

      const oversoldSeries = rsiPane.addLineSeries({
        color: '#10b981',
        lineWidth: 1,
        lineStyle: 2,
        title: 'Oversold (30)',
      });

      overboughtSeries.setData(rsiData.map(item => ({ ...item, value: 70 })));
      oversoldSeries.setData(rsiData.map(item => ({ ...item, value: 30 })));
    }

  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol} Chart</h3>
          <p className="text-sm text-gray-400">Timeframe: {timeframe}</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600">
            1D
          </button>
          <button className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600">
            1W
          </button>
          <button className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600">
            1M
          </button>
          <button className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600">
            3M
          </button>
          <button className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600">
            1Y
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-4">
        <div ref={chartContainerRef} className="w-full" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-lg font-semibold text-white">
            ${data[data.length - 1]?.close?.toFixed(2) || 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">24h Change</div>
          <div className={`text-lg font-semibold ${
            data[data.length - 1]?.close >= data[data.length - 2]?.close 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            {data.length >= 2 ? (
              `${((data[data.length - 1].close - data[data.length - 2].close) / data[data.length - 2].close * 100).toFixed(2)}%`
            ) : 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Volume</div>
          <div className="text-lg font-semibold text-white">
            {data[data.length - 1]?.volume?.toLocaleString() || 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">High/Low</div>
          <div className="text-lg font-semibold text-white">
            ${data[data.length - 1]?.high?.toFixed(2) || 'N/A'} / ${data[data.length - 1]?.low?.toFixed(2) || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
