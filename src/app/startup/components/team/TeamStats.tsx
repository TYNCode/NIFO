import React from 'react';

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

interface TeamStatsProps {
  members: TeamMember[];
}

const TeamStats: React.FC<TeamStatsProps> = ({ members }) => {
  const total = members.length;
  const accepted = members.filter(m => m.status === 'Accepted' || m.status === 'Active').length;
  const pending = members.filter(m => m.status === 'Pending').length;

  // Industry acceptance (if industry field exists)
  const industryMap: Record<string, number> = {};
  members.forEach(m => {
    if (m.industry && (m.status === 'Accepted' || m.status === 'Active')) {
      industryMap[m.industry] = (industryMap[m.industry] || 0) + 1;
    }
  });
  const industries = Object.entries(industryMap);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">Total Invited</span>
        <span className="text-2xl font-bold text-gray-900">{total}</span>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">Accepted / Active</span>
        <span className="text-2xl font-bold text-green-600">{accepted}</span>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">Pending</span>
        <span className="text-2xl font-bold text-yellow-600">{pending}</span>
      </div>
      {industries.length > 0 && (
        <div className="md:col-span-3 bg-white rounded-xl shadow p-6 border border-gray-100 mt-2">
          <span className="text-gray-500 text-sm mb-2 block">Industry Acceptance</span>
          <div className="flex flex-wrap gap-4">
            {industries.map(([industry, count]) => (
              <span key={industry} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                {industry}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamStats; 