import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { subDays, startOfWeek, startOfMonth, isAfter } from "date-fns";

const TableLoader = () => (
  <div className="animate-pulse">
    {[...Array(10)].map((_, index) => (
      <div key={index} className="border-b border-gray-200 py-4">
        <div className="flex items-center space-x-4">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const TableManage = ({
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
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
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
    const apiUrl = `https://tyn-server.azurewebsites.net/api/adminroutes/api/users/${updatedUser.id}/`;

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
          <div className="mb-4 flex items-center space-x-4 justify-between w-full hidden">
            <div className="flex items-center justify-center border border-gray-300 rounded p-1 w-[40%]">
              <IoIosSearch className="pl-1 text-gray-500 text-2xl" />
              <input
                type="text"
                placeholder={`Search by name, email, or ${userType}...`}
                className="border-none focus:outline-none focus:ring-0 w-full"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className=" font-medium text-base">Joined date:</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded p-2"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>
          </div>
        </div>
        {selectedFlatRows.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Bulk Delete ({selectedFlatRows.length})
          </button>
        )}
        {isLoading ? (
          <TableLoader />
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {entityName.toLowerCase()} found
          </div>
        ) : (
          <table
            {...getTableProps()}
            className="table-auto w-full border-collapse border border-gray-300"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gray-100"
                >
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
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={(e) => handleRowClick(row, e)}
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
              })}
            </tbody>
          </table>
        )}

        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-4 p-1 bg-yellow-400 text-white rounded-full disabled:bg-gray-300"
          >
            <GrFormPrevious className="text-3xl" />
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-4 p-1 bg-yellow-400 text-white rounded-full disabled:bg-gray-300"
          >
            <MdOutlineNavigateNext className="text-3xl" />
          </button>
        </div>
      </div>

      {selectedEntity && (
        <div className="w-[30%] bg-white border border-gray-300 p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? `Edit User` : `User Details`}
            </h3>
            <button
              onClick={closeDetailsModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {isEditing ? (
            <EditUserForm
              user={selectedEntity}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          ) : (
            <UserDetails user={selectedEntity} />
          )}
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4">
              Are you sure you want to delete {selectedFlatRows.length} users?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelBulkDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDetails = ({ user }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      {user.first_name}
    </h3>
    <dl className="flex flex-col gap-4">
      <div>
        <dt className="font-bold text-gray-700">Email:</dt>
        <dd>
          <a
            href={`mailto:${user.email}`}
            className="text-blue-500 hover:underline"
          >
            {user.email}
          </a>
        </dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Startup Name:</dt>
        <dd className="text-gray-700">{user.startup_name}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Status:</dt>
        <dd className="text-gray-700">
          {user.is_active ? "Active" : "Inactive"}
        </dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Primary User:</dt>
        <dd className="text-gray-700">{user.is_primary_user ? "Yes" : "No"}</dd>
      </div>
    </dl>
  </div>
);

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditedUser({ ...editedUser, [e.target.name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(editedUser);
      }}
    >
      <input type="hidden" name="id" value={editedUser.id} />
      <div className="mb-4">
        <label
          htmlFor="first_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Name:
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={editedUser.first_name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={editedUser.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="startup_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Startup Name:
        </label>
        <input
          type="text"
          id="startup_name"
          name="startup_name"
          value={editedUser.startup_name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={editedUser.is_active}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-gray-700 font-bold">Active Status</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_primary_user"
            name="is_primary_user"
            checked={editedUser.is_primary_user}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-gray-700 font-bold">Primary User</span>
        </label>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TableManage;
