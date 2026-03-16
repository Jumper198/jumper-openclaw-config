import React, { useState } from 'react';

const TABS = ['全部', '逾期', '今日', '30日内'];

const DATA = [
  { id: 1, type: '专利申请', subject: '高效散热装置的发明', process: '新申请提交流程', node: '代理所撰写中', date: '2026-03-12', status: 'normal' },
  { id: 2, type: '商标注册', subject: 'IP-Inno图形商标', process: '驳回复审', node: '内部评估', date: '2026-03-15', status: 'normal' },
  { id: 3, type: '软著登记', subject: 'AI代码生成平台V1.0', process: '软著申请流程', node: '材料用印', date: '2026-03-09', status: 'overdue' },
  { id: 4, type: '作品著作权', subject: '产品包装设计图V2', process: '作品登记流程', node: '形式审查', date: '2026-03-10', status: 'today' },
  { id: 5, type: '专利申请', subject: '一种新型电动汽车底盘', process: '答复审查意见', node: '发明人补充材料', date: '2026-03-25', status: 'normal' },
];

export function TaskTable() {
  const [activeTab, setActiveTab] = useState('全部');

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight text-gray-800">我的任务</h2>
        <div className="flex space-x-1 rounded-md border border-gray-100 bg-gray-50 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                activeTab === tab
                  ? 'bg-white text-[#1890ff] shadow-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
            <tr>
              <th className="px-3 py-2.5 font-medium">流程类别</th>
              <th className="px-3 py-2.5 font-medium">主题</th>
              <th className="px-3 py-2.5 font-medium">流程名称</th>
              <th className="px-3 py-2.5 font-medium">当前节点</th>
              <th className="px-3 py-2.5 font-medium">截止期限</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {DATA.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#1890ff]">
                    {row.type}
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-3 py-2.5 text-[13px] font-medium text-gray-800">
                  {row.subject}
                </td>
                <td className="px-3 py-2.5 text-[13px] text-gray-600">{row.process}</td>
                <td className="px-3 py-2.5 text-gray-600">
                  <span className="inline-flex items-center text-xs before:mr-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#1890ff]">
                    {row.node}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs font-medium ${row.status === 'overdue' ? 'text-[#fa8c16]' : row.status === 'today' ? 'text-[#1890ff]' : 'text-gray-500'}`}>
                    {row.date}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-400">
        <span>共 5 条记录</span>
        <button className="text-[#1890ff] hover:underline font-medium">查看更多</button>
      </div>
    </div>
  );
}
