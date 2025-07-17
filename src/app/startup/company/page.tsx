"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import {
  fetchMyStartupCompany,
  updateCompanyById,
} from "../../redux/features/companyprofile/companyProfileSlice";

const CompanyInfoPage: React.FC = () => {
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state: RootState) => state.companyProfile);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    dispatch(fetchMyStartupCompany() as any);
  }, [dispatch]);

  useEffect(() => {
    if (company) setForm(company);
    // Debug: log company data
    // eslint-disable-next-line no-console
    console.log("Company Redux State:", company);
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateCompanyById({ id: form.startup_id, data: form }) as any).then(() => setEditMode(false));
  };

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-100">
          <h1 className="text-2xl font-bold mb-4">Company Information</h1>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-600">Error: {error}</div>
          ) : !company ? (
            <div className="text-gray-500">No company data found.</div>
          ) : editMode ? (
            <>
              <label className="block mb-2">Name
                <input className="w-full border p-2 mb-4" name="startup_name" value={form.startup_name || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Analyst Rating
                <input className="w-full border p-2 mb-4" name="startup_analyst_rating" value={form.startup_analyst_rating || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Industry
                <input className="w-full border p-2 mb-4" name="startup_industry" value={form.startup_industry || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Technology
                <input className="w-full border p-2 mb-4" name="startup_technology" value={form.startup_technology || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Overview
                <textarea className="w-full border p-2 mb-4" name="startup_overview" value={form.startup_overview || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Description
                <textarea className="w-full border p-2 mb-4" name="startup_description" value={form.startup_description || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Stage
                <input className="w-full border p-2 mb-4" name="startup_company_stage" value={form.startup_company_stage || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Country
                <input className="w-full border p-2 mb-4" name="startup_country" value={form.startup_country || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Founders
                <input className="w-full border p-2 mb-4" name="startup_founders_info" value={form.startup_founders_info || ''} onChange={handleChange} />
              </label>
              <label className="block mb-2">Contact
                <input className="w-full border p-2 mb-4" name="startup_emails" value={form.startup_emails || ''} onChange={handleChange} />
              </label>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditMode(false); setForm(company); }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {company?.startup_name || <span className="text-gray-400">—</span>}</p>
              <p><strong>Analyst Rating:</strong> {company?.startup_analyst_rating || <span className="text-gray-400">—</span>}</p>
              <p><strong>Industry:</strong> {company?.startup_industry || <span className="text-gray-400">—</span>}</p>
              <p><strong>Technology:</strong> {company?.startup_technology || <span className="text-gray-400">—</span>}</p>
              <p><strong>Overview:</strong> {company?.startup_overview || <span className="text-gray-400">—</span>}</p>
              <p><strong>Description:</strong> {company?.startup_description || <span className="text-gray-400">—</span>}</p>
              <p><strong>Stage:</strong> {company?.startup_company_stage || <span className="text-gray-400">—</span>}</p>
              <p><strong>Country:</strong> {company?.startup_country || <span className="text-gray-400">—</span>}</p>
              <p><strong>Founders:</strong> {company?.startup_founders_info || <span className="text-gray-400">—</span>}</p>
              <p><strong>Contact:</strong> {company?.startup_emails || <span className="text-gray-400">—</span>}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default CompanyInfoPage; 