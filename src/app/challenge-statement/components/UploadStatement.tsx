import { MdArrowBack, MdCalendarToday } from "react-icons/md";
import { LuUpload } from "react-icons/lu";

const UploadStatement = ({ onCancel }) => {
    return (
        <>
            <div className="flex items-center gap-2 mb-8">
                <button className="text-[#515151] hover:bg-gray-100 rounded p-2" onClick={onCancel}>
                    <MdArrowBack size={24} />
                </button>
                <span className="text-2xl font-semibold tracking-tight">Upload Challenge Statement</span>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white px-10 py-8 shadow-lg">
                <form>
                    <div className="grid grid-cols-12 gap-x-6 gap-y-7">
                        <div className="col-span-5">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Challenge Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Enter the challenge title"
                                className="w-full border border-[#919191] rounded-lg px-4 py-2.5 text-[15px] bg-[#fafafa] focus:border-[#0081CA]"
                            />
                        </div>
                        <div className="col-span-4">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Image <span className="text-red-500">*</span></label>
                            <div>
                                <label className="border border-[#919191] rounded-lg px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition bg-[#fafafa] justify-between">
                                    <span className="text-sm text-[#888]">Upload an image</span>
                                    <input type="file" accept="image/png,image/jpg,image/jpeg,image/gif" className="hidden" />
                                    <div className="text-[#222]">
                                        <LuUpload size={20} />
                                    </div>
                                </label>
                                <span className="text-xs text-[#A5A5A5] mt-1 block pl-1">PNG, JPG, GIF up to 10MB</span>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Closing Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full border border-[#919191] rounded-lg py-2.5 text-[15px] bg-[#fafafa] focus:border-[#0081CA]"
                                />
                                <MdCalendarToday size={18} className="absolute top-3 right-3 text-[#bcbcbc]" />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Problem Description <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="Provide a brief about the problem statement"
                                rows={3}
                                className="w-full border border-[#919191] rounded-lg px-4 py-2.5 text-[15px] bg-[#fafafa] focus:border-[#0081CA] resize-none"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Requirement <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="List the requirement (use bullet points)"
                                rows={3}
                                className="w-full border border-[#919191] rounded-lg px-4 py-2.5 text-[15px] bg-[#fafafa] focus:border-[#0081CA] resize-none"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Scenario <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="Describe the current scenario and context"
                                rows={3}
                                className="w-full border border-[#919191] rounded-lg px-4 py-2.5 text-[15px] bg-[#fafafa] focus:border-[#0081CA] resize-none"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-[#222] text-[15px] mb-1 font-semibold">Key Success Metrics <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="List the Key success metrics (use bullet points)"
                                rows={3}
                                className="w-full border border-[#919191] rounded-lg px-4 py-2.5 text-[15px] bg-[#fafafa] focus:border-[#0081CA] resize-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-10 gap-3">
                        <button type="button" className="px-7 py-2.5 rounded-lg border border-[#C3C3C3] text-[#222] font-medium bg-white hover:bg-gray-100 transition"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-7 py-2.5 rounded-lg bg-[#0081CA] text-white font-medium hover:bg-blue-700 transition">
                            Publish Challenge Statement
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
export default UploadStatement;
