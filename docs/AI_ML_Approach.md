# SentimentServe AI — AI/ML Approach

## 1. Overview

SentimentServe AI uses Natural Language Processing to analyze customer review text.

The current implementation is **lexicon-based**, rather than a trained custom machine-learning model.

The main NLP implementation is:

```text
Backend/ai/sentimentAnalyzer.js
```

---

## 2. NLP Pipeline

The review-processing pipeline is:

```text
Raw Review
    ↓
Convert to Lowercase
    ↓
Word Tokenization
    ↓
AFINN Sentiment Analysis
    ↓
Sentiment Score
    ↓
Sentiment Classification
    ↓
Confidence Calculation
    ↓
Keyword Topic Detection
    ↓
Final AI Result
```

---

## 3. Tokenization

The application uses:

```javascript
natural.WordTokenizer()
```

The review text is converted to lowercase before tokenization.

This produces tokens that can be processed by the sentiment analyzer.

---

## 4. Sentiment Analysis

The application initializes:

```javascript
new Analyzer(
  "English",
  stemmer,
  "afinn"
)
```

The AFINN lexicon assigns sentiment values to words.

The resulting values are combined to produce a sentiment score.

---

## 5. Sentiment Classification

The implementation uses these rules:

```text
score > 0.2
    → positive

score < -0.2
    → negative

otherwise
    → neutral
```

This is a deterministic rule-based classification system.

---

## 6. Confidence

The application generates confidence as follows:

### Positive

```text
min(95, round(70 + score × 20))
```

### Negative

```text
min(95, round(70 + |score| × 20))
```

### Neutral

```text
70
```

The confidence value is a project-specific heuristic. It should not be interpreted as a calibrated probability of classification correctness.

---

## 7. Topic Detection

After sentiment analysis, the application checks the original lowercase review text against predefined keywords.

### Delivery

```text
delivery
delivered
shipping
delay
```

### Quality

```text
quality
product
excellent
poor
```

### Support

```text
support
customer service
response
help
```

### Pricing

```text
price
pricing
cost
expensive
cheap
```

### Refund

```text
refund
return
money back
```

If any keyword from a topic appears in the text, that topic is added to the result.

---

## 8. Example

Input:

```text
"The product quality is excellent, but delivery was delayed."
```

Possible result:

```json
{
  "sentiment": "positive",
  "confidence": 75,
  "topics": [
    "quality",
    "delivery"
  ]
}
```

The exact confidence depends on the AFINN score generated for the input.

---

## 9. AI Result Structure

The analyzer returns:

```json
{
  "sentiment": "positive | neutral | negative",
  "confidence": 0,
  "topics": []
}
```

This result is then stored together with the original review.

---

## 10. Current AI Limitations

Because the current implementation uses a lexicon and keyword rules, it may have difficulty with:

* Sarcasm
* Complex context
* Negation
* Slang
* Domain-specific language
* Mixed-language text
* Long contextual relationships
* Implicit sentiment
* Sentiment that depends heavily on sentence context

Topic detection is also keyword-based and does not currently use semantic topic modeling.

---

## 11. Future AI Improvements

Future versions could include:

* Transformer-based sentiment models
* Fine-tuned domain-specific models
* Multilingual NLP
* Semantic topic extraction
* Aspect-based sentiment analysis
* Explainable AI
* Sentiment trends
* Automated recommendation generation
* Model evaluation against labeled datasets

---

## 12. Important Implementation Note

The project currently does **not** contain a separate trained recommendation model.

The backend AI component performs sentiment analysis and topic detection.

The dashboard and AI Insights interfaces contain recommendation and insight content implemented in the frontend.

