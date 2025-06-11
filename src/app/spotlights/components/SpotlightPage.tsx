"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchSpotlights } from "@/app/redux/features/spotlight/spotlightSlice";
import LeftFrame from "@/app/components/LeftFrame/LeftFrame";
import { FaFilter } from "react-icons/fa";
import { encryptURL } from "@/app/utils/shareUtils";
import SpotlightFilters from "./SpotlightFilters";
import SpotlightGrid from "./SpotlightGrid";
import MobileHeader from "@/app/mobileComponents/MobileHeader";

const TABS = ["All Spotlights", "Latest"] as const;
type TabType = (typeof TABS)[number];

const SpotlightPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { spotlights, loading, error } = useAppSelector((state) => state.spotlight);

  const [selectedTab, setSelectedTab] = useState<TabType>("All Spotlights");
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>("");
  const [showAnalystDropdown, setShowAnalystDropdown] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    TYNVerified: false,
  });

  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSpotlightClick = useCallback(
    (spotlight: any) => {
      const targetId = spotlight;
      if (!targetId) return;
      const encryptedId = encryptURL(String(targetId));
      router.push(`/spotlights/${encryptedId}`);
    },
    [router]
  );

  const filteredSpotlights = useMemo(() => {
    if (!spotlights || !Array.isArray(spotlights)) return [];
    return spotlights.filter((spotlight: any) => {
      const matchesVerified = filters.TYNVerified ? spotlight.is_tyn_verified : true;
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

  const sortedSpotlights = useMemo(() => {
    return selectedTab === "Latest"
      ? [...filteredSpotlights].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      : filteredSpotlights;
  }, [filteredSpotlights, selectedTab]);

  const handleFilterToggle = useCallback(() => {
    setFilters((prev) => ({ ...prev, TYNVerified: !prev.TYNVerified }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedAnalyst("");
    setFilters({ TYNVerified: false });
  }, []);

  const hasActiveFilters = !!selectedAnalyst || filters.TYNVerified;

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  if (loading) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:pl-[20%] px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading spotlights...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:pl-[20%] px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchSpotlights())}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#005a9a] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:fixed lg:w-1/5 lg:h-full">
        <LeftFrame />
      </div>

      {/* Mobile Sidebar */}
      <LeftFrame
        isMobile={true}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={handleCloseMobileMenu}
      />

      {/* Main Content */}
      <div className="w-full lg:ml-[30%] xl:ml-[22%] px-3 sm:px-4 lg:px-8 py-4 lg:py-6 xl:py-2">
        {/* Mobile Header with Hamburger */}
        <MobileHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Filter Toggle (Mobile only) */}
        <div className="lg:hidden flex justify-between text-lg mt-2 mb-4">
          <div className="text-primary font-semibold">
            Startup Spotlight
          </div>
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

        {/* Desktop Header & Filters */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <h1 className="text-2xl xl:text-3xl font-bold text-primary">Startup Spotlight</h1>
          <SpotlightFilters
            selectedAnalyst={selectedAnalyst}
            onAnalystChange={setSelectedAnalyst}
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
              onAnalystChange={setSelectedAnalyst}
              filters={filters}
              onFilterToggle={handleFilterToggle}
              hasActiveFilters={hasActiveFilters}
              onClearAll={clearAllFilters}
              showAnalystDropdown={showAnalystDropdown}
              setShowAnalystDropdown={setShowAnalystDropdown}
            />
          </div>
        )}

        {/* Spotlight Grid */}
        <div className="mt-4">
          {sortedSpotlights.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No spotlights found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "There are no spotlights available at the moment."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#005a9a] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
