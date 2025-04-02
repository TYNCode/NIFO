export const UserDetails = ({ user }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      {user.first_name}
    </h3>
    <dl className="flex flex-col gap-4">
      <div>
        <dt className="font-bold text-gray-700">Email:</dt>
        <dd>
          <a
            href={`mailto:${user.email}`}
            className="text-blue-500 hover:underline"
          >
            {user.email}
          </a>
        </dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Startup Name:</dt>
        <dd className="text-gray-700">{user.startup_name}</dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Status:</dt>
        <dd className="text-gray-700">
          {user.is_active ? "Active" : "Inactive"}
        </dd>
      </div>

      <div>
        <dt className="font-bold text-gray-700">Primary User:</dt>
        <dd className="text-gray-700">{user.is_primary_user ? "Yes" : "No"}</dd>
      </div>
    </dl>
  </div>
);
