# SentimentServe AI — Problem Statement

## 1. Background

Online reviews are an important source of customer feedback. Customers frequently describe their experiences through ratings and written comments.

However, written reviews are unstructured. A user or business may need to read many reviews manually to understand the overall customer experience.

This creates a need for automated analysis that can identify the sentiment and major subjects discussed in customer feedback.

---

## 2. Problem

The primary problem addressed by SentimentServe AI is:

> **How can customer reviews be automatically analyzed to identify sentiment and important discussion topics while presenting the results through a simple web interface?**

---

## 3. Existing Challenges

### 3.1 Unstructured Feedback

Customer comments contain useful information but do not follow a fixed structure.

### 3.2 Manual Analysis

Reading large numbers of reviews manually can be time-consuming.

### 3.3 Limited Information from Star Ratings

A five-star rating indicates an overall score but does not explain why the customer gave that rating.

### 3.4 Identifying Recurring Issues

Businesses may need to identify recurring subjects such as delivery, product quality, customer support, pricing, or refunds.

### 3.5 Converting Text into Structured Data

Written feedback needs to be transformed into structured information before it can be summarized and visualized.

---

## 4. Proposed Solution

SentimentServe AI accepts customer reviews through a web application and automatically processes the review text.

The backend uses the `natural` Node.js NLP library with the AFINN sentiment lexicon.

The processing pipeline:

```text
Review Text
     |
     v
Lowercase Text
     |
     v
Word Tokenization
     |
     v
Porter Stemmer + AFINN
     |
     v
Sentiment Score
     |
     +------ Positive
     |
     +------ Neutral
     |
     +------ Negative
     |
     v
Keyword Topic Detection
     |
     v
Structured AI Result
```

---

## 5. Sentiment Classification

The current implementation uses the following thresholds:

* Score greater than `0.2` → **Positive**
* Score less than `-0.2` → **Negative**
* Score between `-0.2` and `0.2` → **Neutral**

A confidence value is then generated from the sentiment score.

The confidence value is an application-generated indicator and should not be interpreted as a statistically calibrated probability.

---

## 6. Topic Detection

The current implementation checks review text for predefined keywords.

| Topic    | Example Keywords                          |
| -------- | ----------------------------------------- |
| Delivery | delivery, delivered, shipping, delay      |
| Quality  | quality, product, excellent, poor         |
| Support  | support, customer service, response, help |
| Pricing  | price, pricing, cost, expensive, cheap    |
| Refund   | refund, return, money back                |

Multiple topics can be detected in a single review.

---

## 7. Expected Benefits

The system is designed to:

* Reduce the effort required to interpret individual reviews.
* Provide an immediate sentiment classification.
* Identify frequently discussed customer topics.
* Store structured review analysis.
* Present customer feedback through an interactive interface.

---

## 8. Success Criteria

The project can be considered functionally successful when:

1. A user can submit a valid review.
2. The backend validates the submitted data.
3. The review is analyzed successfully.
4. Sentiment is assigned.
5. Topics are detected where applicable.
6. The review and analysis are saved in MongoDB.
7. Reviews can be retrieved for a company.
8. The frontend displays retrieved information correctly.

---

## 9. Scope Limitations

The current implementation does not provide:

* User authentication through the backend.
* A trained custom machine-learning model.
* A separate backend recommendation engine.
* Automatic social-media ingestion.
* Multilingual sentiment analysis.
* Production-grade authentication and authorization.

These can be considered future development areas.
