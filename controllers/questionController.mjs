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
    const result = await pool.query("DELETE FROM questions WHERE id = $1", [
      questionId,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res
      .status(200)
      .json({ message: "Question post has been deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete question." });
  }
};

export const searchQuestions = async (req, res) => {
  const { title, category } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM questions WHERE title ILIKE $1 OR category ILIKE $2",
      [`%${title}%`, `%${category}%`]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }
    res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch questions." });
  }
};

export const voteOnQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { vote } = req.body;
  if (![1, -1].includes(vote)) {
    return res.status(400).json({ message: "Invalid vote value." });
  }
  try {
    await pool.query(
      "INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)",
      [questionId, vote]
    );
    res
      .status(200)
      .json({
        message: "Vote on the question has been recorded successfully.",
      });
  } catch (error) {
    res.status(500).json({ message: "Unable to vote question." });
  }
};
