import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Bar } from 'recharts';
import { generateHistoricalData, stockSymbols } from '../data/stockData';

const Research = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [days, setDays] = useState(90);
  const data = useMemo(() => generateHistoricalData(symbol, days), [symbol, days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Research</h1>
        <div className="flex items-center gap-3">
          <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-slate-800 text-white border border-slate-600 rounded px-3 py-2">
            {stockSymbols.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={days} onChange={e => setDays(Number(e.target.value))} className="bg-slate-800 text-white border border-slate-600 rounded px-3 py-2">
            <option value={30}>30D</option>
            <option value={90}>3M</option>
            <option value={180}>6M</option>
            <option value={365}>1Y</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151' }} labelStyle={{ color: '#D1D5DB' }} />
            <Area yAxisId="left" type="monotone" dataKey="price" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
            <Bar yAxisId="right" dataKey="volume" barSize={16} fill="#10B981" opacity={0.6} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Research;


