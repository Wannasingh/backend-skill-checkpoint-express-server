import pool from "../config/db.mjs";

export const createQuestion = async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    await pool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3)",
      [title, description, category]
    );
    res.status(201).json({ message: "Question created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to create question." });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM questions");
    res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({
      message: "Unable to connect to the database",
      error: error.message,
    });
    res.status(500).json({ message: "Unable to fetch questions." });
  }
};

export const getQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM questions WHERE id = $1", [
      questionId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch questions." });
  }
};

export const updateQuestionById = async (req, res) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    const result = await pool.query(
      "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4",
      [title, description, category, questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to update question." });
  }
};

export const deleteQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Delete all answers associated with the question
    await pool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);

    // Delete all votes associated with the answers of this question
    await pool.query(
      "DELETE FROM answer_votes WHERE answer_id IN (SELECT id FROM answers WHERE question_id = $1)",
      [questionId]
    );

    // Delete the question
    const result = await pool.query(
      "DELETE FROM questions WHERE id = $1 RETURNING *",
      [questionId]
    );

    // If no rows were deleted, the question doesn't exist
    if (result.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Question not found." });
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({
      message:
        "Question and all associated answers have been deleted successfully.",
      deletedQuestion: result.rows[0],
    });
  } catch (error) {
    // If there's an error, roll back the transaction
    await pool.query("ROLLBACK");
    res
      .status(500)
      .json({ message: "Unable to delete question and its answers." });
  }
};

export const searchQuestions = async (req, res) => {
  const { title, category } = req.query;

  if (!title && !category) {
    return res
      .status(400)
      .json({
        message:
          "At least one search parameter (title or category) is required.",
      });
  }

  try {
    let query = "SELECT * FROM questions WHERE ";
    let params = [];
    let conditions = [];

    if (title) {
      conditions.push("title ILIKE $" + (params.length + 1));
      params.push(`%${title}%`);
    }

    if (category) {
      conditions.push("category ILIKE $" + (params.length + 1));
      params.push(`%${category}%`);
    }

    query += conditions.join(" OR ");

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found matching the search criteria." });
    }

    res.status(200).json({
      message: "Questions found successfully.",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch questions." });
  }
};

export const voteOnQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { vote } = req.body;

  if (![1, -1].includes(vote)) {
    return res.status(400).json({
      message: "Invalid vote value. Must be 1 (upvote) or -1 (downvote).",
    });
  }

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Check if the question exists
    const questionExists = await pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionExists.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Question not found." });
    }

    // Insert the vote into question_votes table
    await pool.query(
      "INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)",
      [questionId, vote]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({
      message: vote === 1 ? "Upvote recorded successfully." : "Downvote recorded successfully.",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ 
      message: "Unable to vote on question.",
      error: error.message
    });
  }
};
