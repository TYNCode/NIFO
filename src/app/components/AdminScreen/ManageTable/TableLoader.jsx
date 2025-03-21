export const TableLoader = () => (
  <div className="animate-pulse">
    {[...Array(10)].map((_, index) => (
      <div key={index} className="border-b border-gray-200 py-4">
        <div className="flex items-center space-x-4">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
