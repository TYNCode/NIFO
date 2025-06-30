import React from "react";
import { useTable } from "react-table";

interface Startup {
  name: string;
  [key: string]: any;
}

interface RecommendationSummary {
  best_fit: string;
  reason: string;
  situational_recommendations: {
    startup: string;
    best_for: string;
  }[];
}

interface ComparisonTableProps {
  data: Startup[];
  intentType: string;
  recommendation_summary?: RecommendationSummary;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  data,
  recommendation_summary,
  intentType,
}) => {
  const attributeKeys = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key !== "name");
  }, [data]);

  const columns = React.useMemo(
    () => [
      { Header: "Startup", accessor: "name" },
      ...attributeKeys.map((key) => ({
        Header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        accessor: key,
      })),
    ],
    [attributeKeys]
  );

  const tableData = React.useMemo(() => {
    return data?.map((startup) => {
      const row: Record<string, string> = { name: startup.name };
      attributeKeys.forEach((key) => {
        const value = startup[key];
        if (Array.isArray(value)) {
          row[key] = value.join(", ");
        } else if (typeof value === "object" && value !== null) {
          row[key] = JSON.stringify(value);
        } else {
          row[key] = value || "N/A";
        }
      });
      return row;
    });
  }, [data, attributeKeys]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  // Find the best fit startup name for highlighting
  const bestFitName = recommendation_summary?.best_fit;

  if (intentType === "compare_startups" && data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No data available for comparison.
      </p>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Table */}
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="table-auto w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-[#2286C0]"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-4 py-3 text-white text-left text-sm font-semibold border-b border-[#2286C0] first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                const isBestFit = bestFitName && row.original.name === bestFitName;
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`border-b border-gray-200 transition duration-200 
                      ${isBestFit ? "bg-[#FFF9E5] font-bold text-[#B8860B]" : rowIndex % 2 === 0 ? "bg-[#EEF7FF]" : "bg-white"}
                      ${rowIndex === 0 ? "first:rounded-tl-xl first:rounded-tr-xl" : ""}
                    `}
                    style={isBestFit ? { borderLeft: '6px solid #FFD600' } : { borderLeft: '4px solid #2286C0' }}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-3 text-sm text-left align-top border-b border-gray-100"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Recommendation Summary */}
      {recommendation_summary && (
        <div className="mt-8 bg-[#EEF7FF] border-l-4 border-[#2286C0] p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold text-[#2286C0] mb-2">
            Recommendation Summary
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            <strong className="text-[#FFD600]">Best Fit:</strong>{" "}
            <span className="text-[#2286C0] font-semibold">
              {recommendation_summary.best_fit}
            </span>{" "}
            — {recommendation_summary.reason}
          </p>
          <div>
            <h4 className="font-semibold text-[#2286C0] mb-1">
              Situational Recommendations:
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {recommendation_summary.situational_recommendations.map(
                (item, idx) => (
                  <li key={idx}>
                    <strong>{item.startup}</strong>: {item.best_for}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
