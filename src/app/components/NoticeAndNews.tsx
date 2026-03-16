import React, { useState } from 'react';
import { Volume2, Newspaper, BookOpen, ChevronRight } from 'lucide-react';

const TABS = [
  { name: '通知公告', icon: Volume2 },
  { name: '最新动态', icon: Newspaper },
  { name: '学习中心', icon: BookOpen },
];

const ITEMS = [
  { id: 1, title: '关于启用新版发明交底书模板的通知', date: '03-10', isNew: true },
  { id: 2, title: '2026年度知识产权奖励申报开启', date: '03-08', isNew: false },
  { id: 3, title: '系统维护升级公告（3月15日）', date: '03-05', isNew: false },
  { id: 4, title: '专利法实施细则修改解读培训视频', date: '02-28', isNew: false },
  { id: 5, title: '海外商标注册流程及注意事项指南', date: '02-20', isNew: false },
];

export function NoticeAndNews() {
  const [activeTab, setActiveTab] = useState('通知公告');

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-bold tracking-tight text-gray-800">资讯中心</h2>
        <div className="mt-0 flex space-x-1 rounded-md border border-gray-100 bg-gray-50 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                activeTab === tab.name
                  ? 'bg-white text-[#1890ff] shadow-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-0.5">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer items-center justify-between rounded-md border-b border-gray-50 px-2 py-2.5 transition-colors hover:bg-gray-50/50 last:border-0"
          >
            <div className="flex items-center space-x-3 truncate">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff] shrink-0"></div>
              <span className="truncate text-[13px] font-medium text-gray-700 transition-colors group-hover:text-[#1890ff]">
                {item.title}
              </span>
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-[#fa8c16] rounded shrink-0">
                  NEW
                </span>
              )}
            </div>
            <span className="ml-4 flex shrink-0 items-center text-xs font-medium text-gray-400 transition-colors group-hover:text-[#1890ff]">
              {item.date}
              <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 border-t border-gray-50 pt-3 text-center">
        <button className="inline-flex items-center text-xs font-medium text-gray-400 transition-colors hover:text-[#1890ff]">
          查看更多 {activeTab}
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}
