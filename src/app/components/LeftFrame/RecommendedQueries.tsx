import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchRecommendedQueries } from "../../redux/features/recommendedQueriesSlice";
import { setInputPrompt, setIsInputEmpty } from "../../redux/features/prompt/promptSlice";

const RecommendedQueries: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.recommendedQueries);

  useEffect(() => {
    dispatch(fetchRecommendedQueries());
  }, [dispatch]);

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
        {loading ? (
          <div className="text-center text-xs text-gray-400 py-2">Loading...</div>
        ) : error ? (
          <div className="text-center text-xs text-red-400 py-2">{error}</div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-2">No recommended queries found.</div>
        ) : (
          <div className="max-h-44 overflow-y-auto pr-1">
            {data.map((item: any, index: number) => (
              <div
                key={item.id || index}
                className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis  whitespace-nowrap text-xs hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
                onClick={() => sendRecommendationQuery(item)}
              >
                {item.short_name || item.shortName || "Untitled"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedQueries;
