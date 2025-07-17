import React from 'react';
import DataTable, { AdminTableColumn } from '@/app/components/common/DataTable';
import Pagination from './Pagination';
import { FaSyncAlt, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  joined: string;
  industry?: string;
}

interface TeamTableProps {
  members: TeamMember[];
  loading: boolean;
  resendLoadingMap: Record<string | number, boolean>;
  removeLoadingMap: Record<string | number, boolean>;
  onResend: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getInitial = (name: string, email: string) => {
  if (name && name.length > 0) return name.charAt(0).toUpperCase();
  if (email && email.length > 0) return email.charAt(0).toUpperCase();
  return '?';
};

const TeamTable: React.FC<TeamTableProps> = ({
  members,
  loading,
  resendLoadingMap,
  removeLoadingMap,
  onResend,
  onRemove,
  page,
  totalPages,
  onPageChange,
}) => {
  const columns: AdminTableColumn<TeamMember>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (member) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-customBlue flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {getInitial(member.name, member.email)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-customBlack">
              {member.name || '—'}
            </div>
            <div className="text-sm text-customGreyishBlack">
              {member.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (member) => (
        <span className="text-sm text-customGreyishBlack">{member.role || '—'}</span>
      ),
    },
    {
      header: 'Contact Info',
      accessor: 'phone',
      render: (member) => (
        <div className="flex flex-col gap-1 text-sm text-customGreyishBlack">
          {member.phone && (
            <span className="flex items-center gap-1">
              📞 <span>{member.phone}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (member) => (
        member.status === 'Accepted' || member.status === 'Active' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="w-3 h-3 mr-1" /> Accepted
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="w-3 h-3 mr-1" /> Pending
          </span>
        )
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (member) => (
        <div className="flex items-center space-x-3">
          {member.status === 'Pending' && (
            <button
              onClick={() => onResend(member.id)}
              disabled={!!resendLoadingMap[member.id]}
              className="text-customBlue hover:text-blue-700 transition-colors duration-200 flex items-center space-x-1"
              title="Resend Invite"
            >
              {resendLoadingMap[member.id] ? <FaSyncAlt className="animate-spin" /> : <FaSyncAlt />}
              <span>Resend</span>
            </button>
          )}
          <button
            onClick={() => onRemove(member.id)}
            disabled={!!removeLoadingMap[member.id]}
            className="text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center space-x-1"
            title="Delete"
          >
            {removeLoadingMap[member.id] ? <FaTrash className="animate-pulse" /> : <FaTrash />}
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        rowKey={(member) => member.id}
        emptyMessage="No team members found"
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export default TeamTable;
