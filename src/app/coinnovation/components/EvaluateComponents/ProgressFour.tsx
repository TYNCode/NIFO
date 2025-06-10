import React, { useEffect } from 'react';
import SolutionProviders from './SolutionProviders';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectShortlistedProviders,
  setActiveTabRoi
} from "../../../redux/features/source/solutionProviderSlice";
import { useSelector } from 'react-redux';
import * as XLSX from "xlsx-js-style";

interface Tab {
  id: string;
  label: string;
  enabled: boolean;
}

const ProgressFour: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTabSource = useAppSelector((state) => state.solutionProvider.activeTabRoi);
  const solutionProviders = useAppSelector(selectShortlistedProviders);
  const solutionProviderID = useAppSelector((state) => state.solutionProvider.activeTabSource);
  const allData = useSelector((state: any) => state.roiEvaluation.data?.sub_parameters || []);

  const handleDownloadROI = () => {
    const sections = [
      { label: "Total Investment (CAPEX)", key: "CAPEX" },
      { label: "Existing Annual Expenses", key: "Existing_Annual_Expenses" },
      { label: "Annual Recurring Expenses (OPEX) - Estimate", key: "Annual_OPEX" },
      { label: "Annual Savings (Recurring Benefits)", key: "Annual_Savings" },
      { label: "Payback Period Calculation", key: "PAYBACK" },
      { label: "Invaluable ROI", key: "Invaluable_ROI" }
    ];

    const RalewayFont = { name: "Raleway", sz: 10 };

    const sectionHeaderStyle = {
      font: { ...RalewayFont, bold: true },
      fill: { fgColor: { rgb: "FFCCCCCC" } },
    };

    const columnHeaderStyle = {
      font: { ...RalewayFont, bold: true },
      alignment: { horizontal: "center" },
    };

    const normalStyle = {
      font: RalewayFont,
      alignment: { horizontal: "left" },
    };

    const yellowHighlightStyle = {
      font: RalewayFont,
      fill: { fgColor: { rgb: "FFFFFF00" } },
    };

    const sheetRows: any[] = [];
    sheetRows.push([
      { v: "Category", s: columnHeaderStyle },
      { v: "UOM", s: columnHeaderStyle },
      { v: "Per Unit Cost or Per Labour", s: columnHeaderStyle },
      { v: "Total Units or Total Hours", s: columnHeaderStyle },
      { v: "Total", s: columnHeaderStyle },
    ]);

    sections.forEach((section) => {
      sheetRows.push([
        { v: section.label, s: sectionHeaderStyle },
        "", "", "", ""
      ]);

      const rows = allData.filter((item: any) => item.section === section.key);

      if (rows.length === 0) {
        sheetRows.push([{ v: "No data available", s: normalStyle }, "", "", "", ""]);
      } else {
        rows.forEach((item: any) => {
          const total = Number(item.per_unit_cost || 0) * Number(item.units || 0);
          const isYellow = /recycling|3 year potential savings/i.test(item.parameter_name || "");
          const rowStyle = isYellow ? yellowHighlightStyle : normalStyle;

          if (section.key === "Invaluable_ROI") {
            sheetRows.push([{ v: item.parameter_name || "", s: normalStyle }, "", "", "", ""]);
          } else if (section.key === "PAYBACK") {
            sheetRows.push([
              { v: item.parameter_name || "", s: normalStyle },
              { v: item.uom || "", s: normalStyle },
              "", "", "",
              { v: item.total || "", s: normalStyle }
            ]);
          } else {
            sheetRows.push([
              { v: item.parameter_name || "", s: rowStyle },
              { v: item.uom || "", s: rowStyle },
              { v: item.per_unit_cost ?? "", s: rowStyle },
              { v: item.units ?? "", s: rowStyle },
              { v: total || "", s: rowStyle },
            ]);
          }
        });
      }

      sheetRows.push(["", "", "", "", ""]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ROI Evaluation");
    XLSX.writeFile(workbook, `ROI_Evaluation_${solutionProviderID}.xlsx`);
  };

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTabRoi(tabId));
  };

  useEffect(() => {
    const isActiveTabValid = solutionProviders.some(
      (provider) => provider.solution_provider_id === activeTabSource
    );
    if (!isActiveTabValid && solutionProviders.length > 0) {
      const defaultId = solutionProviders[0].solution_provider_id;
      dispatch(setActiveTabRoi(defaultId));
    }
  }, [solutionProviders, activeTabSource, dispatch]);

  const tabs: Tab[] = solutionProviders.map((provider) => ({
    id: provider.solution_provider_id,
    label: provider.solution_provider_name,
    enabled: true,
  }));

  return (
    <div className="h-full bg-white flex flex-col shadow-md rounded-[16px] mx-auto w-11/12 lg:w-11/12 overflow-hidden">
      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-gray-100">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex flex-row gap-1 justify-center items-center shadow-sm">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => tab.enabled && dispatch(setActiveTabRoi(tab.id))}
              className={`flex-1 text-center flex flex-row items-center justify-center gap-2 text-sm font-medium px-4 rounded-t-lg cursor-pointer transition-all duration-200
                ${activeTabSource === tab.id
                  ? "bg-[#F5FCFF] text-[#0071C1] font-semibold border-t-2 border-t-[#56A8F0] py-3"
                  : "bg-[#B5BBC20D] text-[#848484] border-t-2 border-t-[#B5BBC2] py-2"}
                ${!tab.enabled
                  ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 border-t-2 border-gray-300"
                  : ""}`}
            >
              <div>{tab.id}</div>
              <div className="truncate">{tab.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-2 min-w-max">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => tab.enabled && dispatch(setActiveTabRoi(tab.id))}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 whitespace-nowrap
                  ${activeTabSource === tab.id ? "bg-primary text-white" : "bg-gray-100 text-[#848484]"}
                  ${!tab.enabled ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500" : ""}`}
              >
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content + Scrollable Wrapper */}
      <div className="flex-1 bg-[#F5FCFF] pb-4">
        <div className="flex flex-row justify-between items-center p-4">
          <div className="text-sm font-semibold">ROI Evaluation & Customization</div>
          <div>
            <img
              onClick={handleDownloadROI}
              src="/coinnovation/download_questionairre.svg"
              alt="Download ROI Evaluation"
              className="cursor-pointer w-6 h-6 sm:w-5 sm:h-5"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[65vh] sm:max-h-none px-2">
          {tabs.length > 0 && activeTabSource && (
            <SolutionProviders key={activeTabSource} providerId={activeTabSource} />
          )}
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProgressFour;
