"use client"
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCompanyById } from '../redux/features/companyprofile/companyProfile';

const CompanyProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { company, loading, error } = useAppSelector((state) => state.companyProfile);

  useEffect(() => {
    const companyId = "2"; 
    dispatch(fetchCompanyById(companyId));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{company?.startup_name}</h1>
      <p><strong>Analyst Rating:</strong> {company?.startup_analyst_rating}</p>
      <p><strong>Industry:</strong> {company?.startup_industry}</p>
      <p><strong>Technology:</strong> {company?.startup_technology}</p>
      <p><strong>Overview:</strong> {company?.startup_overview}</p>
      <p><strong>Description:</strong> {company?.startup_description}</p>
      <p><strong>Stage:</strong> {company?.startup_company_stage}</p>
      <p><strong>Country:</strong> {company?.startup_country}</p>
      <p><strong>Founders:</strong> {company?.startup_founders_info}</p>
      <p><strong>Contact:</strong> {company?.startup_emails}</p>
    </div>
  );
}

export default CompanyProfilePage;
