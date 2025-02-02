"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCompanies, fetchCompaniesList, searchCompanies, fetchCompanyById, fetchCompanyProfileById, searchCompaniesSuggestion } from '../redux/features/companyprofile/companyProfile';
import { Button, TextInput } from "flowbite-react";
import { IoSearchOutline } from "react-icons/io5";
import CompanyList from '../components/Company/CompanyList';
import debounce from 'lodash.debounce';
import Suggestions from '../components/Company/Suggestion';


const CompanyProfilePage: React.FC = () => {

  const [activeView, setActiveView] = useState<"card" | "list">("card");
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
  const [checkedState, setCheckedState] = useState<{ [key: string]: { [item: string]: boolean } }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isShowBox, setisShowBox] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.companyProfile.companiesList);
  const loading = useAppSelector((state) => state.companyProfile.loading);
  const error = useAppSelector((state) => state.companyProfile.error);
  const hasMore = useAppSelector((state) => state.companyProfile.hasMore);
  const searchResults = useAppSelector((state) => state.companyProfile.searchResults);
  const searchSuggestResults = useAppSelector((state) => state.companyProfile.searchSuggestResults);
  const [initialLoad, setInitialLoad] = useState(true);
  

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    if (hasMore) {
      dispatch(fetchCompaniesList({page, page_size: 9}));
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


  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        dispatch(searchCompaniesSuggestion(query));
      } else {
        setShowSuggestions(false);
      }
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
      if (isShowBox) {
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, handleSearch]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setisShowBox(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element) {
        const suggestionBox = document.querySelector('.suggestion-box');
        if (suggestionBox && !suggestionBox.contains(event.target)) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchCompanies = (query: string) => {
    if (query) {
      dispatch(searchCompanies(query)).then((action) => {
        if (action.payload && action.payload.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      });
    } else {
      dispatch(fetchCompaniesList({ page, page_size: 9}));
      setNoResults(false);
    }
  }


  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name); 
    setShowSuggestions(false); 
    setisShowBox(false); 
  };

  const handleViewChange = (view: "card" | "list") => {
    setActiveView(view); 
  };


  return (
    <div className='w-[90%] mx-auto my-0 px-4'>
     <div className='flex items-center justify-between mt-10'>
      <div className='flex justify-between '>
        <h1 className='sm:text-3xl text-xl'>Growth Tech Firms List</h1>
      </div>

      <div className="flex justify-center my-6">
  <div className="inline-flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
    <Button
      className={`${activeView === 'card' ? 'bg-[#228be6] text-white shadow-md' : 'bg-white text-gray-800'} 
            enabled:hover:!bg-[#4dabf7]   focus:outline-none outline-none focus:ring-0 focus:border-transparent rounded-r-none transition-all duration-300 `}
      onClick={() => handleViewChange('card')}
    >
      Card View
    </Button>
    <Button
      className={`${activeView === 'list' ? 'bg-[#228be6] text-white shadow-md' : 'bg-white text-gray-800'} 
          enabled:hover:!bg-[#4dabf7]   focus:outline-none transition-all focus:ring-0 focus:border-transparent rounded-l-none duration-300`}
      onClick={() => handleViewChange('list')}
    >
      List View
    </Button>
  </div>
</div>

     </div>

      <div className='flex justify-between mt-10 gap-4'>
        <div className="w-full flex justify-around h-fit flex-col">
          <div className='flex sm:w-[70%] w-[90%] mx-auto my-0 flex-col'>
            <div className='flex sm:flex-row flex-col gap-3'>
              <TextInput
                id="text"
                type="text"
                rightIcon={IoSearchOutline}
                placeholder="Search with keywords"
                className='w-full pr-2 outlineChange'
                onChange={handleInputChange}
                value={searchTerm}
                required
              />
              <Button className='bg-[#4dabf7] hover:!bg-[#228be6] focus:!outline-none' onClick={() => handleSearchCompanies(searchTerm)}>Search</Button>
            </div>
            {showSuggestions && searchSuggestResults.length > 0 && (
              <div className="w-full bg-white border border-gray-300 z-10 suggestion-box">
                {searchSuggestResults.map((suggestion) => (
                  <Suggestions suggestion={suggestion} onSuggestionClick={handleSuggestionClick} />
                  
                ))}
              </div>
            )}
          </div>

          <div className='mt-10 w-full'>

            {noResults ? (
              <div className="text-center text-gray-500">
                Data Not Found
              </div>
            ) : (
              <CompanyList
                viewType={activeView}
                companies={searchResults.length > 0 ? searchResults : companies}
                lastCompanyElementRef={lastCompanyElementRef}
                isLoading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;