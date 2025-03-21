import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";

export const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}) => (
  <div className="flex justify-center items-center mt-4">
    <button
      onClick={onPrevious}
      disabled={!canPrevious}
      className="mr-4 p-1 bg-yellow-400 text-white rounded-full disabled:bg-gray-300"
    >
      <GrFormPrevious className="text-3xl" />
    </button>
    <span className="text-gray-600">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={!canNext}
      className="ml-4 p-1 bg-yellow-400 text-white rounded-full disabled:bg-gray-300"
    >
      <MdOutlineNavigateNext className="text-3xl" />
    </button>
  </div>
);
