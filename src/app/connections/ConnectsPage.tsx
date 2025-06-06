"use client";

import React, { useEffect, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPartnerConnectsMade, fetchPartnerConnectsReceived } from "../redux/features/connection/connectionSlice";
import LeftFrame from "../components/LeftFrame/LeftFrame";
import MobileHeader from "../mobileComponents/MobileHeader";

const ConnectsPage = () => {
  const dispatch = useAppDispatch();
  const { connectionsMade, connectionsReceived, loading, error } = useAppSelector((state) => state.partnerConnect);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPartnerConnectsMade());
    dispatch(fetchPartnerConnectsReceived());
  }, [dispatch]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleOpenModal = (companyName: string) => {
    setSelectedCompany(companyName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCompany("");
  };

  return (
    <main className="flex flex-col w-full h-screen bg-[#F8FBFF]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <MobileHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />
      </div>

      <div className="flex flex-row w-full flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-[21%]">
          <LeftFrame />
        </div>

        {/* Mobile Sidebar */}
        <LeftFrame
          isMobile
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Connections</h1>
        <p className="text-gray-600 mb-8">Manage your engagement connections and requests</p>

        {/* Active Conversations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Conversations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500">
                <tr>
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Use Case</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {connectionsMade?.length > 0 ? (
                  connectionsMade.map((connection: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">{connection?.requested_org?.startup_name}</td>
                      <td className="px-4 py-3">{connection?.use_case || "N/A"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenModal(connection?.requested_org?.startup_name)}
                          className="flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          <FiMessageSquare size={16} />
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                      No active conversations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Connection Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Request</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500">
                <tr>
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Use Case</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {connectionsReceived?.length > 0 ? (
                  connectionsReceived.map((connection: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">{connection?.user?.organization?.startup_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            connection.request_status === "Accepted"
                              ? "bg-green-100 text-green-600"
                              : connection.request_status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {connection.request_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{connection?.use_case || "N/A"}</td>
                      <td className="px-4 py-3">{connection?.created_at?.split("T")[0]}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                      No connection requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">{selectedCompany}</h2>
            <div className="text-center text-gray-600">
              <p className="text-lg font-medium mb-2">Coming Soon 🚀</p>
              <p>Chat feature will be available soon.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ConnectsPage;
