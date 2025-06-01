import React from "react";
import { GroupedAgreement } from "../types/agreements";

interface Props {
  agreements: GroupedAgreement[];
  onEdit: (type: "NDA" | "RA", agreementId: number | null, startupId: number) => void;
}

const statusColors: Record<string, string> = {
  signed: "bg-green-100 text-green-700",
  draft: "bg-gray-200 text-gray-700",
  discussion: "bg-yellow-100 text-yellow-700",
  pending_sp: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-500",
};

const GroupedAgreementTable: React.FC<Props> = ({ agreements, onEdit }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-[#0070C0] text-white">
          <tr>
            <th className="p-3 text-left">Startup</th>
            <th className="p-3 text-left">NDA Status</th>
            <th className="p-3 text-left">NDA Dates</th>
            <th className="p-3 text-left">RA Status</th>
            <th className="p-3 text-left">RA Dates</th>
            <th className="p-3 text-left">Verified</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((item, index) => (
            <tr key={item.startup_id} className="bg-white border-t">
              <td className="p-3 flex items-center gap-2">
                <img
                  src={item.startup_logo}
                  alt="logo"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">
                  {item.startup_name}
                </span>
              </td>
              <td className="p-3">
                {item.nda ? (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      statusColors[item.nda.status] || statusColors.default
                    }`}
                  >
                    {item.nda.status === "discussion"
                      ? "In Discussion"
                      : item.nda.status.charAt(0).toUpperCase() + item.nda.status.slice(1)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">Not Created</span>
                )}
              </td>
              <td className="p-3">
                {item.nda?.start_date && item.nda?.end_date ? (
                  <div className="text-sm text-gray-700">
                    Start: {item.nda.start_date}
                    <br />
                    End: {item.nda.end_date}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>
              <td className="p-3">
                {item.ra ? (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      statusColors[item.ra.status] || statusColors.default
                    }`}
                  >
                    {item.ra.status === "discussion"
                      ? "In Discussion"
                      : item.ra.status.charAt(0).toUpperCase() + item.ra.status.slice(1)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">Not Created</span>
                )}
              </td>
              <td className="p-3">
                {item.ra?.start_date && item.ra?.end_date ? (
                  <div className="text-sm text-gray-700">
                    Start: {item.ra.start_date}
                    <br />
                    End: {item.ra.end_date}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>
              <td className="p-3 text-center">
                {item.is_verified ? (
                  <span className="text-green-600 font-bold text-lg">✔</span>
                ) : (
                  <span className="text-gray-400 text-lg">✘</span>
                )}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => onEdit("NDA", item.nda?.id || null, item.startup_id)}
                  className="text-[#0070C0] hover:underline text-sm font-medium"
                >
                  ✏️ NDA
                </button>
                <button
                  onClick={() => onEdit("RA", item.ra?.id || null, item.startup_id)}
                  className="text-[#0070C0] hover:underline text-sm font-medium"
                >
                  ✏️ RA
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupedAgreementTable;
