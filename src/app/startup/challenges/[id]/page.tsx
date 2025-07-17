"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import LeftFrame from "../../../components/LeftFrame/LeftFrame";
import {
  fetchChallengeById,
  Challenge as ChallengeType,
} from "../../../redux/features/coinnovation/challengesListSlice";
import {
  applyToChallenge,
  sendClarification,
} from "../../../redux/features/coinnovation/challengeSlice";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaBuilding,
  FaTag,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaFileAlt
} from "react-icons/fa";

const ChallengeDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedChallenge: challenge,
    selectedLoading: loading,
    selectedError: error,
  } = useSelector((state: RootState) => state.challengesList);
  const {
    applyStatus,
    applyError,
    clarificationStatus,
    clarificationError,
  } = useSelector((state: RootState) => state.challenge);

  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [clarificationSubject, setClarificationSubject] = useState("");
  const [clarificationQuery, setClarificationQuery] = useState("");

  useEffect(() => {
    if (params.id) {
      dispatch(fetchChallengeById(Number(params.id)));
    }
  }, [dispatch, params.id]);

  const handleBack = () => router.back();
  const handleApply = () => setShowTermsModal(true);
  const handleClarification = () => setShowClarificationModal(true);

  const submitApplication = () => {
    if (challenge) {
      dispatch(applyToChallenge({ challengeId: challenge.id }));
    }
  };

  const submitClarification = () => {
    if (challenge && clarificationSubject && clarificationQuery) {
      dispatch(
        sendClarification({
          challengeId: challenge.id,
          subject: clarificationSubject,
          query: clarificationQuery,
        })
      );
    }
  };

  if (!challenge) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
          <LeftFrame />
        </div>
        <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading challenge details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const ClarificationModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Request Clarification</h3>
          <button
            onClick={() => setShowClarificationModal(false)}
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
            value={challenge.title}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            placeholder="Enter subject"
            value={clarificationSubject}
            onChange={e => setClarificationSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            placeholder="Describe your clarification request"
            rows={4}
            value={clarificationQuery}
            onChange={e => setClarificationQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowClarificationModal(false)}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );

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
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors mb-4"
          >
            <FaArrowLeft /> Back to Challenges
          </button>
        </div>

        {/* Challenge Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
                <p className="text-xl opacity-90">{challenge.company}</p>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {challenge.company}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white">
              <FaEye className="text-sm" />
              <span className="text-sm">{challenge.viewCount} views</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1">
                <FaCalendarAlt />
                Due: {new Date(challenge.dueDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FaBuilding />
                {challenge.domain}
              </span>
              <span className="flex items-center gap-1">
                <FaTag />
                {challenge.technology}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaCheckCircle />
                Apply
              </button>
              <button
                onClick={handleClarification}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaFileAlt />
                Clarification
              </button>
            </div>
          </div>
        </div>

        {/* Challenge Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{challenge.summary}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <p className="text-gray-700 leading-relaxed">{challenge.requirements}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario</h3>
              <p className="text-gray-700 leading-relaxed">{challenge.scenario}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Budget Range</h4>
                  <p className="text-2xl font-bold text-blue-600">{challenge.budget}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <p className="text-lg text-gray-700">{challenge.timeline}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Challenge ID:</span>
                  <span className="font-medium">{challenge.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">{challenge.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Technology:</span>
                  <span className="font-medium">{challenge.technology}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{new Date(challenge.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{challenge.viewCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Apply?</h3>
              <p className="text-blue-700 mb-4">
                This is a great opportunity to showcase your expertise and potentially establish a long-term partnership.
              </p>
              <button
                onClick={handleApply}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showClarificationModal && <ClarificationModal />}
        {showTermsModal && <TermsModal />}
      </div>
    </main>
  );
};

export default ChallengeDetails; 