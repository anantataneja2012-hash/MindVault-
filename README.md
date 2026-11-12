
# MindVault

**Explore the architecture of thought.**

MindVault is an independent editorial and interactive platform exploring philosophy, psychology, neuroscience, perception and human thought.

It is designed to encourage intellectual independence, critical thinking, reflection and meaningful discussion.

Website: https://mindvaultspace.com/

Repository: https://github.com/anantataneja2012-hash/MindVault-

Support: supportmindvaultspace@gmail.com

---

## 1. Project philosophy

MindVault is not intended to be a conventional social network, a generic quiz website or a mental-health diagnosis service.

Its purpose is to create a structured space for:

- Exploring philosophical questions.
- Understanding psychological concepts.
- Learning about neuroscience.
- Examining perception and cognitive biases.
- Participating in reasoned discussions.
- Exploring educational psychology activities.
- Maintaining private personal writing.

### Core principles

1. Intellectual independence.
2. Privacy by design.
3. Evidence-based educational content.
4. Transparent moderation.
5. Minimal collection of personal information.
6. Clear distinction between scientific evidence and speculation.
7. No unnecessary behavioural tracking.
8. No misleading psychological or diagnostic claims.

---

## 2. Project structure

```text
MindVault/
│
├── index.html
├── styles.css
├── app.js
│
├── admin.html
├── admin.css
├── admin.js
│
├── privacy.html
├── terms.html
├── cookies.html
│
├── assets/
│   ├── hero-landscape.svg
│   ├── closing-landscape.svg
│   ├── perception-illusion.svg
│   └── inkblot.svg
│
├── supabase/
│   └── schema.sql
│
└── README.md
```

### File responsibilities

| File | Purpose |
|---|---|
| index.html | Main entry and platform structure |
| styles.css | Main visual styling |
| app.js | Frontend interactions |
| admin.html | Administrator interface |
| admin.css | Administrator styling |
| admin.js | Administrator interactions |
| privacy.html | Privacy policy |
| terms.html | Terms of service |
| cookies.html | Cookie policy |
| hero-landscape.svg | Opening landscape |
| closing-landscape.svg | Closing landscape |
| perception-illusion.svg | Perception activity illustration |
| inkblot.svg | Educational inkblot illustration |
| schema.sql | Database foundation |
| README.md | Project documentation |

---

## 3. Main platform areas

### Philosophy Archive

An editorial library containing 20 foundational philosophical topics.

Initial subjects include:

- Free Will and Determinism
- Consciousness and the Hard Problem
- Personal Identity Over Time
- Moral Relativism and Moral Realism
- Truth, Perception and Interpretation
- Existentialism
- Absurdism
- Nihilism
- Stoicism
- Utilitarianism
- Deontology
- Problem of Evil
- Mind-Body Dualism
- Materialism
- Solipsism
- Epistemology
- Social Contract Theory
- Ship of Theseus
- AI and Consciousness
- Ethics of Human Behaviour

Articles should include definitions, historical context, competing arguments, thinkers, examples, critical questions and references.

### Perception Lab

Interactive educational exercises exploring:

- Visual ambiguity
- Pattern recognition
- Social interpretation
- Attention
- Cognitive bias
- Contextual perception
- Emotional interpretation
- Decision-making
- Memory and perception

Explanations must distinguish established findings from hypotheses.

The activities must not claim to diagnose personality, mental disorders or hidden psychological traits.

### Psychology Experiments

The initial educational library includes:

1. Anchoring Effect
2. Reaction Time
3. False Memory
4. Cognitive Style
5. Inkblot Exploration
6. Big Five / OCEAN
7. MBTI-style Exploration
8. Dark Triad Educational Exploration
9. Attachment Style Exploration
10. Values Assessment

These are educational activities, not clinical assessments.

Results should explain methodology, limitations and relevant scientific context.

### Daily Ideas

A collection of 60 initial concepts:

- 20 philosophy concepts.
- 20 psychology concepts.
- 20 neuroscience concepts.

The intended system presents one idea per day, avoids repeating ideas until the initial collection is exhausted and maintains an archive.

### Thought of the Day

A separate editorial feature containing:

- Five reasoned philosophical or psychological thoughts.
- Five external articles with publication details and links.
- Five anonymous user-submitted perspectives.

