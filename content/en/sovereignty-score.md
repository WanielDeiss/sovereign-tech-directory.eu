---
title: "Sovereignty Score"
description: "How we score tools for digital sovereignty: dimensions, rules, and examples"
menu:
  main:
    name: "Sovereignty Score"
    weight: 3
---

## What is the Sovereignty Score?

The **Sovereignty Score** is a number from **0.0 to 10.0** (in steps of 0.5) that summarises how well a tool supports digital sovereignty. It is **computed automatically** from the data we hold for each tool (e.g. where the vendor is based, whether the software is open source, where data is stored). No one edits the score by hand; it is fully transparent and reproducible.

You can use it to compare tools at a glance. The breakdown by dimension (see below) shows where a tool is strong or weak.

**Score colors.** On tool cards and detail pages, the score is shown as a colored badge. The color reflects the score band: **red** (0.0–2.0), **amber** (2.5–5.0), **lime/green** (5.5–8.0), **green** (8.5–10.0). If we have little data for a tool, the badge appears slightly faded (low confidence); the exact confidence is shown on the tool page.

---

## Why we use this score

We want to give you a **clear, comparable** view of tools. The score:

- Reflects several aspects of sovereignty (legal base, data control, openness, lock-in risk, and how independently you can run the tool).
- Is **deterministic**: the same data always produces the same score.
- Is **documented**: every rule is public so you can check how your favourite tool is scored.

Scores are generated when we build the site. They are not stored in our source data; they are derived from it.

---

## The five dimensions

Each dimension is scored from **0 to 2 points** (in 0.5 steps). The total score is the **sum** of these five scores, so the maximum is **10.0**.

| Dimension | What it measures |
| :-------- | :--------------- |
| **Legal jurisdiction** | Where the vendor is based and operates (EU, EEA, countries with EU adequacy, or mixed/non-EU). |
| **Data control** | Where data is stored (EU, EEA, non-EU, or unknown) and whether you can self-host. |
| **Openness** | Whether the software is open source and whether it uses open standards or protocols. |
| **Lock-in** | How easy it is to leave the tool (open standards and data portability reduce lock-in). Higher points = less lock-in. |
| **Operational autonomy** | How independently you can run and control the tool (self-hosting, open source, or at least an EU-based vendor). |

---

## How each dimension is scored

The following tables describe the exact rules we use. They are the same rules used in our build process.

### Legal jurisdiction

We look at whether the company is registered in the EU/EEA and in which countries it operates. Countries are grouped into: **EU only**, **EEA** (EU plus Iceland, Liechtenstein, Norway), **adequacy** (countries with an EU adequacy decision, e.g. UK, Switzerland), **mixed** (mix of these and others), or **non-EU**.

| EU-based company? | Countries classification | Points |
| :----------------- | :----------------------- | -----: |
| Yes | EU or EEA only | 2.0 |
| Yes | Adequacy only | 1.5 |
| Yes | Mixed | 1.0 |
| Yes | Non-EU only | 0.5 |
| No | EU or EEA only | 1.5 |
| No | Adequacy only | 1.0 |
| No | Mixed | 0.5 |
| No | Non-EU only | 0.0 |

### Data control

We combine **self-hostable** (can you run it yourself?) with **data residency** (EU, EEA, non-EU, or unknown).

| Self-hostable? | Data residency | Points |
| :------------- | :------------- | -----: |
| Yes | EU | 2.0 |
| Yes | EEA | 2.0 |
| Yes | Non-EU | 1.5 |
| Yes | Unknown | 1.0 |
| No | EU | 1.5 |
| No | EEA | 1.0 |
| No | Non-EU | 0.5 |
| No | Unknown | 0.0 |

### Openness

We use **open source** (yes/no) and **open standards** (does the tool use or implement open protocols or standards?).

| Open source? | Open standards? | Points |
| :----------- | :-------------- | -----: |
| Yes | Yes | 2.0 |
| Yes | No | 1.5 |
| No | Yes | 1.0 |
| No | No | 0.0 |

### Lock-in

