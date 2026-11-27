import type { CategoryMeta, Project, ProjectCategory } from "@/types/content";

/**
 * Project case studies.
 *
 * Content rules:
 * - Only facts Arnav has provided are written as plain statements.
 * - Anything that still needs real detail (metrics, screenshots, links)
 *   is marked `pending: true` or set to null, and renders as a visible
 *   placeholder instead of invented content.
 *
 * To add a project: append an object to `projects`. The gallery, case-study
 * page, sitemap, command palette and architecture explorer pick it up.
 */

export const categories: CategoryMeta[] = [
  { id: "software-engineering", label: "Software engineering" },
  { id: "data-analytics", label: "Data analytics" },
  { id: "artificial-intelligence", label: "AI" },
  { id: "full-stack", label: "Full-stack" },
];

export const projects: Project[] = [
  {
    slug: "interview-mirror",
    title: "Interview Mirror",
    tagline:
      "An AI mock interviewer that runs entirely in your browser: it asks questions out loud, listens, asks a follow-up and coaches your answer.",
    context: "Independent project",
    categories: ["artificial-intelligence", "software-engineering"],
    domain: "On-device AI, speech, computer vision",
    status: null,
    featured: true,
    preview: "mirror",
    technologies: [
      "TypeScript",
      "React",
      "Vite",
      "Transformers.js",
      "Whisper",
      "WebLLM",
      "WebGPU",
      "MediaPipe",
      "Web Audio",
      "Vitest",
      "Playwright",
      "GitHub Actions",
    ],
    overview:
      "A practice tool for job interviews. It reads a question aloud, records your answer on camera, and then three AI models running on your own device review it: Whisper transcribes the answer, a small language model checks its structure and asks a follow-up about what you said, and MediaPipe face tracking estimates your eye contact. There is no server and nothing is uploaded, so it costs nothing to run.",
    problem:
      "Practising interviews alone gives you no feedback, and most AI interview tools send your voice and video to a server and charge for it. I wanted a mock interviewer that reacts to what you actually said, measures delivery honestly, and keeps the recording on the candidate's own computer.",
    approach: [
      {
        text: "Captures raw microphone samples with an AudioWorklet while you speak and resamples them to 16 kHz, instead of decoding the compressed recording afterwards. The recording is kept only for replay.",
      },
      {
        text: "Transcribes with OpenAI's open-source Whisper (base.en, 8-bit) through Transformers.js in a Web Worker, so the page stays responsive while it works.",
      },
      {
        text: "Runs an open language model (Qwen 2.5 1.5B or Llama 3.2 3B) on the GPU with WebLLM. Its reply is constrained to a JSON schema, and a rubric part only counts as covered if the quote it gives really appears in the transcript.",
      },
      {
        text: "Estimates eye contact from MediaPipe face landmarks: head rotation from the face's transform matrix plus where each iris sits in its eye, sampled five times a second. Look-aways under 1.5 seconds are treated as glances.",
      },
      {
        text: "Measures delivery with rules rather than guesses: pauses from the audio's loudness against a threshold that adapts to the room, pace from first word to last, and filler words matched in context ('like' counts in 'it was, like, slow' but not in 'I like Python').",
      },
    ],
    contributions: [
      { text: "Designed and built the whole application independently." },
      {
        text: "Behavioural, technical and opening question sets, plus custom questions pasted from a job posting, each with its own rubric.",
      },
      {
        text: "AI follow-up questions inserted into the interview as it runs, with a time limit and a skip button so a slow model never blocks you.",
      },
      {
        text: "A report with replay, a highlighted transcript, the interviewer's notes and an eye-contact strip where each look-away jumps to that moment in the video.",
      },
      {
        text: "Progress saved in the browser with trends over time, and a Markdown export of each session.",
      },
    ],
    challenges: [
      {
        text: "On my own laptop every answer failed with 'Unable to decode audio data', because decoding a browser recording fails on some browser and driver combinations. I replaced decoding with raw capture through an AudioWorklet, and recording now waits until the microphone tap is ready.",
      },
      {
        text: "Small language models sometimes invent quotes to justify a score. The app checks every quote against the transcript, drops invented ones and marks that rubric part as missing.",
      },
      {
        text: "Averaging the two irises' positions cancelled out sideways glances (one eye left of centre, the other right). Using the mean of each eye's distance from centre fixed it.",
      },
      {
        text: "The models are large downloads. They load in Web Workers with progress shown, and the app still gives transcript, delivery and eye-contact feedback when a device has no WebGPU for the language model.",
      },
    ],
    evaluation: [
      {
        text: "49 unit tests cover filler and hedge matching, pause timing, pace and length ratings, quote checking of the AI's reply, eye-contact geometry and saved sessions.",
      },
      {
        text: "3 Playwright browser tests run the full flow with Chrome's fake camera and microphone: answering, the AI follow-up, the report, eye-contact markers and a denied microphone. These tests swap the three models for fixed replies, so they check the app around the models, not the models' quality.",
      },
      {
        text: "GitHub Actions runs lint, build, unit tests and browser tests on every push.",
      },
      {
        text: "Limitations: small language models are far weaker than ChatGPT-class models, Whisper tidies up some 'um's so filler counts are a minimum, eye contact is an estimate rather than real eye tracking, it is English only, and I haven't measured whether it improves real interview outcomes.",
      },
    ],
    architecture: {
      summary:
        "Everything runs in the browser. The microphone feeds a timing analysis and Whisper; the transcript feeds rule-based delivery checks and the language model; the camera feeds face tracking. The report combines all three.",
      layers: ["Input", "Models", "Analysis", "Output"],
      nodes: [
        {
          id: "capture",
          label: "Camera and microphone",
          tech: "getUserMedia · AudioWorklet",
          layer: 0,
          role: "Raw microphone samples for analysis and a MediaRecorder clip for replay. Recordings stay in the page's memory and are never uploaded.",
        },
        {
          id: "whisper",
          label: "Speech to text",
          tech: "Whisper base.en · Transformers.js",
          layer: 1,
          role: "Transcribes each answer with WebAssembly in a Web Worker, while you move on to the next question.",
        },
        {
          id: "face",
          label: "Face tracking",
          tech: "MediaPipe Face Landmarker",
          layer: 1,
          role: "478 face points and head rotation, five times a second while you answer, turned into an eye-contact share and a list of look-aways.",
        },
        {
          id: "delivery",
          label: "Delivery analysis",
          tech: "TypeScript rules",
          layer: 2,
          role: "Pauses from the audio's loudness, pace, length, filler words, hedges and 'I' versus 'we', each rated against common coaching targets.",
        },
        {
          id: "llm",
          label: "AI interviewer",
          tech: "WebLLM · WebGPU",
          layer: 2,
          role: "Qwen 2.5 1.5B or Llama 3.2 3B checks the answer against a rubric (Situation, Task, Action, Result for behavioural questions), quoting the transcript, and writes one follow-up question.",
        },
        {
          id: "report",
          label: "Report and progress",
          tech: "React · localStorage",
          layer: 3,
          role: "Replay, highlighted transcript, interviewer's notes and eye-contact strip. Only text results are saved, in the browser.",
        },
      ],
      edges: [
        { from: "capture", to: "whisper", label: "16 kHz audio" },
        { from: "capture", to: "face", label: "Video frames" },
        { from: "capture", to: "delivery", label: "Loudness and pauses" },
        { from: "whisper", to: "delivery", label: "Transcript" },
        { from: "whisper", to: "llm", label: "Transcript" },
        { from: "face", to: "report", label: "Eye contact" },
        { from: "delivery", to: "report", label: "Delivery feedback" },
        { from: "llm", to: "report", label: "Notes and follow-up" },
      ],
    },
    screenshots: [
      {
        src: "/projects/interview-mirror/setup.webp",
        alt: "Interview Mirror setup screen: choosing a question set, the number of questions, and AI interviewer options",
        caption: "Choosing a practice set and the AI interviewer",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/interview-mirror/question.webp",
        alt: "Interview screen with a behavioural question beside the mirror, which is ringed with bulbs that follow the microphone level",
        caption: "A question beside the mirror, with Space to start and stop",
        width: 1600,
        height: 1000,
      },
      {
        src: null,
        alt: "Placeholder for a report from a real practice session",
        caption: "Report from a real practice session (screenshot coming)",
        width: 1600,
        height: 1000,
      },
    ],
    video: {
      src: "/projects/interview-mirror/demo.mp4",
      poster: "/projects/interview-mirror/demo-poster.webp",
      label:
        "Screen recording of Interview Mirror's interface: choosing a behavioural practice set, the first question, and recording an answer while the mirror's bulbs follow the microphone. Recorded with a test microphone, so the feedback report isn't shown.",
    },
    repository: { url: "https://github.com/ChachraArnav/InterviewMirror" },
    demo: { url: "https://interview-mirror-six.vercel.app" },
  },
  {
    slug: "marketlens",
    title: "MarketLens",
    tagline:
      "Can a model warn you about a sharp five-day ETF drop? Tested honestly on a year it never saw, and checked against the exchange's own data.",
    context: "Data science project, solo",
    categories: ["data-analytics", "artificial-intelligence"],
    domain: "Data science, machine learning, financial analytics",
    status: null,
    featured: true,
    preview: "market",
    technologies: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "Streamlit",
      "Plotly",
      "pytest",
      "GitHub Actions",
      "Yahoo Finance",
    ],
    overview:
      "MarketLens studies 13 Canadian-listed ETFs from 2021 to 2026 and asks one question: using only what is known at today's close, can a model rank the days most likely to be followed by a drop of 3% or more over the next five trading days? Four models are trained on 2021 to 2024, compared on 2025, and the chosen one is scored once on 2026. A Streamlit dashboard presents the data, the checks and the results.",
    problem:
      "Most market-prediction projects shuffle the data, report accuracy and stop there. With fewer than one risky day in ten, a model that never predicts a drop is over 90% accurate and useless, and shuffled time series quietly leak the future into training. I wanted a result that would survive a fair test, and to know whether the data underneath it could be trusted.",
    approach: [
      {
        text: "Collected daily adjusted prices for 13 ETFs from Yahoo Finance and rejected any build with non-positive prices, duplicate dates or missing values.",
      },
      {
        text: "Cross-checked Yahoo against TMX Money, the Toronto Stock Exchange's data site, over 188 trading days, and reconciled every dividend adjustment with BlackRock's announced payouts.",
      },
      {
        text: "Built five features known at the close (1- and 5-day returns, 20-day volatility, price vs its 10-day average, volume change) and a label for the next five days.",
      },
      {
        text: "Split by date: train 2021 to 2024 with a 5-day purge gap, choose the model and threshold on 2025, test once on 2026.",
      },
      {
        text: "Compared a majority-class baseline, logistic regression, a random forest and a small neural network on average precision rather than accuracy.",
      },
      {
        text: "Added a model-free reference that ranks days by volatility alone, to see how much of the signal is just that.",
      },
    ],
    contributions: [
      {
        text: "Designed the research question, labels and the train / validation / test protocol.",
      },
      {
        text: "Built the Python package: data collection and validation, features, chronological splits, models, evaluation and the cross-check.",
      },
      {
        text: "Wrote 18 pytest tests, including one that shocks every price after a cutoff and asserts no earlier feature changes.",
      },
      {
        text: "Set up GitHub Actions to lint, test and rebuild the research, failing if the committed results don't reproduce.",
      },
      { text: "Designed and built the eight-page Streamlit dashboard." },
    ],
    challenges: [
      {
        text: "Leakage hides in time series. The last five training days have labels that look into the validation year, so they are purged, and scaling lives inside a pipeline fit on training data only.",
      },
      {
        text: "Yahoo's dividend-adjusted prices never equal the traded price. Instead of comparing prices directly, the check uses the ratio between the two sources, which stays constant between dividends and jumps by exactly the payout on each ex-date.",
      },
      {
        text: "The headline result looked good, so I tried to break it. Ranking days by volatility alone did about as well as the forest, which changed what the project could honestly claim.",
      },
      {
        text: "Every number had to reproduce. Row order changed the random forest's output, so rows are sorted by date and ticker before training, and CI checks the results on every push.",
      },
    ],
    evaluation: [
      {
        text: "On the untouched 2026 test (2,743 ETF-days), the random forest reached an average precision of 0.251 against 0.113 for random guessing, about 2.2×. At its 2025-chosen threshold it flagged 77% of the drops, and about one alert in five was correct.",
      },
      {
        text: "Ranking by 20-day volatility alone scored 0.265 on the same test. Most of what the models learn is that volatile ETFs fall 3% more often, and the forest's own feature importances agree.",
      },
      {
        text: "With a volatility-adjusted drop label, no model beat chance by much (0.067 vs 0.058). Once you account for volatility, short-term drops were close to unpredictable from these features.",
      },
      {
        text: "Data quality: 0 date mismatches with TMX, every close within half a cent once the dividend adjustment is undone, and 3 of 3 dividend adjustments matching BlackRock's announced amounts to the cent.",
      },
      {
        text: "Limitations: one test year, one market and 13 correlated ETFs; overlapping five-day labels; the volatility comparison was added after the test was seen. Historical analysis, not investment advice.",
      },
    ],
    architecture: {
      summary:
        "A reproducible batch pipeline run with one command (python -m marketlens all): prices are collected and validated, cross-checked against an independent source, turned into features and labels, evaluated under a fixed protocol, and presented in Streamlit. CI re-runs the whole thing on every push.",
      layers: ["Source", "Preparation", "Modelling", "Presentation"],
      nodes: [
        {
          id: "yahoo",
          label: "Market data",
          tech: "Yahoo Finance",
          layer: 0,
          role: "Daily adjusted prices for 13 ETFs from January 2021. Saved to disk so every result can be rebuilt without downloading again.",
        },
        {
          id: "tmx",
          label: "Reference data",
          tech: "TMX Money · BlackRock",
          layer: 0,
          role: "Three 90-day XEQT price histories from the Toronto Stock Exchange's data site, plus BlackRock's announced distributions, used only to verify the primary source.",
        },
        {
          id: "validate",
          label: "Validation and cross-check",
          tech: "Pandas",
          layer: 1,
          role: "Rejects non-positive prices, duplicates and missing values, then compares Yahoo with TMX day by day and reconciles each dividend adjustment with the announced payout.",
        },
        {
          id: "features",
          label: "Features and labels",
          tech: "Pandas · NumPy",
          layer: 1,
          role: "Five features computed from data up to each day, and a label for the next five days. A unit test proves no feature can see the future.",
        },
        {
          id: "models",
          label: "Model evaluation",
          tech: "Scikit-learn",
          layer: 2,
          role: "Chronological split with a purge gap; baseline, logistic regression, random forest and MLP compared on 2025 by average precision; the chosen model and threshold are frozen and scored once on 2026.",
        },
        {
          id: "ci",
          label: "Tests and CI",
          tech: "pytest · GitHub Actions",
          layer: 2,
          role: "18 tests plus a CI job that rebuilds the research from saved prices and fails if the committed results don't reproduce.",
        },
        {
          id: "dashboard",
          label: "Dashboard",
          tech: "Streamlit · Plotly",
          layer: 3,
          role: "Eight pages: market overview, data quality, ETF explorer, portfolio simulator, diversification, 2025 model research, the 2026 test and risk analysis.",
        },
      ],
      edges: [
        { from: "yahoo", to: "validate", label: "Raw daily prices" },
        { from: "tmx", to: "validate", label: "Independent prices and payouts" },
        { from: "validate", to: "features", label: "Validated prices" },
        { from: "features", to: "models", label: "Feature matrix and labels" },
        { from: "models", to: "dashboard", label: "Predictions and test results" },
        { from: "validate", to: "dashboard", label: "Quality report" },
        { from: "ci", to: "models", label: "Rebuilds and checks" },
      ],
    },
    screenshots: [
      {
        src: "/projects/marketlens/test.webp",
        alt: "2026 test page: average precision 0.251 versus 0.113 for random guessing, recall 77.1%, precision 20.7%, a precision-recall chart and the random forest's feature importances led by 20-day volatility",
        caption: "The 2026 test, scored once with choices frozen on 2025",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/marketlens/volatility.webp",
        alt: "Bar chart comparing average precision for random guessing, a volatility-only rule and the chosen model, for 2025 and 2026 under both risk definitions",
        caption: "How much of the signal is just volatility",
        width: 1600,
        height: 602,
      },
      {
        src: "/projects/marketlens/data-quality.webp",
        alt: "Data quality page: 188 trading days compared with TMX Money, 0 date mismatches, largest closing-price gap 0.5 cents and 3 of 3 distributions matched",
        caption: "Yahoo cross-checked against the Toronto Stock Exchange's data",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/marketlens/overview.webp",
        alt: "Market overview page with dataset summary, XEQT price chart and return, volatility and drawdown cards",
        caption: "Market overview",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/marketlens/risk.webp",
        alt: "Risk analysis page showing how often each ETF was followed by a five-day drop under both risk definitions",
        caption: "Downside-event frequency by ETF",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/marketlens/portfolio.webp",
        alt: "Portfolio simulator comparing a buy-and-hold ETF mix with a benchmark",
        caption: "Buy-and-hold portfolio simulator",
        width: 1600,
        height: 1000,
      },
    ],
    video: {
      src: "/projects/marketlens/demo.mp4",
      poster: "/projects/marketlens/demo-poster.webp",
      label:
        "Screen recording of the MarketLens dashboard: the market overview, the data quality cross-check, the 2026 test results with the volatility comparison, risk analysis and the portfolio simulator",
    },
    repository: { url: "https://github.com/chachraarnav/MarketLens" },
    demo: { url: null, unavailableReason: "Live demo coming soon" },
  },
  {
    slug: "emak-solutions",
    title: "EMAK Solutions",
    tagline: "Client workflow and task management for an architectural firm.",
    context: "University software engineering team project",
    categories: ["full-stack", "software-engineering"],
    domain: "Full-stack software engineering",
    status: "academic",
    featured: true,
    preview: "workflow",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "REST APIs",
      "JWT",
      "Git",
    ],
    overview:
      "A collaborative workflow and task management system built for an architectural firm as a university software engineering project. Managers and staff use it to run projects, assign work and track task status.",
    problem:
      "Coordinating client projects across a team needs one place to see who owns what, where each task stands and what has changed. Without it, status lives in conversations and inboxes, and managers have no reliable overview.",
    approach: [
      { text: "React and TypeScript single-page frontend talking to a REST API." },
      { text: "Node.js and Express backend handling business logic and validation." },
      { text: "JWT-based authentication with role-based access for managers and staff." },
      { text: "PostgreSQL as the system of record for users, projects, tasks and activity." },
      { text: "Task status workflows and an activity log, with dashboards for managers." },
    ],
    teamScope: [
      { text: "Role-based access control" },
      { text: "Project management and task assignment" },
      { text: "Manager dashboards" },
      { text: "Task status workflows" },
      { text: "Activity logging" },
    ],
    contributions: [
      { text: "Frontend functionality in React and TypeScript." },
      { text: "Integrating the frontend with the team's REST API." },
      { text: "Collaborative development through a shared Git workflow." },
      { text: "Debugging and testing across the stack." },
    ],
    challenges: [
      {
        text: "The interface has to reflect the user's role: managers and staff see different actions, and the API must enforce the same rules rather than trusting the UI.",
      },
      {
        text: "Several developers working in one codebase means agreeing on API contracts early so frontend and backend can progress in parallel.",
      },
      { text: "Add a specific bug or integration problem you worked through.", pending: true },
    ],
    evaluation: [
      { text: "Features were tested and debugged across the frontend and API integration points." },
      {
        text: "Add the testing approach used (manual test plans, unit tests, tools).",
        pending: true,
      },
    ],
    architecture: {
      summary:
        "A conventional three-tier web application: a React client, an Express REST API with a JWT authentication layer, and PostgreSQL behind it.",
      layers: ["Client", "API", "Security", "Data"],
      nodes: [
        {
          id: "react",
          label: "Web client",
          tech: "React · TypeScript",
          layer: 0,
          role: "The interface managers and staff use day to day: project lists, task boards, assignment and status changes. It shows different actions depending on the signed-in user's role, and sends every change to the API.",
        },
        {
          id: "api",
          label: "REST API",
          tech: "Node.js · Express",
          layer: 1,
          role: "Owns EMAK's business rules: who can create a project, assign a task or move it to a new status. Validates requests from the client and is the only component that talks to the database.",
        },
        {
          id: "auth",
          label: "Authentication",
          tech: "JWT",
          layer: 2,
          role: "Issues a signed token at sign-in and verifies it on every API request. The token carries the user's role, which the API uses to enforce role-based access, so a staff account can't call manager-only endpoints even if the UI were bypassed.",
        },
        {
          id: "rbac",
          label: "Role-based access",
          tech: "Express middleware",
          layer: 2,
          role: "Checks the role from the verified token against what each endpoint allows. This is where the manager/staff split is enforced server-side.",
        },
        {
          id: "postgres",
          label: "Database",
          tech: "PostgreSQL",
          layer: 3,
          role: "Stores EMAK's users, roles, projects, tasks and the activity log. Relational constraints keep task assignments tied to real projects and users, and the activity table records who changed what, which feeds the manager dashboards.",
        },
      ],
      edges: [
        { from: "react", to: "api", label: "JSON over HTTPS with bearer token" },
        { from: "api", to: "auth", label: "Verify token" },
        { from: "auth", to: "rbac", label: "User role" },
        { from: "api", to: "postgres", label: "SQL queries" },
      ],
    },
    screenshots: [
      {
        src: null,
        alt: "EMAK Solutions manager dashboard",
        caption: "Manager dashboard (use anonymized data only)",
      },
    ],
    repository: { url: null, unavailableReason: "Private repository (client project)" },
    demo: { url: null, unavailableReason: "Not publicly hosted" },
  },
  {
    slug: "academic-decoder",
    title: "Academic Decoder",
    tagline:
      "Paste or upload your notes and get a summary, key terms and fill-in-the-blank questions built from your own sentences.",
    context: "Independent project",
    categories: ["artificial-intelligence", "software-engineering"],
    domain: "Natural language processing, application development",
    status: null,
    featured: true,
    preview: "pipeline",
    technologies: [
      "Python",
      "spaCy",
      "Streamlit",
      "pypdf",
      "python-docx",
      "pytest",
      "GitHub Actions",
    ],
    overview:
      "A study tool that reads lecture notes, readings or slides (pasted, or uploaded as PDF, Word or text) and returns a short summary, the key terms and a practice quiz. It uses classic natural language processing with spaCy rather than a generative model, so every summary sentence and every question comes word-for-word from the student's own notes. It started as a terminal script and is now a tested web app.",
    problem:
      "Turning dense notes into self-test questions takes time, and generated study material can state things the notes never said. I wanted something that only ever quotes the notes, runs free with no API key, and keeps the notes private.",
    approach: [
      {
        text: "Repairs text copied from PDFs and slides first: rejoins words hyphenated across lines, merges wrapped lines, drops bullets and page numbers, and keeps headings separate.",
      },
      {
        text: "Summarizes by word frequency: words are reduced to their dictionary form, scored by how often they appear, and the highest-scoring sentences are kept in their original order.",
      },
      {
        text: "Builds questions by blanking out a key term in a sentence, using named entities and whole noun terms ('carbon dioxide', not 'dioxide') ranked by how central they are to the notes.",
      },
      {
        text: "Makes multiple-choice options from other terms of the same kind in the same notes, ordered by meaning similarity with spaCy's word vectors, and skips any option already visible in the question.",
      },
      {
        text: "Checks answers forgivingly: capitals, punctuation, a leading 'the' and plurals are ignored, and small typos are accepted only in longer answers.",
      },
    ],
    contributions: [
      { text: "Designed and built the whole application independently." },
      {
        text: "Rewrote the original NLTK and spaCy script as a tested Python package with a terminal version and a Streamlit web app.",
      },
      { text: "Text extraction for PDF, Word, Markdown and plain-text files." },
      { text: "Question generation, distractor selection and answer checking." },
      { text: "A pytest suite and GitHub Actions CI that lint and test every push." },
    ],
    challenges: [
      {
        text: "The first version blanked whatever word matched first, sometimes part of another word, and showed the answer's length in the blank. Questions now blank exact character ranges of whole terms behind a fixed-length blank.",
      },
      {
        text: "spaCy's small English model mislabeled terms (a verb tagged as a noun, 'Photosynthesis' tagged as an organisation). Switching to the medium model fixed most of it and added the word vectors used to choose wrong answers.",
      },
      {
        text: "Lines copied from PDFs are broken mid-sentence while headings have no full stop, so a simple rule either glued headings onto sentences or split sentences apart. The cleaner treats a line followed by a lower-case word as a continuation and a short unpunctuated line as a heading.",
      },
      {
        text: "The original crashed with a division by zero when the notes produced no questions. Empty and very short input is now handled and covered by tests.",
      },
    ],
    evaluation: [
      {
        text: "27 automated tests cover file reading (PDF, Word, text), cleaning, summarizing, question generation and answer checking, and run on every push through GitHub Actions.",
      },
      {
        text: "Tests check the guarantees that matter: every summary sentence appears verbatim in the notes, filling each blank with its answer gives back the original sentence, and every option comes from the notes with the answer listed once.",
      },
      {
        text: "Answer checking is tested both ways: it accepts 'chlorophyl' for 'Chlorophyll' and a missing 'the', and rejects 'plant' for 'planet'.",
      },
      {
        text: "Limitations: it selects sentences rather than understanding them, the general English model still mislabels some technical terms, scanned PDFs need OCR first, and I haven't measured how much the quizzes help people learn.",
      },
    ],
    architecture: {
      summary:
        "A single-pass pipeline: notes in, cleaned text, one spaCy analysis shared by the summarizer and the question builder, then a Streamlit app or the terminal shows the results.",
      layers: ["Input", "Processing", "Analysis", "Output"],
      nodes: [
        {
          id: "notes",
          label: "Study notes",
          tech: "PDF · Word · text",
          layer: 0,
          role: "Notes the student pastes or uploads. They are processed in memory and are not stored or sent to any external service.",
        },
        {
          id: "clean",
          label: "Extraction and cleaning",
          tech: "pypdf · python-docx",
          layer: 1,
          role: "Pulls the text out of the file and repairs it: hyphenated words rejoined, wrapped lines merged, bullets and page numbers removed, headings kept on their own line.",
        },
        {
          id: "spacy",
          label: "Language analysis",
          tech: "spaCy en_core_web_md",
          layer: 1,
          role: "One pass that splits sentences and tags every word with its dictionary form, part of speech and named-entity type, plus word vectors. Both the summary and the quiz reuse it.",
        },
        {
          id: "summary",
          label: "Summary and key terms",
          tech: "Word frequency",
          layer: 2,
          role: "Scores each sentence by how often its words appear in the notes and keeps the top sentences in order. Key terms are the most frequent nouns and noun phrases.",
        },
        {
          id: "quiz",
          label: "Question builder",
          tech: "Entities · word vectors",
          layer: 2,
          role: "Blanks out the most important term in a sentence, picks wrong answers of the same kind from the same notes by meaning similarity, and checks typed answers with typo tolerance.",
        },
        {
          id: "app",
          label: "Web app and report",
          tech: "Streamlit · Markdown",
          layer: 3,
          role: "Shows the summary, key terms, highlighted notes and an interactive quiz, and exports a Markdown study report. A terminal version runs the same pipeline.",
        },
      ],
      edges: [
        { from: "notes", to: "clean", label: "Uploaded or pasted notes" },
        { from: "clean", to: "spacy", label: "Clean text" },
        { from: "spacy", to: "summary", label: "Sentences and word scores" },
        { from: "spacy", to: "quiz", label: "Entities, terms and vectors" },
        { from: "summary", to: "app", label: "Summary and key terms" },
        { from: "quiz", to: "app", label: "Questions and options" },
      ],
    },
    screenshots: [
      {
        src: "/projects/academic-decoder/summary.webp",
        alt: "Summary tab for computer networking notes: 223 words, 15 sentences, 5 in the summary and 6 questions, with five summary sentences about TCP and UDP and a list of key terms",
        caption: "Summary and key terms, quoted from the notes",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/academic-decoder/quiz.webp",
        alt: "Quiz tab after checking answers: multiple-choice fill-in-the-blank questions about TCP and UDP, with correct answers in green and a missed one showing the right answer and its source sentence",
        caption: "Fill-in-the-blank quiz with feedback",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/academic-decoder/notes.webp",
        alt: "The full notes with the summary sentences highlighted in yellow and a small score next to every sentence",
        caption: "Which sentences made the summary, and why",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/academic-decoder/how.webp",
        alt: "How it works tab explaining the word-frequency summary and the question builder, with a privacy note and the tool's limitations",
        caption: "Method, privacy and limits, explained in the app",
        width: 1600,
        height: 1000,
      },
    ],
    video: {
      src: "/projects/academic-decoder/demo.mp4",
      poster: "/projects/academic-decoder/demo-poster.webp",
      label:
        "Screen recording of Academic Decoder: loading sample networking notes, the summary and key terms, the highlighted notes, and answering and checking the quiz",
    },
    repository: { url: "https://github.com/ChachraArnav/TheAcademicDecoder" },
    demo: { url: null, unavailableReason: "Live demo coming soon" },
  },
  {
    slug: "nutritrack",
    title: "NutriTrack",
    tagline: "Meal, macronutrient, hydration and wellness tracking in the browser.",
    context: "Web application project",
    categories: ["software-engineering"],
    domain: "Web application development",
    status: null,
    featured: false,
    preview: "tracker",
    technologies: ["JavaScript", "HTML", "CSS", "REST APIs"],
    overview:
      "A nutrition and wellness tracking web application for logging meals, tracking macronutrients and hydration, and keeping an eye on general wellness habits.",
    problem:
      "Tracking nutrition is only useful if logging a meal is quick and the totals are easy to read. That means pulling nutrition data from an API rather than typing it in by hand.",
    approach: [
      { text: "Built with plain JavaScript, HTML and CSS, no framework." },
      { text: "Integrates REST APIs for nutrition data." },
      { text: "Tracks meals, macronutrients, hydration and wellness metrics." },
    ],
    contributions: [
      { text: "Front-end implementation in JavaScript, HTML and CSS." },
      { text: "REST API integration." },
      { text: "Confirm whether this was solo or team work and update.", pending: true },
    ],
    challenges: [
      {
        text: "Working without a framework means managing UI state and DOM updates by hand as entries are added.",
      },
      { text: "Add specific challenges.", pending: true },
    ],
    evaluation: [{ text: "Add how the app was tested.", pending: true }],
    architecture: {
      summary:
        "A client-side web app that calls external REST APIs for nutrition data and renders daily totals.",
      layers: ["Interface", "Logic", "External"],
      nodes: [
        {
          id: "ui",
          label: "Tracking interface",
          tech: "HTML · CSS",
          layer: 0,
          role: "Forms and views for logging meals, water and wellness entries, and for reading daily totals.",
        },
        {
          id: "logic",
          label: "App logic",
          tech: "JavaScript",
          layer: 1,
          role: "Keeps the day's entries, totals macronutrients and hydration, and updates the interface when something is logged.",
        },
        {
          id: "nutrition-api",
          label: "Nutrition data",
          tech: "REST API",
          layer: 2,
          role: "Provides nutrition information for foods so users don't have to enter macronutrients manually.",
        },
      ],
      edges: [
        { from: "ui", to: "logic", label: "User entries" },
        { from: "logic", to: "nutrition-api", label: "Food lookup requests" },
      ],
    },
    screenshots: [{ src: null, alt: "NutriTrack daily view", caption: "Daily tracking view" }],
    repository: { url: null, unavailableReason: "Repository link not added yet" },
    demo: { url: null, unavailableReason: "No public demo yet" },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getCategoryLabel(id: ProjectCategory): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export const statusLabels: Record<Exclude<Project["status"], null>, string> = {
  complete: "Complete",
  "in-progress": "In development",
  academic: "Academic project",
};
