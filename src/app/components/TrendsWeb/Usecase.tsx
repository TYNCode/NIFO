import React from "react";

const Usecase = ({ onSelectUsecase, selectedTechnology }) => {

   console.log("selectTech", selectedTechnology);
   
  const useCases = selectedTechnology?.useCases || [];
  const handleUsecaseClick = (usecase) => {
    onSelectUsecase(usecase);
  };

  return (
    <div>
      <div className="flex flex-col gap-8">
        <div className="border flex mx-auto w-max border-t-0 rounded-md px-8 py-3 -mt-2 border-blue-500">
          Usecases
        </div>
        <div className="flex flex-col gap-y-12 justify-center items-center">
          {useCases.length > 0 ? (
            useCases.map((usecase, index) => (
              <div
                className="bg-white shadow-md rounded-sm shadow-gray-300 p-4 w-[500px] cursor-pointer"
                key={index}
                onClick={() => handleUsecaseClick(usecase)}
              >
                {usecase}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No use cases available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usecase;