Lock-in is scored by adding:

- **+1.0** if the tool uses open standards.
- **+1.0** if data portability is full, **+0.5** if partial, **+0.0** if none or unknown.

The total is capped at 2.0. So: higher score = less lock-in risk.

### Operational autonomy

We look at self-hosting, open source, and (if neither) whether the vendor is EU-based.

| Self-hostable? | Open source? | EU-based vendor (if neither)? | Points |
| :------------- | :----------- | :----------------------------- | -----: |
| Yes | Yes | — | 2.0 |
| Yes | No | — | 1.5 |
| No | Yes | — | 1.0 |
| No | No | Yes | 0.5 |
| No | No | No | 0.0 |

---

## Confidence level

Next to the score we show a **confidence** level: **high**, **medium**, or **low**.

- **High**: All relevant data is present and no value is "unknown". The score is well grounded.
- **Medium**: One or two fields are missing or set to "unknown". The score may shift a bit if we add more data.
- **Low**: Several fields are missing, or critical fields (e.g. open source, self-hostable) are missing. We still show a score (using conservative defaults), but treat it as uncertain.

Missing booleans are treated as "no"; missing data portability is treated as "unknown". So scores never rely on guesswork; they stay deterministic.

---

## What the score ranges mean

| Score range | Interpretation |
| :---------- | :------------- |
| **0.0 – 2.0** | Low sovereignty; strong dependency on non-EU or non-transparent providers. |
| **3.0 – 5.0** | Limited sovereignty; some EU or control aspects, but notable lock-in or lack of openness. |
| **6.0 – 8.0** | Good sovereignty; EU/EEA or strong openness and control, with some gaps. |
| **9.0 – 10.0** | High sovereignty; EU/EEA where relevant, open, self-hostable, low lock-in. |

---

## Worked examples

### Element (Matrix) – score 9.0

- **Legal jurisdiction**: Vendor not EU-based; operations in UK (adequacy) → **1.0**
- **Data control**: Self-hostable, data residency EU → **2.0**
- **Openness**: Open source, open standards (Matrix) → **2.0**
- **Lock-in**: Open standards + full data portability → **2.0**
- **Operational autonomy**: Self-hostable, open source → **2.0**  
**Total: 9.0** (confidence: high)

### Nextcloud – score 10.0

- **Legal jurisdiction**: EU-based company, operations in Germany (EU) → **2.0**
- **Data control**: Self-hostable, EU → **2.0**
- **Openness**: Open source, open standards (e.g. WebDAV, CalDAV) → **2.0**
- **Lock-in**: Open standards, full data portability → **2.0**
- **Operational autonomy**: Self-hostable, open source → **2.0**  
**Total: 10.0** (confidence: high)

### GitLab – score 8.0

- **Legal jurisdiction**: Not EU-based; operations in NL and US (mixed) → **0.5**
- **Data control**: Self-hostable, but default data residency non-EU → **1.5**
- **Openness**: Open source, open standards (Git, etc.) → **2.0**
- **Lock-in**: Open standards, full data portability → **2.0**
- **Operational autonomy**: Self-hostable, open source → **2.0**  
**Total: 8.0** (confidence: high)

---

## FAQ

**Where do you get the data?**  
From the structured data we maintain for each tool (e.g. EU company yes/no, countries, data residency, open source, self-hostable, open standards, data portability). You can inspect and suggest changes via our repository.

**Do you ever adjust scores manually?**  
No. The score is computed only from the documented rules. If a score changes, it is because the underlying data or the (documented) rules changed.

**Why is "lock-in" scored so that higher is better?**  
We score "low lock-in" positively. So a higher number in that dimension means it is easier to leave the tool or move your data; a lower number means more lock-in risk.

**What if data is missing?**  
We still compute a score using conservative defaults (e.g. missing booleans count as "no"). The **confidence** level (high/medium/low) tells you how much we know. Low confidence means the score could change if we add more data.

**How often do scores change?**  
Scores are regenerated every time we build the site. So any change to tool data or to the scoring logic is reflected in the next build.
