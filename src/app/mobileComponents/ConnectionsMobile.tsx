import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPartnerConnects } from "../redux/features/connection/connectionSlice";

const ConnectionsMobile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connections, loading, error } = useAppSelector(
    (state) => state.partnerConnect
  );


  console.log(connections,"connections");
  useEffect(() => {
    // Fetch connections when the component mounts
    dispatch(fetchPartnerConnects());
  }, [dispatch]);

  if (loading) {
    return <div>Loading connections...</div>;
  }

  if (error) {
    return <div>Error loading connections: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">My Connections</h2>
      {connections.length === 0 ? (
        <div>No connections found.</div>
      ) : (
        <ul className="space-y-4">
          {connections.map((connection:any) => (
            <li
              key={connection.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base font-medium">
                     {connection?.requested_org?.startup_name} 
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Status: {connection.request_status}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectionsMobile;
