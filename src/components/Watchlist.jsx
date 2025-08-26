import React, { useState, useEffect } from 'react';
import { watchlistService } from '../services/auth';
import { stockAPI } from '../services/api';
import toast from 'react-hot-toast';

const Watchlist = ({ user }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [stockQuotes, setStockQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user]);

  useEffect(() => {
    if (watchlist.length > 0) {
      loadStockQuotes();
      const interval = setInterval(loadStockQuotes, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  const loadWatchlist = async () => {
    try {
      const { data, error } = await watchlistService.getWatchlist(user.id);
      if (error) {
        console.error('Error loading watchlist:', error);
        toast.error('Failed to load watchlist');
        return;
      }
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const loadStockQuotes = async () => {
    try {
      const symbols = watchlist.map(item => item.symbol);
      const quotes = await stockAPI.getMultipleQuotes(symbols);
      
      const quotesMap = {};
      quotes.forEach(quote => {
        if (quote) {
          quotesMap[quote.symbol] = quote;
        }
      });
      
      setStockQuotes(quotesMap);
    } catch (error) {
      console.error('Error loading stock quotes:', error);
    }
  };

  const addToWatchlist = async (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;

    const symbol = newSymbol.trim().toUpperCase();
    
    try {
      // Verify the stock exists by getting a quote
      const quote = await stockAPI.getQuote(symbol);
      
      const watchlistItem = {
        user_id: user.id,
        symbol: symbol,
        company_name: quote.name || symbol,
        added_at: new Date().toISOString()
      };

      const { data, error } = await watchlistService.addToWatchlist(watchlistItem);
      
      if (error) {
        toast.error('Failed to add stock to watchlist');
        return;
      }

      setWatchlist(prev => [...prev, data]);
      setNewSymbol('');
      toast.success(`${symbol} added to watchlist`);
    } catch (error) {
      toast.error('Invalid stock symbol or failed to add to watchlist');
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (id, symbol) => {
    try {
      const { error } = await watchlistService.removeFromWatchlist(id);
      
      if (error) {
        toast.error('Failed to remove from watchlist');
        return;
      }

      setWatchlist(prev => prev.filter(item => item.id !== id));
      toast.success(`${symbol} removed from watchlist`);
    } catch (error) {
      toast.error('Failed to remove from watchlist');
      console.error('Error removing from watchlist:', error);
    }
  };

  const getChangeColor = (change) => {
    if (!change) return 'text-gray-400';
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    return change >= 0 ? (
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Watchlist</h2>
          <p className="text-gray-400">Track your favorite stocks</p>
        </div>
        <div className="text-sm text-gray-400">
          {watchlist.length} stocks
        </div>
      </div>

      {/* Add Stock Form */}
      <div className="bg-slate-800 rounded-lg p-6">
        <form onSubmit={addToWatchlist} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </form>
      </div>

      {/* Watchlist Table */}
      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No stocks in watchlist</h3>
          <p className="text-gray-400">Add stocks to your watchlist to track their performance</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    % Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-gray-700">
                {watchlist.map((item) => {
                  const quote = stockQuotes[item.symbol];
                  return (
                    <tr key={item.id} className="hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{item.symbol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{item.company_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-white">
                          {quote ? `$${quote.price?.toFixed(2)}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${getChangeColor(quote?.change)}`}>
                          {quote ? (
                            <div className="flex items-center justify-end">
                              {getChangeIcon(quote.change)}
                              <span className="ml-1">
                                {quote.change >= 0 ? '+' : ''}{quote.change?.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${getChangeColor(quote?.changePercent)}`}>
                          {quote ? (
                            <div className="flex items-center justify-end">
                              {getChangeIcon(quote.changePercent)}
                              <span className="ml-1">
                                {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent?.toFixed(2)}%
                              </span>
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-300">
                          {quote ? quote.volume?.toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => removeFromWatchlist(item.id, item.symbol)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
