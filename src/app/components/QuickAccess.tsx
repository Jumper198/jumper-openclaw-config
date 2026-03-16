import React from 'react';
import { ClipboardList, CheckCircle, FilePlus, PenTool, ImagePlus } from 'lucide-react';

const QUICKS = [
  {
    title: '待办任务',
    count: 12,
    icon: ClipboardList,
    color: 'text-[#fa8c16]',
    bg: 'bg-[#fff7e6]',
  },
  {
    title: '已办任务',
    count: 145,
    icon: CheckCircle,
    color: 'text-[#52c41a]',
    bg: 'bg-[#f6ffed]',
  },
  {
    title: '提出发明/新型交底书',
    icon: FilePlus,
    color: 'text-[#1890ff]',
    bg: 'bg-[#e6f4ff]',
  },
  {
    title: '提出外观设计交底书',
    icon: PenTool,
    color: 'text-[#1890ff]',
    bg: 'bg-[#e6f4ff]',
  },
  {
    title: '提出商标申请需求',
    icon: ImagePlus,
    color: 'text-[#1890ff]',
    bg: 'bg-[#e6f4ff]',
  },
];

export function QuickAccess() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      {QUICKS.map((item, index) => (
        <div
          key={index}
          className="group flex h-24 cursor-pointer flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-1.5 ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            {item.count !== undefined && (
              <span className="font-sans text-xl font-bold tracking-tight text-gray-800">
                {item.count}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-medium text-gray-600 transition-colors group-hover:text-[#1890ff]">
              {item.title}
            </span>
            {item.count === undefined && (
              <span className="text-xs font-medium text-[#1890ff] opacity-0 transition-opacity group-hover:opacity-100">
                发起
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
