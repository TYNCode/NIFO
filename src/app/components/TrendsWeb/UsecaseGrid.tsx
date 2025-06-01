import React, { useEffect, useState } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

interface Usecase {
    id: number;
    challenge_title: string;
    challenge: string;
    sector: string;
    industry: string;
    solution: string[];
    impact: string[];
    solution_provider: number;
}

const UsecaseGrid = ({ selectedSector, onExploreClick, selectedIndustry }: { selectedSector: string, onExploreClick: (id: number) => void, selectedIndustry:string }) => {
    const [usecases, setUsecases] = useState<Usecase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsecases = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://127.0.0.1:8000/trends/");
                const data = await response.json();

                const filtered = data.filter((item: Usecase) => {
                    // Check sector filter if selectedSector is provided
                    const sectorMatch = selectedSector ? item.sector === selectedSector : true;
                    // Check industry filter if selectedIndustry is provided
                    const industryMatch = selectedIndustry ? item.industry === selectedIndustry : true;
                    // Only include if both match (or filter not applied)
                    return sectorMatch && industryMatch;
                });

                setUsecases(filtered);
            } catch (error) {
                console.error("Error fetching usecases:", error);
                setUsecases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsecases();
    }, [selectedSector, selectedIndustry]);
      

    if (loading) return <div className="p-4 text-sm">Loading usecases...</div>;

    return (
        <motion.div
            className="w-[40vw] h-[85vh] bg-white shadow-md mt-4 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="text-lg font-semibold text-[#2F2F2F] mb-2 px-4 pt-4">Usecases</div>

            <div
                className={`
              grid gap-4 px-3 py-3 pb-10
              scrollbar-thin scrollbar-thumb-gray-400 scrollbar-no-arrows
              ${usecases.length <= 2
                        ? "grid-cols-2 justify-items-start overflow-visible h-auto"
                        : "grid-cols-2 justify-items-start overflow-y-scroll h-[80vh]"
                    }
            `}
            >
                {usecases.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="bg-white shadow-md flex flex-col w-full max-w-[320px] rounded-xl transform transition hover:scale-105 hover:shadow-lg "
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                        <div className="relative">
                            <img
                                src="/images.jpeg"
                                alt={item.challenge_title}
                                className="w-full h-[150px] object-cover rounded-t-xl"
                            />
                        </div>
                        <div className="flex flex-col justify-between flex-grow px-3 py-3 gap-3">
                            <div
                                className="text-[14px] font-medium text-[#2F2F2F] leading-tight"
                                title={item.challenge}
                            >
                                {item.challenge_title}
                            </div>

                            <div className="flex flex-row justify-end items-center gap-2 mt-auto">
                                <div
                                    className="text-[14px] text-[#2286C0] cursor-pointer"
                                    onClick={() => onExploreClick(item.solution_provider)}
                                >
                                    Explore
                                </div>
                                <FaArrowRightLong className="text-sm text-[#2286C0] font-light" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {usecases.length === 0 && (
                <div className="text-center text-sm text-gray-500 mt-4">
                    No usecases found for "{selectedSector}"
                </div>
            )}
        </motion.div>
      );
};

export default UsecaseGrid;
