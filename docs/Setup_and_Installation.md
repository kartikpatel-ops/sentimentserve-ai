# SentimentServe AI — Setup and Installation

## 1. Prerequisites

Install the following before running the project:

* Node.js
* npm
* MongoDB database access
* Git

A MongoDB Atlas database can be used instead of a locally installed MongoDB server.

---

## 2. Clone the Repository

```bash
git clone https://github.com/kartikpatel-ops/sentimentserve-ai.git
cd sentimentserve-ai
```

---

# 3. Backend Setup

Move into the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

---

## 4. Environment Variables

Create:

```text
Backend/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace the MongoDB value with the connection string for your database.

Do not commit `.env` to Git.

The repository's `.gitignore` already excludes `.env`.

---

## 5. Start the Backend

From:

```text
Backend/
```

run:

```bash
node server.js
```

The server should start on:

```text
http://localhost:5000
```

You can test the server by opening:

```text
http://localhost:5000/
```

Expected response:

```json
{
  "message": "SentimentServe AI Backend is running 🚀"
}
```

---

## 6. Optional Nodemon Development Server

Nodemon is installed as a development dependency.

It can be used with:

```bash
npx nodemon server.js
```

The current `Backend/package.json` does not define a dedicated `dev` script.

---

# 7. Frontend Setup

Open another terminal.

From the project root:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

---

## 8. Start the Frontend

Run:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, normally:

```text
http://localhost:5173
```

---

# 9. Frontend Build

To create a production build:

```bash
npm run build
```

---

# 10. Frontend Linting

Run:

```bash
npm run lint
```

---

# 11. Running the Complete Application

Two terminals are recommended.

### Terminal 1

```bash
cd Backend
npm install
node server.js
```

### Terminal 2

```bash
cd Frontend
npm install
npm run dev
```

Then open the Vite URL shown in the frontend terminal.

---

# 12. Application Flow

Once both servers are running:

```text
Browser
  |
  v
React / Vite
  |
  v
Express :5000
  |
  v
MongoDB
```

Review submission:

```text
Frontend
 → POST /api/reviews
 → Sentiment Analysis
 → MongoDB
 → Response
```

Review retrieval:

```text
Frontend
 → GET /api/reviews/:company
 → MongoDB
 → Response
```

---

# 13. Troubleshooting

### MongoDB connection failure

Check:

* `MONGO_URI` exists.
* MongoDB is running or Atlas is accessible.
* Database credentials are correct.
* Network access rules allow the connection.

### Frontend cannot submit reviews

Check:

* Backend is running on port 5000.
* Browser can access `http://localhost:5000/`.
* The frontend request URL matches the backend URL.

### No reviews appear

Check:

* The company identifier matches the stored company value.
* MongoDB contains review documents.
* The backend is running.
* Browser console does not show a request error.

---

# 14. Production Considerations

Before deployment:

* Replace localhost API URLs.
* Configure production CORS.
* Use secure environment variables.
* Enable HTTPS.
* Add authentication if required.
* Add rate limiting.
* Add stronger input validation.
* Configure database security.

