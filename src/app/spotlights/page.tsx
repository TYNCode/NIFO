"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchSpotlights } from "@/app/redux/features/spotlight/spotlightSlice";
import LeftFrame from "@/app/components/LeftFrame/LeftFrame";
import { FaFilter, FaTimes, FaBars } from "react-icons/fa";
import SpotlightGrid from "./components/SpotlightGrid";
import SpotlightFilters from "./components/SpotlightFilters";
import { encryptURL } from "@/app/utils/shareUtils";

// Types for better type safety
interface Filters {
  TYNVerified: boolean;
}

const TABS = ["All Spotlights", "Latest"] as const;
type TabType = (typeof TABS)[number];

const SpotlightPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux state
  const { spotlights, loading, error } = useAppSelector(
    (state) => state.spotlight
  );

  // Local state
  const [selectedTab, setSelectedTab] = useState<TabType>("All Spotlights");
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>("");
  const [showAnalystDropdown, setShowAnalystDropdown] =
    useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<Filters>({
    TYNVerified: false,
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowAnalystDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setShowMobileFilters(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

const handleSpotlightClick = useCallback((spotlight: any) => {
  console.log("spotlgihtinspot", spotlight);

  const targetId = spotlight
  if (!targetId) {
    console.warn("[SPOTLIGHT_CLICK] No valid ID found in spotlight:", spotlight);
    return;
  }

  const encryptedId = encryptURL(String(targetId));
  router.push(`/spotlights/${encryptedId}`);
}, [router]);


  const filteredSpotlights = useMemo(() => {
    if (!spotlights || !Array.isArray(spotlights)) return [];

    return spotlights.filter((spotlight: any) => {
      const matchesVerified = filters.TYNVerified
        ? spotlight.is_tyn_verified
        : true;

      const matchesAnalyst = selectedAnalyst
        ? (selectedAnalyst === "gartner" && spotlight.gartner_tag) ||
          (selectedAnalyst === "mckinsey" &&
            spotlight.spotlight_category?.toLowerCase().includes("mckinsey")) ||
          (selectedAnalyst === "forrester" &&
            spotlight.spotlight_category?.toLowerCase().includes("forrester"))
        : true;

      return matchesVerified && matchesAnalyst;
    });
  }, [spotlights, filters.TYNVerified, selectedAnalyst]);

  // Sort logic
  const sortedSpotlights = useMemo(() => {
    if (selectedTab === "Latest") {
      return [...filteredSpotlights].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
    return filteredSpotlights;
  }, [filteredSpotlights, selectedTab]);

  // Event handlers
  const handleTabChange = useCallback((tab: TabType) => {
    setSelectedTab(tab);
  }, []);

  const handleAnalystChange = useCallback((analyst: string) => {
    setSelectedAnalyst(analyst);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setFilters((prev) => ({ ...prev, TYNVerified: !prev.TYNVerified }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedAnalyst("");
    setFilters({ TYNVerified: false });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = !!selectedAnalyst || filters.TYNVerified;

  // Render loading state
  if (loading) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:pl-[20%] px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070C0]"></div>
              <p className="text-gray-600 mt-4 text-lg">
                Loading spotlights...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render error state
  if (error) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:pl-[20%] px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchSpotlights())}
                className="px-6 py-2 bg-[#0070C0] text-white rounded-lg hover:bg-[#005a9a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      {/* Left Sidebar - Desktop Only */}
      <div className="hidden lg:block lg:fixed lg:w-1/5 lg:h-full">
        <LeftFrame />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <LeftFrame />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full lg:ml-[30%] xl:ml-[22%] px-3 sm:px-4 lg:px-8 py-4 lg:py-6 xl:py-2">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Open menu"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-[#0070C0]">
            Startup Spotlight
          </h1>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Toggle filters"
          >
            <FaFilter className="text-lg" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <h1 className="text-2xl xl:text-3xl font-bold text-[#0070C0]">
            Startup Spotlight
          </h1>

          {/* Desktop Filters */}
          <SpotlightFilters
            selectedAnalyst={selectedAnalyst}
            onAnalystChange={handleAnalystChange}
            filters={filters}
            onFilterToggle={handleFilterToggle}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAllFilters}
            showAnalystDropdown={showAnalystDropdown}
            setShowAnalystDropdown={setShowAnalystDropdown}
          />
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-6">
            <SpotlightFilters
              selectedAnalyst={selectedAnalyst}
              onAnalystChange={handleAnalystChange}
              filters={filters}
              onFilterToggle={handleFilterToggle}
              hasActiveFilters={hasActiveFilters}
              onClearAll={clearAllFilters}
              showAnalystDropdown={showAnalystDropdown}
              setShowAnalystDropdown={setShowAnalystDropdown}
            />
          </div>
        )}

        {/* Content Grid/Carousel */}
        <div className="mt-4">
          {sortedSpotlights.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No spotlights found
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "There are no spotlights available at the moment."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-[#0070C0] text-white rounded-lg hover:bg-[#005a9a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <SpotlightGrid
              spotlights={sortedSpotlights}
              onExploreClick={handleSpotlightClick}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default SpotlightPage;
