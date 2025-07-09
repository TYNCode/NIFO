'use client';
import { useState } from "react";
import LeftFrame from "../components/LeftFrame/LeftFrame";
import ProblemStatements from "./components/ProblemStatements";
import UploadStatement from "./components/UploadStatement";
import ViewChallenge from "./components/ViewChallenge";
import { challengeList, challengeDetails, proposals } from "../data/mockData";

export default function Page() {
    const [mode, setMode] = useState<"list" | "upload" | "view">("list");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleViewChallenge = (id: number) => {
        setSelectedId(id);
        setMode("view");
    };
    const handleUpload = () => setMode("upload");
    const handleCancel = () => setMode("list");
    const handleBack = () => setMode("list");

    return (
        <div className="h-screen bg-[#f5f6fa] flex">
            <div className="w-[260px] border-r bg-white/80">
                <LeftFrame />
            </div>

            <div className="flex-1 flex flex-col items-center overflow-x-hidden">
                <div className="w-full max-w-7xl mt-10 transition-all">
                    {mode === "list" && (
                        <ProblemStatements
                            rows={challengeList}
                            onUpload={handleUpload}
                            onView={handleViewChallenge}
                        />
                    )}
                    {mode === "upload" && (
                        <UploadStatement onCancel={handleCancel} />
                    )}
                    {mode === "view" && selectedId !== null && (
                        <div className="relative flex gap-6 px-1 transition-all">
                            <section className="bg-white/80 backdrop-blur border border-[#e5e8ee] rounded-2xl shadow-xl p-8 flex flex-col relative transition-all duration-300">
                                <ViewChallenge
                                    data={challengeDetails[selectedId] || challengeDetails[1]}
                                    proposals={proposals}
                                    onBack={handleBack}
                                />
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
