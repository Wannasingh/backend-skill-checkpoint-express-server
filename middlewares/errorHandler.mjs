// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  res
    .status(500)
    .json({ message: "Something went wrong! Please try again later." });
};
