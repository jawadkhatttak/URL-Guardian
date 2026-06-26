# URL Guardian

A frontend phishing URL analysis tool that evaluates URLs using a modular, rule-based detection engine and presents the results in a modern cybersecurity dashboard.

## Overview

URL Guardian analyzes URLs for common phishing indicators using independent detection rules. Instead of relying on a single heuristic, the application combines multiple signals into a weighted risk score, producing an explainable security assessment.

This project focuses on clean architecture, maintainability, and user experience while demonstrating practical frontend engineering and cybersecurity concepts.

---

## Preview

UI:

<img width="1358" height="916" alt="Image" src="https://github.com/user-attachments/assets/033c2f33-e5a4-4ec4-90ac-abd880765d66" />

<img width="1358" height="1439" alt="Image" src="https://github.com/user-attachments/assets/90690b93-65d5-44c2-9892-559226a5e8e5" />

Output as Json:

<img width="1113" height="527" alt="Image" src="https://github.com/user-attachments/assets/b87e567a-2c06-44ee-be65-1f94068db8d1" />

Output as PDF:

<img width="718" height="620" alt="Image" src="https://github.com/user-attachments/assets/95126e40-21b3-4e54-9dc1-f4add3679961" />

## Features

* Modular rule-based phishing detection engine (16 independent rules)
* Weighted risk scoring (0–100) with suppression logic for overlapping signals
* Severity-based findings with explanations and recommendations
* URL parsing and domain analysis (protocol, hostname, registered domain, subdomain, TLD)
* SVG animated risk score visualization
* Local scan history with restore functionality (no re-analysis needed)
* Export reports as JSON and PDF
* Responsive dashboard optimized for desktop and mobile
* Dark, cybersecurity-inspired interface

---

## Detection Rules

Current analysis includes:

* IP address detection
* URL shorteners
* HTTP / HTTPS validation
* Long URL detection
* Suspicious subdomain patterns
* Hostname keyword analysis
* Brand impersonation detection
* Punycode detection
* Unicode detection
* Homograph / confusable character detection
* Levenshtein brand similarity
* Shannon entropy analysis
* Redirect pattern detection (`@` trick and open-redirect query parameters)
* Non-standard port detection
* Suspicious file extensions
* JavaScript and data protocol detection

Each rule lives in its own file under `js/rules/` and returns a finding object or `null`. Adding a new rule means writing one file and registering it in `js/rules/index.js` — nothing else in the app needs to change.

---

## Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript (ES Modules)
* LocalStorage
* SVG animations

No backend, build step, or external frameworks are used.

---

## Getting Started

This project uses native ES modules, which browsers block on the `file://` protocol — you need to serve it over HTTP, even locally.

```bash
git clone https://github.com/<your-username>/url-guardian.git
cd url-guardian

# pick one:
npx serve .
# or
python3 -m http.server 8080
```

Open the local URL it prints. There's nothing to build or install beyond that.


---

## Project Structure

```
url-guardian/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js              # entry point, wires UI to the engine
    ├── core/
    │   ├── parser.js         # URL parsing + registrable-domain extraction
    │   ├── analyzer.js       # orchestrates parse -> rules -> suppression -> score
    │   ├── score.js          # weighted scoring + risk-level mapping
    │   ├── ruleWeights.js    # per-rule weight + per-severity base score tables
    │   └── ruleDependencies.js # suppression rules for overlapping findings
    ├── rules/                # 16 independent detectors, one file each
    ├── data/                 # brand list, shortener list, keyword list,
    │                         # curated public-suffix list, confusables table
    ├── ui/                   # DOM rendering, history, sample chips, export
    └── utils/                # Levenshtein, Shannon entropy, storage, formatting
```

---

## Risk Levels

| Score  | Level    |
| ------ | -------- |
| 0      | Safe     |
| 1–20   | Low      |
| 21–40  | Medium   |
| 41–70  | High     |
| 71–100 | Critical |

---

## Design Goals

* Explainable phishing detection — every score traces back to specific, readable findings
* Modular architecture — one rule per file, easy to extend or remove
* Production-style UI
* Maintainable codebase
* Frontend-only implementation

---

## Limitations

Worth knowing before treating this as more than a portfolio/educational tool:

* **Domain parsing uses a curated suffix list, not the real Public Suffix List.** The real PSL has 9,000+ entries and normally ships inside a package (`tldts`, `psl`) — pulling one in would require a bundler or CDN dependency, which conflicts with the vanilla-JS, no-build-tooling goal here. The curated list covers common cases and falls back to "last label is the TLD" otherwise.
* **Brand and shortener lists are short and curated**, not exhaustive threat-intel databases — expect both false negatives (an unlisted brand won't be flagged) and occasional false positives.
* **"Export PDF" uses the browser's native print dialog**, not a generated PDF byte stream — building one from scratch client-side would require a library like jsPDF.
* **Every rule is independently defeatable.** This is heuristic pattern-matching, not threat intelligence. Treat every score as supporting evidence for a human decision, not a verdict.

---

## Roadmap

This project is being developed in multiple stages.

### Version 1 (Current)

* Rule-based phishing detection
* Local analysis
* Interactive dashboard
* Report export

### Planned Version 2

* Node.js backend
* WHOIS analysis
* DNS inspection
* SSL certificate analysis
* Threat intelligence integration
* Content analysis using Playwright

### Planned Version 3

* Authentication
* Database persistence
* Background scanning workers
* Job queues
* Scan history
* Public report sharing

### Planned Version 4

* Machine learning classifier
* Feature extraction pipeline
* AI-assisted phishing detection
* Confidence scoring

---

## Purpose

The goal of this project is to explore how modern phishing detection systems work by gradually evolving a frontend rule engine into a full-stack security analysis platform.
