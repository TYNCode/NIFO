"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LeftFrame from "../LeftFrame/LeftFrame";
import Prompt from "../Prompt";
import NavBar from "../Navbar";
import CompanyProfilePane from "../CompanyProfilePane";
import RenderStartup from "./RenderStartup";
import BottomBar from "../../mobileComponents/BottomBar";
import MobileHeader from "../../mobileComponents/MobileHeader";
import SpotlightMobile from "../Spotlights/SpotlightMobile";
import SearchMobile from "../../mobileComponents/FooterComponents/SearchMobile";
import TrendsMobile from "../../mobileComponents/FooterComponents/TrendsMobile";
import MoreMobile from "../../mobileComponents/FooterComponents/MoreMobile";
import TrendsMobileHeader from "../../mobileComponents/TrendsMobileHeader";
import { ChatHistoryResponse, StartupType } from "../../interfaces";
import { encryptURL } from "../../utils/shareUtils";
import { postRequestWithAccessToken, useAppDispatch } from "../../redux/hooks";
import { fetchPartnerConnectsByOrg } from "../../redux/features/connection/connectionSlice";
import { v4 as uuidv4 } from "uuid";
import BounceLoading from "./BounceLoading/BounceLoading";
import { FiPlayCircle } from "react-icons/fi";
import ComparisonTable from "./ComparisonTable";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const searchParams = useSearchParams();
  const [defaultPrompt, setDefaultPrompt] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupType | null>(
    null
  );
  );
  const [inputPrompt, setInputPrompt] = useState(defaultPrompt);
  const [openRightFrame, setOpenRightFrame] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mailMessage, setMailMessage] = useState<any>(null);
  const [queryData, setQueryData] = useState<ChatHistoryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Spotlight");
  const [sessionId, setSessionId] = useState<string>(() => uuidv4());

  const [requestQuery, setRequestQuery] = useState<string>();
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [currentStep, setCurrentStep] = useState("trends");

  const [compareResultsLoading, setCompareResultsLoading] =
    useState<boolean>(false);
  const [comparisonTableResponse, setComparisonTableResponse] =
    useState<any>([
      {
          "name": "Rigetti Computing",
          "attributes": {
              "Customer Feedback": "There are likely positive testimonials available regarding their cloud platform from users implementing quantum algorithms. `(2/3)`",
              "Existing Clients": "Rigetti Computing serves a diverse range of clients, from startups to large enterprises, showcasing versatility. `(2/3)`",
              "Solution Deployment": "The cloud platform is well-integrated and allows users to run algorithms relatively easily. `(3/3)`",
              "Channels": "Collaborates with various research institutions and cloud providers for scalability. `(2/3)`",
              "Differentiation/USP": "Unique because of its cloud-based quantum platform, offering access to quantum processors. `(3/3)`",
              "Patents/IP Protection": "Likely has patents, although specifics are not mentioned within the context. `(1/3)`",
              "Competitor Benchmarking": "Rigetti is competitive in the quantum computing space with substantial features. `(3/3)`",
              "Funding Stage": "Likely beyond Series A, considering its presence and collaborations in the industry. `(2/3)`",
              "Incorporation Timeline": "Has been established for several years, enhancing credibility. `(2/3)`",
              "Product Stage": "Product is commercialized and accessible to users through the cloud platform. `(3/3)`",
              "Product Differentiation": "Solves critical computing challenges using advanced quantum technology. `(3/3)`",
              "Team Strength": "The team likely has a strong background in quantum mechanics and AI. `(2/3)`",
              "Clients": "Rigetti Computing serves a diverse range of clients, from startups to large enterprises, showcasing versatility. `(2/3)`"
          },
          "total_score": 0,
          "relevancy_score": 0
      },
      {
          "name": "Xanadu",
          "attributes": {
              "Customer Feedback": "Strong industry feedback due to its pioneering approach in photonic quantum computing. `(2/3)`",
              "Existing Clients": "Serves clients in various sectors, indicating a growing client base. `(2/3)`",
              "Solution Deployment": "Tools and solutions are designed for ease of use and integration in quantum applications. `(3/3)`",
              "Channels": "Partnerships with academic institutions aiding its scalability. `(2/3)`",
              "Differentiation/USP": "Photon-based technology offers unique capabilities not found in traditional systems. `(3/3)`",
              "Patents/IP Protection": "Likely has some intellectual property, though specific details are not provided. `(1/3)`",
              "Competitor Benchmarking": "Distinct offerings showcase competitive advantages against others in the quantum field. `(3/3)`",
              "Funding Stage": "Advanced funding, likely around Series A or B, given its established reputation. `(2/3)`",
              "Incorporation Timeline": "Founded several years ago, allowing them to mature in the tech landscape. `(2/3)`",
              "Product Stage": "Active market solutions available, signaling a commercialized focus. `(3/3)`",
              "Product Differentiation": "Tackles significant issues in quantum algorithm optimization through unique methodologies. `(3/3)`",
              "Team Strength": "Robust team likely with deep expertise in both AI and quantum computing. `(3/3)`",
              "Clients": "Serves clients in various sectors, indicating a growing client base. `(2/3)`"
          },
          "total_score": 0,
          "relevancy_score": 0
      },
      {
          "name": "QC Ware",
          "attributes": {
              "Customer Feedback": "Feedback points towards positive reception of their optimization capabilities in high-performance computing. `(2/3)`",
              "Existing Clients": "Serves a growing number of enterprise clients, indicating market validation. `(2/3)`",
              "Solution Deployment": "Their solutions are designed for straightforward integration with existing systems. `(3/3)`",
              "Channels": "Collaboration with various tech firms and research entities for scale. `(2/3)`",
              "Differentiation/USP": "Advanced software solutions that specifically leverage AI for enhanced performance. `(3/3)`",
              "Patents/IP Protection": "Some patents likely in AI optimization for quantum applications. `(1/3)`",
              "Competitor Benchmarking": "Offers unique solutions that are well-positioned against competitors. `(3/3)`",
              "Funding Stage": "Likely at the growth stage based on industry reports. `(2/3)`",
              "Incorporation Timeline": "Established enough to demonstrate maturity. `(2/3)`",
              "Product Stage": "Actively commercialized products focused on immediate market needs. `(3/3)`",
              "Product Differentiation": "Validates its approach to solving real-world problems using quantum AI synergy. `(3/3)`",
              "Team Strength": "Skilled team in quantum software development enhances credibility. `(2/3)`",
              "Clients": "Serves a growing number of enterprise clients, indicating market validation. `(2/3)`"
          },
          "total_score": 0,
          "relevancy_score": 0
      },
      {
          "name": "1QBit",
          "attributes": {
              "Customer Feedback": "Positive reception in the financial sector regarding their algorithms’ performance. `(2/3)`",
              "Existing Clients": "Works with prominent clients in finance and materials, indicating diversified reach. `(2/3)`",
              "Solution Deployment": "Focus on optimization suggests a streamlined deployment process. `(3/3)`",
              "Channels": "Collaboratives with other tech entities for wider access and application. `(2/3)`",
              "Differentiation/USP": "Specializes in algorithms combining quantum computing and AI for critical applications. `(3/3)`",
              "Patents/IP Protection": "Likely has patents but details are not specified. `(1/3)`",
              "Competitor Benchmarking": "Strong position against competitors in finance-focused quantum applications. `(3/3)`",
              "Funding Stage": "Likely around Series A or post-growth due to existing market presence. `(2/3)`",
              "Incorporation Timeline": "Established presence, enabling innovation over time. `(2/3)`",
              "Product Stage": "Product in active use with enterprise-level focus. `(3/3)`",
              "Product Differentiation": "Tackles mission-critical problems with a clear value proposition for industries. `(3/3)`",
              "Team Strength": "Team likely experienced in both AI and financial modeling. `(2/3)`",
              "Clients": "Works with prominent clients in finance and materials, indicating diversified reach. `(2/3)`"
          },
          "total_score": 0,
          "relevancy_score": 0
      },
      {
          "name": "D-Wave Systems",
          "attributes": {
              "Customer Feedback": "Significant positive feedback on their quantum systems from tech industries. `(2/3)`",
              "Existing Clients": "Extensive range of clients across different sectors establishes validation. `(3/3)`",
              "Solution Deployment": "Offers easy-to-use solutions with clear deployment strategies. `(3/3)`",
              "Channels": "A multitude of partnerships that enhance scalability. `(3/3)`",
              "Differentiation/USP": "Pioneering in quantum system architecture stands out against other models. `(3/3)`",
              "Patents/IP Protection": "Likely holds numerous patents securing innovative elements. `(2/3)`",
              "Competitor Benchmarking": "Major player with robust technology against competitive threats. `(3/3)`",
              "Funding Stage": "Impressive funding history likely beyond Series B. `(3/3)`",
              "Incorporation Timeline": "Established and mature, with a long history of contributions to quantum computing. `(3/3)`",
              "Product Stage": "Fully commercialized products ready for application. `(3/3)`",
              "Product Differentiation": "Key player in AI-enhanced quantum solutions, addressing high-stakes problems. `(3/3)`",
              "Team Strength": "Solid team background in cutting-edge technology and applications. `(3/3)`",
              "Clients": "Extensive range of clients across different sectors establishes validation. `(3/3)`"
          },
          "total_score": 0,
          "relevancy_score": 0
      },
      {
          "name": "Aliro Quantum",
          "attributes": {
              "Customer Feedback": "Positive considerations regarding their product's impact on secure communications. `(2/3)`",
              "Existing Clients": "Growing client base, particularly in security-focused industries. `(2/3)`",
              "Solution Deployment": "Solutions emphasize secure communications, generally straightforward to implement. `(3/3)`",
              "Channels": "Collaborates with defense and communication sectors for broader scale. `(2/3)`",
              "Differentiation/USP": "Tailors quantum networks for secure applications, showcasing unique positioning. `(3/3)`",
              "Patents/IP Protection": "Likely has pending patents focused on communication security applications. `(1/3)`",
              "Competitor Benchmarking": "Unique in its niche of quantum security, offering competitive advantages. `(3/3)`",
              "Funding Stage": "Early funding presence, likely Seed or Series A. `(2/3)`",
              "Incorporation Timeline": "Relatively newer startup, offering innovative solutions. `(1/3)`",
              "Product Stage": "Active product stage with real-time offerings. `(3/3)`",
              "Product Differentiation": "Addresses critical communication needs in a quantum secure framework. `(3/3)`",
              "Team Strength": "A solid team background in quantum technology, though verification needed. `(2/3)`",
              "Clients": "Growing client base, particularly in security-focused industries. `(2/3)`"
          },
          "total_score": 0,
          "relevancy_score": 0
      }
  ]);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("user");
    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      setUserInfo(parsedUserInfo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("promptStorage", inputPrompt);
  }, [inputPrompt]);

  const handleToggleLeftFrameNavbar = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'More';
    console.log("Current tab=>"+currentTab)
    setActiveTab(currentTab);
  }, [searchParams]);

  useEffect(() => {
    router.push(`/?tab=${activeTab}`);
    console.log("Active tab = > "+activeTab);
  }, [activeTab, router]);

  const handleToggleLeftFrame = () => {
    if (open) {
      setOpen(!open);
    }
  };

  const handleBack = () => {
    if (currentStep === "ecosystem") {
      setCurrentStep("usecaseDescription");
    } else if (currentStep === "usecaseDescription") {
      setCurrentStep("usecasesCombined");
    } else if (currentStep === "usecasesCombined") {
      setCurrentStep("industries");
    } else if (currentStep === "industries") {
      setCurrentStep("subSectors");
    } else if (currentStep === "subSectors") {
      setCurrentStep("sectors");
    } else {
      setCurrentStep("trends");
    }
  };

  const handleSectorClick = (sectorName) => {
    setSelectedSector(sectorName);
    setSelectedIndustry(null);
    setSelectedTechnology(null);
    setCurrentStep("subSectors");
  };

  const handleIndustryClick = (industryName) => {
    setSelectedIndustry(industryName);
    setSelectedTechnology(null);
    setCurrentStep("industries");
  };

  const handleTechnologyClick = (technologyName) => {
    setSelectedTechnology(technologyName);
    setCurrentStep("usecasesCombined");
  };

  const toggleWidth = () => {
    setExpanded(!expanded);
  };

  const handleToggleRightFrame = () => {
    if (openRightFrame) {
      setOpenRightFrame(!openRightFrame);
    }
  };

  const dispatch = useAppDispatch();

  const handleSaveInput = async (input: string) => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    const userQuery = { input, session_id: sessionId };
    setMessages((prevMessages) => [
      ...prevMessages,
      { question: input, response: "Loading" },
    ]);

    try {
      const response = await axios.post(
        "https://tyn-server.azurewebsites.net/prompt/chat/",
        userQuery,
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === input
            ? { question: input, response: response.data }
            : msg
        )
      );
    } catch (error) {
      let errorMessage = "Error fetching response";

      if (error.code === "ECONNREFUSED") {
        errorMessage =
          "Connection error: Please ensure you are connected to the internet securely.";
      } else if (error.response && error.response.status === 500) {
        errorMessage = "Internal Server Error: Please try again later.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.question === input
            ? { question: input, presponse: errorMessage }
            : msg
        )
      );
    }
  };

  const handleGetConvo = async () => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");

    if (jwtAccessToken) {
      try {
        const response = await axios.get(
          `https://tyn-server.azurewebsites.net/prompt/convo/${sessionId}/`,
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );

        if (response.status === 200) {
          setMessages(response.data.conversations);
        } else {
          console.error("Failed to fetch conversation data.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching conversation data:",
          error
        );
      }
    } else {
      console.error("JWT token not found in localStorage.");
    }
  };

  useEffect(() => {
    handleGetConvo();
  }, [sessionId]);

  const fetchConnectStatus = async (startupId: number) => {
    dispatch(fetchPartnerConnectsByOrg(startupId));
  };

  const handleSendStartupData = (item: any, message: any) => {
    setMailMessage(message);
    setRequestQuery(message.question);
    setSelectedStartup(item?.database_info);
    setOpenRightFrame(true);
    fetchConnectStatus(item?.database_info?.startup_id);
  };

  const handleShareClick = async () => {
    const encodedSessionID = encryptURL(sessionId);

    const shareUrl: string = `${window.location.origin}/share/${encodedSessionID}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Chat Session",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported");
    }
  };

  console.log("Messages", messages);

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setInputPrompt("");
  };

  const handleCompareResults = async (message: any) => {
    setCompareResultsLoading(true);
    try {
      const response = await postRequestWithAccessToken(
        "https://tyn-server.azurewebsites.net/prompt/compareresults/",
        message
      );
      setComparisonTableResponse(response?.data?.answer?.entities);
      console.log("Response from compare results:", response);
    } catch (error) {
      console.log("handleCompareResults is error", error);
    } finally {
      setCompareResultsLoading(false);
    }
  };

  const renderMessages = () => {
    return messages.map((message: any, index: number) => (
      <div key={index} className="justify-between mb-4 text-[16px]">
        <div className="p-6 text-left border-l-4 border-orange-100">
          <span className="font-semibold text-[17px] text-black block mb-1">
            You:
          </span>
          <span className="text-[17px]">{message?.question}</span>
        </div>
        <div className="p-6 text-left border-l-4 border-blue-100">
          <span className="font-semibold text-black block mb-3">NIFO:</span>
          {message?.response === "Loading" ? (
            <div>
              <BounceLoading />
            </div>
          ) : (
            <div>
              {typeof message?.response?.response === "string" ? (
                message?.response?.response ===
                "No specific details available." ? null : (
                  message?.response?.response
                )
              ) : (
                <div>
                  {message?.response?.response?.response ||
                    JSON.stringify(message?.response?.response)}
                </div>
              )}
              <RenderStartup
                message={message}
                handleSendStartupData={handleSendStartupData}
              />

              {message?.response?.startups && (
                <div className="flex justify-end my-2">
                  <div
                    className="flex gap-2 bg-blue-400 text-white py-2 px-2 w-max items-center rounded-md justify-end text-sm cursor-pointer"
                    onClick={() => handleCompareResults(message)}
                  >
                    {compareResultsLoading ? (
                      <div className="cursor-not-allowed">Loading ...</div>
                    ) : (
                      <div className="flex gap-2 justify-center items-center cursor-pointer">
                        Compare Results <FiPlayCircle />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {comparisonTableResponse && (
                <ComparisonTable data={comparisonTableResponse} />
              )}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderTabContent = () => { 
    switch (activeTab) {
      case "Spotlight":
        return <SpotlightMobile />;
      case "Search":
        return (
          <SearchMobile
            isInputEmpty={isInputEmpty}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
            handleToggleRightFrame={handleToggleRightFrame}
            handleToggleLeftFrame={handleToggleLeftFrame}
            onSaveInput={handleSaveInput}
            handleNewChat={handleNewChat}
            messages={messages}
            setSessionId={setSessionId}
          />
        );
      case "Trends":
        return (
          <TrendsMobile
            selectedSector={selectedSector}
            selectedIndustry={selectedIndustry}
            selectedTechnology={selectedTechnology}
            handleSectorClick={handleSectorClick}
            handleIndustryClick={handleIndustryClick}
            handleTechnologyClick={handleTechnologyClick}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        );
      case "More":
        return <MoreMobile userInfo={userInfo} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col w-full">
      <div className="hidden md:flex w-full flex-row">
        {open && (
          <div className="w-1/5">
            <LeftFrame
              onNewChat={handleNewChat}
              setSessionId={setSessionId}
              setInputPrompt={setInputPrompt}
            />
          </div>
        )}
        <div className="relative flex-grow pt-12">
          <Prompt
            isInputEmpty={isInputEmpty}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            setIsInputEmpty={setIsInputEmpty}
            handleToggleLeftFrame={handleToggleLeftFrame}
            handleToggleRightFrame={handleToggleRightFrame}
            onSaveInput={handleSaveInput}
            defaultPrompt={defaultPrompt}
            renderMessages={renderMessages}
            open={open}
            openRightFrame={openRightFrame}
          />
          <div className="absolute left-2 top-2 flex items-center">
            <NavBar
              open={open}
              handleToggleLeftFrame={handleToggleLeftFrameNavbar}
            />
            {/* <IoShareSocialOutline
              size={24}
              className="ml-4 cursor-pointer"
              onClick={handleShareClick}
              title="Share Chat Session"
            /> */}
          </div>
        </div>

        {openRightFrame && selectedStartup && (
          <div className={`${expanded ? "" : "w-1/4"}`}>
            <CompanyProfilePane
              companyData={selectedStartup}
              setOpenState={setOpenRightFrame}
              openState={openRightFrame}
              userInfo={userInfo}
              expanded={expanded}
              toggleWidth={toggleWidth}
              mailData={mailMessage}
              setMailData={setMailMessage}
              queryData={queryData}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:hidden h-[100dvh]">
        {activeTab === "Trends" ? (
          <TrendsMobileHeader handleBack={handleBack} />
        ) : (
          <MobileHeader />
        )}
        <div className="flex-grow overflow-y-auto">{renderTabContent()}</div>
        <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    </main>
  );
}
