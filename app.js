
/* MINDVAULT
   Front-end prototype.
   Authentication, cloud storage and community publishing require a backend.
*/

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

/* --------------------------------
   1. NAVIGATION AND PAGE PROGRESS
--------------------------------- */

const screens = $$('.screen');
const navDots = $$('.side-nav a');
const progress = $('#progressBar');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const index = screens.indexOf(entry.target);
      navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    });
  }, { threshold: 0.45 });

  screens.forEach(screen => observer.observe(screen));
}

addEventListener('scroll', () => {
  if (!progress) return;

  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width =
    `${max > 0 ? scrollY / max * 100 : 0}%`;
}, { passive: true });

/* --------------------------------
   2. AUTHENTICATION NOTICE
--------------------------------- */

// No fake OTPs. A real server-side authentication service
// must be connected before account access can be enabled.

$('#otpForm')?.addEventListener('submit', event => {
  event.preventDefault();

  const message = $('#authMessage');

  if (message) {
    message.textContent =
      'Email verification is not connected in this prototype. No code has been sent. A secure server-side OTP service must be configured before member accounts can be enabled.';
  }
});

/* --------------------------------
   3. DAILY IDEAS
--------------------------------- */

const ideas = [
  'The Ship of Theseus',
  'The hard problem of consciousness',
  'Confirmation bias',
  'Neuroplasticity',
  'The veil of ignorance',
  'Working memory',
  'Moral luck',
  'The spotlight effect',
  'Predictive processing',
  'The experience machine',
  'The trolley problem',
  'Cognitive dissonance',
  'The placebo effect',
  'The bystander effect',
  'The problem of induction',
  'Change blindness',
  'The paradox of tolerance',
  'Theory of mind',
  'Moral responsibility',
  'The mere-exposure effect'
];

let ideaIndex = 0;

$('#nextIdea')?.addEventListener('click', () => {
  ideaIndex = (ideaIndex + 1) % ideas.length;
  $('#dailyIdea').textContent = ideas[ideaIndex];
});

/* --------------------------------
   4. PHILOSOPHY ARCHIVE
--------------------------------- */

const philosophy = [
  ['Free Will and Determinism',
   'Are choices genuinely open to us, or are they the result of prior causes? The debate examines agency, causation and responsibility.'],

  ['Consciousness and the Hard Problem',
   'Why is there subjective experience at all? The hard problem asks how physical processes relate to what experience feels like.'],

  ['Personal Identity Over Time',
   'What makes someone the same person across years of physical and psychological change?'],

  ['Moral Relativism and Moral Realism',
   'Are moral truths independent of human opinion, or do moral judgments depend on cultures and frameworks?'],

  ['Truth, Perception and Interpretation',
   'How do observation, language and prior assumptions shape what people accept as true?'],

  ['Existentialism',
   'Existentialist thought examines freedom, responsibility, meaning and the conditions of human existence.'],

  ['Absurdism',
   'Absurdism explores the tension between the human search for meaning and an apparently indifferent universe.'],

  ['Nihilism',
   'Nihilism questions whether life, morality or knowledge possess objective foundations.'],

  ['Stoicism',
   'Stoic philosophy distinguishes what is within our control from what is not, emphasizing judgment and virtue.'],

  ['Utilitarianism',
   'Utilitarian ethics evaluates actions by their consequences for overall well-being.'],

  ['Deontology',
   'Deontological ethics focuses on duties, rules and principles rather than consequences alone.'],

  ['The Problem of Evil',
   'How can suffering and evil be reconciled with the existence of an all-powerful, all-knowing and perfectly good deity?'],

  ['Mind-Body Dualism',
   'Dualist theories hold that mind and body are fundamentally different kinds of thing.'],

  ['Materialism',
   'Materialist views hold that reality is fundamentally physical, including the basis of mental life.'],

  ['Solipsism',
   'Solipsism asks what can be known about a world beyond one’s own conscious experience.'],

  ['Epistemology',
   'The theory of knowledge investigates belief, justification, evidence and the limits of knowing.'],

  ['Social Contract Theory',
   'Social contract theories explain political authority through real or hypothetical agreements among people.'],

  ['The Ship of Theseus',
   'If every component of an object is replaced over time, in what sense is it still the same object?'],

  ['Artificial Intelligence and Consciousness',
   'Could an artificial system have subjective experience, and what evidence could justify such a claim?'],

  ['Ethics of Human Behaviour',
   'How should people evaluate actions, motives, responsibility and harm in complex social contexts?']
];

const philosophyList = $('#philosophyList');

