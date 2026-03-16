import React, { useState } from 'react';
import { Briefcase, Shield, MonitorPlay, PencilRuler, ArrowRight } from 'lucide-react';

const TABS = [
  { name: '专利申请', icon: Briefcase },
  { name: '商标申请', icon: Shield },
  { name: '软著申请', icon: MonitorPlay },
  { name: '作品著作权', icon: PencilRuler },
];

const ITEMS = [
  { id: 1, title: '智能对话机器人核心算法V3.0', status: '撰写中', date: '2026-03-08' },
  { id: 2, title: '一种基于区块链的数据防篡改方法', status: '内部审查', date: '2026-03-05' },
  { id: 3, title: '多模态AI图像生成系统界面设计', status: '已提交', date: '2026-03-01' },
];

export function CollectionsCard() {
  const [activeTab, setActiveTab] = useState('专利申请');

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-bold tracking-tight text-gray-800">我的提案</h2>
        <div className="mt-0 flex space-x-1 overflow-x-auto rounded-md border border-gray-100 bg-gray-50 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center space-x-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition-colors ${
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

      <div className="flex-1 space-y-3">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 p-3 transition-all hover:border-[#1890ff]/30 hover:bg-blue-50/20"
          >
            <div className="flex items-start space-x-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1890ff] transition-colors group-hover:bg-[#1890ff] group-hover:text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h3 className="mb-1 text-[13px] font-semibold text-gray-800 transition-colors group-hover:text-[#1890ff]">{item.title}</h3>
                <div className="flex items-center space-x-3 text-[11px] text-gray-500">
                  <span className="flex items-center before:mr-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-300">提案日期: {item.date}</span>
                  <span className="flex items-center before:mr-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#52c41a]">状态: <span className="ml-1 text-gray-700">{item.status}</span></span>
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 translate-x-2 text-gray-400 opacity-0 transition-colors group-hover:translate-x-0 group-hover:text-[#1890ff] group-hover:opacity-100" />
          </div>
        ))}
      </div>
      
      <div className="mt-3 border-t border-gray-50 pt-3">
        <button className="flex w-full items-center justify-center rounded-md py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#1890ff]">
          查看全部 {activeTab}
        </button>
      </div>
    </div>
  );
}
