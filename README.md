# SentimentServe AI

**AI-powered customer review and sentiment analysis platform built for a hackathon.**

SentimentServe AI helps users explore customer feedback, submit reviews, and understand sentiment and recurring topics using Natural Language Processing.

---

## Overview

Customer reviews contain valuable information about products and services, but manually reading large numbers of reviews can make it difficult to identify overall sentiment and recurring issues.

SentimentServe AI processes customer reviews and extracts:

* Sentiment
* Confidence
* Customer-feedback topics
* Ratings
* Review information

The current NLP implementation uses the Node.js `natural` library with the **AFINN** sentiment lexicon.

---

## Features

### Customer Reviews

Users can:

* Search for companies
* View company information
* Submit reviews
* Select a rating from 1 to 5
* Read submitted reviews

### AI Sentiment Analysis

Each submitted review is classified as:

* Positive
* Neutral
* Negative

### Topic Detection

The current NLP system detects:

* Delivery
* Quality
* Support
* Pricing
* Refund

### Customer Intelligence

The frontend includes:

* Company sentiment summaries
* Topic information
* Dashboard views
* AI Insights interface

---

## Technology Stack

| Component       | Technology     |
| --------------- | -------------- |
| Frontend        | React 19       |
| Build Tool      | Vite 8         |
| Routing         | React Router   |
| Icons           | Lucide React   |
| Backend         | Node.js        |
| API             | Express 5      |
| Database        | MongoDB        |
| ODM             | Mongoose 9     |
| NLP             | Natural        |
| Sentiment       | AFINN          |
| Stemming        | Porter Stemmer |
| Tokenization    | WordTokenizer  |
| Environment     | dotenv         |
| CORS            | cors           |
| Linting         | Oxlint         |
| Version Control | Git / GitHub   |

---

## Architecture

```text
User
 |
 v
React Frontend
 |
 | HTTP / JSON
 v
Express Backend
 |
 +-------------------+
 |                   |
 v                   v
NLP Analysis       MongoDB
 |                   |
 +---------+---------+
           |
           v
     Review Result
           |
           v
     React Frontend
```

---

## Project Structure

```text
sentimentserve-ai/
│
├── Backend/
│   ├── ai/
│   │   └── sentimentAnalyzer.js
│   ├── models/
│   │   └── Review.js
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── 01_Project_Overview.md
│   ├── 02_Problem_Statement.md
│   ├── 03_System_Architecture.md
│   ├── 04_Features.md
│   ├── 05_Technology_Stack.md
│   ├── 06_AI_ML_Approach.md
│   ├── 07_API_Documentation.md
│   ├── 08_Database_Design.md
│   ├── 09_Setup_and_Installation.md
│   ├── 10_Testing.md
│   ├── 11_Future_Scope.md
│   └── 12_Team_and_Contribution.md
│
├── README.md
└── .gitignore
```

---

## AI/NLP Pipeline

The current sentiment analysis process is:

```text
Review Text
    ↓
Lowercase
    ↓
Word Tokenization
    ↓
Porter Stemmer + AFINN
    ↓
Sentiment Score
    ↓
Positive / Neutral / Negative
    ↓
Confidence Calculation
    ↓
Keyword Topic Detection
    ↓
MongoDB
```

### Sentiment Thresholds

```text
score > 0.2  → positive
score < -0.2 → negative
otherwise    → neutral
```

The generated confidence value is a project-specific heuristic and is not a calibrated probability.

---

## API

### Health Check

```http
GET /
```

### Submit Review

```http
POST /api/reviews
```

Example:

```json
{
  "name": "Test User",
  "company": "technova",
  "rating": 5,
  "text": "Great service and fast delivery."
}
```

### Retrieve Company Reviews

```http
GET /api/reviews/:company
```

Example:

```http
GET /api/reviews/technova
```

See:

`docs/07_API_Documentation.md`

for the complete API specification.

---

## Installation

### Clone

```bash
git clone https://github.com/kartikpatel-ops/sentimentserve-ai.git
cd sentimentserve-ai
```

### Backend

```bash
cd Backend
npm install
```

Create:

```text
Backend/.env
```

with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend:

```bash
node server.js
```

Optional development mode:

```bash
npx nodemon server.js
```

### Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

---

## Frontend Commands

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---

## Important Current Limitations

The current implementation is a hackathon prototype.

### Authentication

Login and Signup pages are currently UI-only.

Backend authentication has not yet been implemented.

### AI Recommendations

The backend currently performs:

* Sentiment analysis
* Confidence calculation
* Topic detection

There is no separate backend recommendation engine.

The dashboard contains predefined recommendation and insight content.

### AI Model

The current sentiment system is lexicon-based using AFINN. It is not a custom-trained machine-learning model.

### Automated Testing

The repository currently does not contain a dedicated automated backend test suite.

---

## Future Scope

Possible future improvements include:

* Secure authentication
* User accounts
* Advanced sentiment models
* Multilingual NLP
* Aspect-based sentiment analysis
* Dynamic AI recommendations
* Sentiment trends
* Advanced business analytics
* Social-media integrations
* Explainable AI
* Notifications
* Cloud deployment
* Automated testing

---

## Team

* Kartik
* Anuj
* Harshit
* Anshul

---

## Documentation

| Document                       | Description                         |
| ------------------------------ | ----------------------------------- |
| `01_Project_Overview.md`       | Project introduction and objectives |
| `02_Problem_Statement.md`      | Problem and proposed solution       |
| `03_System_Architecture.md`    | System architecture and data flow   |
| `04_Features.md`               | Application features                |
| `05_Technology_Stack.md`       | Technologies used                   |
| `06_AI_ML_Approach.md`         | NLP and sentiment methodology       |
| `07_API_Documentation.md`      | Backend API                         |
| `08_Database_Design.md`        | MongoDB and Mongoose design         |
| `09_Setup_and_Installation.md` | Installation and setup              |
| `10_Testing.md`                | Testing strategy                    |
| `11_Future_Scope.md`           | Future improvements                 |
| `12_Team_and_Contribution.md`  | Team and contribution information   |

---

## Project Status

**Hackathon Prototype**

The current version demonstrates an end-to-end customer review workflow with NLP-based sentiment analysis, topic detection, MongoDB persistence, and a React frontend.

---

## License

This project was created as a hackathon project.

Add an explicit open-source license if the project is intended to be distributed under one.
