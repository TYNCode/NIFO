"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchConversationsBySessionId } from "../../redux/features/chat/sessionMessageSlice";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import RenderMessagesInChat from "../../components/HomePage/RenderMessagesInChat";

const ChatSessionPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.sessionMessage.conversations);
  const loading = useAppSelector((state) => state.sessionMessage.loading);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchConversationsBySessionId(id));
    }
  }, [id, dispatch]);

  return (
    <div className="flex">
      <div className="w-[21%]">
        <LeftFrame mode="chat" />
      </div>
      <div className="flex-grow pt-12 px-8">
        {loading ? (
          <div className="mt-10 text-gray-600">Loading chat...</div>
        ) : (
          <RenderMessagesInChat messages={messages} />
        )}
      </div>
    </div>
  );
};

export default ChatSessionPage;
