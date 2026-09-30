# SentimentServe AI — Project Overview

## 1. Introduction

**SentimentServe AI** is an AI-powered customer review and sentiment analysis platform developed as a hackathon project.

The application allows users to explore businesses, read customer feedback, submit reviews, and analyze customer sentiment. The platform uses natural language processing to classify review text as **positive, neutral, or negative** and detects common topics discussed in the review.

The project combines a React-based frontend with a Node.js/Express backend, MongoDB data storage, and NLP processing using the `natural` library.

---

## 2. Problem Statement

Traditional review platforms primarily present ratings and written comments. Although these provide useful information, manually reading large numbers of reviews can make it difficult to quickly identify:

* Overall customer sentiment
* Common customer concerns
* Frequently discussed topics
* Positive aspects of a service
* Negative experiences that may require attention

SentimentServe AI addresses this problem by automatically processing submitted reviews and extracting structured sentiment and topic information.

---

## 3. Proposed Solution

SentimentServe AI provides a web-based interface where customers can submit reviews for businesses.

When a review is submitted:

1. The frontend collects the review information.
2. The backend validates the submitted fields.
3. The review text is processed by the sentiment analysis module.
4. The AI module calculates a sentiment score using AFINN.
5. The score is classified as positive, neutral, or negative.
6. A confidence value is generated.
7. Relevant topics are detected using predefined keywords.
8. The complete review and AI results are stored in MongoDB.
9. The frontend can retrieve reviews and calculate company-level sentiment statistics.

---

## 4. Main Objectives

The project aims to:

* Provide an easy-to-use customer review platform.
* Automatically analyze review sentiment.
* Detect important topics in customer feedback.
* Store analyzed reviews for later retrieval.
* Display review and sentiment information through a modern interface.
* Demonstrate practical use of NLP in a customer intelligence application.

---

## 5. Main Features

### Customer Review Submission

Users can submit:

* Name
* Company
* Rating from 1 to 5
* Written review

### Sentiment Analysis

Reviews are classified into:

* Positive
* Neutral
* Negative

### Topic Detection

The current NLP module detects the following topics:

* Delivery
* Quality
* Support
* Pricing
* Refund

### Company Review Display

The frontend retrieves reviews for a company and displays:

* Average rating
* Review count
* Sentiment distribution
* Detected topics
* Individual reviews

### AI Insights Interface

The frontend includes an AI Insights page and business dashboard that present customer intelligence concepts and recommendations.

These pages currently contain predefined frontend insight content rather than being generated dynamically by a separate backend recommendation model.

---

## 6. High-Level Workflow

```text
User
  |
  v
React Frontend
  |
  | POST /api/reviews
  v
Express Backend
  |
  v
Review Validation
  |
  v
NLP / Sentiment Analysis
  |
  +--> AFINN Sentiment Score
  |
  +--> Sentiment Classification
  |
  +--> Keyword Topic Detection
  |
  v
MongoDB
  |
  v
Review Retrieval
  |
  v
React Frontend
```

---

## 7. Target Users

The application can be used by:

* Customers who want to submit reviews.
* Users who want to explore customer opinions.
* Businesses interested in understanding customer feedback.
* Hackathon judges and evaluators demonstrating an AI/NLP application.

---

## 8. Current Scope

The current implementation focuses on:

* Review submission
* Review storage
* Sentiment classification
* Confidence calculation
* Topic detection
* Company-specific review retrieval
* Frontend dashboards and insights

Authentication and user account management are currently frontend UI features and are not connected to backend authentication.

---

## 9. Future Scope

Potential future improvements include:

* User authentication
* Dynamic AI-generated recommendations
* Advanced analytics
* Multilingual sentiment analysis
* Better topic extraction
* Sentiment trends over time
* Business notifications
* Admin dashboards
* Model training using domain-specific datasets
* Deployment to cloud infrastructure

---

## 10. Conclusion

SentimentServe AI demonstrates how a web application can combine customer reviews, database storage, and natural language processing to convert unstructured feedback into structured insights.

The project provides a foundation for a larger customer intelligence platform while remaining suitable for demonstration in a hackathon environment.
s