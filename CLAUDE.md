# Personal site — Mohammed Nagi

## What this is

A personal research site. Astro, static, deployed to GitHub Pages.

**Audience, in priority order:**
1. Interpretability and AI safety researchers deciding whether I'm worth recruiting
2. Hiring managers and PhD admissions reading fast
3. People who found the photography and stayed

**The site's job:** make someone who has never heard of me understand, in under two
minutes, that I do mechanistic interpretability on transformer models used in scientific
discovery — and that I have one concrete result worth remembering.

**The centrepiece for now is the home page.** The MSc thesis writeup (sparse autoencoders
on InstaNovo) is deferred — shipping without `/research/thesis` for now. The Research
entry on the home page links straight to the `instanovo-sae` repo instead. The memorable
claim, for whenever the writeup lands, is that the features the concept vocabulary can't
score are the most interpretable in the model, not the least. Until then, resolve
ambiguous design decisions in favour of the home page reading well.

## Stack

- Astro 7.3.3, minimal JS. No React/Vue/Svelte unless something genuinely needs interactivity.
- MDX for long-form content (`@astrojs/mdx`) — configured but currently unused; the
  thesis writeup that needs it is deferred
- `remark-math` + `rehype-katex` for equations — same: wired up, unused for now
- Astro's `<Image>` component for all photography
- Plain CSS with custom properties. No Tailwind, no component library.
- Content collections for projects and photos, with typed schemas.

## Structure

```
/                 identity, research summary, selected work, links
/research/thesis  deferred — the full writeup, long-form, figures, math, footnotes
/projects         short entries linking out to GitHub repos
/photography      gallery
/about            longer bio
```

Projects live as brief entries here and in full on GitHub. Do not build elaborate
per-project pages; the repos carry the detail. The thesis is the exception.

Never create a "Publications" section. I don't have publications yet, and an empty or
one-item section under that heading is worse than no section.

## Who writes what

**I write all prose.** Research writing, project descriptions, the about page, photo
captions. Do not draft, rewrite, "polish", or fill in placeholder copy for these. If
content is missing, leave a clearly marked TODO and tell me.

**You write** components, layouts, CSS, config, build scripts, the image pipeline,
schemas, accessibility fixes.

If you think a sentence of mine is unclear, say so in conversation. Don't edit it.

## Design

### Palette

```css
--bg:         #F7F8F6;
--surface:    #F2F1EC;
--text:       #1F2421;
--text-muted: #6B7269;
--accent:     #3F6B54;   /* links, active nav */
--accent-hov: #2E5240;
--sage:       #8FAE9B;   /* rules and borders only — never text */
--rule:       #E2E0D8;
```

Green appears in links, hover states, hairlines, and the active nav item. Nothing else.
No green fills, no green backgrounds, no tinted sections. The background stays neutral so
it doesn't fight the photographs.

Verify any new colour against the background at 4.5:1 minimum before using it for text.

### Type

- Long-form (thesis, about): serif — Source Serif 4 or Newsreader. Generous line-height
  (~1.65), measure capped around 68–72 characters.
- Interface (nav, identity card, project list, captions): one sans, clearly distinct.
- One type scale, set once, used everywhere. Weight and size carry hierarchy — not colour.

### Layout

Single column, left-aligned, with the identity block fixed or sticky on wide screens and
stacked on narrow ones. Content-first and quiet. Whitespace and typography do the work.

## Anti-goals

Do not add, and remove if you find:

- Skill bars, percentage proficiency meters, progress rings
- A hero section with animated or gradient text
- Identical rounded cards with soft grey shadows as the default container for everything
- Entrance animations on scroll, hover lifts on every card
- ALL-CAPS tracked-out eyebrow labels above headings
- Meta strings joined with middle dots, and arrows appended to link text
- A chatbot, an AI assistant, or anything that talks
- Course listings, tech-logo walls, testimonials
- The words "passionate", "cutting-edge", "leveraging", "journey"

Motion: only in response to a user action. No scroll-triggered reveals.

## Quality floor

Assume every page ships with: responsive down to 360px, visible keyboard focus,
`prefers-reduced-motion` respected, real alt text on every image, semantic headings in
order, and a Lighthouse accessibility score of 100. Don't announce these; just do them.

## Working conventions

- Use plan mode for anything structural: routing, schemas, the image pipeline, the type
  scale. Small edits, just make them.
- Small commits, one logical change each, present-tense messages.
- Never commit raw camera files or images over ~2MB. Source photos live outside the repo
  or in `/photos-src`, which is gitignored.
- Don't add a dependency without telling me what it's for and what it costs in bundle
  size. Default answer is no.
- You can't see the photographs or judge whether a gallery looks right. Build the
  mechanism, give me specifics (dimensions, ratios, breakpoints), and let me look.
- Don't refactor things I didn't ask about.

## Content inventory

Real content, for reference when building layouts — do not invent additions:

- **MSc thesis**: sparse autoencoders on InstaNovo, a transformer over mass-spectrometry
  signals. 12,288 features, 92–98.4% reconstruction fidelity, >99.5% downstream loss
  preserved, 639,286 spectra. Repo: `instanovo-sae`.
- **PsychRoute**: LinUCB contextual bandit over a fine-tuned MentalBERT classifier for
  psychiatric triage. 35% error reduction, 3,626 held-out encounters. Repo: `psychroute`.
- **MLAS**: ALS recommender on MovieLens 32M, 8,767× speedup via Numba JIT and dual-CSR
  sparse structures. Repo: `MLAS`.
- **SemEval-2026 Task 9**: two-stage framework for multilingual polarisation detection
  under 16:1 class imbalance. Repo: `NLP`.
- **Spectral graph theory**: Cross-Entropy Method extended with GNN policy approximators
  to find counterexamples to open conjectures, graphs up to N=35.

Background: MSc ''AI for Science' (Distinction), AIMS South Africa, Google DeepMind
Scholar. BSc Electrical and Electronics Engineering (First Class Honours), University of
Khartoum.
