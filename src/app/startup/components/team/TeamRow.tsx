import React from 'react';
import { FaSyncAlt, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  joined: string;
}

interface TeamRowProps {
  member: TeamMember;
  onResend: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  resendLoading: boolean;
  removeLoading: boolean;
}

const getInitial = (name: string, email: string) => {
  if (name && name.length > 0) return name.charAt(0).toUpperCase();
  if (email && email.length > 0) return email.charAt(0).toUpperCase();
  return '?';
};

const TeamRow: React.FC<TeamRowProps> = ({
  member,
  onResend,
  onRemove,
  resendLoading,
  removeLoading,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      {/* Name + Avatar */}
      <td className="px-6 py-4 whitespace-nowrap">
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
      </td>

      {/* Role */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-customGreyishBlack">{member.role || '—'}</td>

      {/* Contact Info */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-customGreyishBlack">
        <div className="flex flex-col gap-1">
          {member.phone && (
            <span className="flex items-center gap-1">
              📞 <span>{member.phone}</span>
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        {member.status === 'Accepted' || member.status === 'Active' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="w-3 h-3 mr-1" /> Accepted
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="w-3 h-3 mr-1" /> Pending
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-3">
          {member.status === 'Pending' && (
            <button
              onClick={() => onResend(member.id)}
              disabled={resendLoading}
              className="text-customBlue hover:text-blue-700 transition-colors duration-200 flex items-center space-x-1"
              title="Resend Invite"
            >
              {resendLoading ? (
                <FaSyncAlt className="animate-spin" />
              ) : (
                <FaSyncAlt />
              )}
              <span>Resend</span>
            </button>
          )}
          <button
            onClick={() => onRemove(member.id)}
            disabled={removeLoading}
            className="text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center space-x-1"
            title="Remove Member"
          >
            {removeLoading ? (
              <FaTrash className="animate-pulse" />
            ) : (
              <FaTrash />
            )}
            <span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeamRow;
