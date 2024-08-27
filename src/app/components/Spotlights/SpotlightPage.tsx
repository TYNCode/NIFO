import Image from "next/image";
import React from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import MobileHeader from "../../mobileComponents/MobileHeader";

const SpotlightPage = ({selectedSpotlight , handleSpotlightShare}) => {
  return (
    <div>
       
       <div>
        <MobileHeader/>
       </div>



      <div>
        <Image
          src="/thirdai-mobile.png"
          width={540}
          height={200}
          alt="spotlight"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2 px-6 py-4 bg-gray-100">
        <div className="leading-9 tracking-wide line-clamp-4 font-medium">
          {selectedSpotlight.spotlight_title}
        </div>
        <div className="font-light text-sm">{selectedSpotlight.created_at}</div>
      </div>

      {/* Export Icons */}
      <div className="flex justify-between  px-6 py-4">
        <div className="flex gap-8">
          {/* Share button */}
          <div
            className="flex flex-col gap-1 text-xs items-center cursor-pointer"
            onClick={handleSpotlightShare}
          >
            <div>
              <IoShareSocialOutline size={24} />
            </div>
            <div>Share</div>
          </div>
          {/* Download button */}
          {/* <div className="flex flex-col gap-1 text-xs items-center">
    <div>
      <MdOutlineFileDownload size={24} />
    </div>
    <div>Download</div>
  </div> */}
        </div>

        {/* Connect button */}
        <div className="bg-blue-400 rounded text-sm uppercase font-medium p-2 text-white flex items-center">
          Connect
        </div>
      </div>

      {/* Content */}
      <div className="mx-10 flex flex-col gap-6 leading-8 py-4">
        {selectedSpotlight.spotlight_content.map((content, index) => (
          <div key={index}>
            <span className="font-semibold">{content.heading}</span>{" "}
            {content.body}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightPage;
