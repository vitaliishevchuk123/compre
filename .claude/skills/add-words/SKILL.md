---
description: Add new vocabulary words with Unsplash images to the Compre A1 lesson sequence
---

# How to add new words to Compre

## Overview
Each word = 1 `LessonCard` in `src/data/seed/a1.ts` + 1 image in `assets/images/a1/` + 1 entry in `src/data/imageRegistry.ts`.

---

## Step 1 — Plan the words

Check `CURRICULUM.md` for which category/batch is next.

Rules (CI invariant):
- Each card introduces **exactly ONE new content word**
- The card's `sentence` may only use words already taught in earlier cards + FUNCTION_WORDS
- `options` (distractors) can include untaught words — only the `sentence` is validated
- `order` must be unique and sequential (next after current max)

FUNCTION_WORDS (in `src/data/seed/a1.ts`):
```
'the', 'a', 'an', 'is', 'are', 'can', 'to', 'and',
'what', 'how', 'this', 'does', 'do', 'many', 'color',
'it', 'its', 'which', 'who', 'my', 'your', 'where'
```
Add new question words here if needed.

Check current max order:
```bash
grep "order:" src/data/seed/a1.ts | tail -5
```

---

## Step 2 — Find images

Choose one strategy. Prefer **Pexels** (Strategy 2) when results look better; fall back to **Unsplash** (Strategy 1) when Pexels returns too many similar shots or misses the concept.

---

### Strategy 1 — Unsplash (Playwright MCP)

Navigate to Unsplash search and extract the first photo URL:

```javascript
// Navigate to:
// https://unsplash.com/s/photos/[search-query-with-dashes]

// Then run in browser_evaluate:
() => [...document.querySelectorAll('img[src*="/photo-"]')]
  .slice(0,1)
  .map(i => `${new URL(i.src).origin}${new URL(i.src).pathname}?w=800&h=800&fit=crop&auto=format&q=80`)[0]
```

Good search queries: `[word]-[context]`, e.g.:
- "quietly" → `person-shushing-quiet`
- "together" → `friends-together-happy`
- "horse" → `horse-beautiful`

Skip non-Unsplash URLs (istockphoto, getty) — take the next result instead:
```javascript
() => [...document.querySelectorAll('img[src*="/photo-"]')]
  .filter(i => !i.src.includes('istock') && !i.src.includes('getty'))
  .slice(0,1)
  .map(i => `${new URL(i.src).origin}${new URL(i.src).pathname}?w=800&h=800&fit=crop&auto=format&q=80`)[0]
```

---

### Strategy 2 — Pexels API

**Pros:** great search relevance, free, often better for educational apps than Unsplash.  
**Cons:** sometimes returns many similar-looking photos.

