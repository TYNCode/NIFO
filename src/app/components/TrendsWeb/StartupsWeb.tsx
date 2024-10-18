import React from "react";
import { FaGlobe } from "react-icons/fa";

const data = [
  {
    title: "Lorem ipsum dolor 1",
    description:
      "Lorem ipsum jsdj soaoajd odAnsj jklklakei okajyeb jaookma aiajshu.",
    imgSrc: "kissflow.png",
  },
  {
    title: "Lorem ipsum dolor 2",
    description:
      "Lorem ipsum jsdj soaoajd odAnsj jklklakei okajyeb jaookma aiajshu.",
    imgSrc: "kissflow.png",
  },
  {
    title: "Lorem ipsum dolor 3",
    description:
      "Lorem ipsum jsdj soaoajd odAnsj jklklakei okajyeb jaookma aiajshu.",
    imgSrc: "kissflow.png",
  },
];

const StartupsWeb = ({ handleEcosystem }) => {
  return (
    <div className="mx-auto w-[400px] flex justify-center items-center h-screen">
      <div className="flex flex-col gap-8 justify-center items-center bg-white">
        <div className="relative flex flex-col justify-center items-center gap-8 mx-4 bg-blue-400 h-[200px] overflow-hidden">
          <img
            src="ecosystembg.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 text-white font-semibold text-2xl text-center">
            AI-Generated Marketing Campaigns for Targeted Financial Products
          </div>

          {/* Button to go back to EcosystemWeb */}
          <div
            className="relative z-50 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
            onClick={handleEcosystem} // Navigate back to EcosystemWeb
          >
            Explore Usecases
          </div>
        </div>

        <div className="flex flex-col overflow-y-scroll h-[340px] scrollbar-thin">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col mx-2 px-2 py-1.5 mb-10 bg-white rounded-md shadow-md"
            >
              <div className="flex flex-row">
                <div className="flex flex-col gap-2">
                  <div className="font-medium">{item.title}</div>
                  <div>{item.description}</div>
                  <div className="flex flex-row justify-center gap-2 items-center rounded-md p-1.5 border-2 border-black w-max">
                    <div>Explore</div>
                    <div>
                      <FaGlobe />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={item.imgSrc}
                    alt="Kissflow"
                    className="w-40 object-cover h-[80px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupsWeb;
