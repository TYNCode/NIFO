import { ReactNode } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  type: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg ${type == "edit" ? "w-[80%]" : "w-[40%]"} relative`}
      >
        <div className="bg-primary p-3">
          <button
            className="absolute top-3 right-4 text-white "
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold text-center text-white">
            {title}
          </h2>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
