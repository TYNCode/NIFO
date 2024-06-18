import React from "react";

interface HistoryBarProps {
  onSelectHistory: (value: string) => void;
  historyData: {
    [key: string]: string[] | { [key: string]: string[] }; // Handles both arrays and nested objects
  };
}

const HistoryBar: React.FC<HistoryBarProps> = ({
  onSelectHistory,
  historyData,
}) => {
  const sendQueryHistory = (value: string) => {
    onSelectHistory(value);
  };

  return (
    <>
      <div className="text-sm py-3 px-2 text-gray-400 font-semibold">
        Query History
      </div>
      <div>
        {Object.entries(historyData).map(([timePeriod, queries]) => {
          // Type guard to ensure 'queries' is an array
          if (Array.isArray(queries)) {
            if (queries.length === 0) return null;

            return (
              <div key={timePeriod}>
                <div className="text-sm py-2 px-2 text-gray-500 font-semibold">
                  {timePeriod}
                </div>
                {queries.map((query, index) => (
                  <div
                    key={index}
                    className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
                    onClick={() => sendQueryHistory(query)}
                  >
                    {query}
                  </div>
                ))}
              </div>
            );
          }

          // Handling nested objects for "Older" category
          if (
            timePeriod === "Older" &&
            typeof queries === "object" &&
            queries !== null
          ) {
            return Object.entries(queries).map(([monthYear, monthQueries]) => {
              if (!Array.isArray(monthQueries) || monthQueries.length === 0)
                return null;

              return (
                <div key={monthYear}>
                  <div className="text-sm py-2 px-2 text-gray-500 font-semibold">
                    {monthYear}
                  </div>
                  {monthQueries.map((query, index) => (
                    <div
                      key={index}
                      className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
                      onClick={() => sendQueryHistory(query)}
                    >
                      {query}
                    </div>
                  ))}
                </div>
              );
            });
          }

          return null;
        })}
      </div>
    </>
  );
};

export default HistoryBar;
