# Express Server Quora API

An Express.js server template for building robust web applications with Node.js.
## Project Description

This Express Server Template provides a solid foundation for developing web applications using Node.js and Express.js. It includes a structured setup for handling routes, middleware, and database operations using PostgreSQL. The project is designed to facilitate the creation of a question-and-answer platform, similar to Quora, allowing users to post questions, provide answers, and vote on both questions and answers.

Key features:
- RESTful API design similar to Quora's functionality
- PostgreSQL database integration
- Input validation
- Error handling middleware
- Modular route structure
- Voting system for questions and answers

This project implements an API for a website similar to Quora using Express, providing endpoints for creating, reading, updating, and deleting questions and answers, as well as voting functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Installation

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get the project up and running on your local machine, follow these steps:

1. Clone the repository:
   git clone https://github.com/wannasingh/backend-skill-checkpoint-express-server.git

2. Navigate to the project directory:
   cd backend-skill-checkpoint-express-server

3. Install dependencies:
   npm install

4. Set up your PostgreSQL database and update the connection details in the `.env` file.

5. Run database migrations (if applicable).

6. Start the server:
   npm start

## Usage

Once the server is running, you can interact with it using HTTP requests. Here are some example use cases:

1. Create a new question:
   POST /questions

2. Get all questions:
   GET /questions

3. Vote on a question:
   POST /questions/:questionId/vote

4. Create an answer for a question:
   POST /questions/:questionId/answers

5. Vote on an answer:
   POST /answers/:answerId/vote

For a complete list of endpoints and their usage, refer to the API documentation or the swagger documentation if implemented.

## API Endpoints

- `POST /questions`: Create a new question
- `GET /questions`: Get all questions
- `GET /questions/search`: Search questions by title or category
- `GET /questions/:questionId`: Get a specific question by ID
- `PUT /questions/:questionId`: Update a question
- `DELETE /questions/:questionId`: Delete a question and its answers
- `POST /questions/:questionId/vote`: Vote on a question
- `POST /questions/:questionId/answers`: Create an answer for a question
- `GET /questions/:questionId/answers`: Get all answers for a question
- `DELETE /questions/:questionId/answers`: Delete all answers for a question
- `POST /answers/:answerId/vote`: Vote on an answer

## Database Schema

The project uses a PostgreSQL database with the following main tables:

1. `questions`: Stores question data
2. `answers`: Stores answer data
3. `question_votes`: Tracks votes on questions
4. `answer_votes`: Tracks votes on answers

## Contributing

Contributions to this project are welcome. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.
