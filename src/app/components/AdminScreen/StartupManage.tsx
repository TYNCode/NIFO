import React, { useState, useEffect } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const StartupManage = ({
  users,
  setUsers,
  isLoading,
  totalCount,
  currentPage,
  onPageChange,
}) => {
  const StartupUserData = users.filter((user) => !user.is_staff);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">
        Manage Startups Users
      </h2>
      <TableManage
        data={StartupUserData}
        title="Startups"
        entityName="Startups Users"
        setData={setUsers}
        userType="Startup"
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default StartupManage;
