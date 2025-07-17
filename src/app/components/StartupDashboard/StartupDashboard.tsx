"use client";

import React, { useState, useEffect } from "react";
import { 
  FaChartBar, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaRocket,
  FaBuilding,
  FaUsers,
  FaChartLine
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProblemStatement {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'POC Closed';
  type: string;
  createdAt: string;
  matchedAt?: string;
}

const StartupDashboard: React.FC = () => {
  const [activeProblems, setActiveProblems] = useState<number>(12);
  const [avgMatchTime, setAvgMatchTime] = useState<number>(3.2);
  const [avgAge, setAvgAge] = useState<number>(15.5);
  const [problemData, setProblemData] = useState<ProblemStatement[]>([]);

  // Mock data for charts
  const statusData = [
    { name: 'Open', value: 8, color: '#3B82F6' },
    { name: 'In Progress', value: 3, color: '#F59E0B' },
    { name: 'Completed', value: 2, color: '#10B981' },
    { name: 'POC Closed', value: 1, color: '#EF4444' },
  ];

  const typeData = [
    { name: 'Hot Billet', value: 4, color: '#8B5CF6' },
    { name: 'Duct Insp', value: 3, color: '#06B6D4' },
    { name: 'Quality Control', value: 2, color: '#F97316' },
    { name: 'Process Optimization', value: 3, color: '#EC4899' },
  ];

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProblems: ProblemStatement[] = [
      { id: '1', title: 'Automated Quality Control System', status: 'Open', type: 'Quality Control', createdAt: '2024-01-15' },
      { id: '2', title: 'Hot Billet Temperature Monitoring', status: 'In Progress', type: 'Hot Billet', createdAt: '2024-01-10', matchedAt: '2024-01-12' },
      { id: '3', title: 'Duct Inspection Robot', status: 'Completed', type: 'Duct Insp', createdAt: '2024-01-05', matchedAt: '2024-01-08' },
      { id: '4', title: 'Process Optimization AI', status: 'POC Closed', type: 'Process Optimization', createdAt: '2024-01-01', matchedAt: '2024-01-03' },
    ];
    setProblemData(mockProblems);
  }, []);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ 
    title, 
    value, 
    icon, 
    color 
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
        <p className="text-gray-600">Overview of your innovation participation and performance metrics</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Problem Statements"
          value={activeProblems}
          icon={<FaRocket className="text-white text-xl" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Avg. Time to Vendor Match"
          value={`${avgMatchTime} days`}
          icon={<FaClock className="text-white text-xl" />}
          color="bg-green-500"
        />
        <StatCard
          title="Avg. Age of Unsolved Problems"
          value={`${avgAge} days`}
          icon={<FaExclamationTriangle className="text-white text-xl" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Success Rate"
          value="85%"
          icon={<FaCheckCircle className="text-white text-xl" />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Problem Statements by Status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Problem Type Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Problem Statements</h3>
        <div className="space-y-4">
          {problemData.map((problem) => (
            <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{problem.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">{problem.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    problem.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                    problem.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    problem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Created: {new Date(problem.createdAt).toLocaleDateString()}</p>
                {problem.matchedAt && (
                  <p className="text-sm text-gray-600">Matched: {new Date(problem.matchedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard; 