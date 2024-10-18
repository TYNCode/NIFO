import React from "react";

const EcosystemWeb = ({ handleExploreClick, selectedEcosystem }) => {
  return (
    <div className="mx-auto w-[400px] h-[83vh] flex mt-8">
      <div className="flex flex-col gap-8 justify-around items-center bg-white shadow-lg px-5 rounded py-8 overflow-y-auto w-full h-full scrollbar-thin">
        <div className="relative flex flex-col gap-8 py-6 px-4 w-full bg-blue-400">
          <img
            src="ecosystembg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 "
          />

          {/* Content above the image */}
          <div className="relative z-10 text-center text-white font-medium text-xl">
            {selectedEcosystem
              ? selectedEcosystem
              : "AI-Generated Marketing Campaigns for Targeted Financial Products"}
          </div>

          {/* Button to navigate to the StartupsWeb component */}
          <div
            className="relative z-10 flex mx-auto px-8 py-3 rounded-md font-medium bg-blue-200 text-black border-[1px] w-max justify-center items-center cursor-pointer"
            onClick={handleExploreClick} // Navigate to StartupsWeb
          >
            Explore Ecosystem
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-lg">Description</div>
            <div className="text-base">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there isn't anything embarrassing
              hidden in the middle of text.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-lg">Enhancement</div>
            <div>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemWeb;
