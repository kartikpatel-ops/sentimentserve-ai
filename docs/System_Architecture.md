# System Architecture

## 1. Overview

SentimentServe AI follows a modular architecture in which the frontend, backend, AI-based sentiment analysis, and recommendation components work together to process user feedback and generate personalized service recommendations.

The high-level architecture is:

```text
┌──────────────────────────────┐
│          USER                │
│     Feedback / Input         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          FRONTEND            │
│       User Interface         │
└──────────────┬───────────────┘
               │
               │ API Request
               ▼
┌──────────────────────────────┐
│          BACKEND             │
│       Application API        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      TEXT PROCESSING         │
│   Cleaning / Preparation     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      SENTIMENT ANALYSIS      │
│          AI / ML             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│    RECOMMENDATION ENGINE     │
│ Personalized Recommendation  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          BACKEND             │
│       Response Generation    │
└──────────────┬───────────────┘
               │
               │ API Response
               ▼
┌──────────────────────────────┐
│          FRONTEND            │
│      Display Results         │
└──────────────────────────────┘
```

---

## 2. Main Components

The system is divided into the following major components:

1. Frontend
2. Backend
3. Text Processing
4. Sentiment Analysis
5. Recommendation Engine
6. Result Presentation

---

## 3. Frontend Layer

The frontend provides the user interface for interacting with SentimentServe AI.

The user can provide the required feedback or input through the interface.

The frontend is responsible for:

* Collecting user input
* Sending requests to the backend
* Receiving responses
* Displaying sentiment results
* Displaying personalized recommendations
* Providing an accessible user experience

The frontend communicates with the backend through API requests.

### Frontend Flow

```text
User
 ↓
Enter Feedback
 ↓
Submit
 ↓
API Request
 ↓
Receive Result
 ↓
Display Sentiment
 ↓
Display Recommendation
```

---

## 4. Backend Layer

The backend acts as the central application layer.

It receives requests from the frontend, processes the input, communicates with the AI components, and returns the final result.

The backend is responsible for:

* Handling API requests
* Validating incoming data
* Processing user input
* Calling the sentiment-analysis component
* Passing sentiment information to the recommendation component
* Preparing the final response
* Sending the response back to the frontend

### Backend Flow

```text
Frontend Request
       ↓
API Endpoint
       ↓
Input Validation
       ↓
Processing
       ↓
AI / ML Analysis
       ↓
Recommendation
       ↓
API Response
```

---

## 5. Text Processing Layer

Before sentiment analysis is performed, the input text may need to be prepared for analysis.

Typical text-processing operations can include:

* Cleaning unnecessary characters
* Handling whitespace
* Normalizing text
* Preparing text for the AI model
* Handling invalid or empty input

The purpose of this stage is to provide suitable input to the sentiment-analysis component.

```text
Raw Feedback
     ↓
Text Cleaning
     ↓
Text Preparation
     ↓
Processed Text
```

---

## 6. Sentiment Analysis Layer

The sentiment-analysis component is the AI/ML part of the system.

Its purpose is to analyze the processed text and determine the sentiment expressed by the user.

A typical sentiment classification can contain:

```text
Positive
Neutral
Negative
```

For example:

```text
Input:
"The service was excellent and very helpful."

        ↓

Sentiment Analysis

        ↓

Positive
```

Another example:

```text
Input:
"I am extremely disappointed with the service."

        ↓

Sentiment Analysis

        ↓

Negative
```

The exact model and implementation details should be documented in:

`06_AI_ML_Approach.md`

---

## 7. Recommendation Engine

After sentiment analysis, the resulting sentiment information is passed to the recommendation component.

The recommendation engine uses the available information to determine an appropriate service recommendation.

The conceptual workflow is:

```text
User Feedback
      ↓
Sentiment
      ↓
Recommendation Logic
      ↓
Personalized Recommendation
```

For example:

```text
Negative Sentiment
        ↓
Identify customer dissatisfaction
        ↓
Generate appropriate service response
```

The recommendation logic can be extended in the future to consider additional information such as:

* User preferences
* Previous interactions
* Service history
* Customer profile
* Feedback history
* Detected emotions

---

## 8. API Communication

The frontend and backend communicate through APIs.

The general communication flow is:

```text
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ HTTP Request
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       │ Processing
       ▼
┌──────────────┐
│ AI / ML      │
└──────┬───────┘
       │
       │ Result
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       │ HTTP Response
       ▼
┌──────────────┐
│   Frontend   │
└──────────────┘
```

The exact API endpoints and request/response formats are documented separately in:

`07_API_Documentation.md`

---

## 9. End-to-End Data Flow

The complete system workflow can be represented as follows:

```text
                    USER
                     │
                     ▼
              ┌─────────────┐
              │  Feedback   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │  Frontend   │
              └──────┬──────┘
                     │
                  API Call
                     │
                     ▼
              ┌─────────────┐
              │   Backend   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │Text Process │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │  Sentiment  │
              │   Analysis  │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │Recommendation│
              │    Engine   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   Backend   │
              └──────┬──────┘
                     │
                 API Response
                     │
                     ▼
              ┌─────────────┐
              │  Frontend   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │    User     │
              │   Result    │
              └─────────────┘
```

---

## 10. Component Responsibilities

