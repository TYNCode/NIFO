// src/app/admin/layout.tsx
import React from "react";
import Sidebar from "./components/Sidebar";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
         {/* <div><NavbarTrend/></div> */}
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
