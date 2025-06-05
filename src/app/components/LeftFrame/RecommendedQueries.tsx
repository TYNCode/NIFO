import { useAppDispatch } from "../../redux/hooks";
import { setInputPrompt, setIsInputEmpty } from "../../redux/features/prompt/promptSlice";
import data from "../../data/recommendedQueries";

const RecommendedQueries: React.FC = () => {
  const dispatch = useAppDispatch();
  const sendRecommendationQuery = (item: any) => {
    dispatch(setInputPrompt(item.prompt));
    dispatch(setIsInputEmpty(false));
  };

  return (
    <div className="bg-[#EEF7FF]">
      <div className="mx-2 bg-white rounded-md">
        <div className="text-xs py-3 px-2 text-gray-400 font-semibold">
          Recommended Queries
        </div>
        <div className="">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis  whitespace-nowrap text-xs hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
                onClick={() => sendRecommendationQuery(item)}
              >
                {item.shortName}
              </div>
            );
          })}
        </div>
      </div>
     
    </div>
  );
};

export default RecommendedQueries;
