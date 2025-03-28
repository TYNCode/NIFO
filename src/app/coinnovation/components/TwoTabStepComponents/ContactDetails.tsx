interface ContactProps {
  contact: {
    website: string;
    email: string;
    phone: string;
    linkedin: string;
  };
}

const ContactDetails: React.FC<ContactProps> = ({ contact }) => {
  return (
    <div className="mt-4 p-3 border rounded bg-gray-50">
      <p className="text-sm font-semibold">Contact Details:</p>
      <div className="text-sm text-gray-700">
        <p>
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {contact.website}
          </a>
        </p>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>
        <p>{contact.linkedin}</p>
      </div>
    </div>
  );
};

export default ContactDetails;
