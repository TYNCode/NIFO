import React, { useState, useMemo } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const TableManage = ({ data, title, entityName, setData }) => {
  const [filter, setFilter] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkConfirmation, setShowBulkConfirmation] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
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
      { Header: "Name", accessor: "name" },
      {
        Header: "URL",
        accessor: "url",
        Cell: ({ value }) => (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {value}
          </a>
        ),
      },
      { Header: "Rating", accessor: "rating" },
      { Header: "Industry", accessor: "industry" },
      { Header: "Country", accessor: "country" },
      { Header: "Stage", accessor: "stage" },
      {
        Header: "Verified",
        accessor: "isVerified",
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
    getToggleAllRowsSelectedProps,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageSize: 5 },
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

  const handleSave = (updatedStartup) => {
    const updatedData = data.map((startup) =>
      startup.id === updatedStartup.id ? updatedStartup : startup
    );
    setData(updatedData);
    setSelectedEntity(null);
    setIsEditing(false);
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
      <div className="flex-1 p-2 rounded-lg ">
        <div className="w-full flex justify-between">
          {selectedFlatRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
              Bulk Delete ({selectedFlatRows.length})
            </button>
          )}
          <div className="flex items-center justify-center border border-gray-300 rounded mb-4 p-1 w-auto">
            <IoIosSearch className="pl-1 text-gray-500 text-2xl" />
            <input
              type="text"
              placeholder="Search by name..."
              className="border-none  focus:outline-none focus:ring-0"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

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
            className="ml-4 p-1 bg-yellow-400  text-white rounded-full disabled:bg-gray-300"
          >
            <MdOutlineNavigateNext className="text-3xl" />
          </button>
        </div>
      </div>

      {selectedEntity && (
        <div className="w-1/3 bg-white border border-gray-300 p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? `Edit ${entityName}` : `${entityName} Details`}
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
            <EditEntityForm
              entity={selectedEntity}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          ) : (
            <EntityDetails entity={selectedEntity} />
          )}
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4">
              Are you sure you want to delete this {entityName.toLowerCase()}?
            </p>
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
              Are you sure you want to delete {selectedFlatRows.length}{" "}
              {entityName.toLowerCase()}s?
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

const EntityDetails = ({ entity }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{entity.name}</h3>
    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
      <dt className="font-medium text-gray-700">URL:</dt>
      <dd>
        <a
          href={entity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {entity.url}
        </a>
      </dd>
      <dt className="font-medium text-gray-700">Rating:</dt>
      <dd className="text-gray-700">{entity.rating}</dd>
      <dt className="font-medium text-gray-700">Industry:</dt>
      <dd className="text-gray-700">{entity.industry}</dd>
      <dt className="font-medium text-gray-700">Country:</dt>
      <dd className="text-gray-700">{entity.country}</dd>
      <dt className="font-medium text-gray-700">Stage:</dt>
      <dd className="text-gray-700">{entity.stage}</dd>
      <dt className="font-medium text-gray-700">Verified:</dt>
      <dd className="text-gray-700">{entity.isVerified ? "Yes" : "No"}</dd>
      <dt className="font-medium text-gray-700">Description:</dt>
      <dd className="text-gray-700">{entity.description}</dd>
      <dt className="font-medium text-gray-700">Founders:</dt>
      <dd className="text-gray-700">{entity.founders}</dd>
      <dt className="font-medium text-gray-700">Email:</dt>
      <dd>
        <a
          href={`mailto:${entity.email}`}
          className="text-blue-500 hover:underline"
        >
          {entity.email}
        </a>
      </dd>
    </dl>
  </div>
);

const EditEntityForm = ({ entity, onSave, onCancel }) => {
  const [editedEntity, setEditedEntity] = useState({ ...entity });

  const handleChange = (e) => {
    setEditedEntity({ ...editedEntity, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(editedEntity);
      }}
    >
      <input type="hidden" name="id" value={editedEntity.id} />
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={editedEntity.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="url" className="block text-gray-700 font-bold mb-2">
          URL:
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={editedEntity.url}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="rating" className="block text-gray-700 font-bold mb-2">
          Rating:
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={editedEntity.rating}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="industry"
          className="block text-gray-700 font-bold mb-2"
        >
          Industry:
        </label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={editedEntity.industry}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="country" className="block text-gray-700 font-bold mb-2">
          Country:
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={editedEntity.country}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="stage" className="block text-gray-700 font-bold mb-2">
          Stage:
        </label>
        <input
          type="text"
          id="stage"
          name="stage"
          value={editedEntity.stage}
          onChange={handleChange}
          className="border border-gray-300p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={editedEntity.description}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="founders"
          className="block text-gray-700 font-bold mb-2"
        >
          Founders:
        </label>
        <input
          type="text"
          id="founders"
          name="founders"
          value={editedEntity.founders}
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
          value={editedEntity.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
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
