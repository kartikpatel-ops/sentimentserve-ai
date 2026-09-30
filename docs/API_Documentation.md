# SentimentServe AI — API Documentation

## 1. Base URL

During local development, the backend runs on:

```text
http://localhost:5000
```

The frontend currently uses this address directly when calling the backend.

For production, the API URL should be configured through an environment-specific configuration rather than hard-coded.

---

# 2. GET /

Checks whether the backend server is running.

### Request

```http
GET /
```

### Response

```json
{
  "message": "SentimentServe AI Backend is running 🚀"
}
```

### Status

```text
200 OK
```

---

# 3. POST /api/reviews

Creates, analyzes, and stores a customer review.

### Request

```http
POST /api/reviews
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Rahul",
  "company": "technova",
  "rating": 5,
  "text": "Great service and fast delivery."
}
```

### Processing

The backend:

1. Validates required fields.
2. Sends `text` to the sentiment analyzer.
3. Generates sentiment.
4. Generates confidence.
5. Detects topics.
6. Creates a MongoDB review document.
7. Saves the document.

### Successful Response

```json
{
  "message": "Review analyzed and saved successfully ✅",
  "review": {
    "...": "saved review document"
  }
}
```

### Status

```text
201 Created
```

### Validation Error

If a required field is missing:

```json
{
  "message": "Please provide all review fields."
}
```

### Status

```text
400 Bad Request
```

### Server Error

```json
{
  "message": "Failed to save review ❌",
  "error": "error message"
}
```

### Status

```text
500 Internal Server Error
```

---

# 4. GET /api/reviews/:company

Retrieves reviews belonging to a company.

### Request

```http
GET /api/reviews/technova
```

### Response

```json
{
  "count": 2,
  "reviews": [
    {
      "name": "Rahul",
      "company": "technova",
      "rating": 5,
      "text": "Great service.",
      "sentiment": "positive",
      "confidence": 75,
      "topics": [
        "quality"
      ]
    }
  ]
}
```

Reviews are sorted by `createdAt` in descending order.

---

# 5. Error Response

If review retrieval fails:

```json
{
  "message": "Failed to fetch reviews",
  "error": "error message"
}
```

Status:

```text
500 Internal Server Error
```

---

# 6. Current API Limitations

The current backend does not expose separate API endpoints for:

* Login
* Signup
* Authentication
* User accounts
* AI recommendations
* Analytics
* Sentiment statistics

These can be added in future versions.

---

# 7. Frontend API Usage

The review submission page sends requests to:

```text
http://localhost:5000/api/reviews
```

The company page retrieves reviews from:

```text
http://localhost:5000/api/reviews/{companyName}
```

---

# 8. API Summary

| Method | Endpoint                | Purpose                      |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/`                     | Backend health/test response |
| POST   | `/api/reviews`          | Analyze and save a review    |
| GET    | `/api/reviews/:company` | Retrieve company reviews     |

