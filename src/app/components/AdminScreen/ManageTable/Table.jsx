import { useTable } from "react-table";

export const Table = ({
  columns,
  data,
  onRowClick,
  isLoading,
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
}) => {
  return (
    <table
      {...getTableProps()}
      className="table-auto w-full border-collapse border border-gray-300"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="px-4 py-2 text-left text-gray-700 font-medium border-b border-gray-200"
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {isLoading ? (
          <TableLoader />
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-8 text-gray-500"
            >
              No data found
            </td>
          </tr>
        ) : (
          rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={(e) => onRowClick(row, e)}
                className="cursor-pointer hover:bg-gray-200 transition duration-200"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 text-gray-600 border-b border-gray-200"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};
