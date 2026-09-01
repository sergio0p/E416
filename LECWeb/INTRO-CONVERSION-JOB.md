# Conversion Job: intro.html frames + faq.html

## Context

Working directory: `/Users/sergiop/Dropbox/Teaching/Projects/LECWeb/`
Course: ECON 416 (Behavioral Economics)
Server: `http://localhost:8416`

## Task 1: Expand `416/intro.html`

The current `416/intro.html` has a section header "Introduction" and a Nobel Prize frame. Restructure it so the 4 new frames come **before** the Nobel frame.

Final frame order:
1. Section header "Introduction" (keep as-is)
2. **Borges frame** (new)
3. **Mont Sainte Victoire frame** (new)
4. **Math is a language — egypt image** (new)
5. **Math is a language — math + English** (new)
6. Nobel Prize frame (keep, just moved to end)

---

### Frame 1 — "On Exactitude in Science"

- **Type:** `overlay-frame` (pinned, progressive reveal)
- **Frame title:** "On Exactitude in Science"
- **Frame subtitle:** Jorge Luis Borges, *Collected Fictions*, translated by Andrew Hurley.
- **Content:** 4 overlay `<p>` elements, each revealed in sequence:

  1. "In that Empire, the Art of Cartography attained such Perfection that the map of a single Province occupied the entirety of a City, and the map of the Empire, the entirety of a Province."
  2. "In time, those Unconscionable Maps no longer satisfied, and the Cartographers Guilds struck a Map of the Empire whose size was that of the Empire, and which coincided point for point with it."
  3. "The following Generations, who were not so fond of the Study of Cartography as their Forebears had been, saw that that vast Map was Useless,"
  4. "and not without some Pitilessness was it, that they delivered it up to the Inclemencies of Sun and Winters. In the Deserts of the West, still today, there are Tattered Ruins of that Map, inhabited by Animals and Beggars; in all the Land there is no other Relic of the Disciplines of Geography."

- After the 4 paragraphs, add a right-aligned attribution line (small, italic):
  *Suarez Miranda, Viajes de varones prudentes, Libro IV, Cap. XLV, Lérida, 1658.*

---

### Frame 2 — "Mont Sainte Victoire"

- **Type:** `overlay-frame` with `data-overlay-only` (one image at a time)
- **Frame title:** "Mont Sainte Victoire"
- **Frame subtitle:** "Photography vs Cézanne"
- **Content:** Two full-width images that swap on scroll:
  - Step 1 (only): `svg/sainte-victoire-photo.jpg` — the photograph
  - Step 2 (only): `svg/mont-sainte-victoire.jpg` — the Cézanne painting

**Image source files to copy into `416/svg/`:**
```
/Users/sergiop/Dropbox/Teaching/Images/sainte-victoire-photo.jpg
/Users/sergiop/Dropbox/Teaching/Images/mont-sainte-victoire.jpg
```

---

### Frame 3 — "Mathematics is a tool (language)" — image

- **Type:** plain `frame` (no overlay)
- **Frame title:** "Mathematics is a tool (language)"
- **Content:** The egypt image, centered, filling most of the frame.
  - `src="svg/egypt.jpeg"`
  - Use `max-width: 380px; width: 100%`

**Image source file to copy into `416/svg/`:**
```
/Users/sergiop/Dropbox/Teaching/Images/egypt.jpeg
```

---

### Frame 4 — "Mathematics is a tool (language)" — math + English

- **Type:** `overlay-frame` (2 steps)
- **Frame title:** "Mathematics is a tool (language)"
- **Content:**
  - Step 1 (visible immediately): the math statement (large, `.fs-14pt`):

    > If $f:[a,b]\to\mathbb{R}$ satisfies $[\forall x\in[a,b]$ and $\forall \varepsilon>0,\ \exists\delta>0$ such that $|x-y|\lt\delta \Rightarrow |f(x)-f(y)|\lt\varepsilon]$ $\Rightarrow \exists z\in[a,b];\ \forall x\in[a,b],\ f(z)\ge f(x).$

  - Step 2 (revealed on scroll): the plain-English translation (normal size, `font-style: italic`):

    > If a real-valued function defined on a closed interval on the real line is continuous, then it attains a maximum on that interval.

  Note: use `\lt`, `\gt`, `\le`, `\ge` — never bare `<` or `>` inside `$…$`.

