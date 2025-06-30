import React, { useState } from "react";
import BounceLoading from "./BounceLoading/BounceLoading";
import ComparisonTable from "./ComparisonTable";
import ProviderDeepDiveCard from "./ProviderDeepDiveCard";

interface MessageType {
  question: string;
  response: any;
}

interface RenderMessagesInChatProps {
  messages: MessageType[];
  handleSendStartupData?: (item: any, message: any) => void;
}

const RenderMessagesInChat: React.FC<RenderMessagesInChatProps> = ({
  messages,
  handleSendStartupData,
}) => {
  const [activeTabs, setActiveTabs] = useState<{ [key: number]: string }>({});

  return (
    <>
      {(messages && Array.isArray(messages) ? messages : []).map((message: any, index: number) => {
        const activeTab = activeTabs[index] || "Breakdown";
        const responseData = typeof message.response === "object" ? message.response : message;
        const queryType = responseData.query_type || responseData.classifier_output?.query_type;
        const intentType = responseData.intent_type || responseData.classifier_output?.intent_type;
        const breakdown = responseData.breakdown;
        const expandedQuery = responseData.classifier_output?.expanded_query || message?.question;
        const followUpQuestions =
          responseData.follow_up_questions ||
          responseData.classifier_output?.follow_up_questions;
        const chatResponse =
          typeof responseData.response === "string"
            ? responseData.response
            : responseData.classifier_output?.chat_response;
        const part1 = responseData.part_1;
        const part2 = responseData.part_2;
        const trendList = responseData.trends;

        return (
          <div key={index} className="justify-between mb-4 text-[16px] w-full sm:w-[65vw] px-4 sm:px-0">
            <div className="p-4 sm:p-6 text-left border-l-4 border-orange-100">
              <span className="font-semibold text-[17px] text-black block mb-1">
                You:
              </span>
              <span className="text-[17px] break-words">{message?.question}</span>
            </div>

            {/* NIFO Response */}
            <div className="p-4 sm:p-6 text-left border-l-4 border-blue-100">
              <span className="font-semibold text-black block mb-3">NIFO:</span>

              {message?.response === "Loading" ? (
                <div className="text-gray-400 italic py-4">NIFO is thinking...</div>
              ) : (
                <>
                  {queryType === "valid" &&
                    ["startup_discovery", "co_innovation"].includes(
                      intentType
                    ) && (
                      <div className="flex flex-col gap-6">
                        <div className="text-xl font-semibold text-[#2286C0] break-words">
                          {expandedQuery}
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8 border-b-2 pb-2 overflow-x-auto">
                          {["Breakdown", "Analysis", "Solution Provider"].map(
                            (tab) => (
                              <div
                                key={tab}
                                onClick={() =>
                                  setActiveTabs((prev) => ({
                                    ...prev,
                                    [index]: tab,
                                  }))
                                }
                                className={`pb-1 cursor-pointer whitespace-nowrap transition-all duration-200 ${activeTab === tab ? "font-semibold text-[#2286C0] border-b-4 border-[#2286C0]" : "text-gray-400 hover:text-[#2286C0]"}`}
                              >
                                {tab}
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-4">
                          {activeTab === "Breakdown" && (
                            <div className="bg-[#EEF7FF] rounded-xl p-5 mb-4 shadow-sm">
                              <div className="font-bold text-[#2286C0] mb-2">
                                Problem:
                              </div>
                              <div className="text-[15px] text-gray-700 mb-4 break-words">
                                {breakdown?.core_problem}
                              </div>
                              <div className="font-bold text-[#2286C0] mb-2">
                                Key Requirements:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {breakdown?.technology_requirements
                                  ?.split(",")
                                  ?.map((tech: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 text-sm rounded-full bg-[#2286C0] text-white capitalize break-words font-medium"
                                    >
                                      {tech.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          {activeTab === "Analysis" && (
                            <div className="flex flex-col gap-4">
                              {part1?.startups_brief_list?.map(
                                (startup: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="p-4 bg-[#EEF7FF] border-l-4 border-[#2286C0] rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#005fa3]"
                                    onClick={() => handleSendStartupData && handleSendStartupData(startup, message)}
                                  >
                                    <div className="font-bold text-[#2286C0] text-base break-words">
                                      {startup.name}
                                    </div>
                                    <div className="text-sm text-gray-700 break-words">
                                      {startup.description}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {activeTab === "Solution Provider" && (
                            <div className="flex flex-col gap-4">
                              {part2?.recommendations?.map(
                                (startup: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="p-4 bg-[#FFF9E5] border-l-4 border-[#FFD600] rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:border-yellow-600"
                                    onClick={() => handleSendStartupData && handleSendStartupData(startup, message)}
                                  >
                                    <div className="font-bold text-[#B8860B] text-base break-words">
                                      {startup.name}
                                    </div>
                                    <div className="text-[14px] text-gray-700 break-words">
                                      {startup.technology_expertise}
                                    </div>
                                    <div className="text-[13px] text-gray-500 mt-1 break-words">
                                      {startup.proven_use_case}
                                    </div>
                                    <div className="text-[13px] text-gray-500 break-words">
                                      {startup.key_clients_or_industries_served}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  {queryType === "valid" &&
                    intentType === "provider_deep_dive" && (
                      <ProviderDeepDiveCard data={responseData} />
                    )}

                  {queryType === "valid" && intentType === "trend_insight" && (
                    <div className="flex flex-col gap-6">
                      {trendList?.map((trend: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-xl shadow-md border-l-4 border-[#2286C0] bg-white p-5 flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-[#2286C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span className="font-bold text-lg text-[#2286C0]">{trend.name}</span>
                          </div>
                          <div className="text-gray-700 text-[15px] mb-2">{trend.description}</div>
                          <div className="bg-[#FFF9E5] border-l-4 border-yellow-400 rounded p-3 text-gray-800 text-sm mb-2">
                            <span className="font-semibold text-yellow-700">Example:</span> {trend.example}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Startups:</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {trend.startups?.map((s: any, sIdx: number) => (
                                <div key={sIdx} className="bg-[#EEF7FF] rounded-lg px-3 py-2 flex flex-col">
                                  <span className="font-bold text-[#2286C0] text-sm">{s.name}</span>
                                  <span className="text-xs text-gray-600">{s.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Case: Comparison Results */}
                  {queryType === "valid" &&
                  intentType === "compare_startups" &&
                  Array.isArray(responseData.comparison_table) &&
                  responseData.comparison_table.length > 0 && (
                    <div className="overflow-x-auto">
                      <ComparisonTable
                        data={responseData.comparison_table}
                        recommendation_summary={
                          responseData.recommendation_summary
                        }
                        intentType={responseData.intent_type}
                      />
                    </div>
                  )}

                  {/* Case: Nonsense or Ambiguous */}
                  {(queryType === "nonsense" || queryType === "ambiguous") && (
                    <div className="text-[16px] text-gray-800 break-words">
                      {chatResponse}
                      {followUpQuestions && (
                        <ul className="list-disc list-inside mt-4 text-[15px] text-gray-600">
                          {followUpQuestions.map((q: string, idx: number) => (
                            <li key={idx} className="break-words">{q}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Clarification intent type */}
                  {queryType === "valid" && intentType === "clarification" && (
                    <div className="bg-[#EEF7FF] border-l-4 border-[#2286C0] rounded-lg p-4 flex items-start gap-2 my-2">
                      <svg className="w-5 h-5 text-[#2286C0] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                      <div>
                        <div className="text-[#2286C0] font-semibold mb-1">Clarification</div>
                        <div className="text-gray-800">{chatResponse}</div>
                        {followUpQuestions?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {followUpQuestions.map((q: string, idx: number) => (
                              <span key={idx} className="bg-[#FFD600] text-gray-900 px-3 py-1 rounded-full text-xs font-medium">{q}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RenderMessagesInChat;