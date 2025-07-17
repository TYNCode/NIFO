import { MdArrowBack, MdCalendarToday, MdAttachFile } from "react-icons/md";
import SubmittedProposals from "./SubmittedProposals";

export default function ViewChallenge({ data, proposals, onBack }) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-7">
                <button className="text-[#515151] hover:bg-gray-100 rounded p-2" onClick={onBack}>
                    <MdArrowBack size={24} />
                </button>
                <h2 className="text-2xl font-semibold tracking-tight">{data.title}</h2>
                <span className={`rounded-full px-4 py-1 text-xs font-semibold ${data.status === "Active" ? "bg-[#00DE38] text-white" : "bg-[#E1E1E1] text-[#7D7D7D]"
                    }`}>
                    {data.status}
                </span>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 mb-7">
                <div className="text-[#555] text-[15px]">
                    <span className="font-semibold text-[#222]">Created by:</span> {data.createdBy}
                </div>
                <div className="flex items-center gap-1 text-[#555] text-[15px]">
                    <MdCalendarToday className="text-[#bcbcbc]" size={17} />
                    <span className="font-semibold text-[#222] ml-1">Closing Date:</span> {data.closingDate}
                </div>
                <div className="flex items-center gap-1 text-[#555] text-[15px]">
                    <MdAttachFile className="text-[#bcbcbc]" size={17} />
                    <a
                        href={data.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0081CA] hover:underline font-medium"
                    >
                        Attachment
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-7 mb-10">
                <div>
                    <div className="font-semibold text-[#515151] mb-2">Problem Description</div>
                    <div className="text-[#232323] text-[15px] whitespace-pre-line bg-[#f9f9f9] rounded-md p-3">
                        {data.problemDescription}
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-[#515151] mb-2">Requirement</div>
                    <div className="text-[#232323] text-[15px] whitespace-pre-line bg-[#f9f9f9] rounded-md p-3">
                        {data.requirement}
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-[#515151] mb-2">Scenario</div>
                    <div className="text-[#232323] text-[15px] whitespace-pre-line bg-[#f9f9f9] rounded-md p-3">
                        {data.scenario}
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-[#515151] mb-2">Key Success Metrics</div>
                    <div className="text-[#232323] text-[15px] whitespace-pre-line bg-[#f9f9f9] rounded-md p-3">
                        {data.keySuccessMetrics}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-lg text-[#222]">Submitted Proposals <span className="ml-1 text-[#888] font-normal">({proposals.length})</span></span>
                </div>
                <SubmittedProposals proposals={proposals} />
            </div>
        </div>
    );
}
