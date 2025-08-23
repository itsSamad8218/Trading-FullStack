import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Stock Data API
export const stockAPI = {
  // Get real-time stock quote
  getQuote: (symbol) => api.get(`/stocks/quote/${symbol}`),
  
  // Get historical data
  getHistory: (symbol, timeframe = 'daily') => 
    api.get(`/stocks/history/${symbol}?timeframe=${timeframe}`),
  
  // Get company information
  getCompanyInfo: (symbol) => api.get(`/stocks/company/${symbol}`),
  
  // Get multiple stock quotes
  getMultipleQuotes: async (symbols) => {
    const promises = symbols.map(symbol => 
      api.get(`/stocks/quote/${symbol}`).catch(() => null)
    );
    const results = await Promise.all(promises);
    return results.filter(result => result !== null);
  }
};

// Market Data API
export const marketAPI = {
  // Get market indices
  getIndices: () => api.get('/market/indices'),
  
  // Get market news
  getNews: () => api.get('/news'),
  
  // Get sector performance
  getSectorPerformance: () => api.get('/market/sectors'),
};

// Portfolio API
export const portfolioAPI = {
  // Get user portfolio
  getPortfolio: () => api.get('/portfolio'),
  
  // Add stock to portfolio
  addStock: (data) => api.post('/portfolio/stocks', data),
  
  // Update stock in portfolio
  updateStock: (id, data) => api.put(`/portfolio/stocks/${id}`, data),
  
  // Remove stock from portfolio
  removeStock: (id) => api.delete(`/portfolio/stocks/${id}`),
  
  // Get portfolio analytics
  getAnalytics: () => api.get('/portfolio/analytics'),
};

// Watchlist API
export const watchlistAPI = {
  // Get user watchlist
  getWatchlist: () => api.get('/watchlist'),
  
  // Add stock to watchlist
  addToWatchlist: (symbol) => api.post('/watchlist', { symbol }),
  
  // Remove stock from watchlist
  removeFromWatchlist: (symbol) => api.delete(`/watchlist/${symbol}`),
};

// Authentication API
export const authAPI = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getNotifications: () => api.get('/notifications'),
  
  // Create price alert
  createPriceAlert: (data) => api.post('/notifications/alerts', data),
  
  // Update notification settings
  updateSettings: (settings) => api.put('/notifications/settings', settings),
  
  // Mark notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Fallback to mock data if API fails
export const fallbackToMockData = (error, mockData) => {
  console.warn('API failed, using mock data:', error.message);
  return Promise.resolve(mockData);
};

// Utility function to handle API errors gracefully
export const handleAPIError = (error, fallbackData = null) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    return fallbackData;
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.message);
    return fallbackData;
  } else {
    // Other error
    console.error('Error:', error.message);
    return fallbackData;
  }
};

export default api;
