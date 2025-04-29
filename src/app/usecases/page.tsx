"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface UseCase {
    id: number;
    title: string;
    description: string;
    posted_on: string;
    status: string;
}

const Page: React.FC = () => {
    const [useCases, setUseCases] = useState<UseCase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("All");

    useEffect(() => {
        const fetchUseCases = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/usecases/");
                if (Array.isArray(response.data.usecases)) {
                    setUseCases(response.data.usecases);
                }
            } catch (error) {
                console.error("Error fetching use cases:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUseCases();
    }, []);

    const filteredUseCases = useCases.filter((uc) => {
        return (
            (searchQuery === "" || uc.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (statusFilter === "All" || uc.status === statusFilter)
        );
    });

    return (
        <div className="min-h-screen bg-[#F5FAFF] p-6 md:p-10">
            <h1 className="text-xl md:text-2xl font-semibold mb-6 text-[#0071C1] tracking-tight">
                Innovation Use Cases
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search use cases..."
                    className="border border-gray-300 text-sm p-2.5 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#0071C1]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="border border-gray-300 text-sm p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0071C1]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Closed">Closed</option>
                    <option value="Awarded">Awarded</option>
                </select>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
                <div className="grid gap-6">
                    {filteredUseCases.length === 0 ? (
                        <p className="text-gray-400 text-sm">No Use Cases Found</p>
                    ) : (
                        filteredUseCases.map((useCase) => (
                            <div
                                key={useCase.id}
                                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-base md:text-lg font-medium text-gray-800 leading-snug">
                                        {useCase.title}
                                    </h2>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${useCase.status === "Open"
                                                ? "bg-green-100 text-green-600"
                                                : useCase.status === "Under Review"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : useCase.status === "Closed"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-blue-100 text-blue-600"
                                            }`}
                                    >
                                        {useCase.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {useCase.description}
                                </p>

                                <div className="text-xs text-gray-400">
                                    Posted on {new Date(useCase.posted_on).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Page;
