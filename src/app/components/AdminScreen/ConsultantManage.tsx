import React, { useState, useEffect } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import TableMain from "./TableMain";

const ConsultantManage = ({
  ConsultantData,
  setUsers,
  isLoading,
  totalCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">
        Manage Consultant Users
      </h2>
      <TableMain
        data={ConsultantData}
        title="Users"
        entityName="Users"
        setData={setUsers}
        userType="Users"
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ConsultantManage;
