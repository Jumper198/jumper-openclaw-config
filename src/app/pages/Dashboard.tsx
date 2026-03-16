import React from 'react';
import { QuickAccess } from '../components/QuickAccess';
import { TaskTable } from '../components/TaskTable';
import { WorkCalendar } from '../components/WorkCalendar';
import { CollectionsCard } from '../components/CollectionsCard';
import { NoticeAndNews } from '../components/NoticeAndNews';

export default function Dashboard() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 p-4 sm:p-5">
      <div className="w-full">
        <div className="mb-4">
          <QuickAccess />
        </div>

        <div className="mb-4 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TaskTable />
          </div>
          <div className="lg:col-span-1">
            <WorkCalendar />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CollectionsCard />
          </div>
          <div className="lg:col-span-1">
            <NoticeAndNews />
          </div>
        </div>
      </div>
    </main>
  );
}
