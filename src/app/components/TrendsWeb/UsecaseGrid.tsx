import React, { useEffect, useState } from 'react';
import { FaArrowRightLong, FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrends, deleteTrend } from '../../redux/features/trendsSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import AddTrendsModal from "../../trends/components/AddTrendsModal";

const UsecaseGrid = ({
    selectedSector,
    selectedIndustry,
    selectedSubIndustry,
    onExploreClick
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { trends, loading, error } = useSelector((state: RootState) => state.trends);
    const [isAddTrendModalOpen, setIsAddTrendModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchTrends({ selectedSector, selectedIndustry, selectedSubIndustry }));
    }, [dispatch, selectedSector, selectedIndustry, selectedSubIndustry]);

    const handleDelete = (trendId: number) => {
        if (window.confirm('Are you sure you want to delete this trend?')) {
            dispatch(deleteTrend(trendId));
        }
    };

    const getHeading = () => {
        if (selectedSubIndustry) return `${selectedSubIndustry} Usecases`;
        if (selectedIndustry) return `${selectedIndustry} Usecases`;
        if (selectedSector) return `${selectedSector} Usecases`;
        return 'Usecases';
    };

    if (loading) return <div className="p-4 text-sm">Loading usecases...</div>;
    if (error) return <div className="p-4 text-sm text-red-500">Error: {error}</div>;

    return (
        <motion.div
            className="w-[40vw] h-[85vh] bg-white shadow-md mt-4 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Heading and Add Trend Button */}
            <div className="flex items-center justify-between mb-2 px-4 pt-4">
                <div className="text-lg font-semibold text-primary">
                    {getHeading()}
                </div>
                <button
                    className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-[#005a9a] transition-colors"
                    onClick={() => setIsAddTrendModalOpen(true)}
                >
                    Add Trend
                </button>
            </div>
            <AddTrendsModal
                isOpen={isAddTrendModalOpen}
                onClose={() => setIsAddTrendModalOpen(false)}
            />
            <div
                className={`grid gap-4 px-3 py-3 pb-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-no-arrows
                ${trends.length <= 2
                        ? "grid-cols-2 justify-items-start overflow-visible h-auto"
                        : "grid-cols-2 justify-items-start overflow-y-scroll h-[80vh]"
                    }`}
            >
                {trends.map((item, index) => {
                    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : "/fallback.jpg";
                    return (
                        <motion.div
                            key={item.id}
                            className="relative bg-white shadow-md flex flex-col w-full max-w-[320px] rounded-xl transform transition hover:scale-105 hover:shadow-lg"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 rounded-full hover:bg-red-100 transition"
                                aria-label="Delete trend"
                            >
                                <FaTrash className="text-red-500 text-xs" />
                            </button>
                            <div className="relative">
                                <img
                                    src={imageUrl}
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
                                        onClick={() => onExploreClick(item.id)}  // Pass the item id here
                                    >
                                        Explore
                                    </div>
                                    <FaArrowRightLong className="text-sm text-[#2286C0] font-light" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {trends.length === 0 && (
                <div className="text-center text-sm text-gray-500 mt-4">
                    No usecases found for your selection.
                </div>
            )}
        </motion.div>
    );
};

export default UsecaseGrid;
