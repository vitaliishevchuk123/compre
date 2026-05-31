# Compre

**Learn English through understanding**

> Comprehensible input method

Compre teaches English vocabulary the way people actually acquire language — by
understanding meaning in context, never by translation. Every lesson card shows
an image and introduces exactly **one** new word; every other word on the card is
one you already learned. You understand first, and the words stick.

---

## How it works

- **One new word per card.** Each card adds a single new word. All other words in
  the sentence have appeared in earlier cards, so the meaning is always within reach.
- **No translations.** A picture carries the meaning instead of your native language.
- **Pictures, not dictionaries.** Each card is attached to its own image.
- **Learn by choosing.** Multiple-choice answers reinforce recognition, and your
  progress on every word is tracked over time.

Example progression (A1):

```
boy → girl → dog → "The dog can run." → "The boy can eat."
    → "The girl is happy." → "The dog can run fast."
```

Each step introduces only the **bold** new idea while reusing what you know.

---

## Features (Phase 1)

- 📚 **Vocabulary database** — CEFR-leveled words (starting at A1), stored locally.
- 🖼️ **Image-based lesson cards** — every card bound to its own picture.
- ✅ **Multiple-choice exercises** with instant right/wrong feedback.
- 📈 **Progress tracking** — word status (`new → learning → known → mastered`),
  mastered count, daily streak, and lessons completed.
- 📴 **Offline-first** — runs fully on-device via SQLite; no account required.

---

## Tech stack

| Area        | Choice                                         |
| ----------- | ---------------------------------------------- |
| Framework   | React Native + Expo (SDK 54) + TypeScript      |
| Navigation  | React Navigation (native stack)                |
| Storage     | SQLite (`expo-sqlite`), local-first            |
| Images      | Bundled assets, referenced by `imageKey`       |

> Target device: iPhone 8 / iOS 16.7. Pinned to **Expo SDK 54** (supports iOS 15.1+).
> Do not bump to SDK 55+ — newer Expo Go requires iOS 17+.

---

## Project structure

```
App.tsx                     Navigation + dev-time invariant check
src/
  types.ts                  Domain types (Word, UserWord, LessonCard)
  navigation.ts             Typed route params
  db/
    schema.ts               SQLite schema (words, user_words, lessons, statistics)
    database.ts             Open, init, first-run seed
    words.ts                Word + progress repositories
    statistics.ts           Dashboard stats + streak logic
  data/
    imageRegistry.ts        imageKey → bundled require()
    seed/a1.ts              A1 lesson cards + invariant validator
  screens/
    HomeScreen.tsx          Dashboard
    LessonScreen.tsx        Image + multiple-choice card flow
assets/images/a1/           Bundled lesson images
```

### The core invariant

Lesson content is checked in development by `validateCards()`: every card must
introduce exactly one new content word, and every other content word must have
been taught in an earlier card (articles and auxiliaries like *the / a / is / can*
are treated as implicitly known).

---

## Getting started

```bash
npm install
npx expo start
```

Open the project in **Expo Go** on an iPhone 8 / iOS 16.7 (or a simulator).

Verify the project:

```bash
npx tsc --noEmit     # type-check
npx expo-doctor      # project health
```

---

## Roadmap

**Phase 1 (in progress)** — vocabulary DB, image lesson cards, multiple choice,
progress tracking, local storage. *(Authentication is deferred: the app is
local-first and needs no account yet.)*

**Phase 2** — AI sentence generation, text-to-speech (`expo-speech`), spaced
repetition (SRS).

**Phase 3** — cloud sync, AI stories & conversations, premium.
