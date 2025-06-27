import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTrend, resetTrendsState, fetchSectors, fetchIndustries, fetchSubIndustries, resetOptions } from "../../redux/features/trendsSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { apiRequest } from "../../utils/apiWrapper/apiRequest";
import { FaPlus, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";
import { canManageTrends } from "../../utils/localStorageUtils";

interface AddTrendsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function isOptionObject(opt: any): opt is { value: string; label: string } {
    return opt && typeof opt === 'object' && 'value' in opt && 'label' in opt;
}

const AddTrendsModal: React.FC<AddTrendsModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        loading,
        error,
        success,
        sectorOptions,
        industryOptions,
        subIndustryOptions,
        optionsLoading,
    } = useSelector((state: RootState) => state.trends) as {
        loading: boolean;
        error: string | null;
        success: boolean;
        sectorOptions: (string | { label: string; value: string })[];
        industryOptions: (string | { label: string; value: string })[];
        subIndustryOptions: (string | { label: string; value: string })[];
        optionsLoading: boolean;
    };

    const [challengeTitle, setChallengeTitle] = useState("");
    const [challenge, setChallenge] = useState("");
    const [solution, setSolution] = useState<string[]>([""]);
    const [impact, setImpact] = useState<string[]>([""]);
    const [solutionProvider, setSolutionProvider] = useState("");
    const [solutionProviderSearch, setSolutionProviderSearch] = useState("");
    const [solutionProviderResults, setSolutionProviderResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [solutionProviderWebsite, setSolutionProviderWebsite] = useState("");
    const [enterpriseName, setEnterpriseName] = useState("");
    const [testimonials, setTestimonials] = useState("");
    const [references, setReferences] = useState<string[]>([""]);
    const [images, setImages] = useState<File[]>([]);
    const [sector, setSector] = useState("");
    const [industry, setIndustry] = useState("");
    const [subIndustry, setSubIndustry] = useState("");
    const [canManage, setCanManage] = useState(false);

    useEffect(() => {
        // Check if user can manage trends
        setCanManage(canManageTrends());
    }, []);

    useEffect(() => {
        if (!isOpen) {
            dispatch(resetTrendsState());
            dispatch(resetOptions());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(resetTrendsState());
                dispatch(resetOptions());
                onClose();
            }, 1200);
        }
    }, [success, dispatch, onClose]);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchSectors());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (sector) {
            dispatch(fetchIndustries(sector));
            setIndustry("");
            setSubIndustry("");
        }
    }, [sector, dispatch]);

    useEffect(() => {
        if (sector && industry) {
            dispatch(fetchSubIndustries({ sector, industry }));
            setSubIndustry("");
        }
    }, [sector, industry, dispatch]);

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (query.length < 2) {
                setSolutionProviderResults([]);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            try {
                const res = await apiRequest('get', '/company/view/', { search: query }, false);
                setSolutionProviderResults(res.data.results || []);
            } catch (error) {
                setSolutionProviderResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 400),
        []
    );

    useEffect(() => {
        if (!solutionProvider) debouncedSearch(solutionProviderSearch);
        return () => { debouncedSearch.cancel(); };
    }, [solutionProviderSearch, solutionProvider, debouncedSearch]);

    const handleArrayChange = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const handleAddArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter((prev) => [...prev, ""]);
    };

    const handleRemoveArrayItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number
    ) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSelectSolutionProvider = (provider: any) => {
        setSolutionProvider(provider.startup_id);
        setSolutionProviderSearch(provider.startup_name);
        setSolutionProviderResults([]);
        setSolutionProviderWebsite("");
    };

    const handleClearSolutionProvider = () => {
        setSolutionProvider("");
        setSolutionProviderSearch("");
        setSolutionProviderResults([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check permissions before submitting
        if (!canManage) {
            alert('You do not have permission to create trends. Only TYN users can create trends.');
            return;
        }

        const imagesToSend = images.map((img) => img.name);
        dispatch(
            addTrend({
                challenge_title: challengeTitle,
                challenge,
                solution: solution.filter((s) => s.trim() !== ""),
                impact: impact.filter((i) => i.trim() !== ""),
                solution_provider: parseInt(solutionProvider),
                solution_provider_website: solutionProviderWebsite,
                enterprise_name: enterpriseName,
                testimonials,
                references: references.filter((r) => r.trim() !== ""),
                images: imagesToSend,
                sector,
                industry,
                sub_industry: subIndustry,
            })
        );
    };

    if (!isOpen) return null;

    // Show permission error if user cannot manage trends
    if (!canManage) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
                    <p className="text-gray-700 mb-6">
                        You do not have permission to create trends. Only TYN users can create, update, and delete trends.
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] p-8 overflow-y-auto border border-gray-200 relative">
                <h2 className="text-3xl font-extrabold mb-6 text-primary tracking-tight">Add Trend</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-base font-semibold mb-1 text-gray-700">Challenge Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={challengeTitle}
                                onChange={(e) => setChallengeTitle(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 transition"
                                required
                                placeholder="Enter a short, impactful title"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold mb-1 text-gray-700">Challenge <span className="text-red-500">*</span></label>
                            <textarea
                                value={challenge}
                                onChange={(e) => setChallenge(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 transition"
                                required
                                placeholder="Describe the business challenge..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="border-t border-gray-100 my-3" />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-base font-semibold mb-1 text-gray-700">Solution</label>
                            {solution.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 mb-1">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => handleArrayChange(setSolution, idx, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                        placeholder={`Solution ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveArrayItem(setSolution, idx)}
                                        className="p-1 rounded bg-red-100 hover:bg-red-300 transition"
                                        aria-label="Remove solution"
                                    >
                                        <FaTrash className="text-xs text-red-600" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddArrayItem(setSolution)}
                                className="flex items-center gap-1 mt-1 text-cyan-700 hover:underline"
                            >
                                <FaPlus className="text-sm" /> Add Solution
                            </button>
                        </div>
                        <div className="flex-1">
                            <label className="block text-base font-semibold mb-1 text-gray-700">Impact</label>
                            {impact.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 mb-1">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={e => handleArrayChange(setImpact, idx, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                        placeholder={`Impact ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveArrayItem(setImpact, idx)}
                                        className="p-1 rounded bg-red-100 hover:bg-red-300 transition"
                                        aria-label="Remove impact"
                                    >
                                        <FaTrash className="text-xs text-red-600" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddArrayItem(setImpact)}
                                className="flex items-center gap-1 mt-1 text-cyan-700 hover:underline"
                            >
                                <FaPlus className="text-sm" /> Add Impact
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 my-3" />
                    <div className="relative">
                        <label className="block text-base font-semibold mb-1 text-gray-700">
                            Solution Provider <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={solutionProviderSearch}
                                onChange={(e) => setSolutionProviderSearch(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                placeholder="Type to search provider..."
                                required={!solutionProvider}
                                disabled={!!solutionProvider}
                                autoComplete="off"
                            />
                            {solutionProvider && (
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs ml-2"
                                    onClick={handleClearSolutionProvider}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {isSearching && <div className="p-2 text-gray-600">Searching...</div>}
                        {solutionProviderResults.length > 0 && !solutionProvider && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                {solutionProviderResults.map((provider) => (
                                    <div
                                        key={provider.startup_id}
                                        className="p-2 hover:bg-cyan-100 cursor-pointer"
                                        onClick={() => handleSelectSolutionProvider(provider)}
                                    >
                                        {provider.startup_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {!solutionProvider && (
                        <div>
                            <label className="block text-base font-semibold mb-1 text-gray-700">Solution Provider Website</label>
                            <input
                                type="url"
                                value={solutionProviderWebsite}
                                onChange={e => setSolutionProviderWebsite(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                placeholder="https://provider.com"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-base font-semibold mb-1 text-gray-700">Enterprise Name</label>
                        <input
                            type="text"
                            value={enterpriseName}
                            onChange={e => setEnterpriseName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold mb-1 text-gray-700">Testimonials</label>
                        <textarea
                            value={testimonials}
                            onChange={e => setTestimonials(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold mb-1 text-gray-700">References</label>
                        {references.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={e => handleArrayChange(setReferences, idx, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder={`Reference ${idx + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem(setReferences, idx)}
                                    className="p-1 rounded bg-red-100 hover:bg-red-300 transition"
                                    aria-label="Remove reference"
                                >
                                    <FaTrash className="text-xs text-red-600" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddArrayItem(setReferences)}
                            className="flex items-center gap-1 mt-1 text-cyan-700 hover:underline"
                        >
                            <FaPlus className="text-sm" /> Add Reference
                        </button>
                    </div>
                    <div>
                        <label className="block text-base font-semibold mb-1 text-gray-700">Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        />
                        <div className="flex flex-wrap gap-2 mt-1">
                            {images.map((file, idx) => (
                                <div key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">{file.name}</div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-base font-semibold mb-1 text-gray-700">Sector <span className="text-red-500">*</span></label>
                            <select
                                value={sector}
                                onChange={e => setSector(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                required
                                disabled={optionsLoading}
                            >
                                <option value="">Select Sector</option>
                                {sectorOptions.map(s =>
                                    typeof s === "string"
                                        ? <option key={s} value={s}>{s}</option>
                                        : isOptionObject(s)
                                            ? <option key={s.value} value={s.value}>{s.label}</option>
                                            : null
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-semibold mb-1 text-gray-700">Industry <span className="text-red-500">*</span></label>
                            <select
                                value={industry}
                                onChange={e => setIndustry(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                required
                                disabled={!sector || optionsLoading}
                            >
                                <option value="">Select Industry</option>
                                {industryOptions.map(i =>
                                    typeof i === "string"
                                        ? <option key={i} value={i}>{i}</option>
                                        : isOptionObject(i)
                                            ? <option key={i.value} value={i.value}>{i.label}</option>
                                            : null
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-semibold mb-1 text-gray-700">Sub-Industry <span className="text-red-500">*</span></label>
                            <select
                                value={subIndustry}
                                onChange={e => setSubIndustry(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                required
                                disabled={!industry || optionsLoading}
                            >
                                <option value="">Select Sub-Industry</option>
                                {subIndustryOptions.map(si =>
                                    typeof si === "string"
                                        ? <option key={si} value={si}>{si}</option>
                                        : isOptionObject(si)
                                            ? <option key={si.value} value={si.value}>{si.label}</option>
                                            : null
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-70"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                    {error && <div className="mt-2 px-3 py-2 bg-red-100 text-red-700 rounded">{error}</div>}
                    {success && <div className="mt-2 px-3 py-2 bg-green-100 text-green-700 rounded">Trend added successfully!</div>}
                </form>
            </div>
        </div>
    );
};

export default AddTrendsModal;
