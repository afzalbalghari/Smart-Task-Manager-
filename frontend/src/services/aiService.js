/**
 * AI Task Generator — fully local, zero API calls needed.
 * Uses smart keyword detection + curated task templates.
 * Falls back to a universal template for any unknown project type.
 */

 const TASK_TEMPLATES = {
  // ── Web / App Development ─────────────────────────────────────────────────
  website: {
    emoji: "🌐", label: "Website",
    tasks: [
      { title: "Define goals, audience & sitemap", description: "List pages, user flows, and success metrics.", priority: "high", hours: 3, phase: "Planning" },
      { title: "Wireframe key pages (desktop + mobile)", description: "Sketch layout for homepage, about, contact, etc.", priority: "high", hours: 4, phase: "Design" },
      { title: "Choose tech stack & set up project", description: "Vite / Next.js, Tailwind, hosting decision.", priority: "high", hours: 2, phase: "Setup" },
      { title: "Build navigation & responsive header", description: "Mobile hamburger menu, sticky nav, active links.", priority: "medium", hours: 3, phase: "Frontend" },
      { title: "Develop homepage hero & sections", description: "CTA, features, testimonials, animations.", priority: "high", hours: 5, phase: "Frontend" },
      { title: "Create remaining pages", description: "About, Services, Blog listing, Contact page.", priority: "medium", hours: 6, phase: "Frontend" },
      { title: "Implement contact form with validation", description: "Email integration (Resend / EmailJS), error states.", priority: "medium", hours: 2, phase: "Frontend" },
      { title: "SEO: meta tags, OG images, sitemap.xml", description: "robots.txt, structured data, page titles.", priority: "medium", hours: 2, phase: "SEO" },
      { title: "Performance audit & optimisation", description: "Lighthouse score ≥ 90. Compress images, lazy-load.", priority: "medium", hours: 3, phase: "Quality" },
      { title: "Cross-browser & mobile testing", description: "Chrome, Firefox, Safari, iOS, Android.", priority: "high", hours: 2, phase: "Quality" },
      { title: "Deploy to production + custom domain", description: "Vercel / Netlify, DNS config, HTTPS.", priority: "high", hours: 1, phase: "Launch" },
    ],
  },

  portfolio: {
    emoji: "🎨", label: "Portfolio",
    tasks: [
      { title: "Select 5–8 best projects to showcase", description: "Pick diverse work demonstrating different skills.", priority: "high", hours: 2, phase: "Planning" },
      { title: "Write compelling bio & personal brand", description: "Tagline, story, unique value proposition.", priority: "high", hours: 2, phase: "Content" },
      { title: "Design visual identity (colors, fonts, vibe)", description: "Mood board, typography pair, color palette.", priority: "high", hours: 3, phase: "Design" },
      { title: "Build animated hero / landing section", description: "Name, role, CTA, subtle entrance animation.", priority: "high", hours: 4, phase: "Frontend" },
      { title: "Create project cards with hover effects", description: "Preview image, tech stack chips, live/GitHub links.", priority: "high", hours: 4, phase: "Frontend" },
      { title: "Add skills & tech stack section", description: "Grouped icons/badges with proficiency levels.", priority: "medium", hours: 2, phase: "Frontend" },
      { title: "Build contact section & form", description: "Social links, email form, downloadable CV.", priority: "medium", hours: 2, phase: "Frontend" },
      { title: "Add smooth scroll & page transitions", description: "IntersectionObserver reveals, scroll progress bar.", priority: "low", hours: 2, phase: "Polish" },
      { title: "Optimise for mobile & accessibility", description: "ARIA labels, keyboard nav, contrast ratios.", priority: "high", hours: 2, phase: "Quality" },
      { title: "Deploy & submit to portfolio directories", description: "Vercel deploy, add to LinkedIn, DevHunt etc.", priority: "medium", hours: 1, phase: "Launch" },
    ],
  },

  app: {
    emoji: "📱", label: "Mobile / Web App",
    tasks: [
      { title: "Write product requirements document (PRD)", description: "User stories, core features, out-of-scope items.", priority: "high", hours: 3, phase: "Planning" },
      { title: "Design database schema & API contracts", description: "Entity relationships, endpoints, auth strategy.", priority: "high", hours: 3, phase: "Planning" },
      { title: "Set up monorepo / project scaffolding", description: "Frontend + backend, linting, env configs, CI.", priority: "high", hours: 2, phase: "Setup" },
      { title: "Implement authentication (JWT / OAuth)", description: "Register, login, logout, protected routes.", priority: "high", hours: 4, phase: "Backend" },
      { title: "Build core data models & REST/GraphQL API", description: "CRUD endpoints, validation, error handling.", priority: "high", hours: 6, phase: "Backend" },
      { title: "Develop main UI screens", description: "Dashboard, list views, detail modals, forms.", priority: "high", hours: 8, phase: "Frontend" },
      { title: "Connect frontend to API (services layer)", description: "Axios/fetch wrappers, loading & error states.", priority: "high", hours: 3, phase: "Frontend" },
      { title: "Add real-time features (websockets / polling)", description: "Live updates, notifications, optimistic UI.", priority: "medium", hours: 4, phase: "Features" },
      { title: "Write unit & integration tests", description: "≥ 70% coverage on critical paths.", priority: "medium", hours: 4, phase: "Quality" },
      { title: "Deploy backend + database to cloud", description: "Railway / Render + MongoDB Atlas / PlanetScale.", priority: "high", hours: 2, phase: "Launch" },
      { title: "Deploy frontend & configure CI/CD pipeline", description: "Vercel, automated preview deployments on PR.", priority: "high", hours: 2, phase: "Launch" },
    ],
  },

  // ── Data / ML ─────────────────────────────────────────────────────────────
  "machine learning": {
    emoji: "🤖", label: "Machine Learning",
    tasks: [
      { title: "Define problem statement & success metrics", description: "Classification / regression / generation? Target accuracy?", priority: "high", hours: 2, phase: "Planning" },
      { title: "Collect & document dataset sources", description: "Web scraping, Kaggle, APIs — record provenance.", priority: "high", hours: 4, phase: "Data" },
      { title: "Exploratory data analysis (EDA)", description: "Distributions, correlations, missing values, outliers.", priority: "high", hours: 4, phase: "Data" },
      { title: "Data cleaning & feature engineering", description: "Imputation, encoding, scaling, new features.", priority: "high", hours: 5, phase: "Data" },
      { title: "Baseline model (logistic regression / naive)", description: "Establish minimum acceptable performance.", priority: "medium", hours: 2, phase: "Modelling" },
      { title: "Train & compare candidate models", description: "XGBoost, Random Forest, SVM, Neural Network.", priority: "high", hours: 6, phase: "Modelling" },
      { title: "Hyperparameter tuning (GridSearch / Optuna)", description: "Cross-validation, learning curves.", priority: "medium", hours: 4, phase: "Modelling" },
      { title: "Evaluate on holdout set & analyse errors", description: "Confusion matrix, ROC-AUC, SHAP explainability.", priority: "high", hours: 3, phase: "Evaluation" },
      { title: "Build inference API (FastAPI / Flask)", description: "Serve model predictions via REST endpoint.", priority: "medium", hours: 3, phase: "Deployment" },
      { title: "Write project report & create demo", description: "README, notebook, Streamlit / Gradio demo.", priority: "medium", hours: 3, phase: "Deployment" },
    ],
  },

  // ── Academic ───────────────────────────────────────────────────────────────
  thesis: {
    emoji: "📚", label: "Thesis / Research Paper",
    tasks: [
      { title: "Finalise research question & scope", description: "SMART objectives, hypothesis, limitations.", priority: "high", hours: 3, phase: "Planning" },
      { title: "Conduct systematic literature review", description: "50+ sources, citation manager (Zotero), synthesis table.", priority: "high", hours: 10, phase: "Research" },
      { title: "Write Chapter 1 — Introduction", description: "Background, problem statement, significance, structure.", priority: "high", hours: 4, phase: "Writing" },
      { title: "Write Chapter 2 — Literature Review", description: "Thematic grouping, gaps identified, theoretical framework.", priority: "high", hours: 6, phase: "Writing" },
      { title: "Design research methodology", description: "Quantitative / qualitative / mixed, data collection plan.", priority: "high", hours: 4, phase: "Research" },
      { title: "Collect & analyse data", description: "Surveys, interviews, experiments, statistical analysis.", priority: "high", hours: 8, phase: "Research" },
      { title: "Write Chapter 3 & 4 — Methodology & Results", description: "Data presentation, tables, figures, findings.", priority: "high", hours: 6, phase: "Writing" },
      { title: "Write Chapter 5 — Discussion & Conclusion", description: "Interpret results, link to literature, future work.", priority: "high", hours: 5, phase: "Writing" },
      { title: "Proofread, format & check citations (APA/IEEE)", description: "Plagiarism check, bibliography, abstract.", priority: "high", hours: 4, phase: "Finalisation" },
      { title: "Prepare presentation / defence slides", description: "10–15 slides, key findings, anticipate Q&A.", priority: "medium", hours: 3, phase: "Finalisation" },
    ],
  },

  // ── Business / Marketing ──────────────────────────────────────────────────
  startup: {
    emoji: "🚀", label: "Startup / Business",
    tasks: [
      { title: "Validate idea with 10 customer interviews", description: "Problem interviews — discover pain, not pitch solution.", priority: "high", hours: 5, phase: "Validation" },
      { title: "Define target market & ICP", description: "Demographics, psychographics, Jobs-to-be-Done.", priority: "high", hours: 3, phase: "Strategy" },
      { title: "Competitive analysis & positioning", description: "5–10 competitors, feature matrix, differentiation.", priority: "high", hours: 3, phase: "Strategy" },
      { title: "Build MVP (minimum viable product)", description: "Core feature only. No scope creep allowed.", priority: "high", hours: 20, phase: "Build" },
      { title: "Create landing page with waitlist", description: "Clear value prop, email capture, social proof.", priority: "high", hours: 4, phase: "Marketing" },
      { title: "Launch on Product Hunt & Hacker News", description: "Prepare story, assets, get upvotes from community.", priority: "medium", hours: 3, phase: "Launch" },
      { title: "Set up analytics & conversion tracking", description: "GA4, Hotjar, funnel metrics, north star metric.", priority: "medium", hours: 2, phase: "Analytics" },
      { title: "Run first paid acquisition experiment", description: "$100 budget, A/B test two ad creatives.", priority: "medium", hours: 3, phase: "Growth" },
      { title: "Onboard first 10 paying customers", description: "White-glove support, collect testimonials.", priority: "high", hours: 5, phase: "Growth" },
      { title: "Write investor pitch deck (if applicable)", description: "Problem, solution, market, traction, ask.", priority: "medium", hours: 4, phase: "Fundraising" },
    ],
  },

  // ── DevOps / Infrastructure ───────────────────────────────────────────────
  devops: {
    emoji: "⚙️", label: "DevOps / Infrastructure",
    tasks: [
      { title: "Audit current infrastructure & pain points", description: "Deployment process, bottlenecks, downtime history.", priority: "high", hours: 3, phase: "Planning" },
      { title: "Set up version control strategy (GitFlow)", description: "Branch naming, PR templates, commit conventions.", priority: "high", hours: 2, phase: "Setup" },
      { title: "Containerise application with Docker", description: "Dockerfile, docker-compose, .dockerignore.", priority: "high", hours: 4, phase: "Containers" },
      { title: "Set up container orchestration (K8s / ECS)", description: "Deployments, services, ingress, namespaces.", priority: "high", hours: 6, phase: "Containers" },
      { title: "Build CI/CD pipeline (GitHub Actions)", description: "Lint → test → build → deploy stages.", priority: "high", hours: 4, phase: "CI/CD" },
      { title: "Configure secrets management (Vault / AWS SM)", description: "Rotate credentials, zero plaintext secrets.", priority: "high", hours: 3, phase: "Security" },
      { title: "Set up monitoring & alerting (Grafana/PagerDuty)", description: "Uptime, latency, error rate SLOs.", priority: "medium", hours: 4, phase: "Observability" },
      { title: "Implement centralised logging (ELK / Loki)", description: "Structured logs, query dashboards.", priority: "medium", hours: 3, phase: "Observability" },
      { title: "Disaster recovery & backup plan", description: "RTO / RPO targets, tested restore process.", priority: "high", hours: 3, phase: "Reliability" },
      { title: "Document runbooks & on-call playbook", description: "Incident response steps for top 10 failure modes.", priority: "medium", hours: 3, phase: "Documentation" },
    ],
  },

  // ── Design ────────────────────────────────────────────────────────────────
  design: {
    emoji: "✏️", label: "Design Project",
    tasks: [
      { title: "Client brief & scope alignment", description: "Goals, deliverables, timeline, revision rounds.", priority: "high", hours: 2, phase: "Discovery" },
      { title: "Competitive & inspiration research", description: "Swipe file, trend analysis, aesthetic directions.", priority: "medium", hours: 3, phase: "Discovery" },
      { title: "User research & persona creation", description: "3–5 personas with goals, frustrations, scenarios.", priority: "high", hours: 4, phase: "Research" },
      { title: "Information architecture & user flows", description: "Card sorting, site map, key user journeys.", priority: "high", hours: 3, phase: "UX" },
      { title: "Low-fidelity wireframes (all screens)", description: "Grayscale, layout focus, no colour or branding.", priority: "high", hours: 5, phase: "UX" },
      { title: "Design system: tokens, components, styles", description: "Colours, typography, spacing, icons, states.", priority: "high", hours: 5, phase: "UI" },
      { title: "High-fidelity UI designs", description: "Figma / Sketch — all screens, dark/light modes.", priority: "high", hours: 8, phase: "UI" },
      { title: "Interactive prototype for user testing", description: "Clickable flows in Figma for 5 key journeys.", priority: "medium", hours: 3, phase: "Prototyping" },
      { title: "Usability testing (5 participants)", description: "Task-based sessions, affinity mapping of findings.", priority: "high", hours: 4, phase: "Testing" },
      { title: "Final design handoff with dev specs", description: "Annotated screens, assets exported, Zeplin/Figma links.", priority: "high", hours: 2, phase: "Handoff" },
    ],
  },

  // ── Generic / Universal fallback ──────────────────────────────────────────
  default: {
    emoji: "📋", label: "Project",
    tasks: [
      { title: "Define scope, goals & success criteria", description: "What does 'done' look like? List 3 measurable outcomes.", priority: "high", hours: 2, phase: "Planning" },
      { title: "Break project into phases & milestones", description: "Weekly plan, dependencies, critical path.", priority: "high", hours: 2, phase: "Planning" },
      { title: "Research & gather required resources", description: "Tools, libraries, reference material, examples.", priority: "medium", hours: 3, phase: "Research" },
      { title: "Set up project environment & tools", description: "Repo, task board, communication channels, docs folder.", priority: "high", hours: 1, phase: "Setup" },
      { title: "Complete Phase 1 — Core foundation", description: "The non-negotiable foundation everything builds on.", priority: "high", hours: 6, phase: "Execution" },
      { title: "Complete Phase 2 — Main features", description: "Primary deliverables, iterating based on feedback.", priority: "high", hours: 8, phase: "Execution" },
      { title: "Complete Phase 3 — Polish & refinement", description: "Edge cases, error handling, user experience.", priority: "medium", hours: 4, phase: "Execution" },
      { title: "Write documentation & README", description: "How to run, contribute, architecture overview.", priority: "medium", hours: 2, phase: "Documentation" },
      { title: "Testing & quality assurance", description: "Manual testing all flows, fix critical bugs.", priority: "high", hours: 3, phase: "Quality" },
      { title: "Final review, demo & project retrospective", description: "What went well, what to improve next time.", priority: "medium", hours: 1, phase: "Closure" },
    ],
  },
};

