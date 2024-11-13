// Validate if `vote` is 1 or -1
export const validateVote = (req, res, next) => {
  const { vote } = req.body;
  if (![1, -1].includes(vote)) {
    return res
      .status(400)
      .json({ message: "Invalid vote value. Must be 1 or -1." });
  }
  next();
};

// Validate if questionId or answerId is a valid number
export const validateId = (req, res, next) => {
  const { questionId, answerId } = req.params;
  if (questionId && isNaN(questionId)) {
    return res
      .status(400)
      .json({ message: "Invalid questionId. It should be a number." });
  }
  if (answerId && isNaN(answerId)) {
    return res
      .status(400)
      .json({ message: "Invalid answerId. It should be a number." });
  }
  next();
};

// Validate required fields for creating or updating a question
export const validateQuestionData = (req, res, next) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res
      .status(400)
      .json({
        message: "Missing required fields: title, description, category.",
      });
  }
  next();
};

// Validate required fields for creating an answer
export const validateAnswerData = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res
      .status(400)
      .json({ message: "Missing required field: content." });
  }
  next();
};
