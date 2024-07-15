import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChevronLeft } from "react-icons/md";
import { IoChatbubbleOutline } from "react-icons/io5";

const HistoryMobile = () => {
  const [historyData, setHistoryData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (!jwtAccessToken) {
      setError("Authentication token not found.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://theyellow.group/api/queryhistory/retrieve/",
        {
          headers: { Authorization: `Bearer ${jwtAccessToken}` },
        }
      );
      setHistoryData(response.data);
    } catch (error) {
      console.error("Error fetching query history:", error);
      setError("Failed to fetch history.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="py-3 px-2 flex">
        <div>
          <MdChevronLeft size={28} />
        </div>
        <div className="text-blue-400 flex justify-center items-center italic text-xl font-semibold">
          Query History
        </div>
      </div>
      <div className="px-2">
        {Object.entries(historyData).map(
          ([timePeriod, queries]) =>
            Array.isArray(queries) &&
            queries.length > 0 && (
              <div key={timePeriod}>
                <div className="text-base py-2 px-2 text-gray-500 font-semibold">
                  {timePeriod}
                </div>
                {queries.map((query, index) => (
                  <div
                    key={index}
                    className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] flex gap-4  items-center hover:bg-red-500 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
                    onClick={() => console.log("Query clicked:", query)} // replace with actual function
                  >
                    <div className="text-gray-300">
                    <IoChatbubbleOutline size={22}/>
                    </div>

                    <div>
                    {query}
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
      </div>
    </>
  );
};

export default HistoryMobile;
