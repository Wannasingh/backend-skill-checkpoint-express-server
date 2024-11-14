import pool from "../config/db.mjs";

export const createAnswer = async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;

  // Check if content is provided and within the character limit
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Answer content is required." });
  }
  if (content.length > 300) {
    return res
      .status(400)
      .json({ message: "Answer content must not exceed 300 characters." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *",
      [questionId, content]
    );
    res
      .status(201)
      .json({ message: "Answer created successfully.", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Unable to create answer." });
  }
};

export const getAnswersByQuestionId = async (req, res) => {
  const { questionId } = req.params;
  try {
    // First, check if the question exists
    const questionResult = await pool.query(
      "SELECT title FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const questionTitle = questionResult.rows[0].title;

    // Then, fetch the answers for this question
    // Note: We've replaced a.created_at with a.id as a temporary solution
    const answerResult = await pool.query(
      "SELECT a.id, a.content, " +
      "(SELECT COALESCE(SUM(vote), 0) FROM answer_votes WHERE answer_id = a.id) as vote_count " +
      "FROM answers a WHERE a.question_id = $1 " +
      "ORDER BY vote_count DESC, a.id DESC",
      [questionId]
    );

    if (answerResult.rows.length === 0) {
      return res.status(200).json({
        message: "No answers found for this question.",
        question: { id: questionId, title: questionTitle },
        answers: []
      });
    }

    res.status(200).json({
      message: "Answers retrieved successfully.",
      question: { id: questionId, title: questionTitle },
      answersCount: answerResult.rows.length,
      answers: answerResult.rows
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch answers." });
  }
};

export const deleteAnswersByQuestionId = async (req, res) => {
  const { questionId } = req.params;
  try {
    await pool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);
    res
      .status(200)
      .json({
        message: "All answers for the question have been deleted successfully.",
      });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete answers." });
  }
};

export const voteOnAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { vote } = req.body;

  if (![1, -1].includes(vote)) {
    return res.status(400).json({
      message: "Invalid vote value. Must be 1 (upvote) or -1 (downvote).",
    });
  }

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Check if the answer exists
    const answerExists = await pool.query(
      "SELECT * FROM answers WHERE id = $1",
      [answerId]
    );
    if (answerExists.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Answer not found." });
    }

    // Insert the vote
    await pool.query(
      "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
      [answerId, vote]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({
      message: vote === 1 ? "Upvote recorded successfully." : "Downvote recorded successfully.",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Unable to vote on answer." });
  }
};

