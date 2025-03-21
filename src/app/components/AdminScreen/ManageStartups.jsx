import React, { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { subDays, startOfWeek, startOfMonth, isAfter } from "date-fns";
import { SearchFilter } from "./ManageTable/SearchFilter";
import BulkDeleteButton from "./ManageTable/BulkDeleteButton";
import { EditStartupForm } from "./ManageTable/EditStartupForm";
import { StartupDetails } from "./ManageTable/StartupDetails";
import { ConfirmationModal } from "./ManageTable/ConfirmationModal";
import { UserDetailsModal } from "./ManageTable/UserDetailsModal";
import { Pagination } from "./ManageTable/Pagination";

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

const ManageStartups = ({
  data,
  entityName,
  setData,
  isLoading = false,
  totalCount,
  currentPage,
  onPageChange,
}) => {
  const [filter, setFilter] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkConfirmation, setShowBulkConfirmation] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const filteredData = useMemo(() => {
    console.log("Data=>", data[0]);
    return data.filter(
      (item) => item.startup_name.toLowerCase().includes(filter.toLowerCase())
      //   // item.startup_emails.toLowerCase().includes(filter.toLowerCase()) ||
      //   // item.startup_industry.toLowerCase().includes(filter.toLowerCase())
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
          <img
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
      initialState: { pageIndex: 0, pageSize: 10 },
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
    const apiUrl = `http://127.0.0.1:8000/adminroutes/api/startups/${updatedUser.startup_id}/`;
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
              <SearchFilter
                filter={filter}
                setFilter={setFilter}
                placeholder={`Search by startups Name, Industry, Technology`}
              />
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

          {/* {!isLoading && data.length > 0 && (
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
          )} */}

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
              <EditStartupForm
                startup={selectedEntity}
                onSave={handleSave}
                onCancel={handleCancelEdit}
              />
            ) : (
              <StartupDetails startup={selectedEntity} />
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
    </div>
  );
};

export default ManageStartups;
