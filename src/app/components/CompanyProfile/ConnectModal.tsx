import React from 'react'

const ConnectModal = ({closeModal}) => {
  return (
    <div>
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg">
                      <p className="text-blue-500">
                        Email has been sent to TYN consultant.We will reach you
                        in short span of time
                      </p>
                      <button
                        onClick={closeModal}
                        className="mt-4 bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Close
                      </button>
                    </div>
                  </div>
    </div>
  )
}

export default ConnectModal