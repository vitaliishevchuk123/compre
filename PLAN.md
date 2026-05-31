# English Input - Technical Specification

## Project Goal

Create a mobile application for learning English vocabulary using the Comprehensible Input method.

The core principle is:

* The user learns words through context.
* No direct translation is shown.
* Every new card introduces exactly ONE new word.
* All other words in the sentence must already be known by the user.
* Learning should feel natural, similar to how children acquire language.

---

# Technology Stack

Frontend:

* React Native
* Expo
* TypeScript

Storage:

* SQLite (local database)

Optional Cloud Sync:

* Supabase

AI:

* OpenAI API

Text To Speech:

* Expo Speech
* Native iOS/Android TTS

---

# Core Learning Algorithm

Each word has a learning status.

Word states:

1. New
2. Learning
3. Known
4. Mastered

Example:

```json
{
  "word": "happy",
  "level": "A1",
  "status": "known",
  "reviewCount": 8,
  "correctAnswers": 7
}
```

A word becomes Mastered after multiple successful reviews.

---

# Vocabulary Levels

Vocabulary is organized by CEFR levels:

A1
A2
B1
B2

Example:

A1: 500 words
A2: 1500 words
B1: 3000 words
B2: 5000+ words

Users start at A1.

Words unlock progressively.

---

# Comprehensible Input Engine

For every new lesson:

Known words:

* boy
* girl
* dog
* run
* eat
* happy

New word:

* fast

AI must generate sentences that:

1. Use only known vocabulary
2. Introduce exactly one new word
3. Are grammatically correct
4. Match learner level

Good example:

"The dog can run fast."

Bad example:

"The energetic dog can run extremely fast."

because it introduces multiple unknown words.

---

# Exercise Types

## 1. Choose Correct Word

Image: smiling person

Options:

* happy
* angry
* tired
* sad

Correct:
happy

---

## 2. Find The Odd Word

Category: emotions

* happy
* angry
* sad
* table

Correct:
table

---

## 3. Match Sentence To Image

Image: boy running

Options:

* The boy is running.
* The boy is sleeping.
* The boy is eating.
* The boy is reading.

---

## 4. True / False

Image: girl eating

Sentence:

"The girl is eating."

Answers:

* True
* False

---

## 5. Listening Exercise

Play audio:

"The dog is running."

User selects correct image.

---

# Spaced Repetition

Implement simple SRS.

Correct answer:

* confidence

Incorrect answer:
schedule earlier review

Intervals:

1 day
3 days
7 days
14 days
30 days
90 days

---

# User Progress

Dashboard:

Words Learned: 247

A1 Progress:
247 / 500

Current Streak:
18 days

Lessons Completed:
84

Mastered Words:
133

---

# Daily Goal

User can select:

5 words/day
10 words/day
20 words/day
50 words/day

Progress bar displayed on home screen.

---

# Lesson Flow

1. Introduce new word
2. Show image
3. Play audio
4. Multiple choice
5. Sentence with new word
6. Listening practice
7. Quick review

After lesson:
mark word as Learning.

---

# AI Prompt Rules

The application should generate all examples using strict constraints.

Prompt example:

"You are an English teacher.

Known words:
boy, girl, dog, run, eat, happy

New word:
fast

Create:

* one simple sentence
* maximum 8 words
* exactly one new word
* no translations
* CEFR A1 level."

---

# Database Schema

tables:

words

* id
* word
* level
* category
* image_url

user_words

* id
* word_id
* status
* review_count
* next_review_at

lessons

* id
* date
* words_learned

statistics

* id
* total_words
* mastered_words
* streak

---

# Gamification

Achievements:

First Word
10 Words
50 Words
100 Words
500 Words
1000 Words

7 Day Streak
30 Day Streak
100 Day Streak

---

# Future Features

* AI generated stories
* AI conversations
* Pronunciation scoring
* Family accounts
* Child mode
* Offline mode
* Sync between devices
* Custom vocabulary packs

---

# MVP Priority

Phase 1:

* Authentication
* Vocabulary database
* Learning cards
* Multiple choice exercises
* Progress tracking
* Local storage

Phase 2:

* AI sentence generation
* TTS audio
* SRS reviews

Phase 3:

* Cloud sync
* Stories
* Conversations
* Premium subscription
