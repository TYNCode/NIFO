'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import WithAuth from '../../utils/withAuth';

const ProjectSummaryPage = ({ params }: { params: { id: string } }) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(
        `https://tyn-server.azurewebsites.net/coinnovation/create-project/?project_id=${params.id}`
      );
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [params.id]);

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project Summary - {project.project_id}</h2>
      <p><strong>Name:</strong> {project.project_name ?? 'N/A'}</p>
      <p><strong>Description:</strong> {project.project_description}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Priority:</strong> {project.priority}</p>
      {/* Add more fields here as needed */}
    </div>
  );
};

export default WithAuth(ProjectSummaryPage);
