import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FcIdea } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { IoTrendingUpSharp } from "react-icons/io5";
import { useAppDispatch } from "../redux/hooks";
import { clearProjectState } from "../redux/features/coinnovation/projectSlice";
import { resetChallenge } from "../redux/features/coinnovation/challengeSlice";
interface NavbarProps {
  open: boolean;
  handleToggleLeftFrame: () => void;
}

const NavBar: React.FC<NavbarProps> = ({ open, handleToggleLeftFrame }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleTrendsRoute = () => {
    router.push("/trends");
  };
  const handleCoinnovationRoute = () => {
    localStorage.removeItem("projectID");
    localStorage.removeItem("problemStatement");
    localStorage.setItem("activeTab", "01.a");
    dispatch(clearProjectState());
    dispatch(resetChallenge());
    router.push("/coinnovation");
  };
  return (
    <div
      className={`flex bg-white items-center flex-col gap-8  cursor-pointer transition-all`}
    >
      {open ? (
        <div
          className={`${open ? "" : "hidden"}`}
          onClick={handleToggleLeftFrame}
        >
          <div>
            <IoIosArrowBack size={23} />
          </div>
        </div>
      ) : (
        <div
          className={`${!open ? "" : "hidden"}`}
          onClick={handleToggleLeftFrame}
        >
          <IoIosArrowForward size={23} />
        </div>
      )}
      <div className="hover:text-blue-500" onClick={handleTrendsRoute}>
        <IoTrendingUpSharp size={23} />
      </div>
      <div className="hover:text-blue-500" onClick={handleCoinnovationRoute}>
        <FcIdea size={23} />
      </div>
    </div>
  );
};

export default NavBar;
