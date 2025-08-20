import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">© {new Date().getFullYear()} StockPulse</div>
        <div className="flex items-center gap-4 text-gray-300">
          <a href="//www.linkedin.com/in/abdul-samad-khan9012" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
          
          <a href="https://github.com/itsSamad8218" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href="mailto:abdulkhan14296@gmail.com" className="hover:text-white">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


