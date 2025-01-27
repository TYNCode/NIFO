import React, { useState } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const ConsultantManage = () => {
  const [consultant, SetConsultant] = useState([
    {
      id: 1,
      name: "Strategic Growth Advisors",
      url: "https://strategicgrowth.com",
      rating: 4.9,
      specialization: "Business Strategy",
      location: "New York, NY",
      founded: 2010,
      description:
        "Strategic Growth Advisors helps businesses achieve sustainable growth through innovative strategies.",
      founders: "Emily Carter, David Rodriguez",
      clients: [
        "Fortune 500 companies",
        "Startups",
        "Non-profit organizations",
      ],
      services: [
        "Market analysis",
        "Competitive strategy",
        "Growth planning",
        "M&A advisory",
      ],
      employees: 50,
      revenue: "$10M",
      contact: "info@strategicgrowth.com",
    },
    {
      id: 2,
      name: "Tech Solutions Consulting",
      url: "https://techsolutions.net",
      rating: 4.6,
      specialization: "Technology Consulting",
      location: "San Francisco, CA",
      founded: 2015,
      description:
        "Tech Solutions Consulting provides expert technology consulting services to businesses of all sizes.",
      founders: "Michael Lee, Jessica Nguyen",
      clients: ["Software companies", "Tech startups", "E-commerce businesses"],
      services: [
        "IT strategy",
        "Cloud computing",
        "Cybersecurity",
        "Software development",
      ],
      employees: 30,
      revenue: "$7M",
      contact: "contact@techsolutions.net",
    },
    {
      id: 3,
      name: "Global Management Consulting",
      url: "https://globalmanagement.co.uk",
      rating: 4.7,
      specialization: "Management Consulting",
      location: "London, UK",
      founded: 2008,
      description:
        "Global Management Consulting helps organizations improve their performance through effective management practices.",
      founders: "Aisha Khan, James Wilson",
      clients: [
        "Multinational corporations",
        "Government agencies",
        "Public sector organizations",
      ],
      services: [
        "Organizational design",
        "Change management",
        "Process improvement",
        "Leadership development",
      ],
      employees: 75,
      revenue: "£12M",
      contact: "enquiries@globalmanagement.co.uk",
    },
    {
      id: 4,
      name: "Financial Advisory Group",
      url: "https://financialadvisory.com.au",
      rating: 4.5,
      specialization: "Financial Consulting",
      location: "Sydney, Australia",
      founded: 2012,
      description:
        "Financial Advisory Group provides expert financial advice and consulting services to businesses and individuals.",
      founders: "Olivia Brown, William Davis",
      clients: [
        "Small businesses",
        "Large corporations",
        "High-net-worth individuals",
      ],
      services: [
        "Financial planning",
        "Investment management",
        "Tax consulting",
        "Risk management",
      ],
      employees: 40,
      revenue: "AU$8M",
      contact: "info@financialadvisory.com.au",
    },
    {
      id: 5,
      name: "HR Solutions Partners",
      url: "https://hrsolutions.jp",
      rating: 4.8,
      specialization: "Human Resources Consulting",
      location: "Tokyo, Japan",
      founded: 2017,
      description:
        "HR Solutions Partners helps organizations optimize their human resources practices and improve employee engagement.",
      founders: "Sakura Tanaka, Kenji Ito",
      clients: [
        "Startups",
        "Small and medium-sized enterprises",
        "Large corporations",
      ],
      services: [
        "Talent acquisition",
        "Compensation and benefits",
        "Employee relations",
        "Training and development",
      ],
      employees: 25,
      revenue: "¥500M",
      contact: "contact@hrsolutions.jp",
    },
    {
      id: 6,
      name: "Marketing Mavericks",
      url: "https://marketingmavericks.ca",
      rating: 4.7,
      specialization: "Marketing Consulting",
      location: "Toronto, Canada",
      founded: 2014,
      description:
        "Marketing Mavericks drives business growth through innovative and data-driven marketing strategies.",
      founders: "Isabelle Dubois, Antoine Lefevre",
      clients: [
        "E-commerce businesses",
        "Retail companies",
        "Consumer goods brands",
      ],
      services: [
        "Digital marketing",
        "Brand strategy",
        "Market research",
        "Content marketing",
      ],
      employees: 35,
      revenue: "CA$6M",
      contact: "info@marketingmavericks.ca",
    },
  ]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">Manage Consultant</h2>
      <TableManage
        data={consultant}
        title="Consultant"
        entityName="Consultant"
        setData={SetConsultant}
      />
    </div>
  );
};

export default ConsultantManage;
