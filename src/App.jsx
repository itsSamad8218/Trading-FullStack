import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StockTicker from './components/StockTicker';
import Portfolio from './components/Portfolio';
import MarketNews from './components/MarketNews';
import Markets from './components/Markets';
import Research from './components/Research';
import Footer from './components/Footer';
import { portfolioData, generateLiveStockData } from './data/stockData';

function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [portfolio, setPortfolio] = useState(() => {
    // Normalize to minimal shape we will maintain going forward
    return portfolioData.map(item => ({ symbol: item.symbol, shares: item.shares, avgPrice: item.avgPrice }));
  });
  const [livePrices, setLivePrices] = useState({});

  // Live prices updater
  useEffect(() => {
    const update = () => {
      const snapshot = generateLiveStockData();
      const priceMap = {};
      snapshot.forEach(s => { priceMap[s.symbol] = s.price; });
      setLivePrices(priceMap);
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
      case 'News':
        return <MarketNews />;
      case 'Research':
        return <Research />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <StockTicker />
      <div className="flex flex-1">
        <Sidebar activeItem={activeView} onSelect={setActiveView} />
        <main className="flex-1 p-6 overflow-auto bg-slate-900">
          {renderView()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;