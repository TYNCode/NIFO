import React, { useState, useMemo } from "react";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { subDays, startOfWeek, startOfMonth, isAfter } from "date-fns";
import { useTable, usePagination, useRowSelect } from "react-table";
import { TableLoader } from "./ManageTable/TableLoader";
import { ConfirmationModal } from "./ManageTable/ConfirmationModal.jsx";
import { UserDetailsModal } from "./ManageTable/UserDetailsModal";
import { Table } from "./ManageTable/Table";
import { Pagination } from "./ManageTable/Pagination";
import { EditUserForm } from "./ManageTable/EditUserForm";
import { UserDetails } from "./ManageTable/UserDetails";
import { SearchFilter } from "./ManageTable/SearchFilter";
import { DateFilter } from "./ManageTable/DateFilter";
import BulkDeleteButton from './ManageTable/BulkDeleteButton';

const TableMain = ({
  data,
  title,
  entityName,
  setData,
  userType,
  isLoading = false,
  totalCount,
  onPageChange,
  currentPage,
}) => {
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkConfirmation, setShowBulkConfirmation] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const applyDateFilter = (item) => {
    const today = new Date();
    const itemDate = new Date(item.date_joined);

    if (dateFilter === "today") {
      return itemDate.toDateString() === today.toDateString();
    } else if (dateFilter === "this_week") {
      return isAfter(itemDate, subDays(startOfWeek(today), 1));
    } else if (dateFilter === "this_month") {
      return isAfter(itemDate, startOfMonth(today));
    }
    return true;
  };

  const filteredData = useMemo(() => {
    return data
      .filter(
        (item) =>
          item.first_name.toLowerCase().includes(filter.toLowerCase()) ||
          item.email.toLowerCase().includes(filter.toLowerCase()) ||
          item.startup_name.toLowerCase().includes(filter.toLowerCase())
      )
      .filter(applyDateFilter);
  }, [filter, dateFilter, data]);

  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      { Header: "Name", accessor: "first_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Startup Name", accessor: "startup_name" },
      {
        Header: "Status",
        accessor: "is_active",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded ${value ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Primary User",
        accessor: "is_primary_user",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <MdOutlineEdit
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
              className="cursor-pointer text-2xl"
            />
            <MdOutlineDelete
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              className="cursor-pointer text-2xl"
            />
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: filteredData,
    },
    usePagination,
    useRowSelect
  );

  const handleEdit = (entity) => {
    setSelectedEntity(entity);
    setIsEditing(true);
  };

  const handleDelete = (entityId) => {
    setEntityToDelete(entityId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    const updatedData = data.filter((entity) => entity.id !== entityToDelete);
    setData(updatedData);
    setShowConfirmation(false);
    setEntityToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setEntityToDelete(null);
  };

  const handleBulkDelete = () => {
    setShowBulkConfirmation(true);
  };

  const confirmBulkDelete = () => {
    const selectedIds = selectedFlatRows.map((d) => d.original.id);
    const updatedData = data.filter((item) => !selectedIds.includes(item.id));
    setData(updatedData);
    setShowBulkConfirmation(false);
  };

  const cancelBulkDelete = () => {
    setShowBulkConfirmation(false);
  };

  const handleRowClick = (row, e) => {
    if (e.target.type !== "checkbox") {
      setSelectedEntity(row.original);
      setIsEditing(false);
    }
  };

  const handleSave = async (updatedUser) => {
    const apiUrl = `https://tyn-server.azurewebsites.net/adminroutes/api/users/${updatedUser.id}/`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedResponseData = await response.json();

      const formattedUser = {
        id: updatedResponseData.id,
        first_name: updatedResponseData.first_name,
        email: updatedResponseData.email,
        startup_name: updatedResponseData.organization?.startup_name || "N/A",
        is_active: updatedResponseData.is_active,
        is_primary_user: updatedResponseData.is_primary_user,
        date_joined: updatedResponseData.date_joined,
        is_staff: updatedResponseData.is_staff,
      };

      setData((prevData) =>
        prevData.map((user) =>
          user.id === formattedUser.id ? { ...user, ...formattedUser } : user
        )
      );

      setSelectedEntity(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update the user. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setSelectedEntity(null);
    setIsEditing(false);
  };

  const closeDetailsModal = () => {
    setSelectedEntity(null);
    setIsEditing(false);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-2 rounded-lg">
        <div className="w-full flex justify-between">
          <div className="mb-4 flex items-center space-x-4 justify-between w-full ">
            <SearchFilter
              filter={filter}
              setFilter={setFilter}
              placeholder={`Search by name, email, or ${userType}...`}
            />

            <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
          </div>
        </div>
        {selectedFlatRows.length > 0 && (
          <BulkDeleteButton
            handleBulkDelete={handleBulkDelete}
            selectedFlatRows={selectedFlatRows}
          />
        )}
        {isLoading ? (
          <TableLoader />
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {entityName.toLowerCase()} found
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredData}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            getTableProps={getTableProps}
            getTableBodyProps={getTableBodyProps}
            headerGroups={headerGroups}
            rows={rows}
            prepareRow={prepareRow}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => onPageChange(currentPage - 1)}
          onNext={() => onPageChange(currentPage + 1)}
          canPrevious={currentPage > 1}
          canNext={currentPage < totalPages}
        />
      </div>
      {selectedEntity && (
        <UserDetailsModal
          user={selectedEntity}
          isEditing={isEditing}
          onClose={closeDetailsModal}
        >
          {isEditing ? (
            <EditUserForm
              user={selectedEntity}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          ) : (
            <UserDetails user={selectedEntity} />
          )}
        </UserDetailsModal>
      )}
      <ConfirmationModal
        isOpen={showConfirmation}
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <ConfirmationModal
        isOpen={showBulkConfirmation}
        message="Are you sure you want to selected delete users?"
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
      />
    </div>
  );
};

export default TableMain;
