# 📈 StockPulse - Real-Time Stock Trading Dashboard

A modern, responsive stock trading dashboard built with React, featuring real-time market data, interactive charts, portfolio management, and trading capabilities. Perfect for demonstrating full-stack development skills and financial technology expertise.

![StockPulse Dashboard](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.1-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.10-38B2AC?logo=tailwind-css)
![Recharts](https://img.shields.io/badge/Recharts-2.15.1-green)

## 🚀 Live Demo

**Access the application:** `http://localhost:5173`

## ✨ Key Features

### 📊 **Interactive Dashboard**
- Real-time market overview with live price updates
- Multiple chart types (Line, Area, Bar, Pie, Radar)
- Market indices tracking (S&P 500, NASDAQ, DOW JONES, RUSSELL 2000)
- Live stock ticker with animated scrolling
- Sector performance analysis

### 💼 **Portfolio Management**
- Real-time portfolio value calculation
- Profit/Loss tracking with percentage changes
- Individual stock performance monitoring
- Dynamic updates after trades
- Average cost basis calculation

### 📈 **Trading Interface**
- Live stock quotes for major companies (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META, NFLX)
- Buy/Sell functionality with quantity selection
- Real-time price updates every 3 seconds
- Transaction history tracking
- Portfolio integration

### 🔍 **Research & Analysis**
- Historical price charts with multiple timeframes (30D, 3M, 6M, 1Y)
- Volume analysis with dual-axis charts
- Technical indicators visualization
- Company information and fundamentals
- Interactive chart tooltips

### 📰 **Market News**
- Real-time market news feed
- Sentiment analysis (Positive/Negative/Neutral)
- News categorization and filtering
- Market impact indicators

### 🎨 **Modern UI/UX**
- Dark theme with professional color scheme
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation with sidebar
- Real-time status indicators

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **Vite 5.4.1** - Fast build tool and dev server
- **Tailwind CSS 3.4.10** - Utility-first CSS framework
- **Recharts 2.15.1** - Composable charting library
- **Material-UI 6.0.2** - React component library

### Data & State Management
- **Custom React Hooks** - State management and data fetching
- **Real-time Data Simulation** - Mock market data with realistic price movements
- **Local Storage** - Portfolio persistence
- **Context API** - Global state management

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/           # Chart components (Line, Area, Bar, Pie, etc.)
│   ├── Dashboard.jsx     # Main dashboard view
│   ├── Header.jsx        # Application header with live clock
│   ├── Sidebar.jsx       # Navigation sidebar
│   ├── Portfolio.jsx     # Portfolio management
│   ├── Markets.jsx       # Trading interface
│   ├── Research.jsx      # Research and analysis
│   ├── MarketNews.jsx    # News feed
│   ├── StockTicker.jsx   # Live stock ticker
│   ├── StatsCard.jsx     # Statistics cards
│   └── Footer.jsx        # Footer with social links
├── data/
│   ├── mockData.js       # Chart data and statistics
│   └── stockData.js      # Stock prices and market data
├── App.jsx              # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
    
   cd stockpulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Core Functionality

### Real-Time Trading System
- **Live Price Updates**: Stock prices update every 3 seconds with realistic volatility
- **Buy/Sell Operations**: Complete trading functionality with portfolio integration
- **Portfolio Tracking**: Real-time P&L calculation and position management
- **Transaction History**: Track all buy/sell activities

### Advanced Charting
- **Multiple Chart Types**: Line, Area, Bar, Pie, Radar, and Composed charts
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Charts adapt to different screen sizes
- **Custom Styling**: Dark theme optimized for financial data

### Data Management
- **Mock Data Generation**: Realistic stock price simulation
- **Historical Data**: 30-day to 1-year historical charts
- **Market Indices**: Major market index tracking
- **News Integration**: Market news with sentiment analysis

## 🎨 Design Features

### Professional UI
- **Dark Theme**: Professional dark color scheme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and micro-interactions
- **Typography**: Clean, readable fonts optimized for data display

### User Experience
- **Intuitive Navigation**: Clear sidebar navigation
- **Real-time Indicators**: Live status indicators and updates
- **Error Handling**: Graceful error states and loading indicators
- **Accessibility**: Keyboard navigation and screen reader support

## 📊 Performance Optimizations

- **React.memo**: Component memoization for better performance
- **useMemo/useCallback**: Optimized re-renders
- **Lazy Loading**: Code splitting for better load times
- **Efficient Re-renders**: Minimal component updates

## 🔧 Customization

### Adding New Stocks
Edit `src/data/stockData.js`:
```javascript
export const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'NEW_STOCK'];
```

### Modifying Charts
Update chart components in `src/components/charts/`:
```javascript
// Customize chart colors, styles, and data
const colors = ['#3B82F6', '#10B981', '#F59E0B'];
```

### Theme Customization
Modify `tailwind.config.js` for custom colors and styling.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📈 Future Enhancements

- [ ] Real API integration (Alpha Vantage, Finnhub)
- [ ] User authentication and accounts
- [ ] Advanced technical indicators
- [ ] Watchlist functionality
- [ ] Mobile app (React Native)
- [ ] Real-time WebSocket connections
- [ ] Backend API with Node.js/Express
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Push notifications
- [ ] Social trading features



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**ABDUL SAMAD KHAN** - Full Stack Developer
- LinkedIn: [www.linkedin.com/in/abdul-samad-khan9012](https://www.linkedin.com/)
- GitHub: [www.linkedin.com/in/abdul-samad-khan9012](https://github.com/)
- Email: [abdulkhan14296@gmail.com](mailto:your.email@example.com)

⭐ **Star this repository if you find it helpful!**

---

*Built with ❤️ for demonstrating modern web development skills and financial technology expertise.*
