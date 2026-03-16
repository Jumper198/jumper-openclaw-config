import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import AssetLedgerPage from './pages/AssetLedgerPage';
import BonusSettlementPage from './pages/BonusSettlementPage';
import Dashboard from './pages/Dashboard';
import TaskListPage from './pages/TaskListPage';
import CreateProposalForm from './pages/CreateProposalForm';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import InnovationPage from './pages/InnovationPage';
import SystemConfigPage from './pages/SystemConfigPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="workflow/todo" element={<TaskListPage />} />
          <Route path="workflow/create" element={<CreateProposalForm />} />
          <Route path="workflow/detail/:id" element={<WorkflowDetailPage />} />
          <Route path="assets/ledger" element={<AssetLedgerPage />} />
          <Route path="assets/bonus-settlement" element={<BonusSettlementPage />} />
          <Route path="innovation" element={<InnovationPage />} />
          <Route path="settings" element={<SystemConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
