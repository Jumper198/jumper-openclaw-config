export type TimelineStatus = 'done' | 'current' | 'pending' | 'rejected';

export type TimelineItem = {
  id: string;
  title: string;
  actor: string;
  department: string;
  time: string;
  status: TimelineStatus;
  comment: string;
};

export type WorkflowTaskRecord = {
  id: string;
  category: string;
  subject: string;
  workflowName: string;
  currentNode: string;
  currentHandler: string;
  dueDate: string;
  initiator: string;
  createdAt: string;
  priority: '高' | '中' | '低';
  contact: string;
  applicationType: string;
  secondaryUnit: string;
  departmentLeader: string;
  patentEngineer: string;
  proposalCode: string;
  proposalDate: string;
  relatedProject: string;
  proposalSummary: string;
  costSharing: string;
  inventors: string;
  attachments: string[];
  currentNodeHint: string;
  timeline: TimelineItem[];
};

type DueTone = 'overdue' | 'dueSoon' | 'normal';

export const WORKFLOW_REFERENCE_DATE = '2026-03-11';

export const workflowTasks: WorkflowTaskRecord[] = [
  {
    id: 'WF-2026-001',
    category: '专利申请',
    subject: '高效散热模组发明专利申请',
    workflowName: '专利申请提交流程',
    currentNode: '部门领导审批',
    currentHandler: '李建国',
    dueDate: '2026-03-10',
    initiator: '陈雨桐',
    createdAt: '2026-03-06',
    priority: '高',
    contact: '陈雨桐',
    applicationType: '发明',
    secondaryUnit: '中央研究院',
    departmentLeader: '李建国',
    patentEngineer: '周航',
    proposalCode: 'PA-2026-001',
    proposalDate: '2026-03-06',
    relatedProject: '新一代储能系统热管理平台',
    proposalSummary:
      '围绕储能柜散热模组的风道重构与导热材料组合方案，目标降低核心组件峰值温升 18%，并形成核心结构专利池。',
    costSharing: '中央研究院 70%，材料研发部 30%',
    inventors: '陈雨桐 / 宋明 / 顾衡',
    attachments: ['技术交底书.pdf', '热仿真报告.xlsx', '样机照片.zip'],
    currentNodeHint: '请确认是否同意以部门项目资源进入专利申请流程。',
    timeline: [
      {
        id: 'WF-2026-001-t1',
        title: '提案人提交',
        actor: '陈雨桐',
        department: '中央研究院',
        time: '2026-03-06 09:20',
        status: 'done',
        comment: '已提交技术交底书、对比材料与样机照片。',
      },
      {
        id: 'WF-2026-001-t2',
        title: '专利工程师预审',
        actor: '周航',
        department: '知识产权管理部',
        time: '2026-03-07 14:10',
        status: 'done',
        comment: '检索未发现高风险冲突文献，建议进入部门审批。',
      },
      {
        id: 'WF-2026-001-t3',
        title: '部门领导审批',
        actor: '李建国',
        department: '中央研究院',
        time: '2026-03-10 08:30',
        status: 'current',
        comment: '待确认项目资源与商业化窗口是否匹配。',
      },
      {
        id: 'WF-2026-001-t4',
        title: '法务复核',
        actor: '法务共享中心',
        department: '法务部',
        time: '待触发',
        status: 'pending',
        comment: '部门审批通过后自动流转。',
      },
    ],
  },
  {
    id: 'WF-2026-002',
    category: '专利申请',
    subject: '柔性电池包壳体结构优化',
    workflowName: '专利申请提交流程',
    currentNode: '专利工程师复核',
    currentHandler: '许诺',
    dueDate: '2026-03-11',
    initiator: '宋明',
    createdAt: '2026-03-08',
    priority: '中',
    contact: '宋明',
    applicationType: '发明',
    secondaryUnit: '储能系统事业部',
    departmentLeader: '王岚',
    patentEngineer: '许诺',
    proposalCode: 'PA-2026-002',
    proposalDate: '2026-03-08',
    relatedProject: '柔性电池包平台化改型',
    proposalSummary:
      '针对柔性电池包壳体的加强筋与安装槽位进行一体化设计，提升安装效率并降低运输变形率。',
    costSharing: '储能系统事业部 100%',
    inventors: '宋明 / 赵川',
    attachments: ['结构草图.dwg', '试装记录.pdf'],
    currentNodeHint: '请确认技术特征是否足以支撑独立权利要求。',
    timeline: [
      {
        id: 'WF-2026-002-t1',
        title: '提案人提交',
        actor: '宋明',
        department: '储能系统事业部',
        time: '2026-03-08 11:05',
        status: 'done',
        comment: '已同步提交结构草图和试装数据。',
      },
      {
        id: 'WF-2026-002-t2',
        title: '部门领导审批',
        actor: '王岚',
        department: '储能系统事业部',
        time: '2026-03-09 17:40',
        status: 'done',
        comment: '同意立项申请，要求补充竞品对比。',
      },
      {
        id: 'WF-2026-002-t3',
        title: '专利工程师复核',
        actor: '许诺',
        department: '知识产权管理部',
        time: '2026-03-10 09:15',
        status: 'current',
        comment: '待补充壳体筋位相较现有方案的差异性描述。',
      },
      {
        id: 'WF-2026-002-t4',
        title: '代理所撰写',
        actor: '华东代理组',
        department: '外部代理所',
        time: '待触发',
        status: 'pending',
        comment: '复核通过后由代理所接续撰写。',
      },
    ],
  },
  {
    id: 'WF-2026-003',
    category: '商标管理',
    subject: '“OpenClaw Insight”图形商标续展',
    workflowName: '商标续展审批流程',
    currentNode: '法务复核',
    currentHandler: '林嘉',
    dueDate: '2026-03-13',
    initiator: '周妍',
    createdAt: '2026-03-04',
    priority: '中',
    contact: '周妍',
    applicationType: '商标续展',
    secondaryUnit: '品牌市场中心',
    departmentLeader: '陈瑜',
    patentEngineer: '林嘉',
    proposalCode: 'TM-2026-003',
    proposalDate: '2026-03-04',
    relatedProject: '品牌升级与海外发行计划',
    proposalSummary:
      '对主品牌图形商标进行续展申请，并同步确认 Nice 分类覆盖范围与历史使用证据。',
    costSharing: '品牌市场中心 60%，海外业务部 40%',
    inventors: '品牌组 / 法务组',
    attachments: ['商标样稿.ai', '使用证据目录.pdf'],
    currentNodeHint: '请确认海外发行场景是否需要同步扩展分类。',
    timeline: [
      {
        id: 'WF-2026-003-t1',
        title: '业务发起',
        actor: '周妍',
        department: '品牌市场中心',
        time: '2026-03-04 15:30',
        status: 'done',
        comment: '已上传商标样稿与近三年使用证据。',
      },
      {
        id: 'WF-2026-003-t2',
        title: '品牌负责人审批',
        actor: '陈瑜',
        department: '品牌市场中心',
        time: '2026-03-05 10:05',
        status: 'done',
        comment: '同意续展，要求同步保留海外分类弹性。',
      },
      {
        id: 'WF-2026-003-t3',
        title: '法务复核',
        actor: '林嘉',
        department: '法务部',
        time: '2026-03-10 13:20',
        status: 'current',
        comment: '正在核验分类与历史授权文件完整性。',
      },
      {
        id: 'WF-2026-003-t4',
        title: '对外申报',
        actor: '商标代理机构',
        department: '外部代理所',
        time: '待触发',
        status: 'pending',
        comment: '法务复核通过后提交官方续展。',
      },
    ],
  },
  {
    id: 'WF-2026-004',
    category: '软著登记',
    subject: '流程中心规则引擎 V1.0 登记',
    workflowName: '软著登记流程',
    currentNode: '材料盖章',
    currentHandler: '行政共享中心',
    dueDate: '2026-03-16',
    initiator: '顾衡',
    createdAt: '2026-03-09',
    priority: '低',
    contact: '顾衡',
    applicationType: '软件著作权',
    secondaryUnit: '软件平台部',
    departmentLeader: '赵峰',
    patentEngineer: '沈青',
    proposalCode: 'CR-2026-004',
    proposalDate: '2026-03-09',
    relatedProject: '流程中心产品化一期',
    proposalSummary:
      '针对流程中心规则编排、SLA 预警和审批链配置能力进行软件著作权登记，沉淀产品版本权属证明。',
    costSharing: '软件平台部 100%',
    inventors: '顾衡 / 夏岚 / 潘卓',
    attachments: ['源代码节选.pdf', '操作说明书.docx'],
    currentNodeHint: '请确认盖章材料与登记说明书版本一致。',
    timeline: [
      {
        id: 'WF-2026-004-t1',
        title: '研发提交',
        actor: '顾衡',
        department: '软件平台部',
        time: '2026-03-09 10:18',
        status: 'done',
        comment: '已提交源代码节选与操作说明书。',
      },
      {
        id: 'WF-2026-004-t2',
        title: '知识产权复核',
        actor: '沈青',
        department: '知识产权管理部',
        time: '2026-03-10 16:00',
        status: 'done',
        comment: '材料合规，可进入用印阶段。',
      },
      {
        id: 'WF-2026-004-t3',
        title: '材料盖章',
        actor: '行政共享中心',
        department: '行政部',
        time: '2026-03-11 09:10',
        status: 'current',
        comment: '待完成纸质材料盖章和扫描回传。',
      },
      {
        id: 'WF-2026-004-t4',
        title: '官方递交',
        actor: '登记专员',
        department: '知识产权管理部',
        time: '待触发',
        status: 'pending',
        comment: '盖章完成后递交登记。',
      },
    ],
  },
  {
    id: 'WF-2026-005',
    category: '专利申请',
    subject: '多模态巡检相机支架结构申请',
    workflowName: '专利申请提交流程',
    currentNode: '代理所撰写',
    currentHandler: '华东代理组',
    dueDate: '2026-03-18',
    initiator: '夏岚',
    createdAt: '2026-03-05',
    priority: '中',
    contact: '夏岚',
    applicationType: '实用新型',
    secondaryUnit: '智能制造事业部',
    departmentLeader: '陈瑜',
    patentEngineer: '周航',
    proposalCode: 'PA-2026-005',
    proposalDate: '2026-03-05',
    relatedProject: '智能巡检终端升级项目',
    proposalSummary:
      '为多模态巡检终端设计可折叠快拆支架，解决安装角度受限和维护耗时的问题。',
    costSharing: '智能制造事业部 100%',
    inventors: '夏岚 / 谢恒',
    attachments: ['支架爆炸图.step', '场景照片.zip'],
    currentNodeHint: '等待代理所输出初稿，可先准备实施例图片和改型版本。',
    timeline: [
      {
        id: 'WF-2026-005-t1',
        title: '提案人提交',
        actor: '夏岚',
        department: '智能制造事业部',
        time: '2026-03-05 18:20',
        status: 'done',
        comment: '已提交爆炸图和使用场景照片。',
      },
      {
        id: 'WF-2026-005-t2',
        title: '部门领导审批',
        actor: '陈瑜',
        department: '智能制造事业部',
        time: '2026-03-06 11:45',
        status: 'done',
        comment: '同意申请，要求控制公开节奏。',
      },
      {
        id: 'WF-2026-005-t3',
        title: '代理所撰写',
        actor: '华东代理组',
        department: '外部代理所',
        time: '2026-03-10 15:00',
        status: 'current',
        comment: '代理所正在整理结构层级和实施例表达。',
      },
      {
        id: 'WF-2026-005-t4',
        title: '发明人确认初稿',
        actor: '夏岚',
        department: '智能制造事业部',
        time: '待触发',
        status: 'pending',
        comment: '代理所初稿完成后回到发明人确认。',
      },
    ],
  },
  {
    id: 'WF-2026-006',
    category: '合同审查',
    subject: '海外代理所年度框架协议审查',
    workflowName: '合同法务审批流程',
    currentNode: '法务经理审批',
    currentHandler: '刘峥',
    dueDate: '2026-03-09',
    initiator: '林嘉',
    createdAt: '2026-03-03',
    priority: '高',
    contact: '林嘉',
    applicationType: '合同审查',
    secondaryUnit: '法务部',
    departmentLeader: '刘峥',
    patentEngineer: '林嘉',
    proposalCode: 'CT-2026-006',
    proposalDate: '2026-03-03',
    relatedProject: '海外知识产权代理年度采购',
    proposalSummary:
      '审查海外代理所年度框架协议中的责任边界、赔偿条款与交付 SLA，降低后续委托风险。',
    costSharing: '法务部 100%',
    inventors: '法务部',
    attachments: ['年度框架协议.docx', '红线版本.pdf'],
    currentNodeHint: '请尽快完成赔偿条款确认，避免影响年度采购生效。',
    timeline: [
      {
        id: 'WF-2026-006-t1',
        title: '法务专员提交',
        actor: '林嘉',
        department: '法务部',
        time: '2026-03-03 14:40',
        status: 'done',
        comment: '已提交协议正本和红线版本。',
      },
      {
        id: 'WF-2026-006-t2',
        title: '采购会签',
        actor: '采购共享中心',
        department: '采购部',
        time: '2026-03-05 09:10',
        status: 'done',
        comment: '对付款条款和里程碑交付安排无异议。',
      },
      {
        id: 'WF-2026-006-t3',
        title: '法务经理审批',
        actor: '刘峥',
        department: '法务部',
        time: '2026-03-07 17:30',
        status: 'current',
        comment: '赔偿责任上限仍需最终确认，当前已逾期。',
      },
      {
        id: 'WF-2026-006-t4',
        title: '合同盖章',
        actor: '行政共享中心',
        department: '行政部',
        time: '待触发',
        status: 'pending',
        comment: '审批完成后进入盖章归档。',
      },
    ],
  },
];

