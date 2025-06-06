"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import LeftFrame from "../components/LeftFrame/LeftFrame";
import TrendsWeb from "../components/TrendsWeb/TrendsWeb";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";
import WithAuth from "../utils/withAuth";
import TrendsMobile from "../mobileComponents/FooterComponents/TrendsMobile";
import MobileHeader from "../mobileComponents/MobileHeader";

const PageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Spotlight");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("trends");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectorClick = (sectorName: string) => {
    setSelectedSector(sectorName);
    setSelectedIndustry(null);
    setSelectedTechnology(null);
    setCurrentStep("subSectors");
  };

  const handleIndustryClick = (industryName: string) => {
    setSelectedIndustry(industryName);
    setSelectedTechnology(null);
    setCurrentStep("usecasesCombined");
  };

  const handleTechnologyClick = (technologyName: string) => {
    setSelectedTechnology(technologyName);
    setCurrentStep("usecasesCombined");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

    const handleCloseMobileMenu = useCallback(() => {
      setIsMobileMenuOpen(false);
    }, []);

  return (
    <>

      {isMobile ? (
        <div className="flex flex-col h-[100dvh]">
          <LeftFrame
            isMobile={true}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={handleCloseMobileMenu}
          />
          <MobileHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />
            <TrendsMobile
              selectedSector={selectedSector}
              selectedIndustry={selectedIndustry}
              selectedTechnology={selectedTechnology}
              handleSectorClick={handleSectorClick}
              handleIndustryClick={handleIndustryClick}
              handleTechnologyClick={handleTechnologyClick}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
        </div>
      ) : (
        <main className="flex w-full min-h-screen bg-gray-50">
          <div className="flex flex-col flex-1">
            <NavbarTrend />
            <TrendsWeb />
          </div>
        </main>
      )}
    </>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default WithAuth(Page);
