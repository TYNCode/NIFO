"use client";

import React, { useEffect } from "react";
import SpotlightTable from "./SpotlightTable";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchSpotlights,
  setSelectedSpotlight,
  setSpotlightModalOpen,
  deleteSpotlight,
  selectSpotlights,
  selectIsModalOpen,
} from "@/app/redux/features/spotlight/spotlightSlice";
import SpotlightModal from "./SpotlightModal";

const SpotlightDashboard = () => {
  const dispatch = useAppDispatch();
  const spotlights = useAppSelector(selectSpotlights);
  const isModalOpen = useAppSelector(selectIsModalOpen);

  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

  const handleEdit = (spotlight: any) => {
    dispatch(setSelectedSpotlight(spotlight));
    dispatch(setSpotlightModalOpen(true));
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this spotlight?")) {
      dispatch(deleteSpotlight(id));
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Spotlight Dashboard</h1>
        <button
          onClick={() => dispatch(setSpotlightModalOpen(true))}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Spotlight
        </button>
      </div>

      <SpotlightTable spotlights={spotlights} onEdit={handleEdit} onDelete={handleDelete} />

      {isModalOpen && <SpotlightModal />}
    </div>
  );
};

export default SpotlightDashboard;