const KEYWORD_MAP = [
  { keywords: ["portfolio", "personal site", "personal website", "showcase"],              template: "portfolio" },
  { keywords: ["machine learning", "ml", "ai model", "deep learning", "neural", "nlp", "computer vision"], template: "machine learning" },
  { keywords: ["thesis", "dissertation", "research paper", "academic", "journal"],         template: "thesis" },
  { keywords: ["startup", "saas", "business", "product launch", "mvp"],                   template: "startup" },
  { keywords: ["devops", "infrastructure", "ci/cd", "docker", "kubernetes", "pipeline", "deploy"], template: "devops" },
  { keywords: ["design", "ui/ux", "figma", "wireframe", "prototype", "branding"],         template: "design" },
  { keywords: ["app", "mobile", "react native", "flutter", "ios", "android"],             template: "app" },
  { keywords: ["website", "landing page", "blog", "ecommerce", "nextjs", "next.js"],      template: "website" },
  { keywords: ["web", "frontend", "backend", "fullstack", "full stack", "full-stack"],    template: "app" },
];

function detectTemplate(prompt) {
  const lower = prompt.toLowerCase();
  for (const { keywords, template } of KEYWORD_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return template;
  }
  return "default";
}

function personalise(tasks, prompt) {
  // Extract a short project name from the prompt (first 4 words)
  const words = prompt.trim().split(/\s+/);
  const shortName = words.slice(0, 4).join(" ");
  // Optionally inject the project name into the first task description
  return tasks.map((t, i) =>
    i === 0
      ? { ...t, description: `[${shortName}] ${t.description}` }
      : t
  );
}

