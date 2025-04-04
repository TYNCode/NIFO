// src/components/KpiTable.tsx
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

  return (
    <div className="flex flex-col gap-4 bg-white rounded-[8px] px-4 py-4">
      <div className="flex justify-between items-center">
        <div className="text-[14px] font-semibold text-[#354052]">Operational KPI Metrics</div>
        <button
          onClick={() => {
            if (isEditing) {
              onToggleEdit();
            } else {
              onAddRow();
              onToggleEdit();
            }
          }}
          className="bg-[#2286C0] text-white text-[12px] px-3 py-1 rounded-md"
        >
          {isEditing ? "Save" : "Add Row / Edit"}
        </button>
      </div>

      <div className="flex flex-col border border-[#E1E1E1] rounded-[8px]">
        <div className="grid grid-cols-5 text-[12px] font-semibold text-[#534D59] border-b border-[#E1E1E1] items-center">
          {metricKeys.map((key, index) => (
            <div key={index} className="px-4 py-3">
              {key}
            </div>
          ))}
        </div>

        {kpiTable["Operational KPI Metrics"]?.map((_, rowIndex) => (
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
  );
};

export default KpiTable;