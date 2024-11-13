import express from "express";
import dotenv from "dotenv";
import questionRoutes from "./routes/questionRoutes.mjs";
import answerRoutes from "./routes/answerRoutes.mjs";
import { errorHandler } from "./middlewares/errorHandler.mjs";

dotenv.config();

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionRoutes);
app.use("/", answerRoutes);
app.use(errorHandler);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
