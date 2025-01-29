import React, { useState, useEffect } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const ConsultantManage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        const cachedData = localStorage.getItem("Consultant");
        const cacheTimestamp = localStorage.getItem("ConsultantTimestamp");

        const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
        const now = new Date().getTime();

        if (cacheTimestamp && now - parseInt(cacheTimestamp) > ONE_HOUR) {
          clearCache();
        }

        if (
          cachedData &&
          cacheTimestamp &&
          now - parseInt(cacheTimestamp) < ONE_HOUR
        ) {
          setUsers(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/adminroutes/api/users/"
        );
        const data = await response.json();

        const formattedData = data
          .filter((user) => user.is_staff)
          .map((user) => ({
            id: user.id,
            first_name: user.first_name || "N/A",
            email: user.email,
            startup_name: user.organization?.startup_name || "N/A",
            is_active: user.is_active,
            is_primary_user: user.is_primary_user,
            is_staff: user.is_staff,
          }));

        console.log(formattedData);
        localStorage.setItem("Consultant", JSON.stringify(formattedData));
        localStorage.setItem("ConsultantTimestamp", now.toString());
        setUsers(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const clearCache = () => {
    localStorage.removeItem("Consultant");
    localStorage.removeItem("ConsultantTimestamp");
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">
        Manage Consultant Users
      </h2>
      <TableManage
        data={users}
        title="Consultant"
        entityName="Consultant"
        setData={setUsers}
        userType="Consultant"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ConsultantManage;
