import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Keys (you'll need to get these from the respective services)
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';

// Alpha Vantage API endpoints
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Finnhub API endpoints
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Mock data for demo mode

const mockStockData = {
  AAPL: { price: 175.50, change: 2.30, changePercent: '+1.33%', volume: 45000000 },
  GOOGL: { price: 2750.80, change: -15.20, changePercent: '-0.55%', volume: 12000000 },
  MSFT: { price: 415.25, change: 8.75, changePercent: '+2.15%', volume: 28000000 },
  AMZN: { price: 3200.15, change: 45.85, changePercent: '+1.45%', volume: 18000000 },
  TSLA: { price: 850.75, change: -12.25, changePercent: '-1.42%', volume: 35000000 },
  NVDA: { price: 485.60, change: 18.40, changePercent: '+3.94%', volume: 22000000 },
  META: { price: 325.40, change: 5.60, changePercent: '+1.75%', volume: 15000000 },
  NFLX: { price: 450.85, change: -8.15, changePercent: '-1.78%', volume: 8000000 }
};

// Default route for root
app.get('/', (req, res) => {
  res.send('StockPulse backend is running.');
});



const mockMarketIndices = [
  { index: 'S&P 500', value: '4,567.89', change: '+23.45', changePercent: '+0.52%', trend: 'up' },
  { index: 'NASDAQ', value: '14,234.56', change: '-45.67', changePercent: '-0.32%', trend: 'down' },
  { index: 'DOW JONES', value: '35,123.78', change: '+78.90', changePercent: '+0.23%', trend: 'up' },
  { index: 'RUSSELL 2000', value: '2,156.43', change: '+12.34', changePercent: '+0.58%', trend: 'up' }
];

// Helper function to check if we're in demo mode
const isDemoMode = () => ALPHA_VANTAGE_API_KEY === 'demo' || FINNHUB_API_KEY === 'demo';

// Real-time stock data
app.get('/api/stocks/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (isDemoMode()) {
      // Return mock data for demo mode
      const mockData = mockStockData[symbol.toUpperCase()];
      if (mockData) {
        res.json({
          symbol: symbol.toUpperCase(),
          price: mockData.price,
          change: mockData.change,
          changePercent: mockData.changePercent,
          volume: mockData.volume,
          high: mockData.price + 5,
          low: mockData.price - 5,
          open: mockData.price - mockData.change
        });
      } else {
        res.status(404).json({ error: 'Stock not found' });
      }
      return;
    }

    const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data['Global Quote']) {
      const quote = response.data['Global Quote'];
      res.json({
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'].replace('%', ''),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open'])
      });
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Historical data
app.get('/api/stocks/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = 'daily' } = req.query;
    
    if (isDemoMode()) {
      // Return mock historical data
      const mockHistory = [];
      const basePrice = mockStockData[symbol.toUpperCase()]?.price || 100;
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const volatility = 0.03;
        const change = (Math.random() - 0.5) * 2 * volatility;
        const price = basePrice * (1 + change);
        
        mockHistory.push({
          date: date.toISOString().split('T')[0],
          open: price * (1 + (Math.random() - 0.5) * 0.02),
          high: price * (1 + Math.random() * 0.03),
          low: price * (1 - Math.random() * 0.03),
          close: price,
          volume: Math.floor(Math.random() * 5000000) + 500000
        });
      }
      
      res.json(mockHistory);
      return;
    }

    const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data['Time Series (Daily)']) {
      const timeSeries = response.data['Time Series (Daily)'];
      const data = Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).slice(0, 100); // Last 100 days

      res.json(data);
    } else {
      res.status(404).json({ error: 'Historical data not found' });
    }
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Market news
app.get('/api/news', async (req, res) => {
  try {
    if (isDemoMode()) {
      // Return mock news data
      const mockNews = [
        {
          id: 1,
          title: 'Federal Reserve Announces Interest Rate Decision',
          summary: 'The Federal Reserve has announced its latest interest rate decision, maintaining current rates while signaling potential future adjustments.',
          timestamp: new Date().toISOString(),
          sentiment: 'neutral',
          url: '#',
          source: 'Financial Times'
        },
        {
          id: 2,
          title: 'Tech Stocks Rally on Strong Earnings Reports',
          summary: 'Major technology companies reported stronger-than-expected earnings, driving a broad market rally.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          sentiment: 'positive',
          url: '#',
          source: 'Reuters'
        },
        {
          id: 3,
          title: 'Oil Prices Fluctuate Amid Supply Concerns',
          summary: 'Oil prices experienced volatility as traders weighed supply constraints against demand concerns.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          sentiment: 'negative',
          url: '#',
          source: 'Bloomberg'
        }
      ];
      
      res.json(mockNews);
      return;
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/news`, {
      params: {
        category: 'general',
        token: FINNHUB_API_KEY
      }
    });

    const news = response.data.slice(0, 20).map(article => ({
      id: article.id,
      title: article.headline,
      summary: article.summary,
      timestamp: new Date(article.datetime * 1000).toISOString(),
      sentiment: article.sentiment || 'neutral',
      url: article.url,
      source: article.source
    }));

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Company information
app.get('/api/stocks/company/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (isDemoMode()) {
      // Return mock company data
      const mockCompanyData = {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Corporation`,
        description: `A leading technology company specializing in innovative solutions.`,
        sector: 'Technology',
        industry: 'Software',
        marketCap: '5000000000',
        peRatio: '25.5',
        dividendYield: '1.2',
        eps: '6.85'
      };
      
      res.json(mockCompanyData);
      return;
    }

    const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}`, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data.Symbol) {
      res.json({
        symbol: response.data.Symbol,
        name: response.data.Name,
        description: response.data.Description,
        sector: response.data.Sector,
        industry: response.data.Industry,
        marketCap: response.data.MarketCapitalization,
        peRatio: response.data.PERatio,
        dividendYield: response.data.DividendYield,
        eps: response.data.EPS
      });
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ error: 'Failed to fetch company information' });
  }
});

// Market indices
app.get('/api/market/indices', async (req, res) => {
  try {
    if (isDemoMode()) {
      // Return mock market indices data
      res.json(mockMarketIndices);
      return;
    }

    const indices = ['^GSPC', '^IXIC', '^DJI', '^RUT']; // S&P 500, NASDAQ, DOW, RUSSELL
    const results = [];

    for (const index of indices) {
      try {
        const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}`, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: index,
            apikey: ALPHA_VANTAGE_API_KEY
          }
        });

        if (response.data['Global Quote']) {
          const quote = response.data['Global Quote'];
          const name = {
            '^GSPC': 'S&P 500',
            '^IXIC': 'NASDAQ',
            '^DJI': 'DOW JONES',
            '^RUT': 'RUSSELL 2000'
          }[index];

          results.push({
            index: name,
            value: parseFloat(quote['05. price']).toFixed(2),
            change: parseFloat(quote['09. change']).toFixed(2),
            changePercent: quote['10. change percent'],
            trend: parseFloat(quote['09. change']) >= 0 ? 'up' : 'down'
          });
        }
      } catch (error) {
        console.error(`Error fetching ${index}:`, error);
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching market indices:', error);
    res.status(500).json({ error: 'Failed to fetch market indices' });
  }
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe', (symbols) => {
    // Subscribe to real-time updates for specific symbols
    socket.join(symbols);
    console.log(`Client ${socket.id} subscribed to:`, symbols);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate real-time price updates
