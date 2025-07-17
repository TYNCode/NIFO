import { FiLink, FiPhone, FiMail } from "react-icons/fi";
import { MdCheck, MdClose } from "react-icons/md";

const getStatusBadge = (status: string) => {
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-orange-100 text-orange-600";
    if (status === "Rejected") return "bg-red-100 text-red-500";
    return "";
};

export default function SubmittedProposals({ proposals }) {
    return (
        <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex gap-5 min-w-fit">
                {proposals.map((row, idx) => (
                    <div
                        key={row.startup + idx}
                        className="min-w-[320px] max-w-[340px] w-full bg-white border border-[#e5e8ee] rounded-xl shadow hover:shadow-lg transition flex-shrink-0 flex flex-col p-5"
                        style={{ fontSize: 15 }}
                    >
                        <div className="flex items-center gap-2 font-semibold text-[#232323] mb-2">
                            <a href={row.url} className="hover:underline flex items-center gap-1">
                                {row.startup}
                                <FiLink className="text-[#4b9fff]" size={15} />
                            </a>
                        </div>
                        <div className="text-[#666] font-medium mb-1">
                            {row.person}
                        </div>
                        <div className="flex flex-col gap-1 text-[#777] text-[14px] mb-2">
                            <span className="flex items-center gap-2"><FiPhone size={13} />{row.phone}</span>
                            <span className="flex items-center gap-2"><FiMail size={13} />{row.email}</span>
                        </div>
                        <div className="mb-2">
                            <span className={`rounded-full px-4 py-1 text-xs font-semibold ${getStatusBadge(row.status)}`}>
                                {row.status}
                            </span>
                        </div>
                        <div className="flex gap-2 mb-2">
                            {row.canAccept && (
                                <button className="bg-green-100 hover:bg-green-200 rounded-md p-1">
                                    <MdCheck size={18} className="text-green-600" />
                                </button>
                            )}
                            {row.canReject && (
                                <button className="bg-red-100 hover:bg-red-200 rounded-md p-1">
                                    <MdClose size={18} className="text-red-600" />
                                </button>
                            )}
                        </div>
                        <div className="mt-auto flex justify-end">
                            <a href={row.attachment} target="_blank" rel="noopener noreferrer">
                                <FiLink size={17} className="text-black hover:text-[#0081CA] transition" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
