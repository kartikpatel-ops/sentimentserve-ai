# SentimentServe AI — Technology Stack

## 1. Frontend

### React

The frontend is built using React 19.

React is used to create reusable UI components and page-based application views.

### Vite

Vite is used as the frontend development server and build tool.

### React Router

React Router provides client-side navigation between application pages.

### Lucide React

Lucide React provides interface icons throughout the application.

---

## 2. Backend

### Node.js

Node.js provides the runtime environment for the backend.

### Express

Express 5 is used to create the HTTP API server and middleware pipeline.

### CORS

The `cors` package enables cross-origin requests between the frontend and backend during development.

### dotenv

The `dotenv` package loads environment variables such as the MongoDB connection string.

---

## 3. Database

### MongoDB

MongoDB is used as the application's document database.

Review information is stored as MongoDB documents.

### Mongoose

Mongoose provides:

* Schema definition
* Model creation
* MongoDB queries
* Validation
* Document timestamps

---

## 4. AI / NLP

### Natural

The `natural` Node.js package provides the NLP functionality.

The application uses:

* `SentimentAnalyzer`
* AFINN sentiment lexicon
* `PorterStemmer`
* `WordTokenizer`

---

## 5. Development Tools

### Nodemon

Nodemon is included as a backend development dependency and can automatically restart the server when source files change.

### Oxlint

Oxlint is used for frontend linting.

---

## 6. Version-Control Technology

Git is used for source-code version control.

GitHub is used as the remote repository for the project.

---

## 7. Technology Summary

| Layer                 | Technology     |
| --------------------- | -------------- |
| Frontend              | React 19       |
| Build Tool            | Vite 8         |
| Routing               | React Router   |
| Icons                 | Lucide React   |
| Backend               | Node.js        |
| API Framework         | Express 5      |
| Database              | MongoDB        |
| ODM                   | Mongoose 9     |
| NLP                   | Natural        |
| Sentiment             | AFINN          |
| Stemming              | Porter Stemmer |
| Tokenization          | WordTokenizer  |
| Environment Variables | dotenv         |
| Cross-Origin Requests | CORS           |
| Linting               | Oxlint         |
| Version Control       | Git / GitHub   |

---

## 8. Current Architecture Choice

The selected stack keeps the project relatively lightweight:

* React provides the user interface.
* Express provides the API.
* MongoDB stores flexible review documents.
* Natural provides local NLP processing.
* No external AI API is required for the current sentiment-analysis implementation.