| Component             | Responsibility                                  |
| --------------------- | ----------------------------------------------- |
| User                  | Provides feedback/input                         |
| Frontend              | Collects input and displays results             |
| Backend               | Handles application logic and API communication |
| Text Processing       | Prepares input text                             |
| Sentiment Analysis    | Determines sentiment                            |
| Recommendation Engine | Generates personalized recommendation           |
| API Layer             | Transfers data between frontend and backend     |

---

## 11. Architecture Design Principles

The architecture follows several important principles.

### Modularity

Different responsibilities are separated into independent components.

### Separation of Concerns

The frontend focuses on presentation, while the backend handles application logic and AI processing.

### Scalability

Individual components can be improved or replaced without redesigning the entire application.

### Extensibility

Additional AI models, recommendation strategies, data sources, or services can be integrated in the future.

### Maintainability

Separating the system into logical components makes the application easier to understand, test, and maintain.

---

## 12. Error Handling

The system should handle invalid or unexpected input appropriately.

Potential error scenarios include:

* Empty feedback
* Invalid request format
* AI/ML processing failure
* Backend errors
* API communication failure
* Unexpected recommendation-processing errors

The backend should return appropriate error responses so that the frontend can provide meaningful feedback to the user.

---

## 13. Security Considerations

Potential security considerations include:

* Validating user input
* Protecting API credentials
* Keeping sensitive configuration in environment variables
* Avoiding exposure of private user information
* Securing API endpoints
* Implementing appropriate authentication if required

Sensitive configuration such as API keys should not be committed directly to the GitHub repository.

---

## 14. Future Architecture Extensions

The architecture can be extended with additional components such as:

```text
              ┌──────────────────┐
              │ Social Media API │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Data Collection  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Sentiment Engine │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Recommendation   │
              │     Engine       │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Analytics /      │
              │ Dashboard        │
              └──────────────────┘
```

Future versions could support real-time data collection, multilingual sentiment analysis, advanced recommendation models, analytics dashboards, and automated alerts.

---

# SentimentServe AI — System Architecture

## 1. Architecture Overview

SentimentServe AI follows a client-server architecture.

The main layers are:

1. React frontend
2. Express backend API
3. NLP processing module
4. MongoDB database

```text
+-----------------------------+
|        React Frontend       |
|                             |
| Home / Company / Review     |
| Dashboard / AI Insights     |
| Login / Signup              |
+-------------+---------------+
              |
              | HTTP / JSON
              v
+-----------------------------+
|       Express Backend       |
|                             |
| GET /                       |
| POST /api/reviews           |
| GET /api/reviews/:company   |
+-------------+---------------+
              |
       +------+------+
       |             |
       v             v
+-------------+  +----------------+
| NLP Module  |  | MongoDB        |
|             |  |                |
| natural     |  | Review         |
| AFINN       |  | documents      |
| Tokenizer   |  |                |
| Topics      |  |                |
+-------------+  +----------------+
```

---

## 2. Frontend Layer

The frontend is implemented using:

* React 19
* Vite 8
* React Router
* Lucide React

Important pages include:

* Home
* Company
* Write Review
* Login
* Signup
* Dashboard
* AI Insights

The frontend communicates with the backend through HTTP requests using the browser `fetch()` API.

---

## 3. Backend Layer

The backend uses:

* Node.js
* Express 5
* CORS
* dotenv
* Mongoose

The backend is responsible for:

* Receiving requests
* Validating review input
* Calling the sentiment analyzer
* Saving review information
* Returning stored reviews
* Handling API errors

The default backend port is `5000`, unless overridden through the `PORT` environment variable.

---

## 4. AI/NLP Layer

The NLP module is located at:

```text
Backend/ai/sentimentAnalyzer.js
```

It uses:

* `natural.SentimentAnalyzer`
* AFINN
* `natural.PorterStemmer`
* `natural.WordTokenizer`

The module returns:

```text
{
  sentiment,
  confidence,
  topics
}
```

---

## 5. Database Layer

MongoDB stores review documents.

Mongoose provides the schema and database interaction layer.

The main model is:

```text
Backend/models/Review.js
```

The `Review` model stores customer information, rating, review text, sentiment, confidence, topics, and timestamps.

---

## 6. Request Flow

### Review Submission

```text
User
 ↓
Write Review Page
 ↓
POST /api/reviews
 ↓
Express Validation
 ↓
analyzeSentiment(text)
 ↓
Review Model
 ↓
MongoDB
 ↓
JSON Response
 ↓
Frontend Success State
```

### Review Retrieval

```text
Company Page
 ↓
GET /api/reviews/:company
 ↓
MongoDB Query
 ↓
Sort by createdAt descending
 ↓
JSON Response
 ↓
Frontend Sentiment Calculation
 ↓
Company Dashboard
```

---

## 7. Security Considerations

The current application includes:

* CORS middleware
* JSON request parsing
* Required fields for reviews
* Rating range validation through Mongoose
* Environment variable support for MongoDB credentials

For production deployment, additional measures should be implemented, including:

* Authentication
* Authorization
* Input sanitization
* Rate limiting
* HTTPS
* Stronger validation
* Secure CORS configuration
* Secret management
* Monitoring and logging

---

## 8. Architecture Limitations

The current architecture is appropriate for a hackathon prototype but is not yet a complete production architecture.

In particular:

* Authentication is not connected to the backend.
* AI recommendations are not generated by a dedicated backend recommendation service.
* The frontend contains some static demonstration metrics and insights.
* API URLs are currently hard-coded to `localhost:5000`.
