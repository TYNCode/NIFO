"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { decryptURL } from "../../utils/shareUtils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchConversationsBySessionId } from "../../redux/features/chat/sessionMessageSlice";
import { ConversationType } from "@/app/interfaces";

const ShareSessionPage = () => {
  const dispatch = useAppDispatch();

  const messages = useAppSelector((state) => state.sessionMessage.conversations);
  const loading = useAppSelector((state) => state.sessionMessage.loading);
  const error = useAppSelector((state) => state.sessionMessage.error);

  const params = useParams();
  let encodedSessionID = params?.id;

  if (Array.isArray(encodedSessionID)) {
    encodedSessionID = encodedSessionID[0];
  }

  if (typeof encodedSessionID !== "string") {
    console.error("Invalid session ID in URL.");
    return <div className="text-center mt-10 text-red-500">Invalid session link.</div>;
  }

  const decryptedSessionId = decryptURL(encodedSessionID);

  useEffect(() => {
    if (decryptedSessionId) {
      dispatch(fetchConversationsBySessionId(decryptedSessionId));
    }
  }, [decryptedSessionId, dispatch]);

  const renderSolutionOrchestration = (message: ConversationType) => (
    <div>
      {message?.response?.steps?.map((step, index) => (
        <div key={index}>
          <div className="flex gap-2 m-2 mt-4">
            <div>Step: {step?.step_number}</div>
            <div>{step?.step_description}</div>
          </div>
          {step?.startups?.map((startup, sIndex) => (
            <div
              key={sIndex}
              className="grid grid-cols-3 mt-4 rounded shadow-md p-2 bg-blue-100 cursor-pointer"
            >
              <div className="text-sm">{startup?.name}</div>
              <div className="text-sm col-span-2">{startup?.description}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderOtherCategories = (message: ConversationType) => {
    const startups = message?.response?.startups;

    if (!startups || startups.length === 0) return null;

    return (
      <div>
        <div className="grid grid-cols-3 font-semibold text-base">
          <div>Startup Name</div>
          <div className="col-span-2">Reason</div>
        </div>

        {startups.map((startup, index) => (
          <div
            key={index}
            className="grid grid-cols-3 mt-4 rounded shadow-md p-2 bg-blue-100 cursor-pointer"
          >
            <div className="text-sm">{startup?.name}</div>
            <div className="text-sm col-span-2">{startup?.description}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderMessages = () => {
    if (loading) {
      return <div className="text-center mt-10 text-gray-500">Loading conversation...</div>;
    }

    if (error) {
      return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    if (!messages.length) {
      return <div className="text-center mt-10 text-gray-400">No messages found.</div>;
    }

    return messages.map((message, index) => (
      <div key={index} className="justify-between mb-4 text-[16px] px-6">
        <div className="p-6 text-left border-l-4 border-orange-100">
          <span className="font-semibold text-[17px] text-black block mb-1">You:</span>
          <span className="text-[17px]">{message?.question}</span>
        </div>
        <div className="p-6 text-left border-l-4 border-blue-100">
          <span className="font-semibold text-black block mb-3">NIFO:</span>
          <div>
            {message?.response?.response !== "No specific details available." && (
              <div className="mb-2">{message.response.response}</div>
            )}
            {message?.response?.category === "business problem(solution orchestration)"
              ? renderSolutionOrchestration(message)
              : renderOtherCategories(message)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="sm:mx-10 md:mx-80 xl:mx-[400px] my-4 flex flex-col gap-2 pb-32">
        {renderMessages()}
      </div>

      <div className="fixed bottom-10 left-[35%] sm:left-[48%]">
        <button className="bg-blue-400 sm:bg-yellow-400 px-2 py-2 rounded-lg text-white font-semibold">
          <Link href="/login">Log into Nifo</Link>
        </button>
      </div>
    </div>
  );
};

export default ShareSessionPage;
