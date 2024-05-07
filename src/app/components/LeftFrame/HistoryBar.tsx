import axios from "axios";
import React, { useState, useEffect } from "react";

interface HistoryBarProps {
  onSelectHistory: (value: string) => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ onSelectHistory }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    handleQueryHistory();
  }, []);

  const sendQueryHistory = (value: string) => {
    onSelectHistory(value);
  };

  const handleQueryHistory = async () => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");

    if (jwtAccessToken) {
      const response = await axios.get(
        "https://theyellow.group/api/queryhistory/retrieve/",
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );
      const queries = response.data.map((item: any) => item.query);
      setHistoryData(queries);
    } else {
      console.error("JWT token not found in localStorage");
    }
  };

  return (
    <>
      <div className="text-sm py-3 px-2 text-gray-400 font-semibold">
        Query History
      </div>
      <div className="">
        {historyData.map((item, index) => {
          return (
            <div
              key={index}
              className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis  whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
              onClick={() => sendQueryHistory(item)}
            >
              {item}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HistoryBar;
