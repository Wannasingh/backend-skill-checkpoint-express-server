import { Router } from "express";
import {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswersByQuestionId,
  voteOnAnswer,
} from "../controllers/answerController.mjs";
import {
  validateAnswerData,
  validateVote,
  validateId,
} from "../middlewares/validateRequest.mjs";

const answersRouter = Router();

answersRouter.post(
  "/questions/:questionId/answers",
  validateId,
  validateAnswerData,
  createAnswer
);
answersRouter.get("/questions/:questionId/answers",validateId, getAnswersByQuestionId);
answersRouter.delete(
  "/questions/:questionId/answers",
  validateId, deleteAnswersByQuestionId
);
answersRouter.post(
  "/answers/:answerId/vote",
  validateId,
  validateVote,
  voteOnAnswer
);

export default answersRouter;
