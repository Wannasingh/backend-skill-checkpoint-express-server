import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import questionRoutes from "./routes/questionRoutes.mjs";
import answerRoutes from "./routes/answerRoutes.mjs";
import { errorHandler } from "./middlewares/errorHandler.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wannasingh Quora Express Server API",
      version: "1.0.0",
      description: "A project backend Express Server API",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.mjs"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use("/questions", questionRoutes);
app.use("/", answerRoutes);
app.use(errorHandler);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
  //To Check the Swagger documentation
  // console.log(`Swagger documentation available at http://localhost:${port}/docs`);
});
