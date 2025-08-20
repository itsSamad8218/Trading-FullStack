# 🚀 StockPulse Full-Stack Setup Guide

This guide will help you run StockPulse as a complete full-stack application with both frontend and backend.

## 📋 Current Status

✅ **Backend Server**: Running on port 3001  
✅ **Frontend Server**: Running on port 5173  
✅ **Environment Variables**: Configured with demo values  
✅ **Dependencies**: All installed  

## 🌐 Access Your Application

### Frontend (React App)
- **URL**: http://localhost:5173
- **Features**: Dashboard, Markets, Portfolio, Watchlist, News, Research, Notifications

### Backend API (Node.js/Express)
- **URL**: http://localhost:3001
- **Features**: Real-time stock data, WebSocket connections, API endpoints

## 🔧 How to Run the Full-Stack App

### Option 1: Run Both Servers Separately

1. **Start Backend Server**:
   ```bash
   npm run server
   ```

2. **Start Frontend Server** (in a new terminal):
   ```bash
   npm run dev
   ```

### Option 2: Run Both Simultaneously

```bash
npm run dev:full
```

## 📊 Available Features

### Frontend Features
- **Dashboard**: Market overview with charts and statistics
- **Markets**: Real-time stock trading interface
- **Portfolio**: Personal investment tracking
- **Watchlist**: Stock monitoring and alerts
- **News**: Market news and updates
- **Research**: Advanced charting and analysis
- **Notifications**: Price alerts and system notifications

### Backend Features
- **Real-time Data**: WebSocket connections for live updates
- **API Endpoints**: Stock quotes, historical data, news
- **Authentication**: User management (currently disabled for demo)
- **Database**: Supabase integration (configured but not required for demo)

## 🔑 Environment Configuration

Your `.env` file is configured with demo values:

```env
# API Keys for Real Market Data (using demo values)
ALPHA_VANTAGE_API_KEY=demo
FINNHUB_API_KEY=demo

# Server Configuration
PORT=3001

# Supabase Configuration (using demo values)
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=demo_key
```

## 🎯 Real API Integration (Optional)

To use real market data instead of demo data:

1. **Get Alpha Vantage API Key**:
   - Visit: https://www.alphavantage.co/support/#api-key
   - Sign up for free account
   - Replace `demo` with your actual API key

2. **Get Finnhub API Key**:
   - Visit: https://finnhub.io/
   - Sign up for free account
   - Replace `demo` with your actual API key

3. **Update .env file** with real API keys

## 🔍 Troubleshooting

### Backend Server Issues
- **Port 3001 in use**: Kill the process using the port
- **Missing dependencies**: Run `npm install`
- **Environment variables**: Ensure `.env` file exists

### Frontend Issues
- **Port conflicts**: Vite will automatically find an available port
- **Build errors**: Check console for specific error messages
- **Socket connection**: Ensure backend is running on port 3001

### Common Commands
```bash
# Kill process on specific port (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Restart both servers
npm run dev:full

# Check server status
netstat -ano | findstr ":3001\|:5173"
```

## 📈 Demo Features

The app currently runs with:
- **Mock Data**: Realistic stock prices and market data
- **Live Updates**: Simulated real-time price changes
- **Interactive Charts**: Professional trading charts
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Professional trading interface

## 🚀 Next Steps

1. **Explore the Interface**: Navigate through all sections
2. **Test Features**: Try buying/selling stocks, adding to watchlist
3. **Real API Setup**: Get actual API keys for real data
4. **Database Setup**: Configure Supabase for user authentication
5. **Deployment**: Deploy to production servers

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify both servers are running
4. Ensure all dependencies are installed

Happy trading! 📈
