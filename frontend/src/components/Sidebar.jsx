import React from 'react';

const Sidebar = ({ activeItem = 'Dashboard', onSelect = () => {} }) => {

  const menuItems = [
    { icon: '📊', label: 'Dashboard' },
    { icon: '📈', label: 'Markets' },
    { icon: '💼', label: 'Portfolio' },
    { icon: '👁️', label: 'Watchlist' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '📰', label: 'News' },
    { icon: '🔍', label: 'Research' },
  ];

  const quickStats = [
    { label: 'Portfolio Value', value: '$32,856', change: '+2.3%', positive: true },
    { label: 'Day P&L', value: '$+486', change: '+1.5%', positive: true },
    { label: 'Total Return', value: '+12.8%', change: 'YTD', positive: true },
  ];

  return (
    <aside className="w-64 bg-slate-800 shadow-lg border-r border-slate-700">
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item.label)}
              className={`w-full flex items-center px-3 py-3 mt-1 text-sm rounded-lg transition-all duration-200 ${
                activeItem === item.label
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Quick Stats Section */}
        <div className="mt-8 px-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-slate-700 p-3 rounded-lg">
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div className="text-sm font-semibold text-white">{stat.value}</div>
                <div className={`text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;