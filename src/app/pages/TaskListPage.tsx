import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Filter,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { cn } from '../components/ui/utils';
import {
  WORKFLOW_REFERENCE_DATE,
  formatDate,
  getCategoryBadgeClass,
  getDayDistance,
  getDueMeta,
  workflowTasks,
} from './workflowData';

type QuickFilter = 'all' | 'overdue' | 'today' | 'fiveDays';

type SearchFilters = {
  subject: string;
  workflowName: string;
  initiator: string;
  startDate: string;
  endDate: string;
};

type StatCardProps = {
  title: string;
  count: number;
  icon: LucideIcon;
  tone: 'rose' | 'amber' | 'blue';
  active: boolean;
  onClick: () => void;
};

const initialFilters: SearchFilters = {
  subject: '',
  workflowName: '',
  initiator: '',
  startDate: '',
  endDate: '',
};

const quickFilterMeta: Array<{ key: QuickFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'overdue', label: '逾期' },
  { key: 'today', label: '今日' },
  { key: 'fiveDays', label: '5天内' },
];

function StatCard({ title, count, icon: Icon, tone, active, onClick }: StatCardProps) {
  const toneClassMap = {
    rose: {
      shell: 'border-rose-200 bg-[linear-gradient(135deg,rgba(244,63,94,0.12)_0%,rgba(255,255,255,1)_58%)]',
      icon: 'bg-rose-100 text-rose-600',
      count: 'text-rose-700',
      ring: 'ring-rose-200',
    },
    amber: {
      shell: 'border-amber-200 bg-[linear-gradient(135deg,rgba(245,158,11,0.14)_0%,rgba(255,255,255,1)_58%)]',
      icon: 'bg-amber-100 text-amber-600',
      count: 'text-amber-700',
      ring: 'ring-amber-200',
    },
    blue: {
      shell: 'border-sky-200 bg-[linear-gradient(135deg,rgba(24,144,255,0.14)_0%,rgba(255,255,255,1)_58%)]',
      icon: 'bg-sky-100 text-sky-600',
      count: 'text-sky-700',
      ring: 'ring-sky-200',
    },
  } as const;

  const toneClasses = toneClassMap[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-[18px] border p-3.5 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5',
        toneClasses.shell,
        active && cn('ring-2', toneClasses.ring),
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className={cn('mt-1.5 text-2xl leading-none font-semibold tracking-tight', toneClasses.count)}>{count}</p>
        </div>
        <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', toneClasses.icon)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

function matchesKeyword(value: string, keyword: string) {
  return value.toLowerCase().includes(keyword.trim().toLowerCase());
}

export default function TaskListPage() {
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const overdueCount = workflowTasks.filter((task) => getDueMeta(task.dueDate).tone === 'overdue').length;
  const todayCount = workflowTasks.filter((task) => getDayDistance(task.dueDate) === 0).length;
  const nearDueCount = workflowTasks.filter((task) => {
    const dayDistance = getDayDistance(task.dueDate);

    return dayDistance >= 0 && dayDistance <= 5;
  }).length;

  const filteredTasks = workflowTasks.filter((task) => {
    const dayDistance = getDayDistance(task.dueDate);

    if (quickFilter === 'overdue' && dayDistance >= 0) {
      return false;
    }

    if (quickFilter === 'today' && dayDistance !== 0) {
      return false;
    }

    if (quickFilter === 'fiveDays' && (dayDistance < 0 || dayDistance > 5)) {
      return false;
    }

    if (filters.subject.trim() && !matchesKeyword(task.subject, filters.subject)) {
      return false;
    }

    if (filters.workflowName.trim() && !matchesKeyword(task.workflowName, filters.workflowName)) {
      return false;
    }

    if (filters.initiator.trim() && !matchesKeyword(task.initiator, filters.initiator)) {
      return false;
    }

    if (filters.startDate && task.createdAt < filters.startDate) {
      return false;
    }

    if (filters.endDate && task.createdAt > filters.endDate) {
      return false;
    }

    return true;
  });

  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 p-4">
      <div className="flex w-full flex-col gap-3">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-sm shadow-slate-200/60">
          <div className="flex flex-col gap-2 border-b border-slate-200/80 bg-[linear-gradient(120deg,#f8fbff_0%,#ffffff_52%,#fff8eb_100%)] px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1890ff]">Flow Center</p>
              <h1 className="text-[1.35rem] font-semibold tracking-tight text-slate-900">待办任务列表</h1>
              <p className="text-xs text-slate-500">逾期、临近到期与总待办快速总览</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-sm">
              <p className="font-medium text-slate-700">预警基准日：{formatDate(WORKFLOW_REFERENCE_DATE)}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">未来 5 天内记为临近到期。</p>
            </div>
          </div>

          <div className="grid gap-2.5 px-4 py-3 sm:px-5 lg:grid-cols-3">
            <StatCard
              title="逾期任务"
              count={overdueCount}
              icon={AlertTriangle}
              tone="rose"
              active={quickFilter === 'overdue'}
              onClick={() => setQuickFilter('overdue')}
            />
            <StatCard
              title="临近到期"
              count={nearDueCount}
              icon={CalendarClock}
              tone="amber"
              active={quickFilter === 'fiveDays' || quickFilter === 'today'}
              onClick={() => setQuickFilter('fiveDays')}
            />
            <StatCard
              title="总待办"
              count={workflowTasks.length}
              icon={ClipboardList}
              tone="blue"
              active={quickFilter === 'all'}
              onClick={() => setQuickFilter('all')}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-2 text-slate-900">
                  <Search className="h-3.5 w-3.5 text-[#1890ff]" />
                  <h2 className="text-base font-semibold">高级检索区</h2>
                </div>
                <p className="mt-1 text-xs leading-4 text-slate-500">
                  快捷过滤后，可继续按主题、流程、发起人和发起时间收窄结果。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickFilterMeta.map((item) => {
                  const count =
                    item.key === 'all'
                      ? workflowTasks.length
                      : item.key === 'overdue'
                        ? overdueCount
                        : item.key === 'today'
                          ? todayCount
                          : nearDueCount;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setQuickFilter(item.key)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition',
                        quickFilter === item.key
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100',
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]',
                          quickFilter === item.key ? 'bg-white/20 text-white' : 'bg-white text-slate-500',
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced((current) => !current)}
                className="h-8 rounded-full border-slate-200 px-3 text-xs text-slate-600"
              >
                <Filter className="h-3.5 w-3.5" />
                {showAdvanced ? '收起检索' : '展开检索'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFilters(initialFilters)}
                className="h-8 rounded-full border-slate-200 px-3 text-xs text-slate-600"
              >
                重置条件
              </Button>
            </div>
          </div>

          {showAdvanced ? (
            <div className="mt-3 grid gap-2 rounded-[20px] border border-slate-200 bg-slate-50/80 p-3 lg:grid-cols-12">
              <label className="space-y-1 lg:col-span-3">
                <span className="text-xs font-medium text-slate-600">主题</span>
                <Input
                  value={filters.subject}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, subject: event.target.value }))
                  }
                  placeholder="输入业务主题关键字"
                  className="h-8 rounded-lg border-slate-200 bg-white text-sm"
                />
              </label>
              <label className="space-y-1 lg:col-span-3">
                <span className="text-xs font-medium text-slate-600">流程名称</span>
                <Input
                  value={filters.workflowName}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, workflowName: event.target.value }))
                  }
                  placeholder="例如：专利申请提交流程"
                  className="h-8 rounded-lg border-slate-200 bg-white text-sm"
                />
              </label>
              <label className="space-y-1 lg:col-span-2">
                <span className="text-xs font-medium text-slate-600">发起人</span>
                <Input
                  value={filters.initiator}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, initiator: event.target.value }))
                  }
                  placeholder="按发起人筛选"
                  className="h-8 rounded-lg border-slate-200 bg-white text-sm"
                />
              </label>
              <label className="space-y-1 lg:col-span-2">
                <span className="text-xs font-medium text-slate-600">开始日期</span>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, startDate: event.target.value }))
                  }
                  className="h-8 rounded-lg border-slate-200 bg-white text-sm"
                />
              </label>
              <label className="space-y-1 lg:col-span-2">
                <span className="text-xs font-medium text-slate-600">结束日期</span>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, endDate: event.target.value }))
                  }
                  className="h-8 rounded-lg border-slate-200 bg-white text-sm"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 lg:col-span-12">
                <span>当前命中 {filteredTasks.length} 条待办任务。</span>
                <span>筛选范围按发起时间字段过滤。</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-2 border-b border-slate-200/80 px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-base font-semibold text-slate-900">待办任务数据表格</h2>
              <p className="text-xs text-slate-500">固定展示核心字段与办理入口</p>
            </div>
            <Badge variant="outline" className="rounded-full border-slate-200 px-3 py-1 text-slate-600">
              共 {filteredTasks.length} 条
            </Badge>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/90">
              <TableRow className="hover:bg-slate-50/90">
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-6">
                  流程分类
                </TableHead>
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  主题
                </TableHead>
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  流程名称
                </TableHead>
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  当前节点
                </TableHead>
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  当前处理人
                </TableHead>
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  办理期限
                </TableHead>
                <TableHead className="h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-6">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-16 text-center text-sm text-slate-500">
                    未命中符合条件的待办任务，请调整检索条件后重试。
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => {
                  const dueMeta = getDueMeta(task.dueDate);

                  return (
                    <TableRow key={task.id} className={cn('border-slate-200/80', dueMeta.rowClass)}>
                      <TableCell className="px-4 py-3 align-top sm:px-6">
                        <div className="space-y-1.5">
                          <Badge
                            variant="outline"
                            className={cn('rounded-full px-3 py-1 text-xs font-semibold', getCategoryBadgeClass(task.category))}
                          >
                            {task.category}
                          </Badge>
                          <p className="text-xs text-slate-400">{task.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[320px] px-4 py-3 align-top whitespace-normal">
                        <p className="font-medium leading-5 text-slate-900">{task.subject}</p>
                        <p className="mt-1.5 text-xs text-slate-500">发起人：{task.initiator}</p>
                      </TableCell>
                      <TableCell className="px-4 py-3 align-top text-slate-600">{task.workflowName}</TableCell>
                      <TableCell className="px-4 py-3 align-top">
                        <p className="font-medium text-slate-800">{task.currentNode}</p>
                        <p className="mt-1.5 text-xs text-slate-500">发起时间：{formatDate(task.createdAt)}</p>
                      </TableCell>
                      <TableCell className="px-4 py-3 align-top text-slate-600">{task.currentHandler}</TableCell>
                      <TableCell className="px-4 py-3 align-top">
                        <div className={cn('rounded-2xl border px-3.5 py-2.5', dueMeta.panelClass)}>
                          <p className={cn('font-semibold', dueMeta.textClass)}>{formatDate(task.dueDate)}</p>
                          <Badge
                            variant="outline"
                            className={cn('mt-2 rounded-full px-3 py-1 text-xs font-semibold', dueMeta.badgeClass)}
                          >
                            {dueMeta.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 align-top sm:px-6">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="h-8 rounded-lg bg-[#1890ff] px-3 text-white hover:bg-[#1677ff]"
                          >
                            <Link to={`/workflow/detail/${task.id}`}>
                              办理
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 px-3">
                            <Link to={`/workflow/detail/${task.id}`}>查看</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}
