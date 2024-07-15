import React from "react";

interface SearchResultsMobileProps {}

const searchResultsMobile: React.FC<SearchResultsMobileProps> = () => {
  const startups = [
    { logo: "Logo1", reason: "Reason for startup 1" },
    { logo: "Logo2", reason: "Reason for startup 2" },
    { logo: "Logo3", reason: "Reason for startup 3" },
  ];

  return (
    <>
      <div className="mx-6 flex flex-col gap-6">
        <div className="text-lg font-medium leading-relaxed">
          I need a startup to perform the life insurance underwriting leveraging
          AI in very less time
        </div>
        <div className="text-lg font-light leading-relaxed">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English.
        </div>
        <div className="grid grid-flow-row gap-2">
          <div className="flex text-lg font-medium gap-6">
            <div className="w-1/4">Startups</div>
            <div className="w-3/4">Reason</div>
          </div>
          {startups.length <= 2 ? (
            <div className="flex flex-col gap-6">
              {startups.map((startup, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-1/4">{startup.logo}</div>
                  <div className="w-3/4">{startup.reason}</div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col gap-6"
              style={{ flexGrow: 1, overflowY: "auto" }}
            >
              {startups.map((startup, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-1/4">{startup.logo}</div>
                  <div className="w-3/4">{startup.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default searchResultsMobile;
