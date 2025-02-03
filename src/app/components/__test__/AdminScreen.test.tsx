import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StartupManage from '../AdminScreen/StartupManage';
import EnterpriseManage from '../AdminScreen/EnterPriseManage';
import ConsultantManage from '../AdminScreen/ConsultantManage';
import TableManage from '../AdminScreen/TableManage';


/*
 Jest Unit Testing
 Components
    1. StartupManage     
    2. EnterpriseManage
    3. ConsultantManage
 Location
    app/components/AdminScreen/
 Number of Tests : 3
*/



const startupUsers = [
    {
        "id": 31,
        "first_name": "Hari boopathi",
        "email": "rakeshmahendran@gmail.com",
        "startup_name": "The Yellow Network",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T11:39:00.200931Z",
        "is_staff": false
    },
    {
        "id": 32,
        "first_name": "lathieshh@theyellow.network",
        "email": "lathies11h@theyellow.network",
        "startup_name": "The Yellow Network",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T11:40:46.466314Z",
        "is_staff": false
    },
    {
        "id": 34,
        "first_name": "Rakesh",
        "email": "rakeshmahendrn@gmail.com",
        "startup_name": "The Yellow Network",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T11:54:39.694633Z",
        "is_staff": false
    },
    {
        "id": 51,
        "first_name": "Anand",
        "email": "anand@justcall.com",
        "startup_name": "JustCall",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-08T16:44:40.827397Z",
        "is_staff": false
    },
    {
        "id": 36,
        "first_name": "Anand",
        "email": "anand@gmail.com",
        "startup_name": "Vodafonee",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T13:05:00.690800Z",
        "is_staff": false
    },
    {
        "id": 37,
        "first_name": "Anandtracobit",
        "email": "anandtracobit@gmail.com",
        "startup_name": "Trackobit",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T13:12:02.240062Z",
        "is_staff": false
    },
    {
        "id": 38,
        "first_name": "Keerthana",
        "email": "keerthanaravichandran09@gmail.com",
        "startup_name": "The Yellow Network",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T14:13:06.759109Z",
        "is_staff": false
    },
    {
        "id": 39,
        "first_name": "Ashok",
        "email": "test10@gmail.com",
        "startup_name": "The Yellow Network",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T16:49:23.293161Z",
        "is_staff": false
    },
    {
        "id": 40,
        "first_name": "DAYANANDH V",
        "email": "dayavelusamy@gmail.com",
        "startup_name": "The Yellow Network",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-07T16:54:26.949585Z",
        "is_staff": false
    },
    {
        "id": 52,
        "first_name": "Anand",
        "email": "anand@airtalk.com",
        "startup_name": "Airtalk",
        "is_active": true,
        "is_primary_user": true,
        "date_joined": "2024-09-08T16:47:33.273068Z",
        "is_staff": false
    }
]

describe('AdminScreen Component Tests', () => {
    // Test StartupManage component rendering
    describe('Test for StartupManage component', () => {
        it('should render StartupManage component correctly', () => {
        render(<StartupManage />);
        
        // Check if an element from StartupManage is rendered
        const startupElement = screen.getByText(/Manage Startups Users/i); // Replace with an actual text/content that is displayed in your component
        expect(startupElement).toBeInTheDocument();
        });

    });

    // Test EnterpriseManage component rendering
    describe('Test for EnterpriseManage component', () => {
        it('should render EnterpriseManage component correctly', () => {
        render(<EnterpriseManage />);
        
        // Check if an element from EnterpriseManage is rendered
        const enterpriseElement = screen.getByText(/Manage EnterPrise Users/i); // Replace with actual text/content that is displayed in your component
        expect(enterpriseElement).toBeInTheDocument();
        });

    });

  // Test ConsultantManage component rendering
    describe('Test for ConsultantManage component', () => {
        it('should render ConsultantManage component correctly', () => {
        render(<ConsultantManage />);
        
        // Check if an element from ConsultantManage is rendered
        const consultantElement = screen.getByText(/Manage Consultant Users/i); // Replace with actual text/content that is displayed in your component
        expect(consultantElement).toBeInTheDocument();
        });

    });

    describe("Test for TableManage component", () => {
        let setDataMock;
        const mockData = [
            {
              id: 1,
              first_name: "Alice",
              email: "alice@example.com",
              startup_name: "Tech Corp",
              is_active: true,
              is_primary_user: true,
              date_joined: "2024-02-01",
            },
            {
              id: 2,
              first_name: "Bob",
              email: "bob@example.com",
              startup_name: "StartupX",
              is_active: false,
              is_primary_user: false,
              date_joined: "2024-01-25",
            },
          ];

        beforeEach(() => {
            setDataMock = jest.fn();
                    render(
                    <TableManage
                        data={mockData}
                        title="Users"
                        entityName="User"
                        setData={setDataMock}
                        userType="admin"
                        isLoading={false}
                    />
                );
            });


            test("renders the table with correct data", () => {
                expect(screen.getByText("Users")).toBeInTheDocument();
                expect(screen.getByText("Alice")).toBeInTheDocument();
                expect(screen.getByText("bob@example.com")).toBeInTheDocument();
                expect(screen.getByText("Tech Corp")).toBeInTheDocument();
              });
            
              test("filters users by search input", () => {
                const searchInput = screen.getByPlaceholderText("Search by name, email, or admin...");
                fireEvent.change(searchInput, { target: { value: "Alice" } });
            
                expect(screen.getByText("Alice")).toBeInTheDocument();
                expect(screen.queryByText("Bob")).not.toBeInTheDocument();
              });
            
              test("handles pagination controls", () => {
                const nextButton = screen.getByRole("button", { name: /next/i });
                const prevButton = screen.getByRole("button", { name: /previous/i });
            
                expect(prevButton).toBeDisabled();
                fireEvent.click(nextButton);
                expect(nextButton).toBeDisabled(); // Assuming only 2 records exist
              });
            
              test("shows confirmation modal when deleting a user", () => {
                const deleteButtons = screen.getAllByTestId("delete-button");
                fireEvent.click(deleteButtons[0]);
            
                expect(screen.getByText("Are you sure?")).toBeInTheDocument();
              });
            
              test("confirms user deletion and calls setData", async () => {
                const deleteButtons = screen.getAllByTestId("delete-button");
                fireEvent.click(deleteButtons[0]);
            
                const confirmButton = screen.getByText("Yes");
                fireEvent.click(confirmButton);
            
                await waitFor(() => {
                  expect(setDataMock).toHaveBeenCalled();
                });
              });
            
              test("opens edit modal and updates user details", async () => {
                const editButtons = screen.getAllByTestId("edit-button");
                fireEvent.click(editButtons[0]);
            
                const nameInput = screen.getByLabelText("Name:");
                fireEvent.change(nameInput, { target: { value: "Alice Updated" } });
            
                const saveButton = screen.getByText("Save");
                fireEvent.click(saveButton);
            
                await waitFor(() => {
                  expect(setDataMock).toHaveBeenCalled();
                });
              });
            
            //   test("bulk delete selected users", async () => {
            //     const checkboxes = screen.getAllByRole("checkbox");
            //     fireEvent.click(checkboxes[1]); // Select first user
            //     fireEvent.click(checkboxes[2]); // Select second user
            
            //     const bulkDeleteButton = screen.getByText(/bulk delete/i);
            //     fireEvent.click(bulkDeleteButton);
            
            //     const confirmButton = screen.getByText("Yes");
            //     fireEvent.click(confirmButton);
            
            //     await waitFor(() => {
            //       expect(setDataMock).toHaveBeenCalled();
            //     });
            //   });
            
    })
  

});
