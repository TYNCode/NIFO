export const DateFilter = ({ dateFilter, setDateFilter }) => (
  <div className="flex gap-2 items-center">
    <label className="font-medium text-base">Joined date:</label>
    <select
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="border border-gray-300 rounded p-2"
    >
      <option value="all">All Dates</option>
      <option value="today">Today</option>
      <option value="this_week">This Week</option>
      <option value="this_month">This Month</option>
    </select>
  </div>
);
