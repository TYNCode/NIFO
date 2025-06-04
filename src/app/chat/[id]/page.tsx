"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchSingleSession } from "../../redux/features/chat/sessionMessageSlice";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import RenderMessagesInChat from "../../components/HomePage/RenderMessagesInChat";
import PageLoader from "../../components/PageLoader";

const ChatSessionPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const singleSession = useAppSelector((state) => state.sessionMessage.singleSession);
  const loading = useAppSelector((state) => state.sessionMessage.loading);

  const messages = React.useMemo(() => {
    if (!singleSession?.conversations) return [];
    const grouped = [] as { question: string; response: string }[];
    for (let i = 0; i < singleSession.conversations.length; i += 2) {
      const userMsg = singleSession.conversations[i];
      const aiMsg = singleSession.conversations[i + 1];
      if (userMsg?.role === "user") {
        grouped.push({
          question: userMsg.message,
          response: aiMsg?.message ?? "",
        });
      }
    }
    return grouped;
  }, [singleSession]);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchSingleSession(id));
    }
  }, [id, dispatch]);

  return (
    <div className="flex">
      <div className="w-[21%]">
        <LeftFrame mode="chat" />
      </div>
      <div className="flex-grow pt-12 px-8">
        {loading ? (
          <PageLoader />
        ) : (
          <RenderMessagesInChat messages={messages} />
        )}
      </div>
    </div>
  );
};

export default ChatSessionPage;