setInterval(async () => {
  try {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    const updates = [];

    if (isDemoMode()) {
      // Use mock data for real-time updates
      symbols.forEach(symbol => {
        const mockData = mockStockData[symbol];
        if (mockData) {
          // Add some random variation to simulate real-time updates
          const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
          const newPrice = mockData.price * (1 + variation);
          const newChange = newPrice - (mockData.price - mockData.change);
          
          updates.push({
            symbol: symbol,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
            changePercent: `${newChange >= 0 ? '+' : ''}${((newChange / (mockData.price - mockData.change)) * 100).toFixed(2)}%`,
            volume: mockData.volume + Math.floor((Math.random() - 0.5) * 1000000)
          });
        }
      });
    } else {
      // Use real API data
      for (const symbol of symbols) {
        try {
          const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}`, {
            params: {
              function: 'GLOBAL_QUOTE',
              symbol: symbol,
              apikey: ALPHA_VANTAGE_API_KEY
            }
          });

          if (response.data['Global Quote']) {
            const quote = response.data['Global Quote'];
            updates.push({
              symbol: quote['01. symbol'],
              price: parseFloat(quote['05. price']),
              change: parseFloat(quote['09. change']),
              changePercent: quote['10. change percent'],
              volume: parseInt(quote['06. volume'])
            });
          }
        } catch (error) {
          console.error(`Error updating ${symbol}:`, error);
        }
      }
    }

    if (updates.length > 0) {
      io.emit('priceUpdate', updates);
    }
  } catch (error) {
    console.error('Error in price update interval:', error);
  }
}, 10000); // Update every 10 seconds

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 StockPulse API available at http://localhost:${PORT}`);
  console.log(`🎭 Running in ${isDemoMode() ? 'DEMO' : 'PRODUCTION'} mode`);
});
