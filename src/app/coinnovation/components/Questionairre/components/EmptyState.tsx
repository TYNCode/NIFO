import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-6 bg-white rounded-lg">
      <p className="text-[#979797]">
        No questionnaire data available. Please upload a questionnaire or add categories manually.
      </p>
    </div>
  );
};

export default EmptyState;