Requires a free API key from [pexels.com/api](https://www.pexels.com/api/). Store it as `PEXELS_API_KEY` in the environment (or pass inline).

Fetch the best photo URL for a word:
```bash
curl -s "https://api.pexels.com/v1/search?query=running+cat&per_page=1" \
  -H "Authorization: $PEXELS_API_KEY" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['photos'][0]['src']['large'])"
```

Batch-fetch multiple words and collect URLs into a shell array:
```bash
export PEXELS_API_KEY="YOUR_KEY_HERE"

pexels_url() {
  curl -s "https://api.pexels.com/v1/search?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$1")&per_page=3&orientation=square" \
    -H "Authorization: $PEXELS_API_KEY" \
    | python3 -c "
import sys, json
photos = json.load(sys.stdin)['photos']
# prefer square-ish photo; fall back to first
best = sorted(photos, key=lambda p: abs(p['width']-p['height']))[0]
print(best['src']['large'])
"
}

# Example usage:
pexels_url "running cat"
pexels_url "horse beautiful"
```

`src` fields available: `original`, `large`, `large2x`, `medium`, `small`, `portrait`, `landscape`, `tiny`.  
Use `large` (1280px wide) — good balance of quality and file size for mobile.

If the first result looks wrong, bump `per_page` to 5 and inspect `photos[1]` or `photos[2]` instead.

---

## Step 3 — Download images

Name pattern: `a1/[word-or-descriptive-key].jpg`

Batch download in parallel:
```bash
cd assets/images/a1
curl -sL "[URL]" -o [filename].jpg && echo "[word] ✓" &
curl -sL "[URL]" -o [filename].jpg && echo "[word] ✓" &
# ... add all words ...
wait && echo "done"
```

**After downloading, always validate — Pexels sometimes returns 404 HTML (~29 B) instead of a JPEG:**
```bash
for f in assets/images/a1/*.jpg; do
  size=$(wc -c < "$f")
  [ "$size" -lt 1024 ] && echo "BROKEN ($size B): $f"
done
```

Re-fetch any broken file with a fresh Pexels query (the photo ID may have been deleted):
```bash
# Check what's inside before re-fetching
cat assets/images/a1/broken.jpg   # will print <html><body>404</body></html>

# Re-fetch with a new query, skipping the bad ID
BAD_ID=12345678
encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "new search query")
curl -s "https://api.pexels.com/v1/search?query=${encoded}&per_page=5&orientation=square" \
  -H "Authorization: $PEXELS_API_KEY" \
  | python3 -c "
import sys,json
photos=[p for p in json.load(sys.stdin)['photos'] if p['id']!=int('$BAD_ID')]
best=sorted(photos,key=lambda p:abs(p['width']-p['height']))[0]
pid=best['id']
print(f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop')
" | tee /tmp/fix_url.txt
curl -sL "$(cat /tmp/fix_url.txt)" -o assets/images/a1/broken.jpg
ls -lh assets/images/a1/broken.jpg
```

---

## Step 4 — Register images in imageRegistry.ts

File: `src/data/imageRegistry.ts`

Add entries in the appropriate comment section:
```typescript
// Adverbs (or whatever category)
'a1/adv-quietly':  require('../../assets/images/a1/adv-quietly.jpg'),
'a1/adv-loudly':   require('../../assets/images/a1/adv-loudly.jpg'),
```

**Key:** must match `imageKey` used in the card.
**Note:** React Native requires static `require()` paths — no dynamic keys.

---

## Step 5 — Add cards to a1.ts

File: `src/data/seed/a1.ts`

Append before the closing `];` of `A1_CARDS`. Template:
```typescript
{ order: NNN, kind: 'word', newWord: 'word', category: 'category',
  knownWords: ['prev-word1', 'prev-word2'],
  sentence: 'Sentence using only known words?',
  imageKey: 'a1/image-key',
  options: ['word', 'distractor1', 'distractor2'],
  answer: 'word',
  answerPhrase: 'Full spoken phrase.' },
```

Sentence patterns by category:
- Nouns: `'What is this?'`
- Actions: `'What is the [known-subject] doing?'`
- Adjectives: `'How is the [known-subject]?'`
- Colors: `'What color is this?'`
- Numbers: `'How many apples?'` (apple known at order 40)
- Adverbs of place: `'Where is the [known-subject]?'`
- Adverbs of manner: `'How does the [known-subject] [known-verb]?'`

---

## Step 6 — Verify

```bash
npx tsc --noEmit
```

Check order numbers are sequential, no gaps or duplicates:
```bash
grep "order:" src/data/seed/a1.ts | tail -20
```

---

## Step 7 — Update CURRICULUM.md

Mark added words as done in the "Current status" section.

---

## Quick reference: file locations

| What | File |
|------|------|
| Cards | `src/data/seed/a1.ts` |
| Images | `assets/images/a1/*.jpg` |
| Image registry | `src/data/imageRegistry.ts` |
| DB schema | `src/db/schema.ts` |
| Function words | `src/data/seed/a1.ts` → `FUNCTION_WORDS` |
| Curriculum plan | `CURRICULUM.md` |