if (philosophyList) {
  philosophy.forEach(([title, description], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      `topic-button${index === 0 ? ' active' : ''}`;

    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');

    button.append(number, document.createTextNode(title));

    button.addEventListener('click', () => {
      $$('.topic-button', philosophyList).forEach(item => {
        item.classList.remove('active');
      });

      button.classList.add('active');

      $('#topicDetailTitle').textContent = title;
      $('#topicDetailText').textContent = description;
    });

    philosophyList.append(button);
  });
}

/* --------------------------------
   5. PERCEPTION LAB
--------------------------------- */

$('#perceptionForm')?.addEventListener('submit', event => {
  event.preventDefault();

  const answer =
    new FormData(event.currentTarget).get('perception');

  const explanations = {
    A: 'This is one plausible interpretation. Attention, uncertainty and the social setting can shape how someone approaches a conversation.',

    B: 'This is also plausible. People differ in how much they want to participate, and observation alone does not reveal a motive.',

    C: 'This is the most cautious conclusion. The scenario gives too little context to know why the person is standing apart.'
  };

  const result = $('#perceptionResult');

  result.hidden = false;

  result.textContent =
    `${explanations[answer]} Context, prior assumptions and attribution all influence interpretation. No option reveals a personality type.`;
});

/* --------------------------------
   6. COGNITIVE DEMONSTRATIONS
--------------------------------- */

// Anchoring demonstration

$('#anchorSubmit')?.addEventListener('click', () => {
  const value = Number($('#anchorGuess').value);
  const output = $('#anchorResult');

  if (!Number.isFinite(value) || value < 1 || value > 500) {
    output.textContent = 'Enter an estimate from 1 to 500.';
    return;
  }

  output.textContent =
    `The United Nations has 193 member states. Your estimate was ${value}. A proper anchoring study compares groups exposed to different starting values; this single response cannot establish an individual bias.`;
});

// Reaction-time demonstration

let reactionTimer = null;
let reactionStart = 0;
let reactionState = 'idle';

const reactionButton = $('#reactionTarget');

$('#reactionStart')?.addEventListener('click', () => {
  clearTimeout(reactionTimer);

  reactionState = 'waiting';
  reactionButton.disabled = true;
  reactionButton.classList.remove('ready');
  reactionButton.textContent = 'WAIT';

  $('#reactionStatus').textContent =
    'Wait for the panel to change, then select it.';

  reactionTimer = setTimeout(() => {
    reactionState = 'ready';
    reactionStart = performance.now();

    reactionButton.disabled = false;
    reactionButton.classList.add('ready');
    reactionButton.textContent = 'SELECT NOW';
  }, 1200 + Math.random() * 2200);
});

reactionButton?.addEventListener('click', () => {
  if (reactionState === 'ready') {
    const ms = Math.round(performance.now() - reactionStart);

    $('#reactionStatus').textContent =
      `Recorded response: ${ms} ms. This is a rough browser demonstration, not a clinical measurement.`;

    reactionButton.textContent = 'RECORDED';
    reactionState = 'done';

  } else if (reactionState === 'waiting') {
    clearTimeout(reactionTimer);

    reactionState = 'early';
    reactionButton.disabled = true;

    $('#reactionStatus').textContent =
      'Too early. Restart the demonstration and wait for the change.';

    reactionButton.textContent = 'TOO EARLY';
  }
});

/* --------------------------------
   7. DEBATE PREVIEW
--------------------------------- */

$('#debatePreview')?.addEventListener('click', () => {
  const text = $('#debateText').value.trim();
  const box = $('#debatePreviewBox');

  box.hidden = false;

  box.textContent = text ||
    'Write an argument first. A useful contribution states a position and gives reasons.';
});

/* --------------------------------
   8. PERSONALITY AND REFLECTION
      QUESTIONNAIRE LIBRARY
--------------------------------- */

// These are original educational questions.
// They are not official clinical or diagnostic instruments.

// MBTI-style preferences: 20 questions

