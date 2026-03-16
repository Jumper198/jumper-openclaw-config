import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  Paperclip,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../components/ui/utils';
import {
  WORKFLOW_REFERENCE_DATE,
  formatDate,
  getCategoryBadgeClass,
  getDueMeta,
  getWorkflowById,
  type TimelineItem,
} from './workflowData';

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  span?: 1 | 2;
  accentClassName?: string;
};

function ReadOnlyField({ label, value, span = 1, accentClassName }: ReadOnlyFieldProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-slate-50/80 p-3',
        span === 2 && 'md:col-span-2',
        accentClassName,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-[13px] leading-5 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function getTimelineMeta(item: TimelineItem) {
  switch (item.status) {
    case 'done':
      return {
        label: '已完成',
        icon: CheckCircle2,
        badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        markerClass: 'border-emerald-200 bg-emerald-50 text-emerald-600',
      };
    case 'current':
      return {
        label: '当前节点',
        icon: Clock3,
        badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
        markerClass: 'border-amber-200 bg-amber-50 text-amber-600',
      };
    case 'rejected':
      return {
        label: '已驳回',
        icon: XCircle,
        badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
        markerClass: 'border-rose-200 bg-rose-50 text-rose-600',
      };
    default:
      return {
        label: '待处理',
        icon: Circle,
        badgeClass: 'border-slate-200 bg-slate-50 text-slate-600',
        markerClass: 'border-slate-200 bg-white text-slate-400',
      };
  }
}

function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case '高':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case '中':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600';
  }
}

