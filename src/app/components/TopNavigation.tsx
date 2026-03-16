import React from 'react';
import { Bell, User, Search, Home } from 'lucide-react';

export function TopNavigation() {
  return (
    <div className="flex items-center justify-between h-14 bg-white border-b border-gray-200 px-6 shadow-sm">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#1890ff] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            IP
          </div>
          <span className="text-[#1890ff] text-xl font-bold tracking-tight">IP-Inno</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <Home className="w-4 h-4" />
          <span>首页</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">开发者工作台</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#fa8c16] rounded-full border border-white"></span>
        </div>
        
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors">
          <div className="w-8 h-8 bg-blue-100 text-[#1890ff] rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">管理员</span>
        </div>
      </div>
    </div>
  );
}
