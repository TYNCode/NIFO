import React, { useEffect } from 'react';
import SolutionProviders from './SolutionProviders';
import Tabs from '../Tabs';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    selectShortlistedProviders,
    setActiveTabRoi
} from "../../../redux/features/source/solutionProviderSlice";
import { FaArrowDownLong } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import * as XLSX from "xlsx-js-style";
import Image from 'next/image';


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

        const totalRowStyle = {
            font: { ...RalewayFont, bold: true },
            alignment: { horizontal: "right" },
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
        <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex flex-col gap-4 bg-[#F5FCFF] rounded-lg p-4 mb-4">
                <div className='flex flex-row justify-between'>
                    <div className="text-sm font-semibold">ROI Evaluation & Customization</div>
                    <div className='flex flex-row gap-4'>
                        <div>
                            <img
                                onClick={handleDownloadROI}
                                src='/coinnovation/download_questionairre.svg'
                                alt='Download ROI Evaluation'
                                className='cursor-pointer' />
                        </div>
                        {/* <div>
                            <Image src="/coinnovation/uploadfileicon.svg" height={20} width={20} alt="File Upload Icon" />
                        </div> */}
                    </div>
                </div>

                {tabs.length > 0 && activeTabSource && (
                    <>
                        <Tabs tabs={tabs} activeTab={activeTabSource} setActiveTab={handleTabChange} />
                        <SolutionProviders />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProgressFour;
