import {
  validateQuestionData,
  validateVote,
  validateId,
} from "../middlewares/validateRequest.mjs";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  searchQuestions,
  voteOnQuestion,
} from "../controllers/questionController.mjs";
import express from "express";
const questionRoutes = express.Router();

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Unable to create question
 */
questionRoutes.post("/", validateQuestionData, createQuestion);

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: List of all questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Unable to fetch questions or connect to the database
 */
questionRoutes.get("/", getAllQuestions);

/**
 * @swagger
 * /questions/search:
 *   get:
 *     summary: Search questions by title or category
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by title (optional)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Search by category (optional)
 *     responses:
 *       200:
 *         description: Questions found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       400:
 *         description: At least one search parameter is required
 *       404:
 *         description: No questions found matching the search criteria
 *       500:
 *         description: Unable to fetch questions
 */
questionRoutes.get("/search", searchQuestions);

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to fetch questions
 */
questionRoutes.get("/:questionId", validateId, getQuestionById);

/**
 * @swagger
 * /questions/{questionId}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
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
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to update question
 */
questionRoutes.put(
  "/:questionId",
  validateId,
  validateQuestionData,
  updateQuestionById
);

/**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     summary: Delete a question and all its associated answers
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to delete
 *     responses:
 *       200:
 *         description: Question and all associated answers deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to delete question and its answers
 */
questionRoutes.delete("/:questionId", validateId, deleteQuestionById);

/**
 * @swagger
 * /questions/{questionId}/vote:
 *   post:
 *     summary: Vote on a question
 *     tags: [Questions]
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
 *               - vote
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *                 description: 1 for upvote, -1 for downvote
 *     responses:
 *       200:
 *         description: Vote on the question has been recorded successfully
 *       400:
 *         description: Invalid vote value
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to vote on question
 */
questionRoutes.post('/:questionId/vote', validateId, validateVote, voteOnQuestion);

export default questionRoutes;
