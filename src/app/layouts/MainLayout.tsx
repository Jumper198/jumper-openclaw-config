import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { TopNavigation } from '../components/TopNavigation';

export default function MainLayout() {
  return (
    <div className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-[#f0f2f5] font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="fixed inset-x-0 top-0 z-40">
        <TopNavigation />
      </div>

      <div className="flex min-h-0 flex-1 flex-col pt-14 md:flex-row">
        <Sidebar />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
