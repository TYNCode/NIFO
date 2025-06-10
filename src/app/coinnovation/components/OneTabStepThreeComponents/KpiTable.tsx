import React from 'react';

interface KpiTableProps {
  kpiTable: Record<string, any>;
  isEditing: boolean;
  onAddRow: () => void;
  onToggleEdit: () => void;
  onCellChange: (rowIndex: number, columnKey: string, value: string) => void;
}

const KpiTable: React.FC<KpiTableProps> = ({
  kpiTable,
  isEditing,
  onAddRow,
  onToggleEdit,
  onCellChange
}) => {
  const metricKeys = Object.keys(kpiTable);
  const rows = kpiTable["Operational KPI Metrics"] || [];

  return (
    <div className="flex flex-col gap-4 bg-white rounded-[8px] p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="text-[14px] font-semibold text-[#354052]">
          Operational KPI Metrics
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              onToggleEdit();
            } else {
              onAddRow();
              onToggleEdit();
            }
          }}
          className="bg-[#2286C0] text-white text-[12px] px-3 py-2 rounded-md w-full sm:w-auto"
        >
          {isEditing ? "Save" : "Add Row / Edit"}
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {rows.map((_, rowIndex) => (
          <div key={rowIndex} className="bg-gray-50 rounded-lg p-3 mb-3 border border-[#E1E1E1]">
            {metricKeys.map((key, colIndex) => (
              <div key={colIndex} className="flex flex-col mb-2 last:mb-0">
                <div className="text-[10px] font-semibold text-[#534D59] mb-1">
                  {key}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={kpiTable[key][rowIndex] || ""}
                    onChange={(e) => onCellChange(rowIndex, key, e.target.value)}
                    className="w-full text-[12px] text-[#1B2128] border border-[#D1D1D1] rounded px-2 py-1"
                  />
                ) : (
                  <div className="text-[12px] text-[#1B2128] min-h-[20px]">
                    {kpiTable[key][rowIndex] || ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex flex-col border border-[#E1E1E1] rounded-[8px] min-w-[800px]">
          <div className="grid grid-cols-5 text-[12px] font-semibold text-[#534D59] border-b border-[#E1E1E1] items-center">
            {metricKeys.map((key, index) => (
              <div key={index} className="px-4 py-3 break-words">
                {key}
              </div>
            ))}
          </div>

          {rows.map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 border-b border-[#E1E1E1] items-center">
              {metricKeys.map((key, colIndex) => (
                <div key={colIndex} className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={kpiTable[key][rowIndex] || ""}
                      onChange={(e) => onCellChange(rowIndex, key, e.target.value)}
                      className="w-full text-[12px] text-[#1B2128] border border-[#D1D1D1] rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-[12px] text-[#1B2128]">
                      {kpiTable[key][rowIndex] || ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KpiTable;