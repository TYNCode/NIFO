// import { configureStore } from '@reduxjs/toolkit';
// import companyProfileReducer, { 
//   fetchCompanies,
//   fetchCompaniesList,
//   searchCompaniesSuggestion,
//   searchCompanies,
//   fetchCompanyById,
//   fetchCompanyProfileById,
//   updateCompanyById,
// } from '../features/companyprofile/companyProfile';
// import { getRequest, getRequestWithAccessToken, putRequestWithAccessToken } from '../hooks';

// // Mock the API functions
// // Jest mock for API hooks

// import { AxiosResponse } from 'axios';

// jest.mock('../../hooks', () => ({
//   getRequest: jest.fn(),
//   getRequestWithAccessToken: jest.fn(),
//   putRequestWithAccessToken: jest.fn(),
// }));

// const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
//   data,
//   status: 200,
//   statusText: 'OK',
//   headers: {},
//   config: {
//       headers: undefined
//   },
// });

// // You can now mock the implementation like this:
// getRequest.mockResolvedValueOnce(mockAxiosResponse([{ id: 1, name: 'Company A' }]));
// getRequestWithAccessToken.mockResolvedValueOnce(mockAxiosResponse({ results: [{ id: 1, name: 'Company A' }] }));
// putRequestWithAccessToken.mockResolvedValueOnce(mockAxiosResponse({ id: 1, name: 'Updated Company A' }));


// describe('companyProfileSlice', () => {
//   let store: ReturnType<typeof configureStore>;

//   beforeEach(() => {
//     store = configureStore({
//       reducer: { companyProfile: companyProfileReducer },
//     });
//   });

//   // Test fetchCompanies thunk
//   it('should fetch companies successfully', async () => {
//     const mockCompanies = [{ id: 1, name: 'Company A' }];
//     getRequest.mockResolvedValueOnce({ data: mockCompanies });

//     await store.dispatch(fetchCompanies());

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.companies).toEqual(mockCompanies);
//   });

//   it('should handle fetchCompanies error', async () => {
//     getRequest.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(fetchCompanies());

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('Error in fetching companies');
//   });

//   // Test fetchCompaniesList thunk
//   it('should fetch companies list successfully', async () => {
//     const mockCompaniesList = [{ id: 1, name: 'Company A' }];
//     getRequestWithAccessToken.mockResolvedValueOnce({ data: { results: mockCompaniesList } });

//     await store.dispatch(fetchCompaniesList({ page: 1, page_size: 10 }));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.companiesList).toEqual(mockCompaniesList);
//   });

//   it('should handle fetchCompaniesList error', async () => {
//     getRequestWithAccessToken.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(fetchCompaniesList({ page: 1, page_size: 10 }));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('An error occurred while fetching data');
//   });

//   // Test searchCompaniesSuggestion thunk
//   it('should fetch company suggestions successfully', async () => {
//     const mockSuggestions = [{ id: 1, name: 'Company A' }];
//     getRequest.mockResolvedValueOnce({ data: mockSuggestions });

//     await store.dispatch(searchCompaniesSuggestion('Company A'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.searchSuggestResults).toEqual(mockSuggestions);
//   });

//   it('should handle searchCompaniesSuggestion error', async () => {
//     getRequest.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(searchCompaniesSuggestion('Company A'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('Error in searching companies');
//   });

//   // Test searchCompanies thunk
//   it('should search companies successfully', async () => {
//     const mockSearchResults = [{ id: 1, name: 'Company A' }];
//     getRequest.mockResolvedValueOnce({ data: mockSearchResults });

//     await store.dispatch(searchCompanies('Company A'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.searchResults).toEqual(mockSearchResults);
//   });

//   it('should handle searchCompanies error', async () => {
//     getRequest.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(searchCompanies('Company A'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('Error in searching companies');
//   });

//   // Test fetchCompanyById thunk
//   it('should fetch company by ID successfully', async () => {
//     const mockCompany = { id: 1, name: 'Company A' };
//     getRequestWithAccessToken.mockResolvedValueOnce({ data: mockCompany });

//     await store.dispatch(fetchCompanyById('1'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.company).toEqual(mockCompany);
//   });

//   it('should handle fetchCompanyById error', async () => {
//     getRequestWithAccessToken.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(fetchCompanyById('1'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('Failed to fetch company by ID');
//   });

//   // Test fetchCompanyProfileById thunk
//   it('should fetch company profile by ID successfully', async () => {
//     const mockProfile = { id: 1, name: 'Company A' };
//     getRequestWithAccessToken.mockResolvedValueOnce({ data: mockProfile });

//     await store.dispatch(fetchCompanyProfileById('1'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.companiesList).toEqual([mockProfile]);
//   });

//   it('should handle fetchCompanyProfileById error', async () => {
//     getRequestWithAccessToken.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(fetchCompanyProfileById('1'));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('Failed to fetch company by ID');
//   });

//   // Test updateCompanyById thunk
//   it('should update company by ID successfully', async () => {
//     const mockUpdatedCompany = { id: 1, name: 'Updated Company A' };
//     putRequestWithAccessToken.mockResolvedValueOnce({ data: mockUpdatedCompany });

//     await store.dispatch(updateCompanyById({ id: '1', data: { name: 'Updated Company A' } }));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.company).toEqual(mockUpdatedCompany);
//   });

//   it('should handle updateCompanyById error', async () => {
//     putRequestWithAccessToken.mockRejectedValueOnce({ response: { data: 'Error' } });

//     await store.dispatch(updateCompanyById({ id: '1', data: { name: 'Updated Company A' } }));

//     const state = store.getState().companyProfile;
//     expect(state.loading).toBe(false);
//     expect(state.error).toBe('Failed to update company');
//   });
// });
