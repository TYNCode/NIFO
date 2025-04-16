import { combineReducers } from "redux";
import chatHistorySlice from "./features/chatHistorySlice";
import userInfoSlice from "./features/auth/userInfoSlice";
import sessionMessageSlice from "./features/chat/sessionMessageSlice";
import loginSlice from "./features/auth/loginSlice";
import registerSlice from "./features/auth/registerSlice";
import spotlightSlice from "./features/spotlight/spotlightSlice";
import partnerConnectSlice from "./features/connection/connectionSlice";
import companyProfileSlice from "./features/companyprofile/companyProfileSlice";
import projectSlice from "./features/coinnovation/projectSlice";
import challengeSlice from "./features/coinnovation/challengeSlice";
import fileSlice from "./features/coinnovation/fileSlice";
import solutionProviderSlice from "./features/source/solutionProviderSlice";
import solutionProviderDetailsSlice from "./features/source/solutionProviderDetailsSlice";
import solutionComparison from "./features/source/solutionCompareSlice";

const rootReducer = combineReducers({
  chatHistory: chatHistorySlice,
  userInfo: userInfoSlice,
  sessionMessage: sessionMessageSlice,
  login: loginSlice,
  register: registerSlice,
  spotlight: spotlightSlice,
  partnerConnect: partnerConnectSlice,
  companyProfile: companyProfileSlice,
  solutionProvider: solutionProviderSlice,
  solutionProviderDetails: solutionProviderDetailsSlice,
  projects: projectSlice,
  challenge: challengeSlice,
  file: fileSlice,
  solutionComparison: solutionComparison,
});

export default rootReducer;
