import React from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  Database,
  ChevronDown,
  FilePlus2,
  LayoutDashboard,
  Landmark,
  Lightbulb,
  ListTodo,
  Settings2,
  Wallet,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { cn } from './ui/utils';

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  inset?: boolean;
};

function SidebarLink({ to, label, icon: Icon, end = false, inset = false }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          inset && 'pl-4 text-[13px]',
          isActive
            ? 'bg-[#1890ff] text-white shadow-sm shadow-blue-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-700')} />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const location = useLocation();
  const isWorkflowRoute = location.pathname.startsWith('/workflow');
  const isAssetRoute = location.pathname.startsWith('/assets');

  return (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-white md:min-h-0 md:w-72 md:border-r md:border-b-0">
      <div className="flex flex-col px-4 py-5 md:h-full md:min-h-0 md:overflow-y-auto md:overscroll-y-contain">
        <div className="rounded-2xl bg-gradient-to-br from-[#1890ff] via-sky-500 to-cyan-500 p-4 text-white shadow-sm shadow-blue-100">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/70">Workspace</p>
          <h2 className="mt-2 text-lg font-semibold">业务导航</h2>
          <p className="mt-1 text-sm text-white/85">统一进入工作台、流程中心与系统管理模块。</p>
        </div>

        <nav aria-label="主导航" className="mt-5 space-y-2">
          <SidebarLink to="/" label="工作台" icon={LayoutDashboard} end />

          <div
            className={cn(
              'rounded-2xl border px-2 py-2 transition-colors',
              isWorkflowRoute ? 'border-blue-200 bg-blue-50/80' : 'border-gray-200 bg-gray-50/80',
            )}
          >
            <div className={cn('flex items-center justify-between px-2 py-2 text-sm font-semibold', isWorkflowRoute ? 'text-[#1890ff]' : 'text-gray-700')}>
              <span className="flex items-center gap-3">
                <Workflow className="h-4 w-4" />
                流程中心
              </span>
              <ChevronDown className="h-4 w-4" />
            </div>

            <div className="mt-1 space-y-1">
              <SidebarLink to="/workflow/todo" label="待办事项" icon={ListTodo} inset />
              <SidebarLink to="/workflow/create" label="新建提案" icon={FilePlus2} inset />
            </div>
          </div>

          <div
            className={cn(
              'rounded-2xl border px-2 py-2 transition-colors',
              isAssetRoute ? 'border-blue-200 bg-blue-50/80' : 'border-gray-200 bg-gray-50/80',
            )}
          >
            <div className={cn('flex items-center justify-between px-2 py-2 text-sm font-semibold', isAssetRoute ? 'text-[#1890ff]' : 'text-gray-700')}>
              <span className="flex items-center gap-3">
                <Wallet className="h-4 w-4" />
                资产管理
              </span>
              <ChevronDown className="h-4 w-4" />
            </div>

            <div className="mt-1 space-y-1">
              <SidebarLink to="/assets/ledger" label="资产台账" icon={Database} inset />
              <SidebarLink to="/assets/bonus-settlement" label="奖金结算" icon={Landmark} inset />
            </div>
          </div>

          <SidebarLink to="/innovation" label="我的创新" icon={Lightbulb} />
          <SidebarLink to="/settings" label="系统配置" icon={Settings2} />
        </nav>

        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          当前壳层已切换为标准中后台布局，主内容区支持独立滚动。
        </div>
      </div>
    </aside>
  );
}