export default function WorkflowDetailPage() {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const workflow = getWorkflowById(id);

  if (!workflow) {
    return (
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 p-4 sm:p-5">
        <section className="w-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <h1 className="text-2xl font-semibold text-slate-900">流程详情</h1>
          <p className="mt-2 text-sm leading-5 text-slate-500">
            未找到对应流程实例，当前请求的流程 ID 为 {id ?? '-'}。
          </p>
          <Button asChild size="sm" className="mt-5 rounded-xl bg-[#1890ff] text-white hover:bg-[#1677ff]">
            <Link to="/workflow/todo">
              <ArrowLeft className="h-4 w-4" />
              返回待办列表
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  const dueMeta = getDueMeta(workflow.dueDate);

  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 p-4 sm:p-5">
      <div className="flex w-full flex-col gap-4">
        <section className="rounded-[24px] border border-white/70 bg-white shadow-sm shadow-slate-200/60">
          <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-[linear-gradient(120deg,#f8fbff_0%,#ffffff_54%,#f3fff8_100%)] px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Button asChild variant="outline" size="sm" className="rounded-full border-slate-200 text-slate-600">
                <Link to="/workflow/todo">
                  <ArrowLeft className="h-4 w-4" />
                  返回待办
                </Link>
              </Button>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                    getCategoryBadgeClass(workflow.category),
                  )}
                >
                  {workflow.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                    getPriorityBadgeClass(workflow.priority),
                  )}
                >
                  优先级 {workflow.priority}
                </Badge>
              </div>
              <h1 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-slate-900">{workflow.subject}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-500">{workflow.currentNodeHint}</p>
            </div>

            <div className={cn('rounded-[20px] border px-4 py-3.5 shadow-sm', dueMeta.panelClass)}>
              <p className="text-xs font-medium text-slate-600">流程编号</p>
              <p className="mt-1.5 text-base font-semibold text-slate-900">{workflow.id}</p>
              <p className={cn('mt-3 text-sm font-medium', dueMeta.textClass)}>
                办理期限：{formatDate(workflow.dueDate)}
              </p>
              <Badge
                variant="outline"
                className={cn('mt-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', dueMeta.badgeClass)}
              >
                {dueMeta.label}
              </Badge>
              <p className="mt-3 text-[11px] leading-4 text-slate-500">
                SLA 预警参考日：{formatDate(WORKFLOW_REFERENCE_DATE)}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <section className="space-y-4">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6">
              <div className="flex items-center gap-2 text-slate-900">
                <FileText className="h-4 w-4 text-[#1890ff]" />
                <h2 className="text-base font-semibold">只读表单区</h2>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                左侧仅展示流程已归档信息，不在当前页面修改原始表单内容。
              </p>

              <div className="mt-4 space-y-4">
                <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <UserRound className="h-4 w-4 text-slate-500" />
                    <h3 className="text-sm font-semibold">基本信息</h3>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <ReadOnlyField label="提案联系人" value={workflow.contact} />
                    <ReadOnlyField label="申请类型" value={workflow.applicationType} />
                    <ReadOnlyField label="二级单位" value={workflow.secondaryUnit} />
                    <ReadOnlyField label="部门领导" value={workflow.departmentLeader} />
                    <ReadOnlyField label="专利工程师" value={workflow.patentEngineer} />
                    <ReadOnlyField label="提案编号" value={workflow.proposalCode} />
                    <ReadOnlyField label="提案日" value={formatDate(workflow.proposalDate)} />
                    <ReadOnlyField label="发起人" value={workflow.initiator} />
                  </div>
                </div>

                <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <h3 className="text-sm font-semibold">业务信息</h3>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <ReadOnlyField label="流程名称" value={workflow.workflowName} />
                    <ReadOnlyField label="当前节点" value={workflow.currentNode} />
                    <ReadOnlyField label="当前处理人" value={workflow.currentHandler} />
                    <ReadOnlyField label="关联项目" value={workflow.relatedProject} />
                    <ReadOnlyField label="发明人 / 参与方" value={workflow.inventors} span={2} />
                    <ReadOnlyField label="提案摘要" value={workflow.proposalSummary} span={2} />
                    <ReadOnlyField label="费用承担" value={workflow.costSharing} span={2} />
                    <ReadOnlyField
                      label="办理期限"
                      value={`${formatDate(workflow.dueDate)} · ${dueMeta.label}`}
                      span={2}
                      accentClassName={dueMeta.panelClass}
                    />
                  </div>
                </div>

                <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Paperclip className="h-4 w-4 text-slate-500" />
                    <h3 className="text-sm font-semibold">附件归档</h3>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {workflow.attachments.map((attachment) => (
                      <span
                        key={attachment}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                      >
                        <Paperclip className="h-3 w-3" />
                        {attachment}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="flex items-center gap-2 text-slate-900">
                <CalendarDays className="h-4 w-4 text-[#1890ff]" />
                <h2 className="text-base font-semibold">审批时间轴</h2>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                右侧时间轴展示当前流程的审批流转顺序与节点状态。
              </p>

              <ol className="mt-4 space-y-0">
                {workflow.timeline.map((item, index) => {
                  const meta = getTimelineMeta(item);
                  const Icon = meta.icon;

                  return (
                    <li key={item.id} className="relative pl-10 pb-4 last:pb-0">
                      {index < workflow.timeline.length - 1 ? (
                        <span className="absolute top-8 left-[13px] h-[calc(100%-0.1rem)] w-px bg-slate-200" />
                      ) : null}

                      <span
                        className={cn(
                          'absolute top-0 left-0 flex size-7 items-center justify-center rounded-full border',
                          meta.markerClass,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>

                      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {item.actor} · {item.department}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', meta.badgeClass)}
                          >
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">{item.time}</p>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600">{item.comment}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-4 w-4 text-[#1890ff]" />
                <h2 className="text-base font-semibold">操作按钮区</h2>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                当前节点由 {workflow.currentHandler} 办理，可填写审批意见后选择通过或驳回。
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-sm text-slate-600">
                  <p className="text-[13px] font-medium text-slate-700">当前节点</p>
                  <p className="mt-1.5 text-sm">{workflow.currentNode}</p>
                  <p className="mt-3 text-[13px] font-medium text-slate-700">办理期限</p>
                  <p className={cn('mt-1.5 text-sm font-medium', dueMeta.textClass)}>
                    {formatDate(workflow.dueDate)} · {dueMeta.label}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="approval-comment" className="text-[13px] font-medium text-slate-700">
                    审批意见
                  </label>
                  <Textarea
                    id="approval-comment"
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="填写审批意见，例如：已核对业务必要性、预算与提交材料完整性。"
                    className="min-h-24 rounded-xl border-slate-200 bg-slate-50/70 text-sm leading-5"
                  />
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Button size="sm" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    通过
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-xl">
                    <XCircle className="h-4 w-4" />
                    驳回
                  </Button>
                </div>

                <Button asChild size="sm" variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600">
                  <Link to="/workflow/todo">
                    <ArrowLeft className="h-4 w-4" />
                    返回任务列表
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
