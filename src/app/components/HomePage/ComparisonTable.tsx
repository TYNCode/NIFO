import React from "react";
import { useTable } from "react-table";

interface Startup {
  name: string;
  attributes: Record<string, { answer: string; score: string }>;
}

interface ComparisonTableProps {
  data: Startup[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  console.log("Data in the comparison table", data);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-4">No data available for comparison.</p>;
  }

  // Extract all unique attribute names (used as columns)
  const attributeKeys = Object.keys(data[0]?.attributes || {});

  // Generate table columns dynamically (First column for Startup Name, others for attributes)
  const columns = React.useMemo(
    () => [
      { Header: "Startup", accessor: "name" },
      ...attributeKeys.map((key) => ({
        Header: key,
        accessor: key,
      })),
    ],
    [data]
  );

  // Format data so each startup is a row and attributes are columns
  const tableData = React.useMemo(() => {
    return data.map((startup) => {
      const row: Record<string, string | JSX.Element> = { name: startup.name };

      attributeKeys.forEach((attribute) => {
        const attrData = startup.attributes[attribute] || { answer: "N/A", score: "0 out of 3" };
        const score = parseInt(attrData.score.split(" ")[0]); // Extract score (e.g., "3 out of 3" -> 3)

        row[attribute] = (
          <div className="relative flex items-center justify-center group">
            {/* Render stars based on score */}
            <span className="text-yellow-500 text-lg">
              {"★".repeat(score)}
              {"☆".repeat(3 - score)}
            </span>

            {/* Tooltip with explanation on hover */}
            <div className="absolute w-[200px] bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg opacity-0 transition-opacity duration-300 transform -translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 z-50">
              {attrData.answer}
            </div>
          </div>
        );
      });

      return row;
    });
  }, [data]);

  // Initialize table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  return (
    <div className="overflow-x-auto w-full p-4">
      <table
        {...getTableProps()}
        className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg"
      >
        <thead className="bg-blue-100">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="border-b border-gray-300">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-3 border border-gray-300 text-blue-600 text-left text-sm font-semibold"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white">
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`border-b border-gray-300 ${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition duration-200`}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-3 border border-gray-300 text-sm text-center"
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
  );
};

export default ComparisonTable;
