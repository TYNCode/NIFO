import React, { useState } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";

const ProgressOne: React.FC = () => {
    const [activeTab, setActiveTab] = useState("1a");

    return (
        <>
            <div className=" pt-20">
                <div className="flex flex-row gap-8 justify-center items-center shadow-sm">
                    {[
                        { id: "1a", label: "Identification of the use case" },
                        { id: "1b", label: "Gather and Analyze Problem Details" },
                        { id: "1c", label: "Create a Problem Definition Document" },
                    ].map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-row justify-between text-sm gap-2 font-medium px-4 py-2 rounded-t-lg cursor-pointer transition-all duration-200
                                ${activeTab === tab.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-black"
                                }`}
                        >
                            <div>{tab.id}</div>
                            <div>{tab.label}</div>
                        </div>
                    ))}
                </div>

                <div className="">
                    {activeTab === "1a" && <OneTabStepOne />}
                    {activeTab === "1b" && <OneTabStepTwo />}
                    {activeTab === "1c" && <OneTabStepThree />}
                </div>
            </div>
        </>
    );
};

export default ProgressOne;
