import React from "react";
import { Spotlight } from "../types/spotlights";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import DataTable, { AdminTableColumn } from "@/app/components/common/DataTable";

interface Props {
  spotlights: Spotlight[];
  onEdit: (spotlight: Spotlight) => void;
  onDelete: (id: number) => void;
}

const SpotlightTable: React.FC<Props> = ({ spotlights, onEdit, onDelete }) => {
  const columns: AdminTableColumn<Spotlight>[] = [
    {
      header: "Logo",
      accessor: "logo_url",
      render: (item) => (
        <img
          src={item.logo_url}
          alt="logo"
          className="h-8 w-8 rounded object-cover"
        />
      ),
    },
    {
      header: "Title",
      accessor: "spotlight_title",
      render: (item) => <span className="font-medium text-gray-800">{item.spotlight_title}</span>,
    },
    {
      header: "Week",
      accessor: "spotlight_week",
      render: (item) => <span className="text-sm">{item.spotlight_week}</span>,
    },
    {
      header: "Category",
      accessor: "spotlight_category",
      render: (item) => <span className="text-sm">{item.spotlight_category}</span>,
    },
    {
      header: "Startup ID",
      accessor: "spotlight_startup",
      render: (item) => <span className="text-sm">{item.spotlight_startup}</span>,
    },
    {
      header: "Sort Order",
      accessor: "sort_order",
      render: (item) => <span className="text-sm">{item.sort_order}</span>,
    },
    {
      header: "TYN Verified",
      accessor: "is_tyn_verified",
      render: (item) => (
        item.is_tyn_verified ? (
          <span className="text-green-600 font-bold text-lg">✔</span>
        ) : (
          <span className="text-gray-400 text-lg">✘</span>
        )
      ),
      className: "text-center"
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (item) => (
        <div className="space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="text-primary hover:text-blue-800"
            title="Edit"
          >
            <FaEdit className="inline" /> <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FaTrashAlt className="inline ml-2" /> <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={spotlights}
      rowKey={(item) => item.id}
      emptyMessage="No spotlights found"
    />
  );
};

export default SpotlightTable;
