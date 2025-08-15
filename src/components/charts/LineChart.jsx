import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateHistoricalData, stockSymbols } from '../../data/stockData';

const LineChartComponent = () => {
  const [data, setData] = useState([]);
  const [selectedStocks] = useState(['AAPL', 'GOOGL', 'MSFT']);

  useEffect(() => {
    const combinedData = [];
    const baseData = generateHistoricalData('AAPL', 30);
    
    baseData.forEach((item, index) => {
      const dataPoint = { date: item.date };
      selectedStocks.forEach(stock => {
        const stockData = generateHistoricalData(stock, 30);
        dataPoint[stock] = stockData[index]?.price || 0;
      });
      combinedData.push(dataPoint);
    });
    
    setData(combinedData);
  }, []);

  const colors = ['#3B82F6', '#10B981', '#F59E0B'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
          <p className="text-gray-300 text-sm">{`Date: ${label}`}</p>
          {payload.map((item, index) => (
            <p key={index} className="font-semibold" style={{ color: item.color }}>
              {`${item.dataKey}: $${item.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          {selectedStocks.map((stock, index) => (
            <Line 
              key={stock}
              type="monotone" 
              dataKey={stock} 
              stroke={colors[index]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: colors[index] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;