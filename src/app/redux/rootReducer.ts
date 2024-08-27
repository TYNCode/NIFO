import { combineReducers } from "redux";
import chatHistorySlice from "./features/chatHistorySlice";
import userInfoSlice from "./features/auth/userInfoSlice";
import sessionMessageSlice from "./features/chat/sessionMessageSlice";
import loginSlice from "./features/auth/loginSlice";
import registerSlice from "./features/auth/registerSlice";
import spotlightSlice from "./features/spotlight/spotlightSlice";
import companyProfileSlice from "./features/companyprofile/companyProfile";

const rootReducer = combineReducers({
 chatHistory: chatHistorySlice,
 userInfo: userInfoSlice,
 sessionMessage: sessionMessageSlice,
 login: loginSlice,
 register: registerSlice,
 spotlight:spotlightSlice,
 companyProfile: companyProfileSlice,
});

export default rootReducer;