import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { subDays, startOfWeek, startOfMonth, isAfter } from "date-fns";
import Image from "next/image";

const TableLoader = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, index) => (
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

const ManageStartups = ({ data, entityName, setData, isLoading = false }) => {
  const [filter, setFilter] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkConfirmation, setShowBulkConfirmation] = useState(false);

  const filteredData = useMemo(() => {
    console.log(data[0]);
    return data.filter(
      (item) => item.startup_name.toLowerCase().includes(filter.toLowerCase())
      // item.startup_emails.toLowerCase().includes(filter.toLowerCase()) ||
      // item.startup_industry.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, data]);

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
      {
        Header: "Startup Logo",
        accessor: "startup_logo",
        Cell: ({ value }) => (
          <Image
            src={value}
            alt="Startup Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
        ),
      },
      { Header: "Startup Name", accessor: "startup_name" },
      {
        Header: "Website",
        accessor: "startup_url",
        Cell: ({ value }) => (
          <a
            href={`https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {value}
          </a>
        ),
      },
      { Header: "Industry", accessor: "startup_industry" },
      { Header: "Technology", accessor: "startup_technology" },
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
                handleDelete(row.original.startup_id);
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
    prepareRow,
    page, // ✅ Correct: Now using 'page' instead of 'rows'
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex }, // ✅ Correct: pageIndex is inside 'state'
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 5 }, // ✅ Fix: Correctly setting page size
    },
    usePagination, // ✅ Ensure pagination is properly added
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
    const updatedData = data.filter(
      (entity) => entity.startup_id !== entityToDelete
    );
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
    const selectedIds = selectedFlatRows.map((d) => d.original.startup_id);
    const updatedData = data.filter(
      (item) => !selectedIds.includes(item.startup_id)
    );
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
    const apiUrl = `https://tyn-server.azurewebsites.net/adminroutes/api/startups/${updatedUser.startup_id}/`;
    const { startup_url, startup_name, ...filteredUser } = updatedUser;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredUser),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedResponseData = await response.json();

      const formattedStartup = {
        startup_id: updatedResponseData.startup_id,
        startup_name: updatedResponseData.startup_name,
        startup_url: updatedResponseData.startup_url,
        startup_industry: updatedResponseData.startup_industry,
        startup_technology: updatedResponseData.startup_technology,
        startup_company_stage: updatedResponseData.startup_company_stage,
        startup_country: updatedResponseData.startup_country,
        startup_founders_info: updatedResponseData.startup_founders_info,
        startup_emails: updatedResponseData.startup_emails,
        startup_usecases: updatedResponseData.startup_usecases,
        startup_solutions: updatedResponseData.startup_solutions,
        startup_overview: updatedResponseData.startup_overview,
        startup_description: updatedResponseData.startup_description,
      };

      setData((prevData) =>
        prevData.map((user) =>
          user.startup_id === formattedStartup.startup_id
            ? { ...user, ...formattedStartup }
            : user
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">Manage Startups</h2>
      <div className="flex h-full">
        <div className="flex-1 p-2 rounded-lg">
          <div className="w-full flex justify-between">
            <div className="mb-4 flex items-center space-x-4 justify-between w-full">
              <div className="flex items-center justify-center border border-gray-300 rounded p-1 w-[40%]">
                <IoIosSearch className="pl-1 text-gray-500 text-2xl" />
                <input
                  type="text"
                  placeholder={`Search by startups Name`}
                  className="border-none focus:outline-none focus:ring-0 w-full"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
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

          {!isLoading && data.length > 0 && (
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={previousPage}
                disabled={!canPreviousPage}
                className="mr-4 p-1 bg-yellow-400 text-white rounded-full disabled:bg-gray-300"
              >
                <GrFormPrevious className="text-3xl" />
              </button>
              <span className="text-gray-600">
                Page {pageIndex + 1} of {pageOptions.length}
              </span>
              <button
                onClick={nextPage}
                disabled={!canNextPage}
                className="ml-4 p-1 bg-yellow-400 text-white rounded-full disabled:bg-gray-300"
              >
                <MdOutlineNavigateNext className="text-3xl" />
              </button>
            </div>
          )}
        </div>

        {selectedEntity && (
          <div className="w-[30%] bg-white border border-gray-300 p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? `Edit Startup` : `Startup Details`}
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
              <EditStartupForm
                startup={selectedEntity}
                onSave={handleSave}
                onCancel={handleCancelEdit}
              />
            ) : (
              <StartupDetails startup={selectedEntity} />
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
    </div>
  );
};

const StartupDetails = ({ startup }) => (
  <div className="p-2 ">
    {/* Startup Logo and Name */}
    <div className="flex items-center space-x-4 mb-4">
      <Image
        src={startup.startup_logo}
        alt={`${startup.startup_name} Logo`}
        className="w-16 h-16 rounded-full object-cover"
      />
      <h3 className="text-2xl font-semibold text-gray-800">
        {startup.startup_name}
      </h3>
    </div>

    {/* Startup Details */}
    <dl className="flex flex-col gap-3">
      <div>
        <dt className="font-bold text-gray-700">Website:</dt>
        <dd>
          <a
            href={`https://${startup.startup_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {startup.startup_url}
          </a>
        </dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Industry:</dt>
        <dd className="text-gray-700">{startup.startup_industry}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Technology:</dt>
        <dd className="text-gray-700">{startup.startup_technology}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Company Stage:</dt>
        <dd className="text-gray-700">{startup.startup_company_stage}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Country:</dt>
        <dd className="text-gray-700">{startup.startup_country}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Founder(s):</dt>
        <dd className="text-gray-700">{startup.startup_founders_info}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Email:</dt>
        <dd>
          <a
            href={`mailto:${startup.startup_emails}`}
            className="text-blue-500 hover:underline"
          >
            {startup.startup_emails}
          </a>
        </dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Use Cases:</dt>
        <dd className="text-gray-700">{startup.startup_usecases}</dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Solutions:</dt>
        <dd className="text-gray-700">{startup.startup_solutions}</dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Overview:</dt>
        <dd className="text-gray-700">{startup.startup_overview}</dd>
      </div>

      <div className="">
        <dt className="font-bold text-gray-700">Description:</dt>
        <dd className="text-gray-700">{startup.startup_description}</dd>
      </div>
    </dl>
  </div>
);

const EditStartupForm = ({ startup, onSave, onCancel }) => {
  const [editedStartup, setEditedStartup] = useState({ ...startup });

  const handleChange = (e) => {
    setEditedStartup({ ...editedStartup, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(editedStartup);
      }}
      className="p-3 "
    >
      <input type="hidden" name="startup_id" value={editedStartup.startup_id} />

      {/* Startup Name */}
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
          value={editedStartup.startup_name}
          className="border border-gray-300 p-2 w-full rounded bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Website */}
      <div className="mb-4">
        <label
          htmlFor="startup_url"
          className="block text-gray-700 font-bold mb-2"
        >
          Website:
        </label>
        <input
          type="text"
          id="startup_url"
          name="startup_url"
          value={editedStartup.startup_url}
          className="border border-gray-300 p-2 w-full rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Industry */}
      <div className="mb-4">
        <label
          htmlFor="startup_industry"
          className="block text-gray-700 font-bold mb-2"
        >
          Industry:
        </label>
        <input
          type="text"
          id="startup_industry"
          name="startup_industry"
          value={editedStartup.startup_industry}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Technology */}
      <div className="mb-4">
        <label
          htmlFor="startup_technology"
          className="block text-gray-700 font-bold mb-2"
        >
          Technology:
        </label>
        <input
          type="text"
          id="startup_technology"
          name="startup_technology"
          value={editedStartup.startup_technology}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Company Stage */}
      <div className="mb-4">
        <label
          htmlFor="startup_company_stage"
          className="block text-gray-700 font-bold mb-2"
        >
          Company Stage:
        </label>
        <input
          type="text"
          id="startup_company_stage"
          name="startup_company_stage"
          value={editedStartup.startup_company_stage}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Country */}
      <div className="mb-4">
        <label
          htmlFor="startup_country"
          className="block text-gray-700 font-bold mb-2"
        >
          Country:
        </label>
        <input
          type="text"
          id="startup_country"
          name="startup_country"
          value={editedStartup.startup_country}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Founders Info */}
      <div className="mb-4">
        <label
          htmlFor="startup_founders_info"
          className="block text-gray-700 font-bold mb-2"
        >
          Founder(s):
        </label>
        <input
          type="text"
          id="startup_founders_info"
          name="startup_founders_info"
          value={editedStartup.startup_founders_info}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="startup_emails"
          className="block text-gray-700 font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="startup_emails"
          name="startup_emails"
          value={editedStartup.startup_emails}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Use Cases */}
      <div className="mb-4">
        <label
          htmlFor="startup_usecases"
          className="block text-gray-700 font-bold mb-2"
        >
          Use Cases:
        </label>
        <textarea
          id="startup_usecases"
          name="startup_usecases"
          value={editedStartup.startup_usecases}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Solutions */}
      <div className="mb-4">
        <label
          htmlFor="startup_solutions"
          className="block text-gray-700 font-bold mb-2"
        >
          Solutions:
        </label>
        <textarea
          id="startup_solutions"
          name="startup_solutions"
          value={editedStartup.startup_solutions}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Overview */}
      <div className="mb-4">
        <label
          htmlFor="startup_overview"
          className="block text-gray-700 font-bold mb-2"
        >
          Overview:
        </label>
        <textarea
          id="startup_overview"
          name="startup_overview"
          value={editedStartup.startup_overview}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="startup_description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description:
        </label>
        <textarea
          id="startup_description"
          name="startup_description"
          value={editedStartup.startup_description}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Form Actions */}
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

export default ManageStartups;
