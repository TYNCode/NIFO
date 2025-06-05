import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

const ExploreUseCase = ({ useCaseId, onBack }) => {
    const [useCaseData, setUseCaseData] = useState(null);

    console.log("usecaseData", useCaseData)

    useEffect(() => {
        const fetchUseCaseDetails = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/trends/${useCaseId}/`);
                const data = await res.json();
                setUseCaseData(data);
            } catch (error) {
                console.error("Error fetching use case details:", error);
            }
        };

        fetchUseCaseDetails();
    }, [useCaseId]);

    if (!useCaseData) {
        return <div className="text-center p-4">Loading use case details...</div>;
    }

    return (
        <div className="bg-white shadow flex flex-col mt-4 gap-4 w-[40vw] h-[85vh] overflow-y-scroll">
            <div
                className="relative flex flex-col justify-start gap-4 p-4 h-[25vh] text-black cursor-pointer"
                style={{
                    backgroundImage: `url(${useCaseData.images[0]})`,
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
                    <div className="relative text-lg font-semibold">{useCaseData.challenge_title}</div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium text-black">Solution Provider</div>
                        <div>{useCaseData.solution_provider}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 h-full  px-4">
                <div className="flex flex-col gap-2">
                    <div className="font-semibold">Challenge</div>
                    <div>{useCaseData.challenge || "N/A"}</div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="font-semibold">Solution</div>
                    <div>
                        {useCaseData.solution.map((item) => {
                            return (
                                <ul>
                                    <li>{item}</li>
                                </ul>
                            )
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-2 pb-4">
                    <div className="font-semibold">Impact</div>
                    <div>{useCaseData.impact.map((item)=>{
                        return (
                            <ul>
                                <li>{item}</li>
                            </ul>
                        )
                    })}</div>
                </div>
                
                <div className="flex flex-col gap-2 pb-4">
                    <div className="font-semibold">References</div>
                    <div>
                        {useCaseData.references.map((reference, index) => (
                            <a key={index} href={reference} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                {reference}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExploreUseCase;
