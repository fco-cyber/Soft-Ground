# Soft Ground

A quiet, offline companion for people living with severe anxiety.

It explains what anxiety is doing to the body, shows how the fear was learned, and gives a staged plan for reducing it — in ordinary language, with no clinical jargon and no login. Nothing anyone writes in it ever leaves their device.

Built for young adults in Australia. Crisis numbers throughout are Australian.

---

## What is in it

| Section | What it does |
| --- | --- |
| **Here** | Four doors that meet the reader where she actually is, including "I cannot manage anything today" |
| **Body** | Every physical symptom of anxiety translated into what it is for |
| **Origins** | How the fear was built, in five steps, and where it can be changed |
| **Plan** | Four stages, with a daily checklist and a step-builder for graded exposure |
| **Practices** | Seven exercises: paced breathing with a real hold, naming feelings, distanced self-talk, defusion, the friend test, attention training, values |
| **Reflections** | 18 collapsible readings, each with two or three short lines to repeat silently |
| **Letters** | Seven letters for specific moments — the night before, after cancelling, the two a.m. replay |

Six colour palettes (three light, three dark), adjustable background motion and three text sizes. Every palette passes WCAG AA on every text colour.

## Works offline

The app is a single HTML file with no framework and no build step. A service worker caches it on first visit, along with the web fonts, so after opening it once while connected it runs with no internet at all — on a plane, on the train, or with no data left.

Install it from the browser menu ("Add to Home Screen" / "Install app") and it opens full-screen like a native app.

## Run it

Any static host works. Locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Service workers need `https://` or `localhost`. Opening `index.html` directly with `file://` works, but without offline caching or install.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. **Settings → Pages → Source: GitHub Actions.**
3. Push to `main`. The included workflow publishes the site.

It will be served from `https://<user>.github.io/<repo>/`. All paths are relative, so it works from a subdirectory without changes.

## Repository layout

```
.
├── index.html               the whole app, one file
├── manifest.webmanifest     PWA metadata, icons, shortcuts
├── sw.js                    service worker (offline caching)
├── icons/                   app icons, including a maskable one
├── clinical/index.html      The Understory — the clinician-facing version
└── .github/workflows/       GitHub Pages deployment
```

### The two versions

**`index.html` — Soft Ground.** For the person suffering. Plain language, no citations, no discussion of therapy models. Average sentence length is 10.9 words.

**`clinical/index.html` — The Understory.** Same evidence base, written for clinicians and interested readers. Every claim carries an inline citation, and all 52 references are listed with links. Includes effect sizes and states plainly where the evidence is mixed or contested.

## Editing it

Everything is in `index.html`. Content lives in three arrays near the bottom:

- `REFLECTIONS` — the 18 readings and their "lines to keep"
- `LETTERS` — the seven letters
- `PLANS` — the daily checklists

Palettes are CSS custom-property blocks at the top (`[data-palette="peony"]` and so on). If you change a colour, re-check contrast; the light palettes are the ones that fail first.

**After changing anything, bump `VERSION` in `sw.js`.** Otherwise returning visitors keep the cached copy.

## A note on the content

The exercises are drawn from what has evidence behind it: graded exposure with expectancy testing, cognitive defusion, affect labelling, distanced self-talk, paced breathing at resonance frequency, interoceptive education, self-criticism reduction, and behavioural activation.

The reflections are deliberately **not** affirmations. There is no "I am confident" or "I am enough" anywhere. Statements that contradict what someone actually believes tend not to help people with low self-worth, and specific situational statements do better than global claims about the self. Every line is written to be something a reader could agree with on a bad day.

Source references are in `clinical/index.html`.

## Limits

This is a self-help resource. It is not a diagnosis, not treatment, and not a medical device. It says so in the app. It routes people to a GP and explains that a Mental Health Treatment Plan makes psychology sessions substantially cheaper in Australia.

If you fork this for another country, **change the crisis numbers first.** They appear on the entry screen and in the footer of `index.html`.

## Crisis support (Australia)

- **Lifeline** 13 11 14, or text 0477 13 11 14 — 24 hours
- **Kids Helpline** 1800 55 1800 — ages 5 to 25
- **Beyond Blue** 1300 22 4636
- **13YARN** 13 92 76 — for Aboriginal and Torres Strait Islander people
- **Suicide Call Back Service** 1300 659 467
- **Emergency** 000

## Licence

MIT — see [LICENSE](LICENSE).

The code is freely reusable. If you adapt the written content, please keep the crisis information accurate for wherever your readers are.