const mbtiQuestions = [
  ['At a busy event, you usually feel more refreshed after…', ['Talking with several people', 'Having a quieter conversation or time alone'], 'EI'],
  ['When learning something new, you prefer to begin with…', ['A concrete example', 'The larger idea or pattern'], 'SN'],
  ['When making a difficult decision, you first examine…', ['Consistency and logical consequences', 'People’s needs and personal values'], 'TF'],
  ['For a project, you feel more comfortable when…', ['There is a clear plan and endpoint', 'There is room to adapt as you go'], 'JP'],
  ['After a long day, your natural reset is more often…', ['Doing something with other people', 'Having independent time'], 'EI'],
  ['You tend to trust information most when it is…', ['Specific, observable and practical', 'Connected to patterns and possibilities'], 'SN'],
  ['In a disagreement, you are more likely to focus on…', ['Whether the reasoning is sound', 'How the decision affects people'], 'TF'],
  ['When plans change unexpectedly, you usually…', ['Prefer to reorganize quickly', 'Adjust and see where things lead'], 'JP'],
  ['In a group discussion, you often…', ['Think aloud and develop ideas by speaking', 'Form your view internally before speaking'], 'EI'],
  ['You are more drawn to…', ['What is happening and what can be verified', 'What might happen and what it could mean'], 'SN'],
  ['You consider feedback most useful when it is…', ['Direct, specific and impartial', 'Thoughtful and considerate of context'], 'TF'],
  ['Your workspace tends to feel best when…', ['Things have a known place', 'Materials can move around as ideas develop'], 'JP'],
  ['When solving a problem, you often…', ['Talk through possible approaches', 'Reflect privately before sharing'], 'EI'],
  ['You remember information more easily when it includes…', ['Details and real-world examples', 'Connections, metaphors and concepts'], 'SN'],
  ['When evaluating a rule, you first ask…', ['Is it coherent and consistently applied?', 'Is it fair and humane in this situation?'], 'TF'],
  ['For a deadline, you prefer to…', ['Finish early where possible', 'Work flexibly until the deadline approaches'], 'JP'],
  ['At a social gathering, you are more likely to…', ['Move between conversations', 'Stay with a few familiar people or observe'], 'EI'],
  ['You are more interested in…', ['How a system works in practice', 'What a system could become in future'], 'SN'],
  ['When someone asks for advice, you tend to…', ['Identify the problem and compare solutions', 'Understand the person’s feelings and priorities'], 'TF'],
  ['A satisfying weekend plan is usually…', ['Arranged ahead of time', 'Open enough for spontaneous choices'], 'JP']
];

// Big Five / OCEAN: 25 questions

const bigFiveQuestions = [
  ['I enjoy starting conversations with people I do not know.', 'E', false],
  ['I often notice details that others overlook.', 'C', false],
  ['I make time to understand how other people feel.', 'A', false],
  ['I enjoy exploring unfamiliar ideas.', 'O', false],
  ['I often feel tense when several things demand my attention.', 'N', false],
  ['I prefer to observe before joining a group.', 'E', true],
  ['I keep track of tasks and follow through on them.', 'C', false],
  ['I can be blunt even when a softer approach would help.', 'A', true],
  ['I enjoy art, concepts or questions with no single obvious answer.', 'O', false],
  ['My mood is usually steady when plans change.', 'N', true],
  ['I find it easy to introduce myself in a new setting.', 'E', false],
  ['I sometimes leave important tasks until the last moment.', 'C', true],
  ['I try to give people the benefit of the doubt.', 'A', false],
  ['I like testing different ways to approach a problem.', 'O', false],
  ['I worry about things that may never happen.', 'N', false],
  ['I prefer a small circle to frequent social activity.', 'E', true],
  ['I pay attention to accuracy and organization.', 'C', false],
  ['I can become impatient with other people’s mistakes.', 'A', true],
  ['I am curious about unfamiliar cultures, subjects or viewpoints.', 'O', false],
  ['I recover fairly quickly after a stressful day.', 'N', true],
  ['I feel energized by collaborative activities.', 'E', false],
  ['I usually complete what I have committed to doing.', 'C', false],
  ['I try to cooperate even when I disagree.', 'A', false],
  ['I enjoy thinking about abstract or theoretical questions.', 'O', false],
  ['I can feel overwhelmed by uncertainty.', 'N', false]
];

const bigFiveLabels = {
  O: ['Openness', 'Curiosity, imagination and interest in new ideas'],
  C: ['Conscientiousness', 'Organization, follow-through and preference for structure'],
  E: ['Extraversion', 'Social energy, assertiveness and outward engagement'],
  A: ['Agreeableness', 'Cooperation, consideration and interpersonal trust'],
  N: ['Emotional reactivity', 'How strongly stress and difficult emotions may be experienced']
};

// Cognitive style: 12 questions

