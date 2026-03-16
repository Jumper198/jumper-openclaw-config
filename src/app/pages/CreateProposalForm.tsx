import React, { type ChangeEvent, type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Paperclip, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../components/ui/utils';

type ProposalFormState = {
  contact: string;
  applicationType: string;
  secondaryUnit: string;
  deptLeader: string;
  patentEngineer: string;
  proposalCode: string;
  proposalDate: string;
  proposalTitle: string;
  proposalSummary: string;
  relatedProject: string;
};

type CostBearerRow = {
  id: string;
  department: string;
  percentage: string;
};

type InventorRow = {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  rewardPercentage: string;
};

type StatusBanner = {
  tone: 'success' | 'warning';
  text: string;
};

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
};

const applicationTypes = ['发明', '实用新型', '外观设计'];
const secondaryUnits = ['中央研究院', '智能制造事业部', '储能系统事业部', '海外研发中心'];
const departmentLeaders = ['李建国', '王岚', '陈瑜', '赵峰'];
const patentEngineers = ['周航', '许诺', '沈青', '林维'];
const costDepartments = ['中央研究院', '智能制造事业部', '材料研发部', '软件平台部'];
const processPreviewSteps = [
  {
    title: '提交人录入',
    detail: '填写提案基础信息、发明人比例与附件后发起流程。',
  },
  {
    title: '部门领导评审',
    detail: '校验立项必要性、成本归属与第一发明人信息。',
  },
  {
    title: '专利工程师复核',
    detail: '确认申请类型、交底材料完整度与提案可专利性。',
  },
  {
    title: '流程归档',
    detail: '生成正式编号并进入后续交底、查新与申报阶段。',
  },
];
const entryTips = [
  '提案名称建议直接描述技术方案，避免“优化方案”这类空标题。',
  '奖励比例必须严格等于 100%，否则按钮会保持禁用。',
  '附件建议至少上传技术交底书或查新材料，便于后续流转。',
];

let costBearerSeed = 0;
let inventorSeed = 0;

function createCostBearerRow(overrides?: Partial<CostBearerRow>): CostBearerRow {
  costBearerSeed += 1;

  return {
    id: `cost-${costBearerSeed}`,
    department: '',
    percentage: '',
    ...overrides,
  };
}

function createInventorRow(overrides?: Partial<InventorRow>): InventorRow {
  inventorSeed += 1;

  return {
    id: `inventor-${inventorSeed}`,
    employeeId: '',
    name: '',
    department: '',
    rewardPercentage: '',
    ...overrides,
  };
}

