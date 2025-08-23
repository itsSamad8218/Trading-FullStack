// Real-time stock market data simulation
export const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

// Generate realistic stock prices
const generateStockPrice = (symbol, basePrice) => {
  const change = (Math.random() - 0.5) * 0.1; // ±5% change
  const newPrice = basePrice * (1 + change);
  const changePercent = ((newPrice - basePrice) / basePrice * 100);
  
  return {
    symbol,
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat((newPrice - basePrice).toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
  };
};

// Base prices for stocks
const basePrices = {
  AAPL: 175.50,
  GOOGL: 2750.80,
  MSFT: 415.25,
  AMZN: 3200.15,
  TSLA: 850.75,
  NVDA: 485.60,
  META: 325.40,
  NFLX: 450.85
};

// Generate historical data for charts
export const generateHistoricalData = (symbol, days = 30) => {
  const data = [];
  const basePrice = basePrices[symbol];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.03; // 3% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice * (1 + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 500000,
    });
  }
  
  return data;
};

// Live stock data generator
export const generateLiveStockData = () => {
  return stockSymbols.map(symbol => 
    generateStockPrice(symbol, basePrices[symbol])
  );
};

// Market overview data
export const marketOverviewData = [
  {
    index: 'S&P 500',
    value: '4,567.89',
    change: '+23.45',
    changePercent: '+0.52%',
    trend: 'up'
  },
  {
    index: 'NASDAQ',
    value: '14,234.56',
    change: '-45.67',
    changePercent: '-0.32%',
    trend: 'down'
  },
  {
    index: 'DOW JONES',
    value: '35,123.78',
    change: '+78.90',
    changePercent: '+0.23%',
    trend: 'up'
  },
  {
    index: 'RUSSELL 2000',
    value: '2,156.43',
    change: '+12.34',
    changePercent: '+0.58%',
    trend: 'up'
  }
];

// Portfolio data
export const portfolioData = [
  {
    symbol: 'AAPL',
    shares: 50,
    avgPrice: 165.50,
    currentPrice: 175.50,
    totalValue: 8775,
    gainLoss: 500,
    gainLossPercent: 6.04
  },
  {
    symbol: 'GOOGL',
    shares: 5,
    avgPrice: 2650.00,
    currentPrice: 2750.80,
    totalValue: 13754,
    gainLoss: 504,
    gainLossPercent: 3.80
  },
  {
    symbol: 'MSFT',
    shares: 25,
    avgPrice: 400.00,
    currentPrice: 415.25,
    totalValue: 10381.25,
    gainLoss: 381.25,
    gainLossPercent: 3.81
  }
];

// News data
export const marketNews = [
  {
    id: 1,
    title: "Apple Reports Strong Q4 Earnings, Stock Rises 3%",
    summary: "Apple Inc. exceeded analyst expectations with strong iPhone sales and services revenue growth.",
    timestamp: "2 hours ago",
    sentiment: "positive"
  },
  {
    id: 2,
    title: "Federal Reserve Maintains Interest Rates",
    summary: "The Fed keeps rates steady amid economic uncertainty, markets react positively.",
    timestamp: "4 hours ago",
    sentiment: "neutral"
  },
  {
    id: 3,
    title: "Tech Stocks Rally on AI Optimism",
    summary: "Major technology companies see gains as investors remain bullish on artificial intelligence prospects.",
    timestamp: "6 hours ago",
    sentiment: "positive"
  },
  {
    id: 4,
    title: "Energy Sector Faces Headwinds",
    summary: "Oil prices decline as global demand concerns weigh on energy stocks.",
    timestamp: "8 hours ago",
    sentiment: "negative"
  }
];

// Sector performance data
export const sectorData = [
  { name: 'Technology', value: 28.5, change: 2.3 },
  { name: 'Healthcare', value: 15.2, change: -0.8 },
  { name: 'Financial', value: 13.8, change: 1.2 },
  { name: 'Consumer Discretionary', value: 12.1, change: -1.5 },
  { name: 'Communication', value: 10.4, change: 0.9 },
  { name: 'Industrials', value: 8.7, change: 0.3 },
  { name: 'Energy', value: 6.2, change: -2.1 },
  { name: 'Utilities', value: 5.1, change: 0.7 }
];