---

## Task 2: Create `416/faq.html` (standalone, NOT linked from nav)

Separate file. No `meta[name="nav-prev/next"]`. No link in `index.html`. This is a reference document, not part of the lecture flow.

Use `overlay-frame` for each Q&A so the answer reveals on scroll. Question in italics always visible (step 1), answer revealed (step 2).

### Q&A frames:

**Frame: "Questions & Answers"**
- Q: *I understand the lecture notes but during the exams I am not able to answer the questions. What am I doing wrong? How should I study for this class?*
- A: The only way to make sure you understood the material is to solve problems. Try to work in groups and try to solve as many problems as you can. Do not be frustrated if you get stuck with a problem. The problems where you get stuck are precisely the ones that are useful for your study. They should serve as a guide to where the focus of your reading should go and to which questions you should bring to class.

**Frame: "Questions & Answers"**
- Q: *I am trying to solve problems but many of the posted or suggested problems lack an answer key. How can I check if my work is correct? What use is to solve a problem if I do not know whether my solution is correct?*
- A (two reveals — step 2 and step 3): 
  - Step 2: The point of solving problems is not to come up with a right answer but rather to elicit questions that you may have about the material. If you are unsure about your work or answer this is a good signal. Please do bring the problem to class and express your doubts. If you faced a challenge when trying to solve a problem and you are not sure of your answer or not sure on how to proceed at some step, chances are, your colleagues have similar questions and it is worth discussing in class.
  - Step 3 (highlighted — use a `block` or `boxalert` style): The lack of an answer key is, for most cases, **deliberate**. It is designed to give incentives for you to work the problems rather than trying to memorize solutions.

**Frame: "Questions & Answers"**
- Q: *I am about to graduate. I need an upper-level requirement course. This course is the only one that fits my schedule. Should I take this class?*
- A: It depends on your degree of risk-aversion. The variance of grades is sometimes high.

**Frame: "Is this course useful?" / subtitle: "for an Econ PhD"**
- Q: *I want to go to grad school in Economics. Should I take this course?*
- A: It depends. In grad school, you will have several opportunities to take Microeconomic Theory and Behavioral Economics courses. If you want to increase your chances of being accepted by a top program, you should take more classes at the Mathematics Department.

**Frame: "Is this course useful?" / subtitle: "Econ and other fields"**
- Q: *Would you recommend this course to any Econ, CS, or Poli Sci major?*
- A: Of course: if you want to learn more about when and why people deviate from rational behavior, this is a good course for you. If you plan to go to Law School, grad school in Public Policy, Political Science, etc., or if you just want to learn for the sake of learning, this is a terrific course for you.

**Frame: "Is this course useful?" / subtitle: "outside academia"**
- Q: *I do not want to pursue any further academic degree. I want to find a job in industry, commerce, or the financial sector. But in real life people are not fully rational — will I be able to use anything I learn in this class?*
- A: Chances are, you will not write down a formal model for some real-life situation and make accurate predictions based on it. But that does not mean that models are useless. Behavioral Economics may help you understand and anticipate real-life decisions — your own, your colleagues', and your customers'. Understanding systematic deviations from rationality is directly applicable to product design, policy, negotiation, and finance.

---

## Boilerplate reference

See `416/behavioral-choice-risk.html` for a working example of the full HTML boilerplate used in 416 lectures (KaTeX, GSAP, beamer-theme.css, scroll-animations.js).

The `scroll-animations.js` overlay mechanism:
- `.overlay-frame` pins the frame while scrolling
- `.overlay[data-overlay="N"]` reveals at step N and stays visible
- `data-overlay-only` attribute on an overlay makes it visible **only** at its step (Beamer `\only`)
- First overlay is always visible immediately (step 1 = shown on enter)
