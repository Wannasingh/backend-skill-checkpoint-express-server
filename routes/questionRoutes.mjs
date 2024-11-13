import express from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  searchQuestions,
  voteOnQuestion,
} from "../controllers/questionController.mjs";
import {
  validateQuestionData,
  validateVote,
  validateId,
} from "../middlewares/validateRequest.mjs";

const questionRoutes = express.Router();

questionRoutes.post("/", validateQuestionData, createQuestion);
questionRoutes.get("/", getAllQuestions);
questionRoutes.get("/search", searchQuestions);
questionRoutes.get("/:questionId", validateId, getQuestionById);
questionRoutes.put("/:questionId", validateId, validateQuestionData, updateQuestionById);
questionRoutes.delete("/:questionId", validateId, deleteQuestionById);
questionRoutes.post("/:questionId/vote", validateId, validateVote, voteOnQuestion);

export default questionRoutes;
