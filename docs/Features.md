# SentimentServe AI — Features

## 1. Customer Review Submission

Users can submit a review for a company.

Required information:

* Name
* Rating
* Review text
* Company

The rating must be between 1 and 5.

---

## 2. AI Sentiment Analysis

Every submitted review is processed automatically.

The application assigns one of three sentiment labels:

* Positive
* Neutral
* Negative

The sentiment is generated using the AFINN lexicon through the `natural` library.

---

## 3. Confidence Calculation

The backend generates a numeric confidence value based on the calculated sentiment score.

The current implementation caps generated confidence at 95 and uses 70 as the neutral confidence value.

This value is an application heuristic rather than a calibrated statistical probability.

---

## 4. Topic Detection

The NLP module detects predefined customer-feedback topics.

Current topics:

* Delivery
* Quality
* Support
* Pricing
* Refund

A review can contain more than one detected topic.

---

## 5. Review Storage

Analyzed reviews are stored in MongoDB.

Each stored review includes:

* Name
* Company
* Rating
* Review text
* Sentiment
* Confidence
* Topics
* Creation timestamp
* Update timestamp

---

## 6. Company Review Retrieval

The company page retrieves reviews using:

```text
GET /api/reviews/:company
```

Reviews are returned in descending creation-date order.

---

## 7. Dynamic Sentiment Summary

The company page calculates:

* Positive review percentage
* Neutral review percentage
* Negative review percentage
* Average rating
* Topic frequency

These values are calculated from reviews retrieved from the backend.

---

## 8. Company Pages

The application provides company-specific pages containing:

* Company name
* Category
* Rating
* Review count
* Sentiment analysis
* Detected topics
* Customer reviews
* Write Review action

---

## 9. Dashboard

The dashboard presents business-oriented customer intelligence information.

The current dashboard contains predefined presentation content such as:

* Overall rating
* Total reviews
* Positive sentiment
* Customer growth
* Customer insights
* Recommendations

These dashboard values are currently static frontend content rather than being calculated entirely from the backend.

---

## 10. AI Insights Page

The AI Insights page presents a customer intelligence interface containing:

* Sentiment summaries
* Review analysis
* Customer topics
* Positive observations
* Negative observations
* Insight-oriented content

Some values and insights are currently predefined in the frontend.

---

## 11. Login and Signup UI

The project includes Login and Signup pages.

Currently these pages:

* Accept user input.
* Perform basic empty-field validation.
* Display UI feedback.

They do **not** currently create or authenticate users through the backend.

---

## 12. Responsive Web Interface

The application provides a modern React-based interface with reusable styling and Lucide icons.

---

## 13. Routing

React Router provides routes for:

```text
/
 /company/:companyName
 /company/:companyName/review
 /login
 /signup
 /dashboard
 /ai-insights
```

---

## 14. Error Handling

The review submission flow handles:

* Missing form fields
* Failed API requests
* Backend error messages
* Loading state

The backend returns HTTP error responses for invalid or failed requests.
