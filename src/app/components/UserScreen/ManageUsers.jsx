import React, { useState, useEffect } from "react";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import TableManage from "../AdminScreen/TableManage";

const ManageUsers = ({
  users,
  setUsers,
  isLoading,
  totalCount,
  currentPage,
  onPageChange,
  userEmail,
}) => {
  const companyDomain = userEmail ? userEmail.split("@")[1] : "";

  const UsersData = users.filter(
    (user) => user.email.split("@")[1] === companyDomain
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">Manage Users</h2>
      <TableManage
        data={UsersData}
        title="Consultant"
        entityName="Consultant Users"
        setData={setUsers}
        userType="Consultant"
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ManageUsers;
