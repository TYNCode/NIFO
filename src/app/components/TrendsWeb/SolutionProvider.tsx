"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchStartupById } from "@/app/redux/features/companyprofile/companyProfileSlice";
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
            dispatch(fetchStartupById(solutionProviderId));
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
        if (navigator.share && company?.startup_name) {
            navigator.share({
                title: company.startup_name,
                text: `Check out ${company.startup_name}`,
                url: window.location.href,
            });
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading startup details...</div>;
    }

    if (error || !company) {
        return (
            <div className="text-center py-8 text-red-600">
                Failed to load provider details. Please try again.
            </div>
        );
    }

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
                    {company.startup_logo ? (
                        <img
                            src={company.startup_logo}
                            alt={`${company.startup_name} logo`}
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
                    <h2 className="text-lg font-bold text-gray-800">{company.startup_name}</h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {company.startup_country && (
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                <FaGlobe /> {company.startup_country}
                            </span>
                        )}
                        {company.startup_company_stage && (
                            <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full text-green-700">
                                <FaChartLine /> {company.startup_company_stage}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {company.startup_url && (
                    <button
                        onClick={() => handleVisitWebsite(company.startup_url)}
                        className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary flex items-center gap-1"
                    >
                        <FaExternalLinkAlt /> Website
                    </button>
                )}
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
            {(company.startup_overview || company.startup_description) && (
                <div>
                    <h3 className="font-semibold text-primary mb-1 flex items-center gap-1">
                        <FaRocket /> Overview
                    </h3>
                    {company.startup_overview && (
                        <p className="text-sm text-gray-800 mb-2">{company.startup_overview}</p>
                    )}
                    {company.startup_description && <p className="text-sm text-gray-800">{company.startup_description}</p>}
                </div>
            )}

            {/* Solutions & Use Cases */}
            {(company.startup_solutions || company.startup_usecases) && (
                <div>
                    <h3 className="font-semibold text-primary mb-1">Solutions & Use Cases</h3>
                    {company.startup_solutions && (
                        <p className="text-sm text-gray-800 mb-2">{company.startup_solutions}</p>
                    )}
                    {company.startup_usecases && <p className="text-sm text-gray-800">{company.startup_usecases}</p>}
                </div>
            )}

            {/* Strategic Positioning */}
            {(company.startup_gsi || company.startup_partners || company.startup_customers) && (
                <div>
                    <h3 className="font-semibold text-primary mb-1">Strategic Positioning</h3>
                    {company.startup_gsi && <p className="text-sm mb-2">GSI: {company.startup_gsi}</p>}
                    {company.startup_partners && <p className="text-sm mb-2">Partners: {company.startup_partners}</p>}
                    {company.startup_customers && <p className="text-sm">Customers: {company.startup_customers}</p>}
                </div>
            )}

            {/* Technology & Industry */}
            {(company.startup_technology || company.startup_industry) && (
                <div className="flex gap-2 flex-wrap">
                    {company.startup_technology && (
                        <span className="px-3 py-1 text-xs bg-blue-100 text-primary rounded-full">
                            Tech: {company.startup_technology}
                        </span>
                    )}
                    {company.startup_industry && (
                        <span className="px-3 py-1 text-xs bg-blue-100 text-primary rounded-full">
                            Industry: {company.startup_industry}
                        </span>
                    )}
                </div>
            )}

            {/* Founders */}
            {company.startup_founders_info && (
                <div>
                    <h3 className="font-semibold text-primary mb-1">Founders</h3>
                    <p className="text-sm text-gray-800">{company.startup_founders_info}</p>
                </div>
            )}

            {/* Contact */}
            {company.startup_emails && (
                <div>
                    <h3 className="font-semibold text-primary mb-1">Contact</h3>
                    {company.startup_emails.split(",").map((email, idx) => {
                        const clean = email.trim();
                        const match = clean.match(/<(.+)>/);
                        const actual = match ? match[1] : clean;
                        const label = match ? clean.replace(/<.+>/, "").trim() : clean;
                        return (
                            <button
                                key={idx}
                                onClick={() => handleEmailContact(actual)}
                                className="text-sm text-left text-primary hover:underline block"
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SolutionProvider;