Previous collections should remain accessible through an archive.

### Philosophy Battles

Initial debate pairs:

- Free Will vs Determinism
- Nature vs Nurture
- Moral Realism vs Relativism
- Machine vs Biological Consciousness
- Rationalism vs Empiricism
- Existentialism vs Nihilism

The emphasis is on understanding opposing positions, not simply winning a vote.

### Debate Room

Initial structure:

```text
DEBATE ROOM
│
├── Philosophy
│   ├── Free Will vs Determinism
│   ├── Nihilism vs Existentialism
│   └── Nature vs Nurture
│
├── Psychology
│   ├── Nature of Empathy
│   └── Human Behaviour
│
├── Neuroscience
│   ├── Consciousness
│   └── Memory
│
└── Create a Debate
```

Topics should refresh every 14 days.

Previous discussions should move to a Past Debates archive. Existing conversations should remain readable.

### Anonymous Diary

A separate public reflection space.

Submissions should be moderated before publication. Public display should not expose account identity.

### Private Diary

A separate private writing environment.

Required capabilities:

- Multiple notebooks.
- Unlimited pages, subject to reasonable storage limits.
- Create, edit and delete entries.
- Search and organization.
- Automatic saving.
- Cloud synchronization.
- Export.
- Permanent account deletion workflow.

Private Diary content must never appear in public feeds, debate discussions, profiles or search results.

---

## 4. Technology

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

The planned backend uses:

- Supabase Authentication.
- PostgreSQL.
- Row Level Security.
- Private object storage where needed.
- Secure server-side operations.

### Email

An email provider will be required for authentication codes and optional notifications.

### Hosting

The production hosting provider and deployment configuration must be documented once selected.

---

## 5. Local development

The frontend can be previewed using a local development server.

For example, with Visual Studio Code:

1. Open the MindVault folder.
2. Install the Live Server extension.
3. Open `index.html`.
4. Select **Open with Live Server**.

Alternatively, use Python's local HTTP server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

A local preview does not automatically provide authentication, database access or cloud persistence.

---

## 6. Supabase configuration

The SQL foundation is located at:

```text
supabase/schema.sql
```

Before production:

1. Create a Supabase project.
2. Review the database schema.
3. Run the SQL in a development environment.
4. Configure authentication.
5. Verify Row Level Security policies.
6. Configure private storage buckets.
7. Test account ownership and access restrictions.
8. Configure backups and deletion procedures.

### Important

Never place a Supabase service-role key, database password or other privileged secret in frontend JavaScript.

Only appropriate public configuration values may be exposed in the browser.

Database access must be protected by server-side authorization and Row Level Security.

---

## 7. Administrator access

The administrator account is restricted to the explicitly authorized email:

```text
anantataneja4@gmail.com
```

The administrator password must be chosen and stored privately by the account owner.

### Required security model

- Authenticate through the backend.
- Verify administrator authorization server-side.
- Maintain administrator privileges in a protected database role or allowlist.
- Enforce authorization for every administrative operation.
- Do not rely on hidden buttons or frontend email comparisons.
- Do not expose administrator credentials in source code.
- Log important moderation and administrative actions.

The administrator login interface is not production-secure until the authentication provider and backend authorization checks are connected and tested.

OTP authentication is a separate planned account feature. It is not considered complete merely because an account interface exists.

---

## 8. Privacy and security requirements

MindVault is intended to minimize personal data collection.

### Private information

Private Diary entries must be accessible only to their authenticated owner and properly authorized backend operations.

### Account deletion

The planned deletion process includes a 15-day recovery period.

The final implementation must:

1. Verify the deletion request.
2. Explain the recovery period.
3. Restrict account access as appropriate.
4. Allow verified cancellation during the recovery window.
5. Delete eligible account data after the period.
6. Document any information retained for legal or security reasons.

### Security checklist

- HTTPS.
- Secure session handling.
- Authentication rate limits.
- Row Level Security.
- Server-side authorization.
- Protection against IDOR.
- Input validation.
- Output escaping.
- SQL injection protection.
- CSRF protection where applicable.
- Content Security Policy.
- Secure response headers.
- Safe file upload validation.
- Backups and recovery testing.
- Restricted administrator access.
- No secrets in public repositories.

