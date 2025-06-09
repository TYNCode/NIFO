"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearProjectState,
  fetchProjects,
} from "../redux/features/coinnovation/projectSlice";
import { resetChallenge } from "../redux/features/coinnovation/challengeSlice";
import { loadFullProjectContext } from "../redux/features/coinnovation/loadFullContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const itemsPerPage = 6;

const ProjectLists: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasFetchedProjects = useAppSelector((state) => state.projects.hasFetchedProjects);
  const [loadingProject, setLoadingProject] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    projects,
    fetching: loading,
    error,
  } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (!hasFetchedProjects) {
      dispatch(fetchProjects());
    }
  }, [hasFetchedProjects, dispatch]);

  const handleProjectClick = async (project_id: string) => {
    router.push(`/coinnovation/${project_id}`);
    localStorage.setItem("projectID", project_id);
    setLoadingProject(true);
    await dispatch(loadFullProjectContext(project_id));
    setLoadingProject(false);
  };

  const handleCreateProject = () => {
    localStorage.removeItem("projectID");
    localStorage.removeItem("problemStatement");
    localStorage.setItem("activeTab", "01.a");
    dispatch(clearProjectState());
    dispatch(resetChallenge());
    router.push("/coinnovation");
  };

  const toggleCard = (project_id: string) => {
    setOpenCard((prev) => (prev === project_id ? null : project_id));
  };

  const filteredProjects = Array.isArray(projects)
    ? projects.filter((project) =>
      [project.project_id, project.project_name, project.project_description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    : [];

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getVisiblePages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - 1);
    if (start + 3 > totalPages) {
      start = totalPages - 3;
    }
    return [start, start + 1, start + 2, start + 3];
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = totalPages > 4 && visiblePages[0] > 1;
  const showEndEllipsis = totalPages > 4 && visiblePages[3] < totalPages;

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenCard(null);
    }
  };

  return (
    <div className="bg-[#F5FCFF] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-[#0071C1]">Project Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by ID, name or description..."
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm text-sm w-full sm:w-[300px] focus:outline-none focus:ring-2 focus:ring-[#0071C1]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#0071C1] text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-[#56A8F0]"
            onClick={handleCreateProject}
          >
            + New Project
          </motion.button>
        </div>
      </div>

      <div className="lg:hidden grid gap-4 grid-cols-1">
        {loading || loadingProject ? (
          <p className="text-sm text-[#0071C1] animate-pulse">Loading projects...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : currentItems.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          currentItems.map((project, index) => {
            const isOpen = openCard === project.project_id;
            return (
              <motion.div
                key={project.project_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl px-3 py-3 shadow-md hover:shadow-lg transition-all border-t-4 border-[#0071C1] cursor-pointer"
                onClick={() => toggleCard(project.project_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-row gap-4 items-center">
                    {project.enterprise_img ? (
                      <Image
                        src={project.enterprise_img}
                        alt={project.enterprise}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">N/A</div>
                    )}
                    <div className="text-sm font-semibold text-[#0071C1]">{project.project_id}</div>
                  </div>
                  <div className="text-gray-500">
                    {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </div>
                <div className="text-md font-medium text-gray-700 mt-2">
                  {project.project_name || "Untitled Project"}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-400">👤 Unassigned</div>
                  <div className={`text-xs px-3 py-1 rounded-full font-semibold ${statusBadge(project.status)}`}>
                    {project.status}
                  </div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden text-sm text-gray-600"
                    >
                      <hr className="my-2" />
                      <p>{project.project_description || "No description provided for this project."}</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        className="mt-3 text-sm text-[#0071C1] underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project.project_id);
                        }}
                      >
                        View Full Project →
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="hidden lg:block">
        <div className="overflow-hidden rounded-xl shadow ring-1 ring-gray-200">
          <div className="grid grid-cols-7 gap-4 bg-[#EAF6FF] px-6 py-3 font-bold text-[#0071C1] text-sm tracking-wide">
            <div className="col-span-1">Enterprise</div>
            <div className="col-span-4">Project ID / Name</div>
            <div className="col-span-1 text-center">Assignee</div>
            <div className="col-span-1 text-center">Status</div>
          </div>
          {currentItems.map((project, index) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleProjectClick(project.project_id)}
              className="grid grid-cols-7 gap-4 items-center bg-white hover:bg-blue-50 px-6 py-4 transition-all duration-200 cursor-pointer border-t border-gray-100 hover:shadow-md hover:scale-[1.01]"
            >
              <div className="col-span-1 flex items-center">
                {project.enterprise_img ? (
                  <Image
                    src={project.enterprise_img}
                    alt={project.enterprise}
                    className="w-9 h-9 rounded-full object-cover"
                    width={36}
                    height={36}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">N/A</div>
                )}
              </div>
              <div className="col-span-4">
                <div className="font-semibold text-[#0071C1]">{project.project_id}</div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {project.project_name || "Untitled Project"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {project.project_description || "No description provided."}
                </div>
              </div>
              <div className="col-span-1 text-center text-xs text-gray-500">Unassigned</div>
              <div className="col-span-1 flex justify-center">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${statusBadge(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            className="px-3 py-1 text-sm rounded border bg-white hover:bg-blue-100 disabled:text-gray-400"
          >
            Prev
          </button>
          {showStartEllipsis && <span className="px-2">...</span>}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 text-sm rounded border ${currentPage === page ? 'bg-[#0071C1] text-white' : 'bg-white hover:bg-blue-100'}`}
            >
              {page}
            </button>
          ))}
          {showEndEllipsis && <span className="px-2">...</span>}
          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
            className="px-3 py-1 text-sm rounded border bg-white hover:bg-blue-100 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const statusBadge = (status: string) => {
  const statusMap: Record<string, string> = {
    "In Progress": "bg-blue-100 text-blue-700",
    "To Do": "bg-yellow-100 text-yellow-700",
    Blocked: "bg-red-100 text-red-700",
    Done: "bg-green-100 text-green-700",
  };
  return statusMap[status] + " border border-white/50";
};

export default ProjectLists;
