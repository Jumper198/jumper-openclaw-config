# Route Refactor (2026-03-11)

## Task
- 按《流程中心方案 v0.1》重构前端路由骨架，拆分 `layouts/` 与 `pages/`。

## Changes
- 新增 `src/app/layouts/MainLayout.tsx`，承接全局外层布局与 `TopNavigation`，使用 `<Outlet />` 渲染子路由。
- 新增 `src/app/pages/Dashboard.tsx`，承接原 `App.tsx` 仪表盘内容。
- 新增流程占位页：
  - `src/app/pages/TaskListPage.tsx`
  - `src/app/pages/CreateProposalForm.tsx`
  - `src/app/pages/WorkflowDetailPage.tsx`
- 重写 `src/app/App.tsx`，接入 `react-router` 路由树：
  - `/`
  - `/workflow/todo`
  - `/workflow/create`
  - `/workflow/detail/:id`

## Validation
- 已执行 `npm run build`。
- 当前失败原因为环境缺少 `vite` 可执行文件，不是本次业务代码报错。