Do not claim end-to-end encryption unless it has actually been implemented and independently tested.

---

## 9. Moderation and community safety

Community features require:

- Reporting.
- Content moderation.
- Anti-spam controls.
- Abuse prevention.
- Administrator review.
- Clear community guidelines.
- Protection against disclosure of personal information.

Private messaging between strangers is not part of the initial community scope.

---

## 10. Accessibility and performance

The platform should aim for WCAG 2.2 AA accessibility.

Requirements include:

- Keyboard navigation.
- Visible focus indicators.
- Accessible form labels.
- Meaningful image descriptions.
- Sufficient color contrast.
- Screen-reader compatibility.
- Reduced-motion support.
- Responsive layouts.
- Accessible dialogs and navigation.

Performance work should include:

- Optimized images.
- Lazy loading where appropriate.
- Efficient JavaScript.
- Font optimization.
- Caching.
- Pagination for larger collections.
- Testing on mobile devices.
- Core Web Vitals monitoring.

---

## 11. Legal pages

The project includes:

- `privacy.html`
- `terms.html`
- `cookies.html`

These documents are drafts and must be reviewed against the actual production implementation and applicable laws.

Before launch, confirm:

- The legal operating entity.
- Applicable jurisdiction.
- Actual hosting and database providers.
- Authentication and email providers.
- Actual cookie inventory.
- Data retention practices.
- Age-related requirements.
- User rights and deletion procedures.

Do not publish legal statements that contradict the deployed system.

---

## 12. Development status

The existence of a file does not mean its functionality is complete.

The current project is a development foundation.

| Area | Status |
|---|---|
| Main HTML structure | Created |
| Main CSS | Created |
| Frontend JavaScript | Created |
| Admin interface | Created |
| Admin backend authorization | Pending integration and testing |
| Database foundation | Created, requires review |
| Privacy policy draft | Created |
| Terms draft | Created |
| Cookie policy draft | Created |
| Landscape illustrations | Created |
| Perception illustration | Created |
| Inkblot illustration | Created |
| Supabase authentication | Pending integration |
| OTP authentication | Deferred |
| Private Diary cloud sync | Pending |
| Community persistence | Pending |
| Moderation backend | Pending |
| Educational content library | Pending |
| Account deletion workflow | Pending |
| Production security audit | Pending |

---

## 13. Recommended development order

### Phase 1: Foundation

- Review existing files.
- Verify visual consistency.
- Connect homepage navigation.
- Test mobile responsiveness.
- Remove non-functional controls or clearly mark them as unavailable.

### Phase 2: Authentication

- Connect Supabase Authentication.
- Implement secure email OTP.
- Implement session handling.
- Implement administrator authorization.
- Test account recovery and rate limits.

### Phase 3: Private Diary

- Implement notebooks and entries.
- Add cloud persistence.
- Implement autosave.
- Add ownership checks.
- Add export and deletion.

### Phase 4: Community

- Implement Debate Room.
- Implement anonymous submissions.
- Add reporting and moderation.
- Implement the 14-day debate cycle.

### Phase 5: Educational platform

- Build the Philosophy Archive.
- Add Daily Ideas.
- Add Thought of the Day.
- Implement Perception Lab.
- Implement Psychology Experiments.
- Build Philosophy Battles.

### Phase 6: Production readiness

- Complete legal review.
- Conduct security testing.
- Audit cookies and external requests.
- Test accessibility.
- Optimize performance.
- Configure domain and HTTPS.
- Verify all production functionality.

---

## 14. Production acceptance criteria

MindVault should not be considered production-ready until:

- Every navigation item works.
- Authentication is genuine.
- Administrator access is verified server-side.
- Private Diary data is securely stored.
- Public and private content are separated.
- User submissions are moderated.
- Deletion procedures work as documented.
- All educational collections are populated.
- No frontend secrets are exposed.
- No important buttons are fake or misleading.
- Legal documents match actual practices.
- Mobile and accessibility testing is complete.
- Security and recovery procedures are tested.

---

## 15. Contact

**MindVault Support**

supportmindvaultspace@gmail.com

Website: https://mindvaultspace.com/

Repository: https://github.com/anantataneja2012-hash/MindVault-

---

**MindVault**

*Explore the architecture of thought.*

