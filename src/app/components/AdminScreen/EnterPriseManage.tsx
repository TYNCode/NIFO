import React, { useState, useEffect } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import TableMain from "./TableMain";

const EnterPriseManage = ({
  users,
  setUsers,
  isLoading,
  totalCount,
  currentPage,
  onPageChange,
}) => {
  const EnterpriseUserData = users.filter((user) => !user.is_staff);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">
        Manage EnterPrise Users
      </h2>
      <TableMain
        data={EnterpriseUserData}
        title="EnterPrise"
        entityName="EnterPrises Users"
        setData={setUsers}
        userType="Enterprise"
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default EnterPriseManage;
