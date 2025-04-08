import React from "react";
import { FaGlobe, FaEnvelope, FaPhone } from "react-icons/fa";

interface ContactIconProps {
  type: "website" | "email" | "phone";
  link: string;
}

const ContactIcon: React.FC<ContactIconProps> = ({ type, link }) => {
  const icons = {
    website: <FaGlobe size={16} />,
    email: <FaEnvelope size={16} />,
    phone: <FaPhone size={16} />,
  };

  return (
    <a
      href={
        type === "email"
          ? `mailto:${link}`
          : type === "phone"
            ? `tel:${link}`
            : link
      }
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition-all"
    >
      {icons[type]}
    </a>
  );
};

export default ContactIcon;
