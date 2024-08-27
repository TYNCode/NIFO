"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCompanies } from '../redux/features/companyprofile/companyProfile';
import { Button, TextInput } from "flowbite-react";
import { IoSearchOutline } from "react-icons/io5";
import ViewType from '../components/Company/CardListToggle';
import CompanyList from '../components/Company/CompanyList';

interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
}

const CompanyProfilePage: React.FC = () => {
  const [activeView, setActiveView] = useState<"card" | "list">("card");
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
  const [checkedState, setCheckedState] = useState<{ [key: string]: { [item: string]: boolean } }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.companyProfile.companies);
  const loading = useAppSelector((state) => state.companyProfile.loading);
  const error = useAppSelector((state) => state.companyProfile.error);
  const hasMore = useAppSelector((state) => state.companyProfile.hasMore);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    if (hasMore) {
      dispatch(fetchCompanies());
    }
  }, [dispatch, page, hasMore, initialLoad]);


  const observer = useRef<IntersectionObserver | null>(null);
  const lastCompanyElementRef = useCallback(
    (node: HTMLElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleFilterChange = (category: string, item: string, isSelected: boolean) => {
    setSelectedFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      if (isSelected) {
        if (!updatedFilters[category]) {
          updatedFilters[category] = [];
        }
        if (!updatedFilters[category].includes(item)) {
          updatedFilters[category].push(item);
        }
      } else {
        updatedFilters[category] = updatedFilters[category].filter(filterItem => filterItem !== item);
        if (updatedFilters[category].length === 0) {
          delete updatedFilters[category];
        }
      }
      return updatedFilters;
    });

    setCheckedState(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [item]: isSelected
      }
    }));
  };



  return (
    <div className='w-[90%] mx-auto my-0 px-4'>
      <div className='flex justify-between mt-10'>
        <h1 className='text-3xl'>Growth Tech Firms List</h1>
        <ViewType />
      </div>

      <div className='flex justify-between mt-10 gap-4'>
        <div className="w-full flex justify-around h-fit flex-col">
          <div className='flex w-[70%] mx-auto my-0'>
            <TextInput
              id="text"
              type="text"
              rightIcon={IoSearchOutline}
              placeholder="Search with keywords"
              className='w-full pr-2 outlineChange '
              required
            />
            <Button className="bg-[#339af0] hover:!bg-[#1c7ed6]">Search</Button>
          </div>

          <div className='mt-10 w-full'>
            <CompanyList
              viewType={activeView}
              companies={companies}
              lastCompanyElementRef={lastCompanyElementRef}
              isLoading={loading}
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default CompanyProfilePage;
