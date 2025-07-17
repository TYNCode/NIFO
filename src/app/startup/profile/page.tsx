"use client";

import React, { useState } from "react";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import { FaSave, FaBuilding, FaGlobe, FaEnvelope, FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../../redux/features/auth/userProfileSlice";

const StartupProfile: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.userProfile.data);
  const userProfileLoading = useAppSelector((state) => state.userProfile.loading);
  const userProfileError = useAppSelector((state) => state.userProfile.error);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) setEditData(userProfile);
  }, [userProfile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await dispatch(updateUserProfile(editData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userProfile);
    setIsEditing(false);
  };

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">View your company and personal information</p>
          </div>
          {!isEditing && (
            <button
              className="border border-[#0070C0] text-[#0070C0] px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Display profile info here (companyName, website, description, industry, country, email, phone, address) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {userProfileLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : userProfileError ? (
            <div className="text-red-500">{userProfileError}</div>
          ) : userProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">First Name</div>
                {isEditing ? (
                  <input
                    className="border rounded px-3 py-2 text-sm w-full"
                    name="first_name"
                    value={editData?.first_name || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  <div className="font-semibold text-lg">{userProfile.first_name}</div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                {isEditing ? (
                  <input
                    className="border rounded px-3 py-2 text-sm w-full"
                    name="email"
                    value={editData?.email || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  <div className="font-semibold text-lg">{userProfile.email}</div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Role</div>
                <div className="font-semibold text-lg">{userProfile.role}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Primary User</div>
                <div className="font-semibold text-lg">{userProfile.is_primary_user ? 'Yes' : 'No'}</div>
              </div>
              {/* Add more fields as needed */}
              {isEditing && (
                <div className="md:col-span-2 flex gap-3 mt-4">
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default StartupProfile; 