import React from 'react';

export default function SystemConfigPage() {
  return (
    <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
      <section className="rounded-lg border border-dashed border-gray-300 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">系统配置</h1>
        <p className="mt-2 text-sm text-gray-600">这里预留给角色权限、流程模板与平台参数等系统级设置。</p>
      </section>
    </main>
  );
}