const cognitiveQuestions = [
  ['When a problem is unfamiliar, you usually begin by…', ['Breaking it into smaller parts', 'Looking for the overall pattern'], 'analytical'],
  ['You understand a new system best by…', ['Following its steps and rules', 'Seeing how its parts connect'], 'analytical'],
  ['When comparing ideas, you first notice…', ['Differences in evidence and detail', 'Themes and relationships'], 'analytical'],
  ['A useful explanation usually gives you…', ['A clear sequence of reasons', 'A broad model or analogy'], 'analytical'],
  ['When reading a complex argument, you prefer…', ['Checking each claim in order', 'Understanding the central idea first'], 'analytical'],
  ['When planning a project, you tend to…', ['Define stages and measurable tasks', 'Map the goal and explore routes'], 'analytical'],
  ['When faced with incomplete information, you…', ['Wait for more specific evidence', 'Form a provisional overall picture'], 'analytical'],
  ['When learning a topic, you prefer…', ['Examples before general rules', 'A general framework before examples'], 'analytical'],
  ['When reviewing a decision, you focus on…', ['The reasoning behind each step', 'How the decision fits the wider context'], 'analytical'],
  ['When a pattern appears, you tend to…', ['Test it against specific cases', 'Explore what the pattern might imply'], 'analytical'],
  ['When explaining a concept, you usually…', ['Define terms and build logically', 'Use connections and comparisons'], 'analytical'],
  ['A confusing situation becomes clearer when you…', ['Separate facts from assumptions', 'Connect the clues into a larger picture'], 'analytical']
];

// Relationship patterns: 8 questions

const attachmentQuestions = [
  ['When someone important to you replies later than usual, what is most typical?', ['I assume they may be busy and continue my day.', 'I wonder whether something has changed between us.', 'I prefer to give them space and focus elsewhere.', 'I may want reassurance but also feel uneasy asking.']],

  ['During a disagreement with someone close, you are most likely to…', ['Talk it through and work toward understanding.', 'Seek reassurance that the relationship is okay.', 'Take space and return when ready.', 'Want closeness but also feel conflicted about it.']],

  ['When you need support, you usually…', ['Ask directly and accept that support may look different than expected.', 'Worry about being a burden or not receiving enough care.', 'Try to handle it alone first.', 'Want help but find it hard to trust that it will feel safe.']],

  ['When a relationship becomes emotionally closer, you tend to…', ['Feel comfortable while keeping your own interests.', 'Think often about whether the other person feels the same.', 'Value closeness but protect a lot of independence.', 'Feel both drawn toward closeness and cautious about it.']],

  ['If a message sounds unusually brief, you usually…', ['Wait for more context before deciding what it means.', 'Wonder if the person is upset with you.', 'Do not focus on it much and keep your distance.', 'Feel uncertain and replay the interaction.']],

  ['When someone sets a boundary, you tend to…', ['Respect it and discuss any practical needs.', 'Worry it means they are pulling away.', 'Appreciate the clarity and prefer more space.', 'Feel unsettled even if you understand the boundary.']],

  ['After a difficult conversation, you are most likely to…', ['Reflect and reconnect when both are ready.', 'Want to resolve it quickly to feel secure.', 'Need time alone before discussing it again.', 'Feel mixed about whether to reconnect or withdraw.']],

  ['What feels most comfortable in close relationships?', ['Trust with room for individuality.', 'Frequent reassurance and clear signs of care.', 'Independence and limited emotional pressure.', 'Closeness that develops slowly with consistency.']]
];

// Dark Triad concepts: educational prompts only.
// This is not a diagnostic or validated scale.

const darkTriadQuestions = [
  ['I sometimes plan carefully how to persuade people toward a goal.', 'M', false],
  ['Being admired is important to how I evaluate my success.', 'N', false],
  ['I can overlook someone’s feelings when I am focused on winning.', 'P', false],
  ['I prefer to be straightforward rather than use social tactics.', 'M', true],
  ['I can accept criticism without needing to defend my image.', 'N', true],
  ['I usually consider how my actions affect other people.', 'P', true],
  ['I think strategically about what different people may want.', 'M', false],
  ['Recognition matters more to me than I usually admit.', 'N', false],
  ['I sometimes act before considering the emotional impact.', 'P', false],
  ['I value cooperation more than getting my own way.', 'M', true],
  ['I do not need to be the centre of attention to feel worthwhile.', 'N', true],
  ['I try to pause and consider consequences before acting.', 'P', true]
];

// Original inkblot-inspired reflection prompt.
// Not the clinical Rorschach test.

const inkblotQuestion = [
  'Look at the abstract symmetrical image. What do you notice first?',
  [
    'Two mirrored shapes facing each other',
    'A single central shape',
    'Several smaller shapes or spaces'
  ],
  'This is an open-ended perception prompt. Ambiguous images can support more than one interpretation because attention, figure-ground organization and prior experience influence what stands out. The answer does not reveal personality, trauma, diagnosis or hidden thoughts.'
];

// Personal values: 15 questions

