import React, { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StockTicker from './components/StockTicker';
import Portfolio from './components/Portfolio';
import MarketNews from './components/MarketNews';
import Markets from './components/Markets';
import Research from './components/Research';
import Watchlist from './components/Watchlist';
import Notifications from './components/Notifications';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Footer from './components/Footer';
import { portfolioData, generateLiveStockData } from './data/stockData';
import { authService } from './services/auth';
import { io } from 'socket.io-client';

function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [portfolio, setPortfolio] = useState(() => {
    // Normalize to minimal shape we will maintain going forward
    return portfolioData.map(item => ({ symbol: item.symbol, shares: item.shares, avgPrice: item.avgPrice }));
  });
  const [livePrices, setLivePrices] = useState({});
  const [user, setUser] = useState({ id: 1, name: 'Demo User', email: 'demo@stockpulse.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporarily set to true
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [socket, setSocket] = useState(null);

  // Authentication check - temporarily disabled
  useEffect(() => {
   // Temporarily skip authentication check
    const checkAuth = async () => {
      try {
        const { user } = await authService.getCurrentUser();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('No authenticated user');
      }
    };
    
    // checkAuth();
  }, []);

  // Socket connection for real-time updates
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      newSocket.on('priceUpdate', (updates) => {
        const priceMap = {};
        updates.forEach(update => {
          priceMap[update.symbol] = update.price;
        });
        setLivePrices(prev => ({ ...prev, ...priceMap }));
      });

      return () => newSocket.close();
    }
  }, [isAuthenticated]);

  // Live prices updater (fallback to mock data)
  useEffect(() => {
    const update = () => {
      const snapshot = generateLiveStockData();
      const priceMap = {};
      snapshot.forEach(s => { priceMap[s.symbol] = s.price; });
      setLivePrices(prev => ({ ...prev, ...priceMap }));
    };
    update();
    const id = setInterval(update, 3000);
    return () => clearInterval(id);
  }, []);

  const portfolioComputed = useMemo(() => {
    return portfolio.map(pos => {
      const currentPrice = livePrices[pos.symbol] ?? pos.avgPrice;
      const totalValue = currentPrice * pos.shares;
      const invested = pos.avgPrice * pos.shares;
      const gainLoss = totalValue - invested;
      const gainLossPercent = invested > 0 ? (gainLoss / invested) * 100 : 0;
      return { ...pos, currentPrice, totalValue, gainLoss, gainLossPercent };
    });
  }, [portfolio, livePrices]);

  const handleBuy = (symbol, shares, pricePerShare) => {
    if (!symbol || !shares || shares <= 0) return;
    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      if (!existing) {
        return [...prev, { symbol, shares, avgPrice: pricePerShare }];
      }
      const newShares = existing.shares + shares;
      const newAvg = ((existing.avgPrice * existing.shares) + (pricePerShare * shares)) / newShares;
      return prev.map(p => p.symbol === symbol ? { ...p, shares: newShares, avgPrice: parseFloat(newAvg.toFixed(2)) } : p);
    });
  };

  const handleSell = (symbol, shares, pricePerShare) => {
    if (!symbol || !shares || shares <= 0) return;
    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      if (!existing) return prev; // nothing to sell
      const sellQty = Math.min(shares, existing.shares);
      const remaining = existing.shares - sellQty;
      if (remaining <= 0) {
        return prev.filter(p => p.symbol !== symbol);
      }
      return prev.map(p => p.symbol === symbol ? { ...p, shares: remaining } : p);
    });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setActiveView('Dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const switchToRegister = () => setAuthMode('register');
  const switchToLogin = () => setAuthMode('login');

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Markets':
        return (
          <Markets
            livePrices={livePrices}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        );
      case 'Portfolio':
        return <Portfolio portfolio={portfolioComputed} />;
      case 'Watchlist':
        return <Watchlist user={user} />;
      case 'News':
        return <MarketNews />;
      case 'Research':
        return <Research />;
      case 'Notifications':
        return <Notifications user={user} />;
      default:
        return <Dashboard />;
    }
  };

  // Show authentication if not logged in

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      <StockTicker />
      <div className="flex flex-1">
        <Sidebar activeItem={activeView} onSelect={setActiveView} />
        <main className="flex-1 p-6 overflow-auto bg-slate-900">
          {renderView()}
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;