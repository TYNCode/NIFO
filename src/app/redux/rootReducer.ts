import { combineReducers } from "redux";
import chatHistorySlice from "./features/chatHistorySlice";
import userInfoSlice from "./features/auth/userInfoSlice";
import sessionMessageSlice from "./features/chat/sessionMessageSlice";
import loginSlice from "./features/auth/loginSlice";
import registerSlice from "./features/auth/registerSlice";
import spotlightSlice from "./features/spotlight/spotlightSlice";
import partnerConnectSlice from "./features/connection/connectionSlice"
import companyProfileSlice from "./features/companyprofile/companyProfileSlice";


const rootReducer = combineReducers({
 chatHistory: chatHistorySlice,
 userInfo: userInfoSlice,
 sessionMessage: sessionMessageSlice,
 login: loginSlice,
 register: registerSlice,
 spotlight:spotlightSlice,
 partnerConnect: partnerConnectSlice,
 companyProfile:companyProfileSlice
});

export default rootReducer;