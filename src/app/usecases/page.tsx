"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUseCases } from "../redux/features/usecases/useCaseSlice";
import LeftFrame from "../components/LeftFrame/LeftFrame";

const UseCasePage = () => {
    const dispatch = useAppDispatch();
    const { useCases, loading, error } = useAppSelector((state) => state.useCase);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("All");

    useEffect(() => {
        dispatch(fetchUseCases());
    }, [dispatch]);

    const statusOptions = ["All", "Open", "Under Review", "Closed", "Awarded"];

    const filteredUseCases = useCases.filter((uc: any) => {
        const matchesStatus = selectedStatus === "All" || uc.status === selectedStatus;
        const matchesSearch = uc.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <main className="flex flex-row w-full h-screen">
            <div className="w-[21%]">
                <LeftFrame/>
            </div>

            <div className="flex-1 flex flex-col w-full h-full p-6 bg-[#F8FBFF] overflow-y-auto">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">
                    Innovation Use Cases
                </h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search Usecases"
                        className="px-4 py-1.5 bg-white border rounded-lg text-gray-600 text-sm w-full md:w-1/3 focus:ring-[#0070C0] focus:ring-[0.5px] placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="px-4 py-1.5 bg-white border rounded-lg  text-sm w-full md:w-1/3 focus:ring-[#0070C0] focus:ring-[0.5px] placeholder:text-gray-400 text-gray-400"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {statusOptions.map((status, idx) => (
                            <option key={idx} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredUseCases.length > 0 ? (
                            filteredUseCases.map((useCase: any) => (
                                <div
                                    key={useCase.id}
                                    className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="font-semibold text-lg text-gray-800">
                                            {useCase.title}
                                        </h2>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full text-center font-medium ${useCase.status === "Open"
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

                                    <p className="text-gray-600 text-sm mb-6">{useCase.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400">
                                No use cases found for the selected filters.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default UseCasePage;
