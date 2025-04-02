import { Dispatch, SetStateAction } from "react";
import data from "../../data/recommendedQueries";

interface RecommendedQueriesProps {
  setInputPrompt: Dispatch<SetStateAction<string>>;
  setIsInputEmpty: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecommendedQueries: React.FC<RecommendedQueriesProps> = ({
  setInputPrompt,
  setIsInputEmpty,
}) => {
  const sendRecommendationQuery = (item: any) => {
    setInputPrompt(item.prompt);
    setIsInputEmpty(false);
  };

  return (
    <>
      <div className="text-sm py-3 px-2 text-gray-400 font-semibold">
        Recommended Queries
      </div>
      <div className="">
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis  whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
              onClick={() => sendRecommendationQuery(item)}
            >
              {item.shortName}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RecommendedQueries;
