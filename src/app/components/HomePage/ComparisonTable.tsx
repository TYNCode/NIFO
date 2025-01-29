import React from "react";
import { useTable } from "react-table";

interface Startup {
  name: string;
  attributes: Record<string, string>;
  total_score: number;
}

interface ComparisonTableProps {
  data: Startup[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
    console.log("data in the comparison table", data)
  const columns = React.useMemo(
    () => [
      {
        Header: "Attributes",
        columns: [
          { Header: "Name", accessor: "name" },
          ...Object?.keys(data[0]?.attributes).map((key) => ({
            Header: key,
            accessor: `attributes.${key}`,
          })),
          { Header: "Total Score", accessor: "total_score" },
        ],
      },
    ],
    [data]
  );

  const tableData = React.useMemo(() => {
    return data.map((startup) => ({
      ...startup,
      ...startup.attributes,
    }));
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: tableData,
    });

  return (
    <div className="overflow-x-scroll w-[60vw] p-4">
      <table
        {...getTableProps()}
        className="table-auto w-full border-collapse border border-blue-300"
      >
        <thead className="bg-blue-100">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 border border-blue-300 text-blue-400 text-left text-sm font-medium"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100">
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 border border-gray-300 text-sm"
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