export function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function formatDate(value: string) {
  return value.replace(/-/g, '.');
}

export function getDayDistance(targetDate: string, referenceDate = WORKFLOW_REFERENCE_DATE) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round(
    (parseDateOnly(targetDate).getTime() - parseDateOnly(referenceDate).getTime()) / millisecondsPerDay,
  );
}

export function getDueMeta(dueDate: string, referenceDate = WORKFLOW_REFERENCE_DATE) {
  const dayDistance = getDayDistance(dueDate, referenceDate);

  if (dayDistance < 0) {
    return {
      tone: 'overdue' as DueTone,
      dayDistance,
      label: `已逾期 ${Math.abs(dayDistance)} 天`,
      textClass: 'text-rose-700',
      badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
      panelClass: 'border-rose-200 bg-rose-50/70',
      rowClass: 'bg-rose-50/35 hover:bg-rose-50/70',
    };
  }

  if (dayDistance === 0) {
    return {
      tone: 'dueSoon' as DueTone,
      dayDistance,
      label: '今日到期',
      textClass: 'text-amber-700',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
      panelClass: 'border-amber-200 bg-amber-50/70',
      rowClass: 'bg-amber-50/35 hover:bg-amber-50/70',
    };
  }

  if (dayDistance <= 5) {
    return {
      tone: 'dueSoon' as DueTone,
      dayDistance,
      label: `${dayDistance} 天内到期`,
      textClass: 'text-amber-700',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
      panelClass: 'border-amber-200 bg-amber-50/70',
      rowClass: 'bg-amber-50/20 hover:bg-amber-50/60',
    };
  }

  return {
    tone: 'normal' as DueTone,
    dayDistance,
    label: '正常',
    textClass: 'text-slate-600',
    badgeClass: 'border-slate-200 bg-slate-50 text-slate-600',
    panelClass: 'border-slate-200 bg-slate-50/70',
    rowClass: 'bg-white hover:bg-slate-50',
  };
}

export function getWorkflowById(id?: string) {
  return workflowTasks.find((task) => task.id === id);
}

export function getCategoryBadgeClass(category: string) {
  switch (category) {
    case '专利申请':
      return 'border-sky-200 bg-sky-50 text-sky-700';
    case '商标管理':
      return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700';
    case '软著登记':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case '合同审查':
      return 'border-violet-200 bg-violet-50 text-violet-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700';
  }
}
