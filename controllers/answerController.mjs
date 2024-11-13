import pool from "../config/db.mjs";

export const createAnswer = async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *",
      [questionId, content]
    );
    res
      .status(201)
      .json({ message: "Answer created successfully.", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Unable to create answers." });
  }
};

export const getAnswersByQuestionId = async (req, res) => {
  const { questionId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for this question." });
    }
    res.status(200).json({ data: result.rows });
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
    return res.status(400).json({ message: "Invalid vote value." });
  }
  try {
    await pool.query(
      "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
      [answerId, vote]
    );
    res
      .status(200)
      .json({ message: "Vote on the answer has been recorded successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to vote answer." });
  }
};

