import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';

import { useAdminStore } from '../../../stores/AdminStore';
import { UserRole } from '../../../types/eoc';

import {
  Shield,
  Users,
  Lock,
  History,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Key,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { users, auditLogs, updateUserRole, updateUserStatus, logAuditAction } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');

  const roleList: UserRole[] = [
    'Super Admin',
    'Admin',
    'Dispatcher',
    'Rescue Commander',
    'Team Leader',
    'Field Rescuer',
    'Observer',
  ];

  return (
    <PageContainer
      title="EOC Administration & Role-Based Access Control (RBAC)"
      subtitle="User Roles, Fine-Grained Permissions, Immutable Audit Logs & System Configuration"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Administration' }]}
    >
      {/* Navigation Tabs */}
      <div className="mb-6 flex items-center gap-2 p-1 bg-[#10232C] border border-[#1E3440] rounded-xl">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'users' ? 'bg-[#00D4FF] text-[#07161E] shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          User Account Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'roles' ? 'bg-[#00D4FF] text-[#07161E] shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          RBAC Role & Permission Matrix
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'audit' ? 'bg-[#00D4FF] text-[#07161E] shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Immutable Audit Log History ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: User Account Roster */}
      {activeTab === 'users' && (
        <Card title="EOC Personnel Roster & RBAC Role Assignment">
          <Table
            data={users}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'User Name',
                accessor: (item) => (
                  <div>
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{item.email}</span>
                  </div>
                ),
              },
              {
                header: 'Department',
                accessor: (item) => <span className="text-xs text-[#AAB6C3]">{item.department}</span>,
              },
              {
                header: 'Assigned Role',
                accessor: (item) => (
                  <select
                    value={item.role}
                    onChange={(e) => updateUserRole(item.id, e.target.value as any)}
                    className="bg-[#07161E] border border-[#1E3440] text-xs font-mono text-[#00D4FF] font-bold rounded px-2 py-1 outline-none"
                  >
                    {roleList.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ),
              },
              {
                header: 'Status',
                accessor: (item) => (
                  <Badge variant={item.status === 'On Duty' ? 'success' : 'neutral'}>
                    {item.status}
                  </Badge>
                ),
              },
              {
                header: 'Last Active',
                accessor: (item) => <span className="text-[11px] font-mono text-gray-400">{item.lastActive}</span>,
              },
            ]}
          />
        </Card>
      )}

      {/* Tab 2: Permission Matrix */}
      {activeTab === 'roles' && (
        <Card title="EOC RBAC Permission Matrix">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left text-white border-collapse">
              <thead>
                <tr className="border-b border-[#1E3440] bg-[#07161E]">
                  <th className="p-3 text-gray-400">Permission Module</th>
                  <th className="p-3 text-[#FF4B55]">Super Admin</th>
                  <th className="p-3 text-[#FFB000]">Admin</th>
                  <th className="p-3 text-[#00D4FF]">Dispatcher</th>
                  <th className="p-3 text-[#3DDC84]">Rescue Commander</th>
                  <th className="p-3 text-gray-300">Team Leader</th>
                  <th className="p-3 text-gray-400">Observer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { module: 'EOC DEFCON Alert Control', perm: ['Full', 'Full', 'None', 'Read', 'None', 'None'] },
                  { module: 'Mission Creation & Dispatch', perm: ['Full', 'Full', 'Full', 'Full', 'Read', 'None'] },
                  { module: 'Rescue Team Allocation', perm: ['Full', 'Full', 'Full', 'Full', 'Manage Own', 'None'] },
                  { module: 'Vehicle Telemetry Override', perm: ['Full', 'Full', 'Full', 'Read', 'Read', 'None'] },
                  { module: 'Emergency Broadcast Transmission', perm: ['Full', 'Full', 'Full', 'Full', 'None', 'None'] },
                  { module: 'Audit Log Inspection', perm: ['Full', 'Full', 'None', 'None', 'None', 'None'] },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-[#1E3440]/60 hover:bg-[#07161E]/40">
                    <td className="p-3 font-bold text-[#00D4FF]">{row.module}</td>
                    {row.perm.map((p, pIdx) => (
                      <td key={pIdx} className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p === 'Full' ? 'bg-[#3DDC84]/20 text-[#3DDC84]' : p === 'None' ? 'bg-[#FF4B55]/15 text-[#FF4B55]' : 'bg-[#1E3440] text-gray-300'
                        }`}>
                          {p}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Immutable Audit Logs */}
      {activeTab === 'audit' && (
        <Card title="Immutable Audit Trail & System Action Logs">
          <Table
            data={auditLogs}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Timestamp',
                accessor: (item) => <span className="font-mono text-[#00D4FF] font-bold">{item.timestamp}</span>,
              },
              {
                header: 'User',
                accessor: (item) => (
                  <div>
                    <span className="font-bold text-white block">{item.userName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({item.userRole})</span>
                  </div>
                ),
              },
              {
                header: 'Action',
                accessor: (item) => (
                  <span className="px-2 py-0.5 rounded bg-[#1E3440] text-[10px] font-mono text-[#3DDC84] font-bold">
                    {item.action}
                  </span>
                ),
              },
              {
                header: 'Target Module',
                accessor: (item) => <span className="text-xs text-[#AAB6C3]">{item.targetModule}</span>,
              },
              {
                header: 'Details',
                accessor: (item) => <span className="text-xs text-gray-300">{item.details}</span>,
              },
              {
                header: 'IP Address',
                accessor: (item) => <span className="text-[10px] font-mono text-gray-500">{item.ipAddress}</span>,
              },
            ]}
          />
        </Card>
      )}
    </PageContainer>
  );
};

export default AdminPage;
