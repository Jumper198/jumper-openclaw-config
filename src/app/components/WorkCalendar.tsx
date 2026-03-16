import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function WorkCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-10'));
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date('2026-03-10'));
      const hasTask = [12, 15, 25].includes(day.getDate()) && isCurrentMonth;
      const isOverdue = [9].includes(day.getDate()) && isCurrentMonth;

      days.push(
        <div
          key={day.toString()}
          className={`flex min-h-9 flex-col items-center justify-center rounded-md p-1.5 text-[13px] transition-colors
            ${!isCurrentMonth ? "text-gray-300" : isToday ? "bg-[#1890ff] text-white shadow-sm font-semibold" : "text-gray-700 hover:bg-gray-50"}
          `}
        >
          <span className="relative z-10">{formattedDate}</span>
          {(hasTask || isOverdue) && !isToday && (
            <div className={`w-1 h-1 rounded-full mt-1 ${isOverdue ? 'bg-[#fa8c16]' : 'bg-[#52c41a]'}`}></div>
          )}
          {isToday && (hasTask || isOverdue) && (
            <div className="w-1 h-1 rounded-full bg-white mt-1"></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-gray-800">工作日历</h2>
        <div className="flex items-center space-x-2.5 text-sm font-medium text-gray-700">
          <button onClick={prevMonth} className="rounded-md p-1 transition-colors hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <span className="tabular-nums text-sm">{format(currentDate, 'yyyy年 M月', { locale: zhCN })}</span>
          <button onClick={nextMonth} className="rounded-md p-1 transition-colors hover:bg-gray-100">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
        <div>日</div>
      </div>
      
      <div className="flex flex-1 flex-col justify-start gap-1">
        {rows}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#1890ff]"></div>
            <span>今日</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#fa8c16]"></div>
            <span>逾期</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#52c41a]"></div>
            <span>待办</span>
          </div>
        </div>
      </div>
    </div>
  );
}
