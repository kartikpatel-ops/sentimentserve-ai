# SentimentServe AI — Team and Contribution

## 1. Team

The SentimentServe AI project was developed by:

* Kartik
* Anuj
* Harshit
* Anshul

---

## 2. Project Collaboration

The project can be developed collaboratively using:

* Git
* GitHub
* Feature branches
* Pull requests
* Code review

---

## 3. Suggested Responsibility Areas

| Area          | Possible Responsibility                          |
| ------------- | ------------------------------------------------ |
| Frontend      | React pages, routing, UI, styling                |
| Backend       | Express APIs and server logic                    |
| AI/NLP        | Sentiment analysis and topic detection           |
| Database      | MongoDB/Mongoose integration                     |
| Testing       | API, UI and NLP verification                     |
| Documentation | Technical documentation and project presentation |

Responsibilities can be shared among team members according to the team's actual contribution.

---

## 4. Git Workflow

A simple workflow is:

```text
main
 |
 +-- feature/frontend
 |
 +-- feature/backend
 |
 +-- feature/ai
 |
 +-- feature/docs
```

Develop changes on a feature branch and merge them into the main branch after verification.

---

## 5. Recommended Commit Format

Use descriptive commits such as:

```text
feat: add review submission API
```

```text
feat: implement AFINN sentiment analysis
```

```text
fix: handle failed review submission
```

```text
docs: update API documentation
```

```text
refactor: improve review processing
```

---

## 6. Contribution Guidelines

Before pushing changes:

1. Pull the latest code.
2. Make the required change.
3. Test the application.
4. Run frontend linting.
5. Review changed files.
6. Commit with a descriptive message.
7. Push the branch.
8. Merge after review.

---

## 7. Documentation Guidelines

Documentation should remain synchronized with the implementation.

When adding or changing:

* API routes
* Database fields
* AI algorithms
* Frontend pages
* Environment variables
* Installation commands

the corresponding documentation should also be updated.

---

## 8. Current Project Structure

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

## 9. Project Status

The current implementation provides a working foundation for:

* Customer review submission
* NLP sentiment analysis
* Topic detection
* MongoDB persistence
* Review retrieval
* Frontend customer/business interfaces

Further development is required for production authentication, automated testing, dynamic recommendation generation, deployment, and advanced AI functionality.

---

## 10. Conclusion

The project demonstrates collaboration across frontend development, backend API development, database integration, and natural language processing.

The documentation should be updated whenever the implementation changes so that the repository remains technically accurate.