export const aiService = {
  /**
   * Generate a task list locally — instant, no API needed.
   * Returns the same shape the backend OpenAI version would return.
   */
  generate: async (prompt, priority = "medium") => {
    // Simulate a realistic "thinking" delay (600–1400 ms)
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    const templateKey = detectTemplate(prompt);
    const template    = TASK_TEMPLATES[templateKey];

    const tasks = personalise(
      template.tasks.map(t => ({
        ...t,
        priority: priority === "high" ? (t.priority === "low" ? "medium" : t.priority) : t.priority,
      })),
      prompt
    );

    const totalHours = tasks.reduce((s, t) => s + t.hours, 0);

    return {
      tasks,
      total_estimated_hours: totalHours,
      template_used:         templateKey,
      template_label:        template.label,
      template_emoji:        template.emoji,
      generated_locally:     true,
    };
  },

  /**
   * Suggest subtask breakdown — local fallback version.
   */
  suggest: async (title) => {
    await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
    const templateKey = detectTemplate(title);
    const template    = TASK_TEMPLATES[templateKey];
    // Pick 5 random tasks as subtask suggestions
    const shuffled = [...template.tasks].sort(() => Math.random() - 0.5).slice(0, 5);
    return {
      subtasks: shuffled.map(t => t.title),
      estimated_hours: shuffled.reduce((s, t) => s + t.hours, 0),
      tips: "Break each subtask into 2-hour blocks for best focus.",
    };
  },
};
