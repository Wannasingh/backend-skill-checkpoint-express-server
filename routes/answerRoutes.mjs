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

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   post:
 *     summary: Create a new answer for a question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Unable to create answers
 */
answersRouter.post(
  "/questions/:questionId/answers",
  validateId,
  validateAnswerData,
  createAnswer
);

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers for a question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: List of answers for the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No answers found for this question
 *       500:
 *         description: Unable to fetch answers
 */
answersRouter.get("/questions/:questionId/answers", validateId, getAnswersByQuestionId);

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   delete:
 *     summary: Delete all answers for a question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: All answers for the question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unable to delete answers
 */
answersRouter.delete(
  "/questions/:questionId/answers",
  validateId,
  deleteAnswersByQuestionId
);

/**
 * @swagger
 * /questions/{questionId}/answers/{answerId}/vote:
 *   post:
 *     summary: Vote on an answer
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *       - in: path
 *         name: answerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vote
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *                 description: 1 for upvote, -1 for downvote
 *     responses:
 *       200:
 *         description: Vote on the answer has been recorded successfully
 *       400:
 *         description: Invalid vote value
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Unable to vote on answer
 */
answersRouter.post(
  "/questions/:questionId/answers/:answerId/vote",
  validateId,
  validateVote,
  voteOnAnswer
);


export default answersRouter;
