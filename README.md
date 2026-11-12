
# MindVault

**Explore the architecture of thought.**

MindVault is an independent intellectual platform exploring philosophy, psychology, neuroscience, perception and human thought.

It is designed as an editorial, interactive experience rather than a conventional social-media platform.

## Project Structure

```text
MindVault/
│
├── index.html
├── styles.css
├── app.js
├── privacy.html
├── terms.html
├── cookies.html
│
├── assets/
│   ├── hero-landscape.svg
│   ├── closing-landscape.svg
│   ├── perception-illusion.svg
│   └── mindvault-lake.png
│
└── README.md
```

Additional assets may be added as development progresses.

## Main Sections

1. Cinematic Entry Page
2. Account Authentication
3. Main Editorial Index
4. Philosophy Archive
5. Perception Lab
6. Psychology Experiments
7. Philosophy Battles
8. Debate Room
9. Anonymous Diary
10. Private Diary
11. Support and Closing

## Educational Content

### Philosophy Archive
Twenty foundational philosophical topics, including:

- Free Will and Determinism
- Consciousness
- Personal Identity
- Existentialism
- Absurdism
- Nihilism
- Stoicism
- Utilitarianism
- Epistemology
- Ethics of Human Behaviour

### Perception Lab

Interactive exercises exploring:

- Visual ambiguity
- Pattern recognition
- Attention
- Cognitive bias
- Contextual perception
- Social interpretation
- Memory and perception

### Psychology Experiments

Planned experiments include:

- Anchoring Effect
- Reaction Time
- False Memory
- Cognitive Style
- Inkblot Exploration
- Big Five
- MBTI-style exploration
- Dark Triad educational exploration
- Attachment Style exploration
- Values Assessment

These activities are educational and are not clinical assessments or diagnoses.

### Daily Ideas

The initial content library will contain 60 concepts:

- 20 Philosophy
- 20 Psychology
- 20 Neuroscience

One idea will be featured each day, with an archive and category filters.

## Design Principles

- Vertical editorial layout
- Cinematic natural landscapes
- Minimal typography
- Ivory, charcoal, forest green and burgundy palette
- Responsive desktop and mobile layouts
- Accessible navigation
- Reduced-motion support
- No unnecessary visual clutter

## Technology

Current frontend:

- HTML5
- CSS3
- Vanilla JavaScript

Planned backend:

- PostgreSQL database
- Secure authentication
- Email OTP provider
- Private cloud storage
- Server-side access controls
- Secure account and diary management

The final provider choices are still to be confirmed.

## Running Locally

1. Open the project folder.
2. Open `index.html` in a browser.

For a more reliable local development environment, use a local development server such as VS Code Live Server.

## Current Development Status

The frontend is under development.

Some interactive features may currently use demonstration data or browser-side logic.

The following require genuine backend implementation before production:

- Email OTP authentication
- Secure account sessions
- Private Diary cloud synchronisation
- Debate Room persistence
- Anonymous submissions and moderation
- Notifications
- Secure file uploads
- Account deletion workflow
- Email delivery
- Privacy and cookie controls

A demonstration feature must never be represented as a functioning production service.

## Privacy Principles

MindVault aims to:

- Collect only necessary information.
- Keep private diary entries private.
- Separate anonymous submissions from private writing.
- Avoid advertising trackers.
- Avoid selling personal information.
- Avoid using private user content for AI training.
- Provide transparent account and data controls.

Actual privacy guarantees depend on the implemented infrastructure and must be verified before launch.

## Security Requirements

Production deployment must include:

- HTTPS
- Server-side authentication and authorisation
- Secure session cookies
- OTP expiration and rate limiting
- Input validation
- Protection against common web vulnerabilities
- Private file storage
- Database access controls
- Secure secret management
- Tested account deletion

Never publish API secrets, database passwords or private credentials in frontend code or a public repository.

## Legal Documents

- Privacy Policy: `privacy.html`
- Terms of Service: `terms.html`
- Cookie Policy: `cookies.html`

These documents must be reviewed against the actual implementation and applicable law before launch.

## Development Philosophy

MindVault is not designed to tell people what to think.

It is designed to create room for questioning, examining assumptions, exploring evidence and considering alternative interpretations.

**Think independently. Question carefully.**