const valuesQuestions = [
  ['When choices conflict, which matters more?', ['Independence', 'Belonging'], ['autonomy', 'connection']],
  ['Which achievement feels more meaningful?', ['Mastering a difficult skill', 'Helping a group succeed'], ['mastery', 'care']],
  ['Which principle would you protect first?', ['Fairness', 'Loyalty'], ['justice', 'loyalty']],
  ['Which environment suits your priorities?', ['Stability and predictability', 'Discovery and change'], ['security', 'curiosity']],
  ['Which contribution matters more?', ['Creating something original', 'Preserving something valuable'], ['creativity', 'tradition']],
  ['When resources are limited, what guides you?', ['The greatest overall benefit', 'Protecting the most vulnerable'], ['utility', 'compassion']],
  ['Which quality do you respect most?', ['Courage to challenge a norm', 'Discipline to uphold a commitment'], ['courage', 'duty']],
  ['Which kind of freedom matters more?', ['Freedom to choose your own path', 'Freedom from unfair treatment'], ['autonomy', 'justice']],
  ['Which would you rather develop?', ['Deep expertise', 'Wide understanding'], ['mastery', 'curiosity']],
  ['What makes a community stronger?', ['Shared responsibility', 'Room for individual difference'], ['duty', 'autonomy']],
  ['Which outcome would you prioritize?', ['A peaceful relationship', 'An honest disagreement'], ['harmony', 'truth']],
  ['Which legacy feels more worthwhile?', ['A useful improvement', 'A meaningful creative work'], ['utility', 'creativity']],
  ['Which is harder to compromise?', ['Personal integrity', 'A promise to someone'], ['truth', 'loyalty']],
  ['Which matters more in leadership?', ['Clear standards', 'Empathy and listening'], ['duty', 'care']],
  ['What would you most regret neglecting?', ['Learning and exploration', 'Relationships and care'], ['curiosity', 'connection']]
];

/* --------------------------------
   9. QUIZ CONFIGURATION
--------------------------------- */

const quizDefinitions = {
  mbti: {
    title: 'MBTI-style preferences',
    count: mbtiQuestions.length
  },

  bigfive: {
    title: 'Big Five / OCEAN',
    count: bigFiveQuestions.length
  },

  values: {
    title: 'Personal values',
    count: valuesQuestions.length
  },

  cognitive: {
    title: 'Cognitive style',
    count: cognitiveQuestions.length
  },

  attachment: {
    title: 'Relationship patterns',
    count: attachmentQuestions.length
  },

  darktriad: {
    title: 'Dark Triad concepts',
    count: darkTriadQuestions.length
  },

  inkblot: {
    title: 'Inkblot exploration',
    count: 1
  }
};

let activeQuiz = 'mbti';
let quizIndex = 0;
let quizAnswers = [];
let quizStarted = false;

const quizContent = $('#quizContent');
const quizName = $('#quizName');
const quizCount = $('#quizCount');
const quizProgress = $('#quizProgress');

/* --------------------------------
   10. QUIZ INTRODUCTION
--------------------------------- */

function setQuiz(name) {
  if (!quizDefinitions[name]) return;

  activeQuiz = name;
  quizIndex = 0;
  quizAnswers = [];
  quizStarted = false;

  $$('.quiz-choice').forEach(button => {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.quiz === name)
    );
  });

  renderQuizIntro();
}

function renderQuizIntro() {
  if (!quizContent || !quizName || !quizCount || !quizProgress) return;

  const definition = quizDefinitions[activeQuiz];

  quizName.textContent = definition.title;
  quizCount.textContent = `Ready · ${definition.count} questions`;
  quizProgress.style.width = '0%';

  quizContent.replaceChildren();

  const heading = document.createElement('p');
  heading.className = 'quiz-question';

  const introductions = {
    mbti: 'Explore how you tend to recharge, notice information, make decisions and organize your time.',

    bigfive: 'Reflect on how often each statement describes your usual behaviour across ordinary situations.',

    values: 'Explore the principles that tend to guide your choices when priorities compete.',

    cognitive: 'Notice whether you tend to approach information through step-by-step analysis or broader patterns.',

    attachment: 'Reflect on how you may respond to closeness, uncertainty and communication in relationships. These patterns can vary by person and situation.',

    darktriad: 'Consider broad research concepts about strategic social behaviour, admiration and empathy. This is not a diagnosis or a measure of whether someone is good or bad.',

    inkblot: 'Explore an original ambiguous visual prompt. This is not the clinical Rorschach test and does not interpret your personality.'
  };

  heading.textContent = introductions[activeQuiz];

  const note = document.createElement('p');
  note.className = 'small muted';

  note.textContent =
    'There are no right answers. Choose what feels more typical, not what sounds more impressive. Your answers stay in this browser page and are not sent to a server.';

  const begin = document.createElement('button');
  begin.className = 'button button-dark';
  begin.type = 'button';
  begin.textContent = 'Begin exploration ↗';

  begin.addEventListener('click', () => {
    quizStarted = true;
    renderQuestion();
  });

  quizContent.append(heading, note, begin);
}

