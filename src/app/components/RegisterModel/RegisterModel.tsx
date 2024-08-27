import React from 'react';

interface RegistrationModelProps {
  onClose: () => void;
  onSubmit: (data: { organization_name: string; website: string; description: string }) => void;
}

const RegistrationModel: React.FC<RegistrationModelProps> = ({ onClose, onSubmit }) => {
  const [organizationName, setOrganizationName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ organization_name: organizationName, website, description });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          X
        </button>
        
        <h2 className="text-lg font-bold mb-4">Add Organization</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text"
              placeholder='OrganizationName'
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              placeholder='Website'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModel;
