import React from "react";
import { Spotlight } from "../types/spotlights";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

interface Props {
  spotlights: Spotlight[];
  onEdit: (spotlight: Spotlight) => void;
  onDelete: (id: number) => void;
}

const SpotlightTable: React.FC<Props> = ({ spotlights, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-[#0070C0] text-white">
          <tr>
            <th className="p-3 text-left">Logo</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Week</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Startup ID</th>
            <th className="p-3 text-left">Sort Order</th>
            <th className="p-3 text-center">TYN Verified</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {spotlights.map((item) => (
            <tr key={item.id} className="bg-white border-t">
              <td className="p-3">
                <img
                  src={item.logo_url}
                  alt="logo"
                  className="h-8 w-8 rounded object-cover"
                />
              </td>
              <td className="p-3 font-medium text-gray-800">
                {item.spotlight_title}
              </td>
              <td className="p-3 text-sm">{item.spotlight_week}</td>
              <td className="p-3 text-sm">{item.spotlight_category}</td>
              <td className="p-3 text-sm">{item.spotlight_startup}</td>
              <td className="p-3 text-sm">{item.sort_order}</td>
              <td className="p-3 text-center">
                {item.is_tyn_verified ? (
                  <span className="text-green-600 font-bold text-lg">✔</span>
                ) : (
                  <span className="text-gray-400 text-lg">✘</span>
                )}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-[#0070C0] hover:text-blue-800"
                  title="Edit"
                >
                  <FaEdit className="inline" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrashAlt className="inline ml-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpotlightTable;
