# SentimentServe AI — Testing

## 1. Testing Overview

Testing for SentimentServe AI focuses on verifying:

* Frontend functionality
* API behavior
* Review validation
* NLP processing
* Database storage
* Review retrieval
* Error handling
* Build and lint correctness

The current repository does not contain a dedicated automated backend test suite.

Therefore, API and NLP verification should currently be performed through manual testing or external API tools such as Postman/Insomnia.

---

# 2. Frontend Testing

## Home Page

Verify:

* Page loads successfully.
* Search field accepts input.
* Search button navigates to a company route.
* Popular company cards are clickable.
* Login button opens the login page.
* Dashboard navigation works.
* AI Insights navigation works.

---

## Company Page

Verify:

* Known company pages load.
* Company information is displayed.
* Reviews are requested from the backend.
* Average rating is calculated.
* Sentiment percentages are calculated.
* Topics are displayed.
* Write Review opens the review page.

---

## Write Review Page

Verify:

* Name is required.
* Review text is required.
* Rating can be selected from 1 to 5.
* Submit button enters loading state.
* Successful submission displays confirmation.
* Failed requests display an error message.

---

## Login Page

Verify:

* Email input works.
* Password input works.
* Empty fields are rejected.
* Login UI feedback is displayed.

Important:

> Login is currently UI-only and does not authenticate against the backend.

---

## Signup Page

Verify:

* Name input works.
* Email input works.
* Password input works.
* Empty fields are rejected.

Important:

> Signup is currently UI-only and does not create a backend user account.

---

# 3. API Testing

## Health Endpoint

Request:

```http
GET /
```

Expected:

```text
200 OK
```

---

## Create Review

Request:

```http
POST /api/reviews
```

Example:

```json
{
  "name": "Test User",
  "company": "technova",
  "rating": 5,
  "text": "Excellent product and fast delivery."
}
```

Expected:

```text
201 Created
```

The response should contain a saved review with sentiment, confidence, and topics.

---

## Missing Fields

Send:

```json
{
  "name": "Test User"
}
```

Expected:

```text
400 Bad Request
```

---

## Retrieve Reviews

Request:

```http
GET /api/reviews/technova
```

Expected:

```text
200 OK
```

The response should contain:

* `count`
* `reviews`

---

# 4. NLP Testing

The sentiment analyzer should be tested with clearly positive, negative, and neutral examples.

### Positive

```text
The product is excellent and the service is great.
```

Expected general classification:

```text
positive
```

### Negative

```text
The delivery was terrible and the support was poor.
```

Expected general classification:

```text
negative
```

### Neutral

```text
I received the product yesterday.
```

Expected general classification:

```text
neutral
```

The exact classification depends on the AFINN lexicon score.

---

# 5. Topic Testing

### Delivery

```text
My delivery was delayed.
```

Expected topic:

```text
delivery
```

### Quality

```text
The product quality is excellent.
```

Expected topic:

```text
quality
```

### Support

```text
Customer support responded quickly.
```

Expected topic:

```text
support
```

### Pricing

```text
The price is expensive.
```

Expected topic:

```text
pricing
```

### Refund

```text
I am waiting for my refund.
```

Expected topic:

```text
refund
```

---

# 6. Database Testing

After submitting a review, verify that MongoDB contains:

* Name
* Company
* Rating
* Text
* Sentiment
* Confidence
* Topics
* createdAt
* updatedAt

---

# 7. Build Testing

Frontend build:

```bash
npm run build
```

The command should complete successfully.

---

# 8. Lint Testing

Run:

```bash
npm run lint
```

Resolve reported frontend lint issues before production deployment.

---

# 9. Error Testing

Test:

* Backend unavailable
* MongoDB unavailable
* Missing review fields
* Invalid rating
* Empty review text
* Invalid company route
* Network failure

---

# 10. Current Testing Limitation

The backend `package.json` currently contains:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

Therefore, `npm test` is not currently an implemented automated test suite.

A future version should introduce automated tests for:

* API routes
* Sentiment classification
* Topic detection
* Database behavior
* Validation

