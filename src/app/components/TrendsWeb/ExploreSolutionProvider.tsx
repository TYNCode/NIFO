import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

const ExploreSolutionProvider = ({ solutionProviderId, onBack }) => {
    const [providerData, setProviderData] = useState(null);

    useEffect(() => {
        if (!solutionProviderId) return;

        const fetchProvider = async () => {
            try {
                const res = await fetch(`https://tyn-server.azurewebsites.net/trends/solution-providers/${solutionProviderId}/`);
                const data = await res.json();
                setProviderData(data);
            } catch (error) {
                console.error("Error fetching provider data:", error);
            }
        };

        fetchProvider();
    }, [solutionProviderId]);

    if (!providerData) return <div>Loading solution provider details...</div>;

    return (
        <div className="bg-white shadow flex flex-col mt-4 gap-4 w-[40vw] h-[85vh]">
            <div
                className="relative flex flex-col justify-start gap-4 p-4 h-[25vh] text-black cursor-pointer"
                style={{
                    backgroundImage: "url('images.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                onClick={onBack}
            >
                <div className="absolute inset-0 bg-white/80"></div>
                <div className="relative flex flex-row items-center gap-4">
                    <div className="text-[#2286C0]">
                        <FaArrowRight />
                    </div>
                    <div className="text-sm font-medium text-[#2286C0]">Back to Usecases</div>
                </div>
                <div className="relative grid grid-cols-2 gap-2">
                    <div className="relative text-lg font-semibold">{providerData.startup_name}</div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium text-black">Solution Provider</div>
                        <div>{providerData.startup_name}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 h-full bg-white shadow-lg px-4">
                <div className="flex flex-col gap-2">
                    <div className="font-bold">Challenge</div>
                    <div>{providerData.startup_description || "N/A"}</div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="font-bold">Solution</div>
                    <div>{providerData.startup_solutions || "N/A"}</div>
                </div>

                <div className="flex flex-col gap-2 pb-4">
                    <div className="font-bold">Impact</div>
                    <div>{providerData.startup_usecases || "N/A"}</div>
                </div>
            </div>
        </div>
    );
};

export default ExploreSolutionProvider;
