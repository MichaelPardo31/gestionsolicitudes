import React from 'react';

const LayoutHeader = ({ title, user }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">{user?.name}</span>
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;