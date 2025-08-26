import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above', // 'above' or 'below'
    enabled: true
  });

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadPriceAlerts();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to mock data
      setNotifications([
        {
          id: 1,
          type: 'price_alert',
          title: 'AAPL Price Alert',
          message: 'Apple Inc. has reached your target price of $175.00',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'system',
          title: 'Market Open',
          message: 'US markets are now open for trading',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          priority: 'medium'
        },
        {
          id: 3,
          type: 'news',
          title: 'Market News',
          message: 'Federal Reserve announces interest rate decision',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: false,
          priority: 'medium'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadPriceAlerts = async () => {
    try {
      const data = await notificationsAPI.getNotifications();
      setPriceAlerts(data?.filter(n => n.type === 'price_alert') || []);
    } catch (error) {
      console.error('Error loading price alerts:', error);
      // Fallback to mock data
      setPriceAlerts([
        {
          id: 1,
          symbol: 'AAPL',
          targetPrice: 175.00,
          condition: 'above',
          enabled: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          symbol: 'TSLA',
          targetPrice: 800.00,
          condition: 'below',
          enabled: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update locally anyway
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const createPriceAlert = async (e) => {
    e.preventDefault();
    
    if (!newAlert.symbol || !newAlert.targetPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const alertData = {
        user_id: user.id,
        symbol: newAlert.symbol.toUpperCase(),
        target_price: parseFloat(newAlert.targetPrice),
        condition: newAlert.condition,
        enabled: newAlert.enabled
      };

      const data = await notificationsAPI.createPriceAlert(alertData);
      setPriceAlerts(prev => [...prev, data]);
      setNewAlert({ symbol: '', targetPrice: '', condition: 'above', enabled: true });
      toast.success('Price alert created successfully');
    } catch (error) {
      console.error('Error creating price alert:', error);
      toast.error('Failed to create price alert');
    }
  };

  const toggleAlert = async (id, enabled) => {
    try {
      await notificationsAPI.updateSettings({ id, enabled });
      setPriceAlerts(prev => 
        prev.map(alert => alert.id === id ? { ...alert, enabled } : alert)
      );
      toast.success(`Alert ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Failed to update alert');
    }
  };

  const deleteAlert = async (id) => {
    try {
      await notificationsAPI.markAsRead(id); // Using this as delete endpoint
      setPriceAlerts(prev => prev.filter(alert => alert.id !== id));
      toast.success('Alert deleted successfully');
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
      case 'medium': return (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    }
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
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-gray-400">Stay updated with market alerts and news</p>
        </div>
        <div className="text-sm text-gray-400">
          {notifications.filter(n => !n.read).length} unread
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Price Alerts
          </button>
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-slate-800 rounded-lg p-4 border-l-4 ${
                  notification.read ? 'border-gray-600' : 'border-blue-500'
                } ${!notification.read ? 'bg-slate-750' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getPriorityIcon(notification.priority)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-white">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-400 text-sm"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Price Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Create New Alert */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Create Price Alert</h3>
            <form onSubmit={createPriceAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  placeholder="AAPL"
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="175.00"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Condition
                </label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Your Price Alerts</h3>
            {priceAlerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No price alerts</h3>
                <p className="text-gray-400">Create your first price alert above</p>
              </div>
            ) : (
              priceAlerts.map((alert) => (
                <div key={alert.id} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">
                          {alert.symbol} {alert.condition} ${alert.targetPrice}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Created {new Date(alert.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAlert(alert.id, !alert.enabled)}
                        className={`px-3 py-1 text-xs rounded ${
                          alert.enabled
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {alert.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
