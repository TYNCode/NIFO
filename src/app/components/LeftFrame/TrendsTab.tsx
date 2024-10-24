import { useRouter } from "next/navigation";
import React from "react";

const TrendsTab = () => {
  const router = useRouter()
  const handleTryTrends = () => {
   router.push('/trends')
  }
  return (
    <div>
      <div className="text-sm py-3 px-2 text-gray-400 font-semibold">
        Trends
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-max rounded-lg cursor-pointer bg-yellow-400 px-2 py-2 text-white my-3" onClick={handleTryTrends}>
          <div>Try trends</div>
        </div>

        <div className="mx-2">
          Explore emerging industry innovations and the startups leading them.
          Identify new technologies shaping sectors like healthcare, finance,
          and more. Get insights into how these advancements can solve
          real-world challenges in your business.
        </div>
      </div>
    </div>
  );
};

export default TrendsTab;
