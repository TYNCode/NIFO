import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  clearAgreementState,
  fetchGroupedAgreements,
  setSelectedAgreement,
  setAgreementModalOpen,
  setAgreementMode,
} from "../../../redux/features/admin/agreements/agreementSlice";
import {
  createAgreement,
  updateAgreement,
} from "../../../redux/features/admin/agreements/agreementSlice";
import GroupedAgreementTable from "./GroupedAgreementTable";
import { FilterDropdown } from "./FilterDropDown";
import { SearchBar } from "./Searchbar";
import AgreementModal from "./AgreeementModal";
import { toast } from "react-toastify";

const AgreementDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    groupedAgreements,
    agreements,
    loading,
    error,
    isModalOpen,
    selectedAgreement,
    mode,
  } = useAppSelector((state) => state.agreement);

  const [searchTerm, setSearchTerm] = useState("");
  const [ndaFilter, setNdaFilter] = useState<string | null>(null);
  const [raFilter, setRaFilter] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGroupedAgreements());
    return () => {
      dispatch(clearAgreementState());
    };
  }, [dispatch]);

  const handleEdit = (
    type: "NDA" | "RA",
    agreementId: number | null,
    startupId: number
  ) => {
    dispatch(setAgreementMode("edit"));
    dispatch(setSelectedAgreement({ type, agreementId, startupId }));
    dispatch(setAgreementModalOpen(true));
  };

  const handleAdd = () => {
    dispatch(setAgreementMode("create"));
    dispatch(setSelectedAgreement(null));
    dispatch(setAgreementModalOpen(true));
  };

  const filteredAgreements = groupedAgreements.filter((agreement) => {
    const matchSearch = agreement.startup_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchNda = ndaFilter ? agreement.nda?.status === ndaFilter : true;
    const matchRa = raFilter ? agreement.ra?.status === raFilter : true;
    return matchSearch && matchNda && matchRa;
  });

  const editingAgreement = agreements.find(
    (a) => a.id === selectedAgreement?.agreementId
  );

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === "edit" && selectedAgreement?.agreementId) {
        await dispatch(
          updateAgreement({
            id: selectedAgreement.agreementId,
            payload: formData,
          })
        ).unwrap();
        toast.success("Agreement updated");
      } else {
        await dispatch(createAgreement(formData)).unwrap();
        toast.success("Agreement created");
      }
      dispatch(setAgreementModalOpen(false));
      dispatch(fetchGroupedAgreements());
    } catch (err) {
      toast.error("Error submitting agreement");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">
          Agreements Dashboard
        </h2>
        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#005a9c] transition"
        >
          + Add Agreement
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar
          placeholder="Search startups..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterDropdown
          label="NDA Status"
          options={["draft", "discussion", "pending_sp", "signed"]}
          value={ndaFilter || ""}
          onChange={(val) => setNdaFilter(val || null)}
        />
        <FilterDropdown
          label="RA Status"
          options={["draft", "discussion", "pending_sp", "signed"]}
          value={raFilter || ""}
          onChange={(val) => setRaFilter(val || null)}
        />
      </div>

      {loading && <p className="text-gray-500">Loading agreements...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <GroupedAgreementTable
          agreements={filteredAgreements}
          onEdit={handleEdit}
        />
      )}

      {isModalOpen && (
        <AgreementModal
          open={isModalOpen}
          onClose={() => dispatch(setAgreementModalOpen(false))}
          onSubmit={handleSubmit}
          defaultValues={editingAgreement}
        />
      )}
    </div>
  );
};

export default AgreementDashboard;
