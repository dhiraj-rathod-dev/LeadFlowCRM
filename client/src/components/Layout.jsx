import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <footer className="text-center py-3 text-xs text-gray-400 border-t border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900">
          Built for <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 font-medium">Digital Heroes</a> Training Task
        </footer>
      </div>
    </div>
  );
};

export default Layout;
