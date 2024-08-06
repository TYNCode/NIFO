import React from "react";

const RenderStartup = ({ message, handleSendStartupData }) => {
  const renderSolutionOrchestration = () => {
    return (
      <div>
        {message?.response?.steps?.map((step, index) => (
          <div key={index}>
            {" "}
            {/* Ensure key is used on the outermost element */}
            <div className="flex gap-2 m-2 mt-4">
              <div>Step: {step?.step_number}</div>
              <div>{step?.step_description}</div>
            </div>
            {step?.startups?.map((startup, sIndex) => (
              <div
                key={sIndex}
                className="grid grid-cols-3 mt-4 rounded shadow-md p-2 bg-blue-100 cursor-pointer"
                onClick={() => handleSendStartupData(startup, message)}
              >
                <div className="text-sm">{startup?.name}</div>
                <div className="text-sm col-span-2">{startup?.description}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  const renderOtherCategories = () => {
    const startups = message?.response?.startups;

    console.log("messageinrenderstartup", message);
    if (!startups || startups?.length === 0) return null;
    console.log("startups", startups);
    return (
      <div>
        <div className="grid grid-cols-3 font-semibold text-base">
          <div>Startup Name</div>
          <div>Reason</div>
        </div>

        {startups.map((startup, index) => (
          <div
            key={index}
            className="grid grid-cols-3 mt-4 rounded shadow-md p-2 bg-blue-100 cursor-pointer"
            onClick={() => handleSendStartupData(startup, message)}
          >
            <div className="text-sm">{startup?.name}</div>
            <div className="text-sm col-span-2">{startup?.description}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {message?.response?.category == "business problem(solution orchestration)"
        ? renderSolutionOrchestration()
        : renderOtherCategories()}
    </>
  );
};

export default RenderStartup;
