import React, { useEffect, useState } from "react";
import { StartupType } from "../types/company";
import {
  clearStartupState,
  setStartupModalOpen,
  setSelectedStartup,
  setStartupMode,
  deleteStartup,
  fetchCompaniesByPagination,
  fetchCompaniesBySearch,
} from "@/app/redux/features/companyprofile/companyProfileSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

// Modular Components
import StartupFormDrawer from "./StartupFormDrawer";
import StartupTable from "./StartupTable";
import StartupGridCard from "./StartupGridCard";

import DeleteConfirmationModal from "./DeleteConfirmationModal";
import NoResultMessage from "./NoResultMessage";
import ViewModeToggle from "./ViewModeToggle";
import SearchBarWithRedux from "./SearchBarwithRedux";
import SearchStatusIndicator from "./SearchStatusIndicator";

const StartupDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, loading, error, hasMore, message } = useAppSelector(
    (state) => state.companyProfile
  );



  // Local State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    startup: StartupType | null;
  }>({ open: false, startup: null });

  useEffect(() => {
    dispatch(fetchCompaniesByPagination({ page: 10, page_size: 20}));
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearStartupState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  // Event Handlers
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    
    if (isSearchMode && search.trim()) {
      dispatch(fetchCompaniesBySearch({ 
        query: search.trim(), 
        page: nextPage, 
        page_size: 10 
      }));
    } else {
      dispatch(fetchCompaniesByPagination({ page: nextPage, page_size: 10 }));
    }
  };

  const handleAddStartup = () => {
    dispatch(clearStartupState());
    dispatch(setStartupMode("create"));
    dispatch(setStartupModalOpen(true));
  };

  const handleEditStartup = (startup: StartupType) => {
    dispatch(setSelectedStartup({ startupId: startup.startup_id, mode: "edit" }));
    dispatch(setStartupMode("edit"));
    dispatch(setStartupModalOpen(true));
  };

  const handleDeleteClick = (startup: StartupType) => {
    setDeleteModal({ open: true, startup });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.startup) {
      dispatch(deleteStartup(deleteModal.startup.startup_id));
      setDeleteModal({ open: false, startup: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, startup: null });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    // Don't trigger search on every keystroke, wait for submit or enter
  };

  const handleSearchSubmit = (value: string) => {
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      setIsSearchMode(true);
      setPage(1);
      dispatch(fetchCompaniesBySearch({ 
        query: trimmedValue, 
        page: 1, 
        page_size: 10 
      }));
    } else {
      handleClearSearch();
    }
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    setSearch("");
    setPage(1);
    dispatch(fetchCompaniesByPagination({ page: 1, page_size: 10 }));
  };

  // Computed Values
  const displayStartups = companies;
  console.log("displayStartups------", companies)
  const showNoResults = !loading && displayStartups.length === 0;
  const showLoadMore = hasMore && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0070C0]">Startup Directory</h1>
              <p className="text-sm text-[#0070C0]/80 mt-1">
                Manage and organize your startup portfolio
              </p>
            </div>
            <button
              onClick={handleAddStartup}
              className="bg-customBlue text-white bg-[#0070C0] px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Startup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 text-sm font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Search and Controls Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <SearchBarWithRedux 
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search startups by name..."
            />
            <ViewModeToggle 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Search Status Indicator */}
        <SearchStatusIndicator
          isSearchMode={isSearchMode}
          searchText={search}
          resultCount={displayStartups.length}
          onClearSearch={handleClearSearch}
        />

        {/* Loading State */}
        {loading && companies.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-customBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-customGreyishBlack">Loading startups...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Content Section */}
        {!loading || companies.length > 0 ? (
          <>
            {/* Table View */}
            {viewMode === "table" && displayStartups.length > 0 && (
              <StartupTable 
                startups={displayStartups} 
                onEdit={handleEditStartup}
                onDelete={handleDeleteClick}
              />
            )}

            {/* Grid View */}
            {viewMode === "grid" && displayStartups.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayStartups.map((startup) => (
                  <StartupGridCard
                    key={startup.startup_id}
                    startup={startup}
                    onEdit={handleEditStartup}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {showLoadMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-white text-customBlue border border-customBlue px-8 py-3 rounded-lg hover:bg-customBlue hover:text-white transition-all duration-200 shadow-sm"
                >
                  Load More Startups
                </button>
              </div>
            )}
          </>
        ) : null}

        {/* No Results Message */}
        {showNoResults && (
          <NoResultMessage 
            searchText={search}
            onAddStartup={!search.trim() ? handleAddStartup : undefined}
            loading={loading}
          />
        )}
      </div>

      {/* Modals and Drawers */}
      <StartupFormDrawer />
      
      <DeleteConfirmationModal
        open={deleteModal.open}
        startup={deleteModal.startup}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default StartupDashboard;