/* --------------------------------
   11. QUESTION RENDERING
--------------------------------- */

function getQuestionCount() {
  return quizDefinitions[activeQuiz].count;
}

function renderQuestion() {
  if (!quizContent) return;

  const count = getQuestionCount();

  quizName.textContent = quizDefinitions[activeQuiz].title;
  quizCount.textContent = `Question ${quizIndex + 1} of ${count}`;

  quizProgress.style.width =
    `${quizIndex / count * 100}%`;

  quizContent.replaceChildren();

  let questionText;
  let options;

  if (activeQuiz === 'mbti') {
    const item = mbtiQuestions[quizIndex];

    questionText = item[0];

    options = item[1].map((label, index) => ({
      label,
      value: index
    }));

  } else if (activeQuiz === 'bigfive') {
    questionText = bigFiveQuestions[quizIndex][0];

    options = [
      { label: 'Strongly disagree', value: 1 },
      { label: 'Disagree', value: 2 },
      { label: 'Neither agree nor disagree', value: 3 },
      { label: 'Agree', value: 4 },
      { label: 'Strongly agree', value: 5 }
    ];

  } else if (activeQuiz === 'values') {
    const item = valuesQuestions[quizIndex];

    questionText = item[0];

    options = item[1].map((label, index) => ({
      label,
      value: index
    }));

  } else if (activeQuiz === 'cognitive') {
    const item = cognitiveQuestions[quizIndex];

    questionText = item[0];

    options = item[1].map((label, index) => ({
      label,
      value: index
    }));

  } else if (activeQuiz === 'attachment') {
    const item = attachmentQuestions[quizIndex];

    questionText = item[0];

    options = item[1].map((label, index) => ({
      label,
      value: ['secure', 'anxious', 'avoidant', 'mixed'][index]
    }));

  } else if (activeQuiz === 'darktriad') {
    questionText = darkTriadQuestions[quizIndex][0];

    options = [
      { label: 'Strongly disagree', value: 1 },
      { label: 'Disagree', value: 2 },
      { label: 'Neither agree nor disagree', value: 3 },
      { label: 'Agree', value: 4 },
      { label: 'Strongly agree', value: 5 }
    ];

  } else {
    questionText = inkblotQuestion[0];

    options = inkblotQuestion[1].map((label, index) => ({
      label,
      value: index
    }));
  }

  // Display original inkblot illustration.

  if (activeQuiz === 'inkblot') {
    const image = document.createElement('img');

    image.src = 'assets/inkblot.svg';
    image.alt = 'Original symmetrical abstract inkblot illustration';
    image.className = 'quiz-illustration';

    quizContent.append(image);
  }

  const heading = document.createElement('h4');
  heading.className = 'quiz-question';
  heading.textContent = questionText;

  const optionGroup = document.createElement('div');

  optionGroup.className = 'quiz-options';
  optionGroup.setAttribute('role', 'group');
  optionGroup.setAttribute('aria-label', 'Answer choices');

  options.forEach(option => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = option.label;

    button.setAttribute(
      'aria-pressed',
      String(quizAnswers[quizIndex] === option.value)
    );

    button.addEventListener('click', () => {
      quizAnswers[quizIndex] = option.value;

      $$('.quiz-option', optionGroup).forEach((el, index) => {
        el.setAttribute(
          'aria-pressed',
          String(options[index].value === option.value)
        );
      });

      nextButton.disabled = false;
    });

    optionGroup.append(button);
  });

  const actions = document.createElement('div');
  actions.className = 'quiz-actions';

  const backButton = document.createElement('button');

  backButton.type = 'button';
  backButton.textContent = '← Previous';
  backButton.disabled = quizIndex === 0;

  backButton.addEventListener('click', () => {
    if (quizIndex > 0) {
      quizIndex--;
      renderQuestion();
    }
  });

  const nextButton = document.createElement('button');

  nextButton.type = 'button';

  nextButton.textContent =
    quizIndex === count - 1
      ? 'View reflection ↗'
      : 'Next question →';

  nextButton.disabled =
    quizAnswers[quizIndex] === undefined;

  nextButton.addEventListener('click', () => {
    if (quizAnswers[quizIndex] === undefined) return;

    if (quizIndex < count - 1) {
      quizIndex++;
      renderQuestion();
    } else {
      renderResult();
    }
  });

  actions.append(backButton, nextButton);

  quizContent.append(heading, optionGroup, actions);
}

/* --------------------------------
   12. RESULT HELPERS
--------------------------------- */

