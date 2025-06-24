"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { CompanyType, fetchCompanyById } from "@/app/redux/features/companyprofile/companyProfileSlice";
import {
    FaArrowLeft,
    FaGlobe,
    FaChartLine,
    FaUsers,
    FaRocket,
    FaBuilding,
    FaEnvelope,
    FaExternalLinkAlt,
    FaLinkedinIn,
} from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineLanguage, MdOutlinePhoneInTalk } from "react-icons/md";

interface SolutionProviderProps {
    solutionProviderId: number;
    handleBack: () => void;
    useCaseTitle?: string;
    useCaseDescription?: string;
}

const SolutionProvider: React.FC<SolutionProviderProps> = ({
    solutionProviderId,
    handleBack,
    useCaseTitle,
    useCaseDescription,
}) => {
    const dispatch = useAppDispatch();
    const { company, loading, error } = useAppSelector((state) => state.companyProfile);

    useEffect(() => {
        if (solutionProviderId) {
            dispatch(fetchCompanyById({ id: solutionProviderId, type: "startup" }));
        }
    }, [dispatch, solutionProviderId]);

    const handleEmailContact = (email: string) => {
        window.open(`mailto:${email}`, "_self");
    };

    const handleVisitWebsite = (url: string) => {
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const handleShare = () => {
        const companyTyped = company as any;
        let name = '';
        if (isStartup(companyTyped)) {
            name = (companyTyped as any).startup_name;
        } else if (isEnterprise(companyTyped)) {
            name = (companyTyped as any).enterprise_name;
        }
        if (navigator.share && name) {
            navigator.share({
                title: name,
                text: `Check out ${name}`,
                url: window.location.href,
            });
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading provider details...</div>;
    }

    if (error || !company) {
        return (
            <div className="text-center py-8 text-red-600">
                Failed to load provider details. Please try again.
            </div>
        );
    }

    // Type guards for company
    function isStartup(c: any): c is { startup_id: number } {
        return c && typeof c === 'object' && 'startup_id' in c;
    }
    function isEnterprise(c: any): c is { enterprise_id: number } {
        return c && typeof c === 'object' && 'enterprise_id' in c;
    }
    const companyTyped = company as any;

    return (
        <div className="bg-white w-[40vw] h-[85vh] overflow-y-auto p-4 rounded-xl shadow space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-2 text-primary cursor-pointer mb-2" onClick={handleBack}>
                <FaArrowLeft />
                <span className="text-sm font-medium">Back to Use Case</span>
            </div>

            {/* Header */}
            <div className="flex gap-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                    {isStartup(companyTyped) && (companyTyped as any).startup_logo ? (
                        <img
                            src={(companyTyped as any).startup_logo}
                            alt={`${(companyTyped as any).startup_name} logo`}
                            className="w-16 h-16 object-contain border rounded"
                            onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ELogo%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                            <FaBuilding className="text-gray-500 text-xl" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-gray-800">
                        {isStartup(companyTyped) ? (companyTyped as any).startup_name : isEnterprise(companyTyped) ? (companyTyped as any).enterprise_name : ''}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {isStartup(companyTyped) && (companyTyped as any).startup_country && (
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                <FaGlobe /> {(companyTyped as any).startup_country}
                            </span>
                        )}
                        {isEnterprise(companyTyped) && (companyTyped as any).enterprise_description && (
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                <FaGlobe /> {(companyTyped as any).enterprise_description}
                            </span>
                        )}
                        {isStartup(companyTyped) && (companyTyped as any).startup_company_stage && (
                            <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700">
                                <FaChartLine /> {(companyTyped as any).startup_company_stage}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {(isStartup(companyTyped) && (companyTyped as any).startup_url) || (isEnterprise(companyTyped) && (companyTyped as any).enterprise_url) ? (
                    <button
                        onClick={() => handleVisitWebsite(isStartup(companyTyped) ? (companyTyped as any).startup_url : isEnterprise(companyTyped) ? (companyTyped as any).enterprise_url : "")}
                        className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary flex items-center gap-1"
                    >
                        <FaExternalLinkAlt /> Website
                    </button>
                ) : null}
                <button
                    onClick={handleShare}
                    className="text-xs px-2 py-1 bg-blue-100 text-primary rounded hover:bg-blue-200 flex items-center"
                >
                    <IoShareSocialOutline size={14} />
                </button>
                <button className="text-xs px-2 py-1 bg-blue-100 text-primary rounded hover:bg-blue-200">
                    <MdOutlineLanguage size={14} />
                </button>
                <button className="text-xs px-2 py-1 bg-blue-100 text-primary rounded hover:bg-blue-200">
                    <MdOutlinePhoneInTalk size={14} />
                </button>
                <button className="text-xs px-2 py-1 bg-blue-100 text-primary rounded hover:bg-blue-200">
                    <FaLinkedinIn size={14} />
                </button>
            </div>

            {/* Use Case Reference */}
            {useCaseTitle && (
                <div className="bg-blue-50 p-3 rounded">
                    <h3 className="font-semibold text-sm text-primary">Use Case</h3>
                    <p className="text-sm">{useCaseTitle}</p>
                    {useCaseDescription && <p className="text-xs text-gray-600">{useCaseDescription}</p>}
                </div>
            )}

            {/* Overview */}
            {(isStartup(companyTyped) && ((companyTyped as any).startup_overview || (companyTyped as any).startup_description)) || (isEnterprise(companyTyped) && (companyTyped as any).enterprise_description) ? (
                <div>
                    <h3 className="font-semibold text-primary mb-1 flex items-center gap-1">
                        <FaRocket /> Overview
                    </h3>
                    {isStartup(companyTyped) && (companyTyped as any).startup_overview && (
                        <p className="text-sm text-gray-800 mb-2">{(companyTyped as any).startup_overview}</p>
                    )}
                    {isStartup(companyTyped) && (companyTyped as any).startup_description && <p className="text-sm text-gray-800">{(companyTyped as any).startup_description}</p>}
                    {isEnterprise(companyTyped) && (companyTyped as any).enterprise_description && <p className="text-sm text-gray-800">{(companyTyped as any).enterprise_description}</p>}
                </div>
            ) : null}

            {/* Solutions & Use Cases */}
            {isStartup(companyTyped) && ((companyTyped as any).startup_solutions || (companyTyped as any).startup_usecases) ? (
                <div>
                    <h3 className="font-semibold text-primary mb-1">Solutions & Use Cases</h3>
                    {(companyTyped as any).startup_solutions && (
                        <p className="text-sm text-gray-800 mb-2">{(companyTyped as any).startup_solutions}</p>
                    )}
                    {(companyTyped as any).startup_usecases && <p className="text-sm text-gray-800">{(companyTyped as any).startup_usecases}</p>}
                </div>
            ) : null}

            {/* Strategic Positioning */}
            {isStartup(companyTyped) && ((companyTyped as any).startup_gsi || (companyTyped as any).startup_partners || (companyTyped as any).startup_customers) ? (
                <div>
                    <h3 className="font-semibold text-primary mb-1">Strategic Positioning</h3>
                    {(companyTyped as any).startup_gsi && <p className="text-sm mb-2">GSI: {(companyTyped as any).startup_gsi}</p>}
                    {(companyTyped as any).startup_partners && <p className="text-sm mb-2">Partners: {(companyTyped as any).startup_partners}</p>}
                    {(companyTyped as any).startup_customers && <p className="text-sm">Customers: {(companyTyped as any).startup_customers}</p>}
                </div>
            ) : null}

            {/* Technology & Industry */}
            {isStartup(companyTyped) && ((companyTyped as any).startup_technology || (companyTyped as any).startup_industry) ? (
                <div className="flex gap-2 flex-wrap">
                    {(companyTyped as any).startup_technology && (
                        <span className="px-3 py-1 text-xs bg-blue-100 text-primary rounded-full">
                            Tech: {(companyTyped as any).startup_technology}
                        </span>
                    )}
                    {(companyTyped as any).startup_industry && (
                        <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            Industry: {(companyTyped as any).startup_industry}
                        </span>
                    )}
                </div>
            ) : null}

            {/* Contact & Email */}
            {isStartup(companyTyped) && (companyTyped as any).startup_emails && (
                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => handleEmailContact((companyTyped as any).startup_emails)}
                        className="text-xs px-3 py-1 bg-blue-100 text-primary rounded hover:bg-blue-200 flex items-center gap-1"
                    >
                        <FaEnvelope /> Email
                    </button>
                </div>
            )}
        </div>
    );
};

export default SolutionProvider;
