import React from 'react';

interface ProviderDeepDiveCardProps {
  data: any;
}

const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'blue' }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2 mb-2 bg-${color}-100 text-${color}-800`}>{children}</span>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[#2286C0] font-bold text-lg border-l-4 border-[#2286C0] pl-2 mb-2 mt-4">{children}</div>
);

const ProviderDeepDiveCard: React.FC<ProviderDeepDiveCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 max-w-2xl mx-auto my-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#EEF7FF] flex items-center justify-center border-2 border-[#2286C0]">
          <span className="text-2xl text-[#2286C0] font-bold">{data.provider_name?.[0] || '?'}</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-[#2286C0] mb-1 tracking-tight">{data.provider_name}</h2>
          <div className="text-gray-600 text-base mb-1">{data.headquarters} {data.founded_year && <>• Founded {data.founded_year}</>}</div>
          <Pill color="yellow">{data.funding_stage}</Pill>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="flex flex-wrap justify-center md:justify-start mb-4">
        <Pill><span className="mr-1">👥</span>Team: {data.team_strength || 'N/A'}</Pill>
        <Pill><span className="mr-1">🏆</span>Clients: {data.impact_metrics?.clients_served || 'N/A'}</Pill>
        <Pill><span className="mr-1">🌎</span>Regions: {data.impact_metrics?.regions || 'N/A'}</Pill>
        <Pill color="yellow"><span className="mr-1">💰</span>Value: {data.impact_metrics?.value_generated || 'N/A'}</Pill>
      </div>

      {/* Overview */}
      <SectionTitle>Overview</SectionTitle>
      <div className="text-gray-700 text-base mb-2">{data.overview || 'No overview available.'}</div>

      {/* Core Offerings */}
      {data.core_offerings?.length > 0 && (
        <>
          <SectionTitle>Core Offerings</SectionTitle>
          <div className="flex flex-wrap mb-2">
            {data.core_offerings.map((item: string, idx: number) => (
              <Pill key={idx}>{item}</Pill>
            ))}
          </div>
        </>
      )}

      {/* Key Technologies */}
      {data.key_technologies?.length > 0 && (
        <>
          <SectionTitle>Key Technologies</SectionTitle>
          <div className="flex flex-wrap mb-2">
            {data.key_technologies.map((tech: string, idx: number) => (
              <Pill key={idx} color="gray">{tech}</Pill>
            ))}
          </div>
        </>
      )}

      {/* Use Cases */}
      {data.use_cases?.length > 0 && (
        <>
          <SectionTitle>Use Cases & Impact</SectionTitle>
          <div className="space-y-3 mb-2">
            {data.use_cases.map((uc: any, idx: number) => (
              <div key={idx} className="bg-[#EEF7FF] rounded-lg p-3">
                <div className="font-bold text-[#2286C0] mb-1">{uc.title}</div>
                <div className="text-gray-700 text-sm mb-1">{uc.description}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Pill color="yellow">Impact: {uc.impact}</Pill>
                  <Pill color="gray">Client/Sector: {uc.client_or_sector}</Pill>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Notable Clients */}
      {data.notable_clients?.length > 0 && (
        <>
          <SectionTitle>Notable Clients</SectionTitle>
          <div className="flex flex-wrap mb-2">
            {data.notable_clients.map((client: string, idx: number) => (
              <Pill key={idx} color="gray">{client}</Pill>
            ))}
          </div>
        </>
      )}

      {/* Competitive Positioning */}
      {data.competitive_positioning && (
        <>
          <SectionTitle>Competitive Positioning</SectionTitle>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Peers:</span>
            <div className="flex flex-wrap mt-1">
              {data.competitive_positioning.peers?.map((peer: string, idx: number) => (
                <Pill key={idx} color="gray">{peer}</Pill>
              ))}
            </div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Differentiators:</span>
            <ul className="list-disc pl-6 mt-1">
              {data.competitive_positioning.differentiators?.map((diff: string, idx: number) => (
                <li key={idx} className="text-gray-700 text-sm mb-1">{diff}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* USP Summary */}
      {data.summary_usp && (
        <>
          <SectionTitle>Unique Selling Proposition</SectionTitle>
          <div className="bg-[#FFF9E5] border-l-4 border-yellow-400 rounded p-3 text-gray-800 text-sm mb-2">
            {data.summary_usp}
          </div>
        </>
      )}

      {/* Website Link */}
      {data.website && (
        <div className="text-center mt-4">
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#2286C0] hover:bg-blue-700 text-white font-bold rounded-full shadow transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" /></svg>
            Visit Website
          </a>
        </div>
      )}
    </div>
  );
};

export default ProviderDeepDiveCard;

// Animations
// Add this to your global CSS or Tailwind config:
// .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none;} } 