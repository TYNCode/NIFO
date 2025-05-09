import React, { useState } from "react";
import BounceLoading from "./BounceLoading/BounceLoading";
import ComparisonTable from "./ComparisonTable";

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
      {messages.map((message: any, index: number) => {
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
          <div key={index} className="justify-between mb-4 text-[16px] w-[50vw]">
            <div className="p-6 text-left border-l-4 border-orange-100">
              <span className="font-semibold text-[17px] text-black block mb-1">
                You:
              </span>
              <span className="text-[17px]">{message?.question}</span>
            </div>

            {/* NIFO Response */}
            <div className="p-6 text-left border-l-4 border-blue-100">
              <span className="font-semibold text-black block mb-3">NIFO:</span>

              {message?.response === "Loading" ? (
                <BounceLoading />
              ) : (
                <>
                  {queryType === "valid" &&
                    ["startup_discovery", "co_innovation"].includes(
                      intentType
                    ) && (
                      <div className="flex flex-col gap-6">
                        <div className="text-xl font-semibold">
                          {expandedQuery}
                        </div>

                        <div className="flex gap-8 border-b-2 pb-2">
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
                                className={`pb-1 cursor-pointer ${activeTab === tab ? "font-semibold text-[#2286C0] border-b-2 border-[#2286C0]" : "text-gray-400"}`}
                              >
                                {tab}
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-4">
                          {activeTab === "Breakdown" && (
                            <>
                              <div className="font-bold text-gray-700 mb-2">
                                Problem:
                              </div>
                              <div className="text-[15px] text-gray-700 mb-4">
                                {breakdown?.core_problem}
                              </div>
                              <div className="font-bold text-gray-700 mb-2">
                                Key Requirements:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {breakdown?.technology_requirements
                                  ?.split(",")
                                  ?.map((tech: string, idx: number) => (
                                    <div
                                      key={idx}
                                      className="px-3 py-1 text-sm rounded-full bg-blue-100 text-[#2286C0] capitalize"
                                    >
                                      {tech.trim()}
                                    </div>
                                  ))}
                              </div>
                            </>
                          )}

                          {activeTab === "Analysis" && (
                            <div className="flex flex-col gap-3">
                              {part1?.startups_brief_list?.map(
                                (startup: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer"
                                    onClick={() => handleSendStartupData && handleSendStartupData(startup, message)}
                                  >
                                    <div className="font-semibold">
                                      {startup.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {startup.description}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {activeTab === "Solution Provider" && (
                            <div className="flex flex-col gap-3">
                              {part2?.recommendations?.map(
                                (startup: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer"
                                    onClick={() => handleSendStartupData && handleSendStartupData(startup, message)}
                                  >
                                    <div className="font-bold text-[16px]">
                                      {startup.name}
                                    </div>
                                    <div className="text-[14px] text-gray-700">
                                      {startup.technology_expertise}
                                    </div>
                                    <div className="text-[13px] text-gray-500 mt-1">
                                      {startup.proven_use_case}
                                    </div>
                                    <div className="text-[13px] text-gray-500">
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
                      <div className="flex flex-col gap-4">
                        <div className="text-xl font-semibold">
                          Detailed Profile
                        </div>

                        <div className="flex flex-col gap-2">
                          <div>
                            <strong>Name:</strong> {responseData.provider_name}
                          </div>
                          <div>
                            <strong>Founded:</strong> {responseData.founded_year}
                          </div>
                          <div>
                            <strong>Headquarters:</strong>{" "}
                            {responseData.headquarters}
                          </div>
                          <div>
                            <strong>Team Strength:</strong>{" "}
                            {responseData.team_strength}
                          </div>
                          <div>
                            <strong>Funding Stage:</strong>{" "}
                            {responseData.funding_stage}
                          </div>
                          <div>
                            <strong>Website:</strong>{" "}
                            <a
                              href={responseData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {responseData.website}
                            </a>
                          </div>
                          <div>
                            <strong>Overview:</strong> {responseData.overview}
                          </div>
                          <div>
                            <strong>Core Offerings:</strong>
                            <ul className="list-disc pl-6">
                              {responseData.core_offerings?.map(
                                (item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <strong>Key Technologies:</strong>
                            <ul className="list-disc pl-6">
                              {responseData.key_technologies?.map(
                                (tech: string, idx: number) => (
                                  <li key={idx}>{tech}</li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <strong>Use Cases:</strong>
                            {responseData.use_cases?.map(
                              (uc: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="mt-2 p-2 bg-gray-50 rounded"
                                >
                                  <div className="font-semibold">{uc.title}</div>
                                  <div className="text-sm">{uc.description}</div>
                                  <div className="text-sm text-gray-600">
                                    Impact: {uc.impact}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Client/Sector: {uc.client_or_sector}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <div>
                            <strong>Notable Clients:</strong>{" "}
                            {responseData.notable_clients?.join(", ")}
                          </div>
                          <div>
                            <strong>Impact Metrics:</strong>
                            <ul className="list-disc pl-6">
                              <li>
                                Clients Served:{" "}
                                {responseData.impact_metrics?.clients_served}
                              </li>
                              <li>
                                Value Generated:{" "}
                                {responseData.impact_metrics?.value_generated}
                              </li>
                              <li>
                                Regions: {responseData.impact_metrics?.regions}
                              </li>
                            </ul>
                          </div>
                          <div>
                            <strong>Competitive Positioning:</strong>
                            <div className="mt-1">
                              Peers:{" "}
                              {responseData.competitive_positioning?.peers?.join(
                                ", "
                              )}
                            </div>
                            <ul className="list-disc pl-6 mt-1">
                              {responseData.competitive_positioning?.differentiators?.map(
                                (d: string, idx: number) => <li key={idx}>{d}</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <strong>USP Summary:</strong>{" "}
                            {responseData.summary_usp}
                          </div>
                        </div>
                      </div>
                    )}

                  {queryType === "valid" && intentType === "trend_insight" && (
                    <div className="flex flex-col gap-5">
                      <div className="text-xl font-semibold">Emerging Trends</div>
                      {trendList?.map((trend: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-gray-50 rounded-lg shadow-sm"
                        >
                          <div className="font-semibold text-[#2286C0] text-[16px]">
                            {trend.name}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {trend.description}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            Example: {trend.example}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold text-gray-700">
                              Startups:
                            </span>
                            <ul className="list-disc pl-6 text-sm text-gray-700">
                              {trend.startups?.map((s: any, sIdx: number) => (
                                <li key={sIdx}>
                                  {s.name} - {s.description}
                                </li>
                              ))}
                            </ul>
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
                    <ComparisonTable
                      data={responseData.comparison_table}
                      recommendation_summary={
                        responseData.recommendation_summary
                      }
                      intentType={responseData.intent_type}
                    />
                  )}

                  {/* Case: Nonsense or Ambiguous */}
                  {(queryType === "nonsense" || queryType === "ambiguous") && (
                    <div className="text-[16px] text-gray-800">
                      {chatResponse}
                      {followUpQuestions && (
                        <ul className="list-disc list-inside mt-4 text-[15px] text-gray-600">
                          {followUpQuestions.map((q: string, idx: number) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      )}
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