function parsePercentage(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercentage(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return value.toFixed(2).replace(/\.?0+$/, '');
}

function Field({ label, required = false, hint, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs leading-4 font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[10px] leading-4 text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default function CreateProposalForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProposalFormState>({
    contact: '',
    applicationType: '发明',
    secondaryUnit: '中央研究院',
    deptLeader: '李建国',
    patentEngineer: '周航',
    proposalCode: '',
    proposalDate: '',
    proposalTitle: '',
    proposalSummary: '',
    relatedProject: '',
  });
  const [costBearers, setCostBearers] = useState<CostBearerRow[]>([
    createCostBearerRow({ department: '中央研究院', percentage: '100' }),
  ]);
  const [inventors, setInventors] = useState<InventorRow[]>([
    createInventorRow({ rewardPercentage: '100' }),
  ]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [statusBanner, setStatusBanner] = useState<StatusBanner | null>(null);

  const totalRewardPercentage = Number(
    inventors.reduce((sum, inventor) => sum + parsePercentage(inventor.rewardPercentage), 0).toFixed(2),
  );
  const totalCostPercentage = Number(
    costBearers.reduce((sum, bearer) => sum + parsePercentage(bearer.percentage), 0).toFixed(2),
  );
  const hasMissingReward = inventors.some((inventor) => inventor.rewardPercentage.trim() === '');
  const hasOutOfRangeReward = inventors.some((inventor) => {
    if (inventor.rewardPercentage.trim() === '') {
      return false;
    }

    const value = parsePercentage(inventor.rewardPercentage);
    return value < 0 || value > 100;
  });

  let rewardValidationMessage: string | null = null;

  if (hasMissingReward) {
    rewardValidationMessage = '请填写所有发明人的奖励比例。';
  } else if (hasOutOfRangeReward) {
    rewardValidationMessage = '奖励比例必须在 0% 到 100% 之间。';
  } else if (totalRewardPercentage !== 100) {
    rewardValidationMessage = `奖励比例合计必须严格等于 100%，当前为 ${formatPercentage(totalRewardPercentage)}%。`;
  }

  const rewardAllocationValid = rewardValidationMessage === null;
  const hasBasicInfo =
    form.contact.trim() !== '' &&
    form.applicationType.trim() !== '' &&
    form.secondaryUnit.trim() !== '' &&
    form.deptLeader.trim() !== '' &&
    form.patentEngineer.trim() !== '';
  const hasProposalInfo = form.proposalTitle.trim() !== '';
  const hasCostStructure = costBearers.every(
    (row) => row.department.trim() !== '' && row.percentage.trim() !== '',
  );
  const hasInventorInfo =
    inventors.every(
      (row) =>
        row.employeeId.trim() !== '' &&
        row.name.trim() !== '' &&
        row.department.trim() !== '' &&
        row.rewardPercentage.trim() !== '',
    ) && rewardAllocationValid;
  const checklistItems = [
    {
      label: '基本信息',
      detail: '联系人、申请类型、二级单位、部门领导、专利工程师',
      complete: hasBasicInfo,
    },
    {
      label: '提案信息',
      detail: '至少补齐提案名称，建议同时填写核心内容',
      complete: hasProposalInfo,
    },
    {
      label: '费用承担',
      detail: '承担部门与比例需要完整，合计建议控制为 100%',
      complete: hasCostStructure,
    },
    {
      label: '发明人信息',
      detail: '工号、姓名、部门、奖励比例全部完整且合计 100%',
      complete: hasInventorInfo,
    },
  ];
  const completedChecklistCount = checklistItems.filter((item) => item.complete).length;

  const updateFormField = <K extends keyof ProposalFormState>(field: K, value: ProposalFormState[K]) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setStatusBanner(null);
  };

  const updateCostBearer = (id: string, field: keyof Omit<CostBearerRow, 'id'>, value: string) => {
    setCostBearers((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    setStatusBanner(null);
  };

  const updateInventor = (id: string, field: keyof Omit<InventorRow, 'id'>, value: string) => {
    setInventors((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    setStatusBanner(null);
  };

  const addCostBearer = () => {
    setCostBearers((current) => [...current, createCostBearerRow()]);
    setStatusBanner(null);
  };

  const removeCostBearer = (id: string) => {
    if (costBearers.length === 1) {
      return;
    }

    setCostBearers((current) => current.filter((row) => row.id !== id));
    setStatusBanner(null);
  };

  const addInventor = () => {
    setInventors((current) => [...current, createInventorRow()]);
    setStatusBanner(null);
  };

  const removeInventor = (id: string) => {
    if (inventors.length === 1) {
      return;
    }

    setInventors((current) => current.filter((row) => row.id !== id));
    setStatusBanner(null);
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);

    if (nextFiles.length === 0) {
      return;
    }

    setAttachments((current) => {
      const deduped = nextFiles.filter(
        (file) =>
          !current.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified,
          ),
      );

      return [...current, ...deduped];
    });
    setStatusBanner(null);
    event.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) => current.filter((_, attachmentIndex) => attachmentIndex !== index));
    setStatusBanner(null);
  };

  const buildPayload = () => ({
    ...form,
    costBearers: costBearers.map((row) => ({
      department: row.department,
      percentage: parsePercentage(row.percentage),
    })),
    inventors: inventors.map((row) => ({
      employeeId: row.employeeId,
      name: row.name,
      department: row.department,
      rewardPercentage: parsePercentage(row.rewardPercentage),
    })),
    attachments: attachments.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  });

  const handleSaveDraft = () => {
    console.log('提案草稿 payload:', buildPayload());
    setStatusBanner({
      tone: 'success',
      text: '草稿已暂存。当前为前端演示态，数据已输出到控制台。',
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rewardAllocationValid) {
      setStatusBanner({
        tone: 'warning',
        text: rewardValidationMessage ?? '奖励比例校验未通过，请先修正发明人信息。',
      });
      return;
    }

    console.log('提案提交流程 payload:', buildPayload());
    setStatusBanner({
      tone: 'success',
      text: '流程已启动。当前为前端演示态，提交数据已输出到控制台。',
    });
  };

  return (
    <main className="flex-1 px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto grid w-full max-w-[1880px] gap-4 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <form className="min-w-0 space-y-4 pb-24 text-sm" onSubmit={handleSubmit}>
          <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_40%),linear-gradient(135deg,#ffffff_0%,#f8fafc_58%,#fff7ed_100%)] p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">Process Center</p>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-950">新建提案表单</h1>
                  <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-600">
                    覆盖基本信息、提案内容、费用承担、发明人动态表格和附件归档，按紧凑型 B 端表单密度重新排布。
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div
                  className={cn(
                    'rounded-xl border px-3 py-2 shadow-sm backdrop-blur',
                    rewardAllocationValid
                      ? 'border-emerald-200 bg-white/85 text-emerald-700'
                      : 'border-rose-200 bg-rose-50/90 text-rose-700',
                  )}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em]">发明人比例</p>
                  <p className="mt-0.5 text-lg font-semibold">{formatPercentage(totalRewardPercentage)}%</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2 text-slate-700 shadow-sm backdrop-blur">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em]">费用承担合计</p>
                  <p className="mt-0.5 text-lg font-semibold">{formatPercentage(totalCostPercentage)}%</p>
                </div>
              </div>
            </div>
          </section>

          <Card className="gap-0 rounded-[20px] border-slate-200 shadow-sm">
            <CardHeader className="gap-1 border-b border-slate-100 px-4 pt-4 pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">基本信息</CardTitle>
              <CardDescription className="text-[11px] leading-4">
                提案立项主数据。带 * 字段按方案要求视为必填。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <Field label="提案联系人" required>
                  <Input
                    value={form.contact}
                    onChange={(event) => updateFormField('contact', event.target.value)}
                    placeholder="请输入联系人姓名 / 工号"
                    className="h-8 text-sm"
                    required
                  />
                </Field>

                <Field label="申请类型" required>
                  <Select value={form.applicationType} onValueChange={(value) => updateFormField('applicationType', value)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="请选择申请类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationTypes.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="二级单位" required>
                  <Select value={form.secondaryUnit} onValueChange={(value) => updateFormField('secondaryUnit', value)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="请选择二级单位" />
                    </SelectTrigger>
                    <SelectContent>
                      {secondaryUnits.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="部门领导" required>
                  <Select value={form.deptLeader} onValueChange={(value) => updateFormField('deptLeader', value)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="请选择部门领导" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentLeaders.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="专利工程师" required>
                  <Select value={form.patentEngineer} onValueChange={(value) => updateFormField('patentEngineer', value)}>
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="请选择专利工程师" />
                    </SelectTrigger>
                    <SelectContent>
                      {patentEngineers.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="提案编号" hint="保留字段，可由后端在保存后回填。">
                  <Input
                    value={form.proposalCode}
                    onChange={(event) => updateFormField('proposalCode', event.target.value)}
                    placeholder="例如：IP-2026-00128"
                    className="h-8 text-sm"
                  />
                </Field>

                <Field label="提案日">
                  <Input
                    type="date"
                    value={form.proposalDate}
                    onChange={(event) => updateFormField('proposalDate', event.target.value)}
                    className="h-8 text-sm"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-[20px] border-slate-200 shadow-sm">
            <CardHeader className="gap-1 border-b border-slate-100 px-4 pt-4 pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">提案信息</CardTitle>
              <CardDescription className="text-[11px] leading-4">聚焦提案标题、核心内容和项目归属。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pt-3 pb-4">
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <Field label="提案名称" required>
                  <Input
                    value={form.proposalTitle}
                    onChange={(event) => updateFormField('proposalTitle', event.target.value)}
                    placeholder="请输入提案名称"
                    className="h-8 text-sm"
                    required
                  />
                </Field>

                <Field label="关联项目">
                  <Input
                    value={form.relatedProject}
                    onChange={(event) => updateFormField('relatedProject', event.target.value)}
                    placeholder="例如：星火计划二期 / 自定义项目名"
                    className="h-8 text-sm"
                  />
                </Field>

                <div className="xl:col-span-2">
                  <Field label="专利提案核心内容">
                    <Textarea
                      value={form.proposalSummary}
                      onChange={(event) => updateFormField('proposalSummary', event.target.value)}
                      className="min-h-24 text-sm leading-5"
                      placeholder="请概述技术方案、创新点、相对现有技术的差异。"
                    />
                  </Field>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-[20px] border-slate-200 shadow-sm">
            <CardHeader className="gap-1 border-b border-slate-100 px-4 pt-4 pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">费用承担</CardTitle>
              <CardDescription className="text-[11px] leading-4">支持多部门分摊，当前为前端演示态。</CardDescription>
              <CardAction>
                <Button type="button" variant="outline" size="sm" onClick={addCostBearer} className="text-xs">
                  <Plus className="size-4" />
                  新增分摊
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2.5 px-4 pt-3 pb-4">
              <div className="rounded-2xl border border-slate-200">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead className="h-8 w-[45%] px-3 text-xs">承担部门</TableHead>
                      <TableHead className="h-8 w-[35%] px-3 text-xs">承担比例 (%)</TableHead>
                      <TableHead className="h-8 w-[20%] px-3 text-right text-xs">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costBearers.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="px-3 py-2">
                          <Select value={row.department} onValueChange={(value) => updateCostBearer(row.id, 'department', value)}>
                            <SelectTrigger size="sm">
                              <SelectValue placeholder="请选择承担部门" />
                            </SelectTrigger>
                            <SelectContent>
                              {costDepartments.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            inputMode="decimal"
                            value={row.percentage}
                            onChange={(event) => updateCostBearer(row.id, 'percentage', event.target.value)}
                            placeholder="0"
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCostBearer(row.id)}
                            disabled={costBearers.length === 1}
                            className="text-xs text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 className="size-4" />
                            删除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="px-3 py-2 font-semibold">合计</TableCell>
                      <TableCell className="px-3 py-2 font-semibold">{formatPercentage(totalCostPercentage)}%</TableCell>
                      <TableCell className="px-3 py-2 text-right text-[11px] text-slate-500">
                        建议控制为 100%
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              <p className="text-[10px] leading-4 text-slate-500">
                费用承担区目前不阻断提交流程，但保留了多部门分摊录入结构。
              </p>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-[20px] border-slate-200 shadow-sm">
            <CardHeader className="gap-1 border-b border-slate-100 px-4 pt-4 pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">发明人信息</CardTitle>
              <CardDescription className="text-[11px] leading-4">
                动态表格支持增删行，第 1 行默认视作第一发明人。
              </CardDescription>
              <CardAction>
                <Button type="button" variant="outline" size="sm" onClick={addInventor} className="text-xs">
                  <Plus className="size-4" />
                  添加发明人
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2.5 px-4 pt-3 pb-4">
              <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900">奖励比例实时校验</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-600">
                    提交前必须保证所有发明人奖励比例合计严格等于 100%。
                  </p>
                </div>
                <div
                  className={cn(
                    'rounded-full border px-3 py-1 text-[11px] font-semibold',
                    rewardAllocationValid
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700',
                  )}
                >
                  当前合计 {formatPercentage(totalRewardPercentage)}%
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead className="h-8 w-[20%] px-3 text-xs">工号</TableHead>
                      <TableHead className="h-8 w-[20%] px-3 text-xs">姓名</TableHead>
                      <TableHead className="h-8 w-[28%] px-3 text-xs">部门</TableHead>
                      <TableHead className="h-8 w-[20%] px-3 text-xs">奖励比例 (%)</TableHead>
                      <TableHead className="h-8 w-[12%] px-3 text-right text-xs">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventors.map((row, index) => {
                      const rewardValue = parsePercentage(row.rewardPercentage);
                      const rewardOutOfRange =
                        row.rewardPercentage.trim() !== '' && (rewardValue < 0 || rewardValue > 100);

                      return (
                        <TableRow key={row.id}>
                          <TableCell className="px-3 py-2">
                            <div className="space-y-1">
                              <Input
                                value={row.employeeId}
                                onChange={(event) => updateInventor(row.id, 'employeeId', event.target.value)}
                                placeholder="例如：A10293"
                                className="h-8 text-sm"
                                required
                              />
                              {index === 0 ? <p className="text-[10px] text-amber-600">默认第一发明人</p> : null}
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <Input
                              value={row.name}
                              onChange={(event) => updateInventor(row.id, 'name', event.target.value)}
                              placeholder="请输入姓名"
                              className="h-8 text-sm"
                              required
                            />
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <Input
                              value={row.department}
                              onChange={(event) => updateInventor(row.id, 'department', event.target.value)}
                              placeholder="请输入所属部门"
                              className="h-8 text-sm"
                              required
                            />
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              inputMode="decimal"
                              value={row.rewardPercentage}
                              onChange={(event) => updateInventor(row.id, 'rewardPercentage', event.target.value)}
                              placeholder="0"
                              className="h-8 text-sm"
                              required
                              aria-invalid={!rewardAllocationValid || rewardOutOfRange}
                            />
                          </TableCell>
                          <TableCell className="px-3 py-2 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInventor(row.id)}
                              disabled={inventors.length === 1}
                              className="text-xs text-slate-500 hover:text-rose-600"
                            >
                              <Trash2 className="size-4" />
                              删除
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="px-3 py-2 font-semibold" colSpan={3}>
                        奖励比例合计
                      </TableCell>
                      <TableCell
                        className={cn(
                          'px-3 py-2 font-semibold',
                          rewardAllocationValid ? 'text-emerald-700' : 'text-rose-700',
                        )}
                      >
                        {formatPercentage(totalRewardPercentage)}%
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right text-[11px] text-slate-500">
                        {inventors.length} 人
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              {rewardValidationMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] leading-4 text-rose-700">
                  {rewardValidationMessage}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] leading-4 text-emerald-700">
                  奖励比例校验通过，可以启动流程。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-[20px] border-slate-200 shadow-sm">
            <CardHeader className="gap-1 border-b border-slate-100 px-4 pt-4 pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">附件</CardTitle>
              <CardDescription className="text-[11px] leading-4">
                支持上传提案材料、查新报告、技术交底书等附件。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pt-3 pb-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,240px)_1fr]">
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-3.5">
                  <div className="flex items-center gap-2.5 text-slate-900">
                    <Paperclip className="size-4" />
                    <p className="text-xs font-semibold">上传附件</p>
                  </div>
                  <p className="mt-1 text-[11px] leading-4 text-slate-600">
                    支持多文件选择。当前为演示态，仅展示文件名，不上传到服务器。
                  </p>
                  <Input type="file" multiple className="mt-3 h-8 text-sm" onChange={handleAttachmentChange} />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-4 py-2.5">
                    <p className="text-xs font-semibold text-slate-900">附件清单</p>
                  </div>
                  <div className="px-4 py-3">
                    {attachments.length === 0 ? (
                      <p className="text-[11px] text-slate-500">暂未添加附件。</p>
                    ) : (
                      <ul className="space-y-2">
                        {attachments.map((file, index) => (
                          <li
                            key={`${file.name}-${file.lastModified}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-900">{file.name}</p>
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {(file.size / 1024).toFixed(1)} KB
                                {file.type ? ` · ${file.type}` : ''}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="text-xs text-slate-500 hover:text-rose-600"
                            >
                              <Trash2 className="size-4" />
                              移除
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-2 z-20">
            <div className="flex flex-col gap-2.5 rounded-[18px] border border-slate-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-900">底部悬浮操作区</p>
                <p className="text-[11px] leading-4 text-slate-600">
                  {rewardAllocationValid
                    ? '发明人奖励比例校验已通过，启动流程按钮可用。'
                    : rewardValidationMessage}
                </p>
                {statusBanner ? (
                  <p
                    className={cn(
                      'text-[11px] font-semibold',
                      statusBanner.tone === 'success' ? 'text-emerald-700' : 'text-rose-700',
                    )}
                  >
                    {statusBanner.text}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/workflow/todo')}
                  className="text-xs"
                >
                  取消
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={handleSaveDraft} className="text-xs">
                  暂存草稿
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!rewardAllocationValid}
                  className="bg-amber-600 text-xs text-white hover:bg-amber-700 disabled:bg-slate-300"
                >
                  启动流程
                </Button>
              </div>
            </div>
          </div>
        </form>

        <aside className="hidden xl:block">
          <div className="sticky top-4 space-y-3">
            <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">Form Pulse</p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-900">录入概览</h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {completedChecklistCount}/{checklistItems.length} 完成
                </span>
              </div>

              <div className="mt-3 grid gap-2.5 2xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                  <p className="text-[10px] text-slate-500">发明人</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{inventors.length} 人</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                  <p className="text-[10px] text-slate-500">费用分摊</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{costBearers.length} 条</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                  <p className="text-[10px] text-slate-500">附件</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{attachments.length} 个</p>
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">提交前检查</h2>
                <span className="text-[10px] text-slate-500">必填项</span>
              </div>

              <ul className="mt-3 space-y-2">
                {checklistItems.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      'rounded-xl border px-3 py-2',
                      item.complete ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50/80',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-slate-900">{item.label}</p>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          item.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600',
                        )}
                      >
                        {item.complete ? '已完成' : '待补齐'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-4 text-slate-600">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">流程预览</h2>
              <div className="mt-3 space-y-2.5">
                {processPreviewSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                        {index + 1}
                      </div>
                      {index < processPreviewSteps.length - 1 ? <div className="mt-1 h-full w-px bg-slate-200" /> : null}
                    </div>
                    <div className="pb-2">
                      <p className="text-xs font-semibold text-slate-900">{step.title}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-slate-600">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">录入提示</h2>
              <ul className="mt-3 space-y-2">
                {entryTips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-[11px] leading-4 text-slate-600">
                    <span className="mt-1 size-1.5 rounded-full bg-amber-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
