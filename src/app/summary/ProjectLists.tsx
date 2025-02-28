import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Project {
  project_id: string;
  project_name: string | null;
  priority: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  enterprise: string | null;
  owner: string | null;
  approver: string | null;
  category: string | null;
  department: string | null;
  business_unit: string | null;
  location: string | null;
  project_description: string;
  context: string | null;
  problem_statement: string | null;
}

const ProjectLists: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter()
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (project_id:string) => {
    router.push(`/coinnovation/${project_id}`)
  }

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/coinnovation/create-project/");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#F5FCFF] min-h-screen ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button className="bg-[#0071C1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#56A8F0]">
          + Create Project
        </button>
      </div>

      {/* Table Header (Using div to simulate table header) */}
      <div className="bg-white shadow rounded-xl p-4 font-bold text-black grid grid-cols-7 gap-2 mb-2">
        <div className="col-span-1">Enterprise</div>
        <div className="col-span-4">Project ID/Name</div>
        <div className="col-span-1">Assignee</div>
        {/* <div className="col-span-1">Pending With</div>
        <div className="col-span-1">Technology</div> */}
        <div className="col-span-1">Status</div>
        {/* <div className="col-span-1">Created On</div> */}
      </div>

      {/* Project Rows */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.project_id}
            className="bg-white shadow rounded-xl p-4 grid grid-cols-7 gap-2 items-center mb-2 cursor-pointer"
            onClick={()=>handleProjectClick(project.project_id)}
          >
            {/* Enterprise */}
            <div className="col-span-1 font-medium text-gray-800">
              {project.enterprise ?? "N/A"}
            </div>

            {/* Project ID and Name */}
            <div className="col-span-4">
              <p className="font-bold">{project.project_id}</p>
              <p className="text-gray-600 text-sm">
                {project.project_name ?? "Untitled Project"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {project.project_description}
              </p>
            </div>

            {/* Assignee - Placeholder (since you don't have it yet) */}
            <div className="col-span-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-700">
                -
              </div>
            </div>

            {/* Pending With - Placeholder (you can replace with actual data later) */}
            {/* <div className="col-span-1">
              <div className="flex space-x-1">
                <span className="bg-gray-200 px-2 py-1 rounded text-xs">-</span>
              </div>
            </div> */}

            {/* Technology - Placeholder (can be mapped if data exists) */}
            {/* <div className="col-span-1 text-xs text-gray-600">-</div> */}

            {/* Status */}
            <div className={`col-span-1 font-medium ${statusColor(project.status)}`}>
              {project.status}
            </div>

            {/* Created On */}
            {/* <div className="col-span-1 text-gray-600">
              {project.start_date ?? "N/A"}
            </div> */}
          </div>
        ))
      )}
    </div>
  );
};

// Helper to color status
function statusColor(status: string) {
  switch (status) {
    case "In Progress":
      return "text-blue-500";
    case "To Do":
      return "text-gray-500";
    case "Blocked":
      return "text-red-500";
    case "Done":
      return "text-green-500";
    default:
      return "text-gray-800";
  }
}

export default ProjectLists;
