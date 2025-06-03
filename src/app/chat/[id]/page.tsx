// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { fetchSingleSession } from "../../redux/features/chat/sessionMessageSlice";
// import BounceLoading from "../../components/HomePage/BounceLoading/BounceLoading";
// import LeftFrame from "../../components/LeftFrame/LeftFrame";


// const ChatSessionPage = () => {
//   const { id } = useParams();
//   const dispatch = useAppDispatch();
//   const { singleSession, loading } = useAppSelector((state) => state.sessionMessage);
//   const [activeTabs, setActiveTabs] = useState<{ [index: number]: string }>({});

//   console.log("singleSession",singleSession)
//   useEffect(() => {
//     if (id && typeof id === "string") {
//       dispatch(fetchSingleSession(id));
//     }
//   }, [id, dispatch]);

//   const renderMessages = () => {
//     if (!singleSession?.conversations) return null;

//     const groupedMessages = [];
//     for (let i = 0; i < singleSession.conversations.length; i += 2) {
//       const userMsg = singleSession.conversations[i];
//       const aiMsg = singleSession.conversations[i + 1];
//       groupedMessages.push({ question: userMsg?.message, response: aiMsg?.message });
//     }

//     return groupedMessages.map((message, index) => {
//       const activeTab = activeTabs[index] || "Breakdown";

//       return (
//         <div key={index} className="justify-between mb-4 text-[16px] w-[50vw]">
//           <div className="p-6 text-left border-l-4 border-orange-100">
//             <span className="font-semibold text-[17px] text-black block mb-1">You:</span>
//             <span className="text-[17px]">{message?.question}</span>
//           </div>

//           <div className="p-6 text-left border-l-4 border-blue-100">
//             <span className="font-semibold text-black block mb-3">NIFO:</span>
//             {message?.response === "Loading" ? (
//               <BounceLoading />
//             ) : (
//               <div className="text-[16px] text-gray-700 whitespace-pre-line">
//                 {message?.response}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="flex">
//       <div className="w-[21%]">
//         <LeftFrame mode="chat" />
//       </div>
//       <div className="flex-grow pt-12 px-8">
//         {loading ? (
//           <div className="mt-10 text-gray-600">Loading chat...</div>
//         ) : (
//           renderMessages()
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatSessionPage;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page