import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StartupManage from '../AdminScreen/StartupManage';
import EnterpriseManage from '../AdminScreen/EnterPriseManage';
import ConsultantManage from '../AdminScreen/ConsultantManage';
import TableManage from '../AdminScreen/TableManage';
import React from 'react';

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
    describe('StartupManage', () => {
        it('should render StartupManage component correctly', () => {
        render(<StartupManage />);
        
        // Check if an element from StartupManage is rendered
        const startupElement = screen.getByText(/Manage Startups Users/i); // Replace with an actual text/content that is displayed in your component
        expect(startupElement).toBeInTheDocument();
        });

    });

    // Test EnterpriseManage component rendering
    describe('EnterpriseManage', () => {
        it('should render EnterpriseManage component correctly', () => {
        render(<EnterpriseManage />);
        
        // Check if an element from EnterpriseManage is rendered
        const enterpriseElement = screen.getByText(/Manage EnterPrise Users/i); // Replace with actual text/content that is displayed in your component
        expect(enterpriseElement).toBeInTheDocument();
        });

    });

  // Test ConsultantManage component rendering
    describe('ConsultantManage', () => {
        it('should render ConsultantManage component correctly', () => {
        render(<ConsultantManage />);
        
        // Check if an element from ConsultantManage is rendered
        const consultantElement = screen.getByText(/Manage Consultant Users/i); // Replace with actual text/content that is displayed in your component
        expect(consultantElement).toBeInTheDocument();
        });

    });
  

});
