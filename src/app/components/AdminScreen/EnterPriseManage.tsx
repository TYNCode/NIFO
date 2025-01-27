import React, { useState } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const EnterPriseManage = () => {
  const [enterprises, setEnterprises] = useState([
    {
      id: 1,
      name: "Acme Inc.",
      url: "https://acmeinc.com",
      rating: 4.8,
      industry: "Manufacturing",
      country: "USA",
      type: "Public",
      employees: 5000,
      hq_location: "San Francisco, CA",
      founded: 1979,
      description:
        "Acme Inc. is a leading manufacturer of industrial products.",
      founders: "John Smith, Jane Doe",
      products: [
        "Industrial machinery",
        "Construction equipment",
        "Building materials",
      ],
      services: [
        "Engineering services",
        "Supply chain management",
        "Maintenance and repair",
      ],
    },
    {
      id: 2,
      name: "Global Health Solutions",
      url: "https://globalhealthsolutions.com",
      rating: 4.3,
      industry: "Healthcare",
      country: "UK",
      type: "Private",
      employees: 10000,
      hq_location: "London, England",
      founded: 2001,
      description:
        "Global Health Solutions provides innovative healthcare services.",
      founders: "Alice Brown, David Miller",
      services: [
        "Hospitals and clinics",
        "Pharmaceutical research",
        "Medical devices",
      ],
    },
    {
      id: 3,
      name: "SunTech Energy",
      url: "https://suntechenergy.com",
      rating: 4.7,
      industry: "Energy",
      country: "China",
      type: "Public",
      employees: 20000,
      hq_location: "Shanghai, China",
      founded: 2010,
      description:
        "SunTech Energy is a leading provider of solar energy solutions.",
      founders: "Li Wang, Chen Lin",
      products: ["Solar panels", "Battery storage systems", "Solar inverters"],
      services: [
        "Solar installation",
        "Project financing",
        "Maintenance and monitoring",
      ],
    },
    {
      id: 4,
      name: "FinTech Solutions",
      url: "https://fintechsolutions.com",
      rating: 4.5,
      industry: "Financial Services",
      country: "USA",
      type: "Private",
      employees: 3000,
      hq_location: "New York City, NY",
      founded: 2015,
      description:
        "FinTech Solutions offers innovative financial technology solutions.",
      founders: "Michael Jones, Sarah Lee",
      products: [
        "Online banking platforms",
        "Mobile payment apps",
        "Investment management tools",
      ],
      services: ["Financial consulting", "Fraud prevention", "Cybersecurity"],
    },
    {
      id: 5,
      name: "LogiTech Inc.",
      url: "https://logistechinc.com",
      rating: 4.9,
      industry: "Logistics",
      country: "Germany",
      type: "Public",
      employees: 8000,
      hq_location: "Berlin, Germany",
      founded: 1998,
      description:
        "LogiTech Inc. is a leading provider of logistics and supply chain solutions.",
      founders: "Peter Schmidt, Franz Mayer",
      services: [
        "Transportation and warehousing",
        "Inventory management",
        "International trade",
      ],
    },
    {
      id: 7,
      name: "AgriGrow Ltd.",
      url: "https://agrigrow.com",
      rating: 4.2,
      industry: "Agriculture",
      country: "Australia",
      type: "Private",
      employees: 2500,
      hq_location: "Sydney, NSW",
      founded: 1988,
      description:
        "AgriGrow Ltd. focuses on sustainable agriculture and food production.",
      founders: "William Taylor, Olivia Anderson",
      products: [
        "Agricultural equipment",
        "Seeds and fertilizers",
        "Livestock feed",
      ],
      services: ["Farming consulting", "Crop management", "Livestock breeding"],
      revenue: "AU$400M",
      ceo: "James Wilson",
    },
    {
      id: 8,
      name: "BuildTech Group",
      url: "https://buildtechgroup.com",
      rating: 4.4,
      industry: "Construction",
      country: "Japan",
      type: "Public",
      employees: 12000,
      hq_location: "Tokyo, Japan",
      founded: 1970,
      description:
        "BuildTech Group specializes in large-scale construction projects.",
      founders: "Kenji Tanaka, Akari Sato",
      services: [
        "Civil engineering",
        "Building construction",
        "Infrastructure development",
      ],
      revenue: "¥800B",
      ceo: "Hiroki Yamamoto",
    },
  ]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">Manage EnterPrise</h2>
      <TableManage
        data={enterprises}
        title="EnterPrise"
        entityName="EnterPrise"
        setData={setEnterprises}
      />
    </div>
  );
};

export default EnterPriseManage;
