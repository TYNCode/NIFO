import { FaUsers } from "react-icons/fa";
import { MdBusiness, MdCalendarToday } from "react-icons/md";

const PAGE_SIZE = 6;

export default function ProblemStatements({ rows, onUpload, onView }) {
    // Could paginate if you want, but for 6-8 rows just render all

    return (
        <>
            <div className="flex items-center gap-3 mb-7 sticky top-0 z-10 bg-[#f5f6fa] pt-2 pb-2">
                <span className="bg-blue-100 text-[#0081CA] p-2 rounded-xl">
                    <MdBusiness size={24} />
                </span>
                <span className="text-2xl font-semibold tracking-tight">Challenge Statements</span>
                <button
                    className="ml-auto bg-[#0081CA] text-white rounded-xl px-6 py-2 font-medium hover:bg-blue-700 transition"
                    onClick={onUpload}
                >
                    + Upload
                </button>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white overflow-hidden shadow-lg">
                <div className="grid grid-cols-[2.3fr_1.5fr_1fr_1.5fr_1fr] bg-[#f7f7f9] text-[#7D7D7D] font-semibold text-[15px] py-3 px-6 border-b border-[#e0e0e0]">
                    <div>Challenge Statement</div>
                    <div>Company</div>
                    <div className="flex items-center gap-1">Proposal</div>
                    <div className="flex items-center gap-1">Closing Date</div>
                    <div>Status</div>
                </div>
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="grid grid-cols-[2.3fr_1.5fr_1fr_1.5fr_1fr] items-center px-6 py-5 border-b border-[#e0e0e0] last:border-b-0 bg-white text-[#232323] text-[15px] cursor-pointer hover:bg-blue-50/50 transition"
                        onClick={() => onView(row.id)}
                        tabIndex={0}
                        role="button"
                        aria-label={row.statement}
                    >
                        <div className="font-medium">{row.statement}</div>
                        <div className="flex items-center gap-2 text-[#7D7D7D]">
                            <MdBusiness size={16} className="text-[#B9B9B9]" />
                            <span>{row.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers size={14} className="text-[#0081CA]" />
                            <span className="text-[#0081CA] font-semibold">{row.proposalCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#7D7D7D]">
                            <MdCalendarToday size={14} className="text-[#B9B9B9]" />
                            <span>{row.closingDate}</span>
                        </div>
                        <div>
                            <span className={`rounded-full px-4 py-1 text-xs font-semibold ${row.status === 'Active'
                                    ? 'bg-[#00DE38] text-[#fff]'
                                    : 'bg-[#E1E1E1] text-[#7D7D7D]'
                                }`}>
                                {row.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
