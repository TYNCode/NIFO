import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearProjectState,
  fetchProjects,
} from "../redux/features/coinnovation/projectSlice";
import { resetChallenge } from "../redux/features/coinnovation/challengeSlice";
import { loadFullProjectContext } from "../redux/features/coinnovation/loadFullContext";

const ProjectLists: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loadingProject, setLoadingProject] = useState(false);

  const {
    projects,
    fetching: loading,
    error,
  } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const handleProjectClick = async (project_id: string) => {
    localStorage.setItem("projectID", project_id); 
    await dispatch(loadFullProjectContext(project_id));
    router.push(`/coinnovation/${project_id}`);
  };
  

  const handleCreateProject = () => {
    localStorage.removeItem("projectID");
    localStorage.removeItem("problemStatement");
    dispatch(clearProjectState());
    dispatch(resetChallenge());
    router.push("/coinnovation");
  };

  return (
    <div className="p-6 bg-[#F5FCFF] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <div className="flex flex-row gap-5">
          <button
            className="bg-[#0071C1] text-white px-4 py-2 rounded-lg shadow hover:bg-[#56A8F0]"
            onClick={handleCreateProject}
          >
            + Create Project
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-4 font-bold text-black grid grid-cols-7 gap-2 mb-2">
        <div className="col-span-1">Enterprise</div>
        <div className="col-span-4">Project ID/Name</div>
        <div className="col-span-1">Assignee</div>
        <div className="col-span-1">Status</div>
      </div>

      {loading || loadingProject ? (
        <p className="text-sm text-blue-500">Loading projects...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.project_id}
            className="bg-white shadow rounded-xl p-4 grid grid-cols-7 gap-2 items-center mb-2 cursor-pointer hover:bg-blue-50 transition"
            onClick={() => handleProjectClick(project.project_id)}
          >
            <div className="col-span-1 font-medium text-gray-800">
              {project.enterprise_img ? (
                <img
                  src={project.enterprise_img}
                  alt={project.enterprise}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  N/A
                </div>
              )}
            </div>

            <div className="col-span-4">
              <p className="font-bold text-[#0071C1]">{project.project_id}</p>
              <p className="text-gray-600 text-sm">
                {project.project_name || "Untitled Project"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {project.project_description || "No description provided."}
              </p>
            </div>

            <div className="col-span-1">
              <div className="text-xs text-gray-500">Unassigned</div>
            </div>

            <div
              className={`col-span-1 font-medium ${statusColor(project.status)}`}
            >
              {project.status}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const statusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    "In Progress": "text-blue-500",
    "To Do": "text-gray-500",
    Blocked: "text-red-500",
    Done: "text-green-500",
  };
  return statusMap[status] || "text-gray-800";
};

export default ProjectLists;
