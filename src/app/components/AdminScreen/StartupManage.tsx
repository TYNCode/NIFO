import React, { useState } from "react";
import TableManage from "./TableManage";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const StartupManage = () => {
  const [startups, setStartups] = useState([
    {
      id: 1,
      name: "TechCorp",
      url: "https://techcorp.com",
      rating: 4.5,
      industry: "Technology",
      country: "USA",
      stage: "Growth",
      isVerified: true,
      description: "TechCorp is a leading tech company.",
      founders: "John Doe, Jane Doe",
      email: "contact@techcorp.com",
    },
    {
      id: 2,
      name: "BioHealth",
      url: "https://biohealth.com",
      rating: 4.2,
      industry: "Healthcare",
      country: "Germany",
      stage: "Startup",
      isVerified: false,
      description: "BioHealth focuses on innovative healthcare solutions.",
      founders: "Alice Brown, Bob Smith",
      email: "info@biohealth.com",
    },
    {
      id: 3,
      name: "EduLabs",
      url: "https://edulabs.com",
      rating: 4.8,
      industry: "Education",
      country: "UK",
      stage: "Growth",
      isVerified: true,
      description: "EduLabs offers online education solutions.",
      founders: "Tom White, Sarah Green",
      email: "support@edulabs.com",
    },
    {
      id: 4,
      name: "GreenEnergy",
      url: "https://greenenergy.com",
      rating: 3.9,
      industry: "Energy",
      country: "Canada",
      stage: "Mature",
      isVerified: true,
      description: "GreenEnergy is dedicated to sustainable energy solutions.",
      founders: "Jack Blue, Lisa Yellow",
      email: "contact@greenenergy.com",
    },
    {
      id: 5,
      name: "SpaceXplore",
      url: "https://spacexplore.com",
      rating: 5.0,
      industry: "Aerospace",
      country: "USA",
      stage: "Mature",
      isVerified: false,
      description: "SpaceXplore focuses on space exploration.",
      founders: "Elon Musk, Gwynne Shotwell",
      email: "info@spacexplore.com",
    },
    {
      id: 6,
      name: "TechCorp",
      url: "https://techcorp.com",
      rating: 4.5,
      industry: "Technology",
      country: "USA",
      stage: "Growth",
      isVerified: true,
      description: "TechCorp is a leading tech company.",
      founders: "John Doe, Jane Doe",
      email: "contact@techcorp.com",
    },
    {
      id: 7,
      name: "BioHealth",
      url: "https://biohealth.com",
      rating: 4.2,
      industry: "Healthcare",
      country: "Germany",
      stage: "Startup",
      isVerified: false,
      description: "BioHealth focuses on innovative healthcare solutions.",
      founders: "Alice Brown, Bob Smith",
      email: "info@biohealth.com",
    },
    {
      id: 8,
      name: "EduLabs",
      url: "https://edulabs.com",
      rating: 4.8,
      industry: "Education",
      country: "UK",
      stage: "Growth",
      isVerified: true,
      description: "EduLabs offers online education solutions.",
      founders: "Tom White, Sarah Green",
      email: "support@edulabs.com",
    },
    {
      id: 9,
      name: "GreenEnergy",
      url: "https://greenenergy.com",
      rating: 3.9,
      industry: "Energy",
      country: "Canada",
      stage: "Mature",
      isVerified: true,
      description: "GreenEnergy is dedicated to sustainable energy solutions.",
      founders: "Jack Blue, Lisa Yellow",
      email: "contact@greenenergy.com",
    },
    {
      id: 10,
      name: "SpaceXplore",
      url: "https://spacexplore.com",
      rating: 5.0,
      industry: "Aerospace",
      country: "USA",
      stage: "Mature",
      isVerified: false,
      description: "SpaceXplore focuses on space exploration.",
      founders: "Elon Musk, Gwynne Shotwell",
      email: "info@spacexplore.com",
    },
  ]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 ml-2">Manage Startups</h2>
      <TableManage
        data={startups}
        title="Startups"
        entityName="Startup"
        setData={setStartups}
      />
    </div>
  );
};

export default StartupManage;
