# STORIES E-commerce

## Current State
- Full-stack luxury e-commerce site with React frontend + Motoko backend
- Pages: HomePage, ProductPage, QuizPage, AdminPage
- Sections on HomePage: HeroSection, IntroSection, ProductCarouselSection, AboutSection, Footer
- ProductPage: product image/video, details, variants, quantity, add to cart, recommendations
- QuizPage: 4-step style quiz (style type, occasions, colors, priorities)
- AboutSection already exists but only appears on HomePage
- Brand color: emerald (#20A57E) on cream/warm backgrounds, dark warm footer
- Backend has: products, cart, quiz submission, recommendations, user profiles, authorization, blob-storage

## Requested Changes (Diff)

### Add
1. **Global About Section Footer Strip** — A compact branded about/brand-story strip that renders below every page (HomePage, ProductPage, QuizPage). Should sit above the Footer component. Create a reusable `BrandStripSection` component.
2. **Survey Button in Discover/Intro Section** — A secondary CTA button below the paragraph in IntroSection linking to a new `/survey` route.
3. **Detailed Style Survey** — New SurveyPage at `/survey` route with multi-step questions covering:
   - Body figure (petite, average, tall, plus-size, athletic, curvy)
   - Body proportions (long torso, long legs, balanced, short torso, short legs)
   - Skin tone (fair/porcelain, light/beige, medium/olive, tan/caramel, deep/espresso)
   - Eye color (blue, green, hazel, brown, dark brown/black, grey)
   - Hair color/texture (blonde, brunette, red/auburn, black, grey/silver; and straight, wavy, curly, coily)
   - Style preferences (minimalist, classic, romantic, edgy/bold, boho, streetwear, preppy)
   - Color palette preference (neutrals/earth tones, pastels/soft, bold/vibrant, monochrome/dark)
   Survey saves to backend via a new `submitStyleSurvey` function. On completion, saves to localStorage as well for instant frontend access.
4. **Product Fit Recommendation Paragraph** — In ProductPage, below the product description, add a contextual paragraph that reads the survey data from localStorage and renders a personalized recommendation: "Best For You", "Okay For You", or "Not Ideal For You" with a brief reason. This is frontend-only logic using stored survey answers.
5. **New Motoko backend function** — `submitStyleSurvey(survey: StyleSurvey)` and `getMyStyleSurvey()` to store/retrieve the detailed survey.

### Modify
1. **Brand Colors** — Upgrade the color palette in `index.css` and `tailwind.config.js`:
   - Replace emerald accent with a deep obsidian/charcoal primary (#1A1A1A), warm ivory white (#FAFAF7) backgrounds
   - Add pastel accent tokens: soft blush rose, soft sage green, soft champagne/gold, soft lavender — used sparingly as accents
   - Keep the overall palette white-dominant with black type and pastel touches for a luxury feel
2. **Intro/Discover Section** — Add "Take Our Style Survey" button below the paragraph, styled as a secondary outlined CTA.
3. **ProductPage** — Add fit/recommendation paragraph below the product description based on saved survey data.
4. **All page layouts** — Add `BrandStripSection` above `Footer` on HomePage, ProductPage, QuizPage, AdminPage.

### Remove
- Nothing removed

## Implementation Plan
1. Update `index.css` color tokens: warm white, pure black, pastel accents (blush, sage, champagne, lavender)
2. Update `tailwind.config.js` to map new pastel token names
3. Create `BrandStripSection.tsx` — compact reusable about strip with brand philosophy quote, 3 values pills in pastel accents
4. Create `SurveyPage.tsx` at `/survey` — 7-step detailed survey with smooth step transitions, saves to backend + localStorage
5. Modify `IntroSection.tsx` — add secondary "Take Our Style Survey" CTA button below paragraph
6. Modify `ProductPage.tsx` — add fit recommendation paragraph below description, reading localStorage survey data
7. Modify `HomePage.tsx`, `ProductPage.tsx`, `QuizPage.tsx`, `AdminPage.tsx` — add `BrandStripSection` above Footer
8. Modify `App.tsx` — add `/survey` route
9. Update `main.mo` — add `StyleSurvey` type and `submitStyleSurvey` / `getMyStyleSurvey` functions
