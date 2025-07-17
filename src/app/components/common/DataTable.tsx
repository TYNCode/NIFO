import React from 'react';

export interface AdminTableColumn<T> {
  header: string;
  accessor: keyof T | string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
}

function AdminTable<T>({ columns, data, loading, emptyMessage, rowKey }: AdminTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-primary">
          <thead>
            <tr className="bg-primary text-white">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={
                    col.className ||
                    'px-6 py-4 text-left text-xs font-medium text-customBlack uppercase tracking-wider'
                  }
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <span className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full"></span>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-customBlack">{emptyMessage || 'No data found'}</h3>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-gray-50 transition-colors duration-200">
                  {columns.map((col) => (
                    <td key={col.header} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable; 