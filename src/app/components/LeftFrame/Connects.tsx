import React, { useState, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPartnerConnectsMade, fetchPartnerConnectsReceived } from '../../redux/features/connection/connectionSlice';

const Connects: React.FC = () => {
    const dispatch = useAppDispatch();
    const { connectionsMade, connectionsReceived, loading, error } = useAppSelector((state) => state.partnerConnect);

    const [expandedConnections, setExpandedConnections] = useState(false);
    const [expandedInvitations, setExpandedInvitations] = useState(false);
    const [expandedRequests, setExpandedRequests] = useState(false);

    // Fetch data when the component mounts
    useEffect(() => {
        dispatch(fetchPartnerConnectsMade());
        dispatch(fetchPartnerConnectsReceived());
    }, [dispatch]);

    const toggleConnections = () => {
        setExpandedConnections(!expandedConnections);
    };

    const toggleInvitations = () => {
        setExpandedInvitations(!expandedInvitations);
    };

    const toggleRequests = () => {
        setExpandedRequests(!expandedRequests);
    };

    return (
        <>
            <div className='text-sm py-3 px-2 text-gray-400 font-semibold'>
                Connects
            </div>

            <div className=''>
                {/* Connections Section */}
                <div
                    className={`border bg-gray-100 flex flex-row items-center py-3 cursor-pointer hover:bg-blue-100 text-gray-400 hover:text-black mb-1`}
                    onClick={toggleConnections}
                >
                    <div className='flex flex-col ml-1.5 text-black'>
                        <div className='mt-1 text-sm font-medium'>Connections</div>
                    </div>
                    <div className='flex items-center ml-auto mr-2'>
                        <span className='text-xs text-gray-500 mr-1'>{connectionsMade ? connectionsMade.length : 0}</span>
                        <FaAngleDown
                            className={`text-gray-500 transition-transform transform ${
                                expandedConnections ? 'rotate-0' : 'rotate-180'
                            }`}
                        />
                    </div>
                </div>
                {expandedConnections && (
                    <div className='px-4 py-2 bg-gray-50 border border-t-0 '>
                        {loading ? (
                            <p>Loading connections...</p>
                        ) : error ? (
                            <p className='text-red-500'>{error}</p>
                        ) : connectionsMade && connectionsMade.length > 0 ? (
                            <ul>
                                {connectionsMade.map((connection: any, index: number) => (
                                    <div key={index} className='my-1'>
                                        {connection?.requested_org?.startup_name}
                                        <div className='capitalize text-gray-400 text-sm'>
                                            Status : {connection.request_status}
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p>No connections found.</p>
                        )}
                    </div>
                )}

                {/* Invitations Section */}
                <div
                    className={`border bg-gray-100 flex flex-row items-center py-3 cursor-pointer hover:bg-blue-100 text-gray-400 hover:text-black mb-1`}
                    onClick={toggleInvitations}
                >
                    <div className='flex flex-col ml-1.5 text-black'>
                        <div className='mt-1 text-sm font-medium'>Invitations</div>
                    </div>
                    <div className='flex items-center ml-auto mr-2'>
                        <span className='text-xs text-gray-500 mr-1'>{connectionsReceived ? connectionsReceived.length : 0}</span>
                        <FaAngleDown
                            className={`text-gray-500 transition-transform transform ${
                                expandedInvitations ? 'rotate-0' : 'rotate-180'
                            }`}
                        />
                    </div>
                </div>
                {expandedInvitations && (
                    <div className='px-4 py-2 bg-gray-50 border border-t-0'>
                        {loading ? (
                            <p>Loading invitations...</p>
                        ) : error ? (
                            <p className='text-red-500'>Error: {error}</p>
                        ) : connectionsReceived && connectionsReceived.length > 0 ? (
                            <ul>
                                {connectionsReceived.map((invitation: any, index: number) => (
                                    <li key={index}>
                                        {invitation?.user?.organization?.startup_name || 'N/A'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No invitations received.</p>
                        )}
                    </div>
                )}

                {/* Requests Sent Section */}
                {/* <div
                    className={`border bg-gray-100 flex flex-row items-center py-3 cursor-pointer hover:bg-blue-100 text-gray-400 hover:text-black mb-1`}
                    onClick={toggleRequests}
                >
                    <div className='flex flex-col ml-1.5 text-black'>
                        <div className='mt-1 text-sm font-medium'>Request Sent</div>
                    </div>
                    <div className='flex items-center ml-auto mr-2'>
                        <span className='text-xs text-gray-500 mr-1'>7</span>
                        <FaAngleDown
                            className={`text-gray-500 transition-transform transform ${
                                expandedRequests ? 'rotate-0' : 'rotate-180'
                            }`}
                        />
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default Connects;
