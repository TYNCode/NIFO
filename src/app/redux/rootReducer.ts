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
import roiEvaluationReducer from "./features/coinnovation/roiEvaluationSlice";
import useCaseSlice from "./features/usecases/useCaseSlice"
import changePasswordSlice from "./features/auth/forgotPasswordSlice";
import resetPasswordSlice from "./features/auth/resetPasswordSlice";
import agreementSlice from "./features/admin/agreements/agreementSlice"
import promptSlice from "./features/prompt/promptSlice";
import trendsReducer from "./features/trendsSlice";

const rootReducer = combineReducers({
  chatHistory: chatHistorySlice,
  userInfo: userInfoSlice,
  sessionMessage: sessionMessageSlice,
  login: loginSlice,
  register: registerSlice,
  changePassword: changePasswordSlice,
  resetPassword : resetPasswordSlice,
  spotlight: spotlightSlice,
  partnerConnect: partnerConnectSlice,
  companyProfile: companyProfileSlice,
  solutionProvider: solutionProviderSlice,
  solutionProviderDetails: solutionProviderDetailsSlice,
  projects: projectSlice,
  challenge: challengeSlice,
  file: fileSlice,
  solutionComparison: solutionComparison,
  roiEvaluation: roiEvaluationReducer,
  useCase:useCaseSlice,
  agreement:agreementSlice,
  prompt: promptSlice,
  trends: trendsReducer,

});

export default rootReducer;
