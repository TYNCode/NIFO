import { AppDispatch } from "../../store";
import { fetchProjectDetails, setProjectID, enableStep, clearProjectState } from "./projectSlice";
import {
  setQuestionnaireData,
  setJsonForDocument,
  setActiveDefineStepTab,
  resetChallenge,
  fetchQuestionnaire,
  fetchChallengeDocument,
} from "./challengeSlice";

export const loadFullProjectContext = (projectID: string) => async (dispatch: AppDispatch) => {
  try {
    // Step 0: Full reset before loading new project
    dispatch(clearProjectState());
    dispatch(resetChallenge());

    // Step 1: Fetch project details (01.a)
    const projectRes = await dispatch(fetchProjectDetails(projectID)).unwrap();
    dispatch(setProjectID(projectID));
    dispatch(enableStep(1));

    // Step 2: Fetch questionnaire (01.b) - uses Redux action
    const questionRes = await dispatch(
      fetchQuestionnaire({ 
        projectID,
        problemStatement: projectRes.problem_statement,
        context: projectRes.project_description || projectRes.context
      })
    ).unwrap();
    dispatch(setQuestionnaireData(questionRes));

    // Step 3: Fetch document (01.c) - uses Redux action
    const docRes = await dispatch(fetchChallengeDocument(projectID)).unwrap();
    if (docRes) {
      dispatch(setJsonForDocument(docRes));
    }
  } catch (err) {
    console.error("❌ Failed to load full project context", err);
  }
};
