import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import SolutionProvider from "../TrendsWeb/SolutionProvider";

const ExploreUseCase = ({ useCaseId, onBack }) => {
    const [useCaseData, setUseCaseData] = useState(null);
    const [viewProviderDetails, setViewProviderDetails] = useState(false);
    const [providerName, setProviderName] = useState("");

    // Fetch use case details
    useEffect(() => {
        const fetchUseCaseDetails = async () => {
            try {
                const res = await fetch(`https://tyn-server.azurewebsites.net/trends/${useCaseId}/`);
                const data = await res.json();
                setUseCaseData(data);
            } catch (error) {
                console.error("Error fetching use case details:", error);
            }
        };

        fetchUseCaseDetails();
    }, [useCaseId]);

    // Fetch startup name by ID
    useEffect(() => {
        const fetchStartupName = async () => {
            if (useCaseData?.solution_provider) {
                try {
                    const res = await fetch(`https://tyn-server.azurewebsites.net/companies/view/${useCaseData.solution_provider}/`);
                    const data = await res.json();
                    setProviderName(data.startup_name || "Unknown Provider");
                } catch (error) {
                    console.error("Failed to fetch provider name", error);
                    setProviderName("Unknown Provider");
                }
            }
        };

        fetchStartupName();
    }, [useCaseData?.solution_provider]);

    if (!useCaseData) {
        return <div className="text-center py-6 text-gray-600">Loading use case details...</div>;
    }

    if (viewProviderDetails && useCaseData.solution_provider) {
        return (
            <SolutionProvider
                solutionProviderId={useCaseData.solution_provider}
                handleBack={() => setViewProviderDetails(false)}
                useCaseTitle={useCaseData.challenge_title}
                useCaseDescription={useCaseData.challenge}
            />
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg flex flex-col mt-4 gap-4 w-[40vw] h-[85vh] overflow-y-auto overflow-x-clip transition-all duration-300">
            {/* Header */}
            <div
                className="relative flex flex-col justify-between gap-3 p-4 min-h-[150px] text-black rounded-t-xl"
                style={{
                    backgroundImage: `url(${useCaseData.images[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                onClick={onBack}
            >
                {/* White translucent overlay */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0" />

                {/* Top: Back button */}
                <div className="relative z-10 flex items-center gap-2 text-[#2286C0] font-medium">
                    <FaArrowRight />
                    <span className="text-sm sm:text-base">Back to Usecases</span>
                </div>

                {/* Bottom: Title + Solution Provider */}
                <div className="relative z-10 grid grid-cols-2 gap-4 items-start">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{useCaseData.challenge_title}</h2>
                    <div className="flex flex-col gap-1 items-start">
                        <div className="text-sm text-gray-700 font-medium">Solution Provider</div>
                        <div className="text-[#2286C0] font-semibold text-sm">{providerName}</div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setViewProviderDetails(true);
                            }}
                            className="mt-1 text-xs px-3 py-1 bg-[#2286C0] text-white rounded-md hover:bg-[#005a9a] transition"
                        >
                            Explore
                        </button>
                    </div>
                </div>
            </div>


            {/* Body */}
            <div className="flex flex-col gap-6 px-4 pb-6">
                {/* Challenge */}
                <section className="border-b pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Challenge</h3>
                    <p className="text-sm text-gray-800 leading-relaxed">{useCaseData.challenge || "N/A"}</p>
                </section>

                {/* Solution */}
                <section className="border-b pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Solution</h3>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                        {useCaseData.solution.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                {/* Impact */}
                <section className="border-b pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Impact</h3>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                        {useCaseData.impact.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                {/* References */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">References</h3>
                    <div className="flex flex-col gap-2">
                        {useCaseData.references.map((reference, index) => (
                            <a
                                key={index}
                                href={reference}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 underline hover:text-blue-800 transition"
                            >
                                {reference}
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ExploreUseCase;