function addResultParagraph(parent, text, className = '') {
  const paragraph = document.createElement('p');

  if (className) {
    paragraph.className = className;
  }

  paragraph.textContent = text;
  parent.append(paragraph);
}

/* --------------------------------
   13. QUIZ RESULTS
--------------------------------- */

function renderResult() {
  quizProgress.style.width = '100%';
  quizCount.textContent = 'Completed · Reflection';

  quizContent.replaceChildren();

  const wrapper = document.createElement('div');
  wrapper.className = 'quiz-result';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'YOUR REFLECTION';

  wrapper.append(eyebrow);

  /* MBTI-STYLE RESULT */

  if (activeQuiz === 'mbti') {
    const totals = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    mbtiQuestions.forEach((question, index) => {
      const [left, right] = question[2];

      totals[
        quizAnswers[index] === 0 ? left : right
      ]++;
    });

    const dimensions = [
      ['E', 'I', 'Extraversion / Introversion'],
      ['S', 'N', 'Sensing / Intuition'],
      ['T', 'F', 'Thinking / Feeling'],
      ['J', 'P', 'Judging / Perceiving']
    ];

    const type = dimensions
      .map(([a, b]) => totals[a] >= totals[b] ? a : b)
      .join('');

    const title = document.createElement('h4');
    title.textContent = `Your preference pattern: ${type}`;

    wrapper.append(title);

    dimensions.forEach(([a, b, label]) => {
      const total = totals[a] + totals[b];
      const percent = Math.round(totals[a] / total * 100);

      addResultParagraph(
        wrapper,
        `${label}: ${percent}% ${a} preference · ${100 - percent}% ${b} preference`
      );
    });

    addResultParagraph(
      wrapper,
      'This pattern summarizes your answers in this short exercise. A close split suggests that your preference may be flexible or context-dependent. It is not a validated MBTI result, diagnosis, ability measure or prediction of compatibility.',
      'result-note'
    );

  /* BIG FIVE RESULT */

  } else if (activeQuiz === 'bigfive') {
    const totals = {
      O: [], C: [], E: [], A: [], N: []
    };

    bigFiveQuestions.forEach((question, index) => {
      const [, trait, reverse] = question;

      const score = reverse
        ? 6 - quizAnswers[index]
        : quizAnswers[index];

      totals[trait].push(score);
    });

    const title = document.createElement('h4');
    title.textContent = 'Your five-dimension snapshot';

    wrapper.append(title);

    Object.entries(totals).forEach(([trait, scores]) => {
      const average =
        scores.reduce((sum, value) => sum + value, 0) /
        scores.length;

      const [name, description] = bigFiveLabels[trait];

      const level =
        average >= 3.7
          ? 'Higher in this response set'
          : average <= 2.3
            ? 'Lower in this response set'
            : 'Around the middle in this response set';

      addResultParagraph(
        wrapper,
        `${name}: ${average.toFixed(1)} / 5 · ${level}. ${description}.`
      );
    });

    addResultParagraph(
      wrapper,
      'This is a brief, non-validated reflection questionnaire, not a standardized Big Five inventory. Trait scores are not grades, and no level is inherently better.',
      'result-note'
    );

  /* PERSONAL VALUES RESULT */

  } else if (activeQuiz === 'values') {
    const totals = {};

    valuesQuestions.forEach((question, index) => {
      const key = question[2][quizAnswers[index]];

      totals[key] = (totals[key] || 0) + 1;
    });

    const labels = {
      autonomy: 'Independence',
      connection: 'Belonging',
      mastery: 'Mastery',
      care: 'Care',
      justice: 'Fairness',
      loyalty: 'Loyalty',
      security: 'Stability',
      curiosity: 'Curiosity',
      creativity: 'Creativity',
      tradition: 'Continuity',
      utility: 'Practical benefit',
      compassion: 'Compassion',
      courage: 'Courage',
      duty: 'Responsibility',
      harmony: 'Harmony',
      truth: 'Honesty'
    };

    const sorted = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const title = document.createElement('h4');
    title.textContent = 'Values that appeared most often';

    wrapper.append(title);

    sorted.forEach(([key, count]) => {
      addResultParagraph(
        wrapper,
        `${labels[key] || key}: selected ${count} time${count === 1 ? '' : 's'}.`
      );
    });

    addResultParagraph(
      wrapper,
      'This exercise reveals which options you selected in these particular trade-offs. Values can change with context, and the result is not a complete or permanent account of your priorities.',
      'result-note'
    );

  /* COGNITIVE STYLE RESULT */

  } else if (activeQuiz === 'cognitive') {
    const left = quizAnswers.filter(value => value === 0).length;
    const right = quizAnswers.length - left;

    const title = document.createElement('h4');
    title.textContent = 'Your problem-solving snapshot';

    wrapper.append(title);

    addResultParagraph(
      wrapper,
      `Step-by-step / analytical choices: ${left} of ${quizAnswers.length}.`
    );

    addResultParagraph(
      wrapper,
      `Pattern-based / holistic choices: ${right} of ${quizAnswers.length}.`
    );

    addResultParagraph(
      wrapper,
      left === right
        ? 'Your answers were evenly split. You may use both approaches depending on the task.'
        : left > right
          ? 'You selected more step-by-step options in this set. That can be useful for checking details and tracing reasoning.'
          : 'You selected more pattern-based options in this set. That can be useful for connecting ideas and seeing wider relationships.'
    );

    addResultParagraph(
      wrapper,
      'These are complementary approaches, not fixed types or measures of intelligence.',
      'result-note'
    );

  /* RELATIONSHIP PATTERNS RESULT */

  } else if (activeQuiz === 'attachment') {
    const totals = {
      secure: 0,
      anxious: 0,
      avoidant: 0,
      mixed: 0
    };

    quizAnswers.forEach(value => {
      totals[value]++;
    });

    const labels = {
      secure: 'Comfort with trust and mutual support',
      anxious: 'Reassurance-seeking when connection feels uncertain',
      avoidant: 'Preference for independence or space under pressure',
      mixed: 'A mixture of wanting closeness and feeling cautious'
    };

    const sorted = Object.entries(totals)
      .sort((a, b) => b[1] - a[1]);

    const title = document.createElement('h4');
    title.textContent = 'Relationship reflection';

    wrapper.append(title);

    sorted.forEach(([key, count]) => {
      addResultParagraph(
        wrapper,
        `${labels[key]}: selected ${count} time${count === 1 ? '' : 's'}.`
      );
    });

    addResultParagraph(
      wrapper,
      'Attachment research describes patterns, not permanent identities. Responses can differ across relationships and life stages. This short exercise is not a validated attachment assessment or diagnosis.',
      'result-note'
    );

  /* DARK TRIAD EDUCATIONAL RESULT */

  } else if (activeQuiz === 'darktriad') {
    const totals = {
      M: [], N: [], P: []
    };

    darkTriadQuestions.forEach((question, index) => {
      const [, trait, reverse] = question;

      totals[trait].push(
        reverse
          ? 6 - quizAnswers[index]
          : quizAnswers[index]
      );
    });

    const names = {
      M: 'Strategic social influence',
      N: 'Admiration and self-focus',
      P: 'Callous or impulsive tendencies'
    };

    const title = document.createElement('h4');
    title.textContent = 'Concept-by-concept response snapshot';

    wrapper.append(title);

    Object.entries(totals).forEach(([trait, scores]) => {
      const average =
        scores.reduce((sum, value) => sum + value, 0) /
        scores.length;

      addResultParagraph(
        wrapper,
        `${names[trait]}: ${average.toFixed(1)} / 5 average response.`
      );
    });

    addResultParagraph(
      wrapper,
      'These items are original educational prompts, not a validated Dark Triad scale. They cannot establish a trait, diagnose a person or predict behaviour. Context, age and development matter; a score is not a moral label.',
      'result-note'
    );

  /* INKBLOT REFLECTION RESULT */

  } else {
    const title = document.createElement('h4');
    title.textContent = 'What stood out to you';

    wrapper.append(title);

    addResultParagraph(
      wrapper,
      inkblotQuestion[1][quizAnswers[0]]
    );

    addResultParagraph(
      wrapper,
      inkblotQuestion[2],
      'result-note'
    );
  }

  /* RETAKE BUTTON */

  const restart = document.createElement('button');

  restart.type = 'button';
  restart.className = 'button button-dark quiz-restart';
  restart.textContent = 'Retake this exploration ↻';

  restart.addEventListener('click', () => {
    setQuiz(activeQuiz);
  });

  wrapper.append(restart);
  quizContent.append(wrapper);
}

/* --------------------------------
   14. QUIZ BUTTONS AND INITIAL STATE
--------------------------------- */

$$('.quiz-choice').forEach(button => {
  button.addEventListener('click', () => {
    setQuiz(button.dataset.quiz);
  });
});

if ($('#quizBegin')) {
  $('#quizBegin').addEventListener('click', () => {
    quizStarted = true;
    renderQuestion();
  });
}

if (quizContent) {
  renderQuizIntro();
}

/* --------------------------------
   15. CURRENT PROTOTYPE LIMITATIONS
--------------------------------- */

// Private Diary, account authentication, cloud sync,
// debate publishing and email delivery are not connected.
// Do not present these features as production-ready.
// No quiz answers are uploaded or stored by this script.
