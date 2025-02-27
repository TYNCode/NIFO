const mockConversations = [
  {
    question: "",
    response: {
      success: true,
      category: null,
      response: "No specific data to process.",
    },
  },
  {
    question:
      "Can you provide companies which will help in Real-time quality monitoring of water at every process step",
    response: {
      success: true,
      category: "direct user query",
      response:
        "Here are several companies that specialize in real-time quality monitoring of water across various process steps:",
      startups: [
        {
          name: "KarIOT",
          description: "A cool startup",
          database_info: { /* Add the appropriate StartupType data here */ },
        },
      ],
    },
  },
  {
    question:
      "How can we implement a real-time headcount tracking solution that enhances visitor and employee management, improves security, and optimises operational efficiency within workplace premises?",
    response: {
      success: true,
      category: "direct user query",
      response:
        "Here are several startups that provide solutions for real-time headcount tracking, enhancing visitor and employee management, improving security, and optimizing operational efficiency:",
      startups: [
        {
          name: "Veris",
          relevance:
            "Veris's comprehensive workplace management solutions are tailored for enhancing security and optimizing space usage, making it a strong candidate for your needs.",
          description:
            "Veris offers smart solutions for workplace management, focusing on visitor and employee management with AI-driven systems for access control, desk bookings, and visitor check-ins. Their platform provides real-time occupancy data and insights for operational efficiency.",
        },
        {
          name: "VAMS Global",
          relevance:
            "Their focus on visitor management and security aligns with your requirements for real-time tracking and operational efficiency.",
          description:
            "VAMS Global specializes in advanced visitor management and security systems, integrating technologies like biometric access control and real-time data insights to ensure efficient and secure workplace management.",
        },
        {
          name: "AiRISTA",
          relevance:
            "AiRISTA's RTLS solutions are designed for real-time tracking in workplace settings, making them suitable for your headcount management needs.",
          description:
            "AiRISTA provides real-time location systems (RTLS) that improve operational efficiency and enhance safety in various environments. Their solutions include wearable devices for tracking personnel and assets, which can be applied to headcount tracking.",
          database_info: {
            startup_id: 715,
            startup_url: "https://www.airista.com",
            startup_logo:
              "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1725444921/AiRISTA_edwnsm.jpg",
            startup_name: "AiRISTA",
            startup_emails: "support@airista.com",
            startup_country: "USA",
            startup_industry: "Real-Time Location Systems, Healthcare Solutions",
            startup_overview:
              "AiRISTA develops and markets real-time location systems (RTLS), using Wi-Fi RFID to improve operational efficiency and enhance safety in healthcare and industrial environments.",
            startup_technology:
              "RTLS, IoT for Healthcare and Industrial Applications",
            startup_description:
              "AiRISTA Flow offers solutions for asset tracking, staff safety, and patient care in hospitals and industrial settings, enhancing efficiency and accuracy.",
          },
        },
        {
          name: "Crowd Connected",
          relevance:
            "Their expertise in crowd dynamics and location tracking makes them a viable option for real-time headcount solutions.",
          description:
            "Crowd Connected provides location-based data analytics and tracking solutions, enabling deep insights into crowd movements and behaviors, which can be applied to workplace environments for headcount tracking.",
          database_info: {
            startup_id: 1457,
            startup_url: "crowdconnected.com",
            startup_logo:
              "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1725431238/Crowd_Connected_zgtup8.jpg",
            startup_name: "Crowd Connected",
            startup_emails: "info@crowdconnected.com",
            startup_country: "UK",
            startup_industry: "Location Data Analytics, Event Technology",
            startup_overview:
              "Crowd Connected provides location-based data analytics and tracking solutions for events, retail, and smart cities, enabling deep insights into crowd movements and behaviors.",
            startup_technology:
              "Indoor Positioning, Geolocation Data Analytics",
          },
        },
        {
          name: "Identec Solutions",
          relevance:
            "Their RFID technology can enhance operational efficiency and improve security through accurate personnel tracking.",
          description:
            "Identec Solutions offers RFID-based solutions for asset tracking and personnel safety, which can be utilized for real-time headcount tracking in workplace environments.",
          database_info: {
            startup_id: 196,
            startup_url: "https://identecsolutions.com/",
            startup_logo:
              "https://res.cloudinary.com/dkgfu1pvh/image/upload/v1725444342/Identec_Solutions_jmkj0o.jpg",
            startup_name: "Identec Solutions",
            startup_emails: "info@identecsolutions.com",
            startup_country: "Austria",
            startup_industry: "RFID",
            startup_overview:
              "Identec Solutions offers RFID-based solutions for asset tracking and personnel safety, improving operational efficiency.",
            startup_technology: "RFID Products",
          },
        },
      ],
    },
  },
];

export default mockConversations;
