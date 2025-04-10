import { AppDispatch } from "../../store";
import { fetchProjectDetails, setProjectID, enableStep, clearProjectState } from "./projectSlice";
import {
  setQuestionnaireData,
  setJsonForDocument,
  setActiveDefineStepTab,
  resetChallenge,
} from "./challengeSlice";
import axios from "axios";

export const loadFullProjectContext = (projectID: string) => async (dispatch: AppDispatch) => {
  try {
    // Step 0: Full reset before loading new project
    dispatch(clearProjectState());
    dispatch(resetChallenge());

    // Step 1: Fetch project details (01.a)
    const projectRes = await dispatch(fetchProjectDetails(projectID)).unwrap();
    dispatch(setProjectID(projectID));
    dispatch(enableStep(1));

    // Step 2: Fetch questionnaire (01.b)
    const questionRes = await axios.post(
      "https://tyn-server.azurewebsites.net/coinnovation/generate-questions/",
      { project_id: projectID }
    );
    dispatch(setQuestionnaireData(questionRes.data.data));
    // dispatch(enableStep(2));

    // Step 3: Fetch document (01.c)
    const docRes = await axios.get(
      `https://tyn-server.azurewebsites.net/coinnovation/generate-challenge-document/?project_id=${projectID}`
    );
    if (docRes.data.data?.json) {
      dispatch(setJsonForDocument(docRes.data.data.json));
    //   dispatch(enableStep(3));
    }
  } catch (err) {
    console.error("❌ Failed to load full project context", err);
  }
};
