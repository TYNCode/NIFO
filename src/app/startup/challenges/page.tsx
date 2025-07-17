"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import {
  fetchChallenges,
  Challenge as ChallengeType,
} from "../../redux/features/coinnovation/challengesListSlice";
import {
  applyToChallenge,
  sendClarification,
  fetchChallengeApplications,
} from "../../redux/features/coinnovation/challengeSlice";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCalendarAlt,
  FaBuilding,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getUserFromStorage } from "../../utils/roleBasedRouting";
import axiosPrivate from "../../utils/apiWrapper/axiosPrivate";

const domains = [
  "Manufacturing",
  "Healthcare",
  "Finance",
  "Retail",
  "Energy",
  "Transportation",
];
const technologies = [
  "AI/ML",
  "IoT",
  "Blockchain",
  "Computer Vision",
  "Robotics",
  "Cloud Computing",
];

const StartupChallenges: React.FC = () => {
  console.log("StartupChallenges rendered");
  const dispatch = useDispatch<AppDispatch>();
  const { challenges = [], loading, error } = useSelector(
    (state: RootState) => state.challengesList || { challenges: [], loading: false, error: null }
  );
  const {
    applyStatus,
    applyError,
    clarificationStatus,
    clarificationError,
    applications = [],
  } = useSelector((state: RootState) => state.challenge);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [clarificationSubject, setClarificationSubject] = useState("");
  const [clarificationQuery, setClarificationQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [clarifications, setClarifications] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery("");
    setSelectedDomain("");
    setSelectedTechnology("");
    dispatch(fetchChallenges());
    dispatch(fetchChallengeApplications());
    setCurrentUser(getUserFromStorage());
  }, [dispatch]);

  // Show success modal when application is successful
  useEffect(() => {
    if (applyStatus === "succeeded") {
      setShowSuccessModal(true);
      setShowTermsModal(false); // Hide terms modal if open
    }
  }, [applyStatus]);

  // Hide success modal when user applies again
  useEffect(() => {
    if (showTermsModal) {
      setShowSuccessModal(false);
    }
  }, [showTermsModal]);

  useEffect(() => {
    if (!selectedChallenge || !currentUser) return;
    setLoadingHistory(true);
    setHistoryError(null);
    // Only include 'startup' param if it is a valid number
    const params = [`challenge=${selectedChallenge.id}`];
    if (
      currentUser.startup !== undefined &&
      currentUser.startup !== null &&
      currentUser.startup !== '' &&
      !isNaN(Number(currentUser.startup))
    ) {
      params.push(`startup=${currentUser.startup}`);
    }
    axiosPrivate
      .get(`/coinnovation/challenge-clarifications/?${params.join("&")}`)
      .then((res) => {
        setClarifications(res.data.results || []);
      })
      .catch((err) => {
        setHistoryError("Failed to load clarification history");
      })
      .finally(() => setLoadingHistory(false));
  }, [selectedChallenge, currentUser]);

  const maxClarifications = 3;
  const reachedLimit = clarifications.length >= maxClarifications;

  const filteredChallenges = challenges.filter((challenge) => {
    let match = true;
    if (searchQuery) {
      match =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (selectedDomain) {
      match = match && challenge.industry === selectedDomain;
    }
    if (selectedTechnology) {
      match = match && challenge.technology === selectedTechnology;
    }
    return match;
  });

  console.log("challenges", challenges);
  console.log("filteredChallenges", filteredChallenges);
  console.log("searchQuery", searchQuery, "selectedDomain", selectedDomain, "selectedTechnology", selectedTechnology);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("");
    setSelectedTechnology("");
  };

  const handleApply = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setShowTermsModal(true);
  };

  const handleClarification = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setShowClarificationModal(true);
  };

  const submitApplication = () => {
    if (selectedChallenge) {
      dispatch(applyToChallenge({ challengeId: selectedChallenge.id }));
    }
  };

  const submitClarification = async () => {
    if (selectedChallenge && clarificationSubject && clarificationQuery) {
      try {
        await axiosPrivate.post('/coinnovation/challenge-clarifications/', {
          challenge: selectedChallenge.id,
          subject: clarificationSubject,
          query: clarificationQuery,
        });
        // Optionally, refetch clarifications after successful submit
        setClarificationSubject("");
        setClarificationQuery("");
        // Refetch clarifications
        const params = [`challenge=${selectedChallenge.id}`];
        if (
          currentUser.startup !== undefined &&
          currentUser.startup !== null &&
          currentUser.startup !== '' &&
          !isNaN(Number(currentUser.startup))
        ) {
          params.push(`startup=${currentUser.startup}`);
        }
        axiosPrivate
          .get(`/coinnovation/challenge-clarifications/?${params.join("&")}`)
          .then((res) => {
            setClarifications(res.data.results || []);
          });
      } catch (err) {
        // Optionally, handle error (show toast, etc.)
      }
    }
  };

  // Defensive: ensure applications is always an array
  const safeApplications = Array.isArray(applications) ? applications : [];

  // Helper: Get number of applicants for a challenge
  const getNumApplicants = (challengeId: number) => {
    return safeApplications.filter((app) => app.challenge === challengeId).length;
  };

  const ChallengeCard: React.FC<{ challenge: ChallengeType }> = ({ challenge }) => {
    const applied = challenge.applied;

    console.log("challenge with applied", challenge);
    const numApplicants = getNumApplicants(challenge.id);
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
        <div 
          className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer"
          onClick={() => router.push(`/startup/challenges/${challenge.id}`)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {challenge.company_name}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white">
            <FaEye className="text-sm" />
            <span className="text-sm">{numApplicants}</span>
          </div>
        </div>
        <div className="p-6">
          <h3 
            className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => router.push(`/startup/challenges/${challenge.id}`)}
          >
            {challenge.title}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FaCalendarAlt />
                Due: {new Date(challenge.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {challenge.description}
          </p>
          <div className="flex gap-2">
            {applied ? (
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium cursor-not-allowed opacity-80"
                disabled
              >
                Applied
              </button>
            ) : (
              <button
                onClick={() => handleApply(challenge)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply
              </button>
            )}
            <button
              onClick={() => handleClarification(challenge)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clarification
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Move ClarificationModal outside the main component
  const ClarificationModal: React.FC<{
    selectedChallenge: any,
    clarificationSubject: string,
    setClarificationSubject: (v: string) => void,
    clarificationQuery: string,
    setClarificationQuery: (v: string) => void,
    clarifications: any[],
    loadingHistory: boolean,
    historyError: string | null,
    reachedLimit: boolean,
    onClose: () => void,
    onSubmit: () => void,
  }> = ({
    selectedChallenge,
    clarificationSubject,
    setClarificationSubject,
    clarificationQuery,
    setClarificationQuery,
    clarifications,
    loadingHistory,
    historyError,
    reachedLimit,
    onClose,
    onSubmit,
  }) => {
    console.log("ClarificationModal rendered");
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Request Clarification</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Challenge Title
          </label>
          <input
            type="text"
            value={selectedChallenge?.title || ""}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        {/* Clarification History */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Your Clarification History</div>
          {loadingHistory ? (
            <div>Loading...</div>
          ) : historyError ? (
            <div className="text-red-600">{historyError}</div>
          ) : clarifications.length === 0 ? (
            <div className="text-gray-500">No clarifications sent yet.</div>
          ) : (
            <div className="border rounded divide-y">
              {clarifications.map((clar, idx) => (
                <div key={clar.id} className="p-2">
                  <div className="font-semibold">{idx + 1}. {clar.subject}</div>
                  <div className="text-gray-600 text-sm mb-1">{clar.query}</div>
                  <div className="text-xs text-gray-400">{new Date(clar.sent_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Clarification Form */}
        {reachedLimit ? (
          <div className="text-red-600 font-medium text-center mb-4">
            You have reached the maximum of 3 clarifications for this challenge.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={clarificationSubject}
                onChange={e => setClarificationSubject(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-400 text-right">{clarificationSubject.length}/100</div>
            </div>
            <div className="mb-6">
              <textarea
                placeholder="Describe your clarification request"
                rows={4}
                value={clarificationQuery}
                onChange={e => setClarificationQuery(e.target.value)}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-400 text-right">{clarificationQuery.length}/500</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

  const TermsModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
          <button
            onClick={() => setShowTermsModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Summary of Participation Terms</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Intellectual Property: You retain full IP rights to your solution</li>
            <li>• Confidentiality: All challenge details are confidential</li>
            <li>• Withdrawal: You can withdraw your application at any time</li>
            <li>• Timeline: Project must be completed within specified timeframe</li>
            <li>• Budget: Payment will be made upon successful completion</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Key Benefits</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Direct access to enterprise innovation challenges</li>
            <li>• Potential for long-term partnerships</li>
            <li>• Industry validation and credibility</li>
            <li>• Revenue generation opportunities</li>
          </ul>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowTermsModal(false)}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={submitApplication}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  // Success Modal
  const SuccessModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4 flex flex-col items-center">
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#22c55e"/>
            <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-600 mb-2 text-center">Application Submitted!</h3>
        <p className="text-gray-700 text-center mb-6">Your application has been received successfully. We will notify you about the next steps soon.</p>
        <button
          onClick={() => setShowSuccessModal(false)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Challenges</h1>
            <p className="text-gray-600">Browse and apply to innovation problems posted by enterprises</p>
          </div>
          <button
            onClick={clearFilters}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
            <select
              value={selectedTechnology}
              onChange={(e) => setSelectedTechnology(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Technologies</option>
              {technologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredChallenges.length} of {challenges.length} challenges
          </p>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}

        {showClarificationModal && (
          <ClarificationModal
            selectedChallenge={selectedChallenge}
            clarificationSubject={clarificationSubject}
            setClarificationSubject={setClarificationSubject}
            clarificationQuery={clarificationQuery}
            setClarificationQuery={setClarificationQuery}
            clarifications={clarifications}
            loadingHistory={loadingHistory}
            historyError={historyError}
            reachedLimit={reachedLimit}
            onClose={() => setShowClarificationModal(false)}
            onSubmit={submitClarification}
          />
        )}
        {showTermsModal && <TermsModal />}
        {showSuccessModal && <SuccessModal />}
      </div>
    </main>
  );
};

export default StartupChallenges; 