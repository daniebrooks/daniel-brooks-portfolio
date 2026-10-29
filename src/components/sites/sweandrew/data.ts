// Content source: Daniel Brooks CV. Optional fields are omitted when the CV doesn't state them,
// and the UI hides whatever is missing.
type Contact = {
  email: string;
  phone?: string;
  whatsapp?: boolean; // only set when the number is confirmed to be on WhatsApp
  github?: { handle: string; url: string };
  linkedin?: { handle: string; url: string };
  telegram?: { handle: string; url: string };
};

export const profile = {
  name: ["Daniel", "Brooks"],
  fullName: "DANIEL BROOKS",
  role: ["Senior", "Software", "Engineer"],
  city: "Ashburn, Virginia, USA", // as written on the CV
  timeZone: "America/New_York",
  builds: ["SOFTWARE", "AI AGENTS", "SAAS PLATFORMS", "API INTEGRATION", "DATA PIPELINES"],
  intro:
    "Freelance software engineer with 8+ years delivering scalable, secure software: custom development, AI agents and automation, SaaS and API integration.",
  base: "8+ yrs",
  stackLine: "C# · Python · TS · .NET · React · Azure",
  about: [
    "Software engineer with 8+ years of experience designing, developing, and delivering scalable, secure, high-performance software. I specialize in custom development, ASP.NET and .NET applications, AI agents and automation, web and SaaS products, and API and system integration.",
    "My path runs from machine learning at Walmart through generative AI at Orthogonal and full-stack engineering at TheAMLab to leading a team at AS-P. I care about quality-driven, maintainable engineering that helps startups and established businesses scale and achieve long-term growth.",
  ],
  // Quick facts for the About card. Every value is stated in the CV.
  facts: [
    { label: "LOCATION", value: "Ashburn, Virginia, USA" }, // keep equal to profile.city
    { label: "CURRENT ROLE", value: "Senior Software Engineer & Team Lead at AS-P" },
    { label: "EXPERIENCE", value: "8+ years" },
    { label: "EDUCATION", value: "BSCS, University of the Punjab (2018)" },
  ],
  contact: {
    email: "daniel.brooks.ashburn@gmail.com",
    phone: "+1 228 227 8781",
    github: { handle: "/daniebrooks", url: "https://github.com/daniebrooks" },
    linkedin: { handle: "/in/danielbrookswork", url: "https://www.linkedin.com/in/danielbrookswork/" },
  } as Contact,
  cv: { href: "/Daniel_Brooks_CV.pdf", filename: "Daniel_Brooks_CV.pdf" },
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const stack = [
  {
    title: "PROGRAMMING",
    items: ["Python", "C#", "JavaScript", "TypeScript", "Java", "Scala", "Ruby", "SQL / T-SQL"],
  },
  {
    title: "BACKEND & APIS",
    items: [
      ".NET / .NET Core",
      "ASP.NET Core",
      "Entity Framework Core",
      "FastAPI",
      "Flask",
      "Django",
      "Django REST Framework",
      "Node.js",
      "NestJS",
      "Express",
      "Ruby on Rails",
      "REST APIs",
      "GraphQL",
    ],
  },
  {
    title: "FRONTEND & MOBILE",
    items: [
      "HTML5",
      "CSS3",
      "React.js",
      "Next.js",
      "Angular",
      "React Native",
      "Flutter",
      "Dart",
      "Expo",
      "Redux Toolkit",
      "Tailwind CSS",
      "Bootstrap",
      "Vite",
      "Responsive UI/UX",
      "Android",
      "iOS",
      "Firebase",
      "Push Notifications",
      "REST API Integration",
      "Mobile App Deployment",
      "Google Play Store",
      "Apple App Store",
    ],
  },
  {
    title: "AI / ML / GENAI",
    items: [
      "LLM Integration",
      "OpenAI API",
      "Prompt Engineering",
      "RAG",
      "Embeddings",
      "Vector Search",
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "AI Agents",
      "MCP",
      "Tool Calling",
      "Hugging Face Transformers",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "Model Evaluation",
      "AI Workflow Automation",
    ],
  },
  {
    title: "DATA ENGINEERING & ANALYTICS",
    items: [
      "ETL / ELT",
      "Batch & streaming pipelines",
      "Distributed ingestion",
      "Data modeling",
      "Validation",
      "Reconciliation",
      "Backfills",
      "Data quality",
      "Apache Spark",
      "Hadoop",
      "pandas",
      "NumPy",
      "Kafka (familiar)",
      "Power BI",
    ],
  },
  {
    title: "DATABASES & STORAGE",
    items: [
      "PostgreSQL",
      "SQL Server",
      "MySQL",
      "MongoDB",
      "Redis",
      "Firebase",
      "Supabase",
      "Cosmos DB",
      "Pinecone",
      "Qdrant",
      "Weaviate",
      "Chroma",
      "pgvector",
      "Prisma ORM",
      "Drizzle ORM",
      "AWS S3",
      "Azure Blob Storage",
    ],
  },
  {
    title: "CLOUD & DEVOPS",
    items: [
      "Microsoft Azure",
      "AWS",
      "GCP",
      "Azure Synapse",
      "Azure AI Search",
      "BigQuery",
      "Dataflow",
      "Dataproc",
      "Docker",
      "Kubernetes",
      "AKS",
      "Helm",
      "Linux",
      "Azure DevOps",
      "GitHub Actions",
      "CircleCI",
      "YAML CI/CD",
    ],
  },
  {
    title: "TESTING & OPERATIONS",
    items: [
      "Unit testing",
      "Regression testing",
      "API testing",
      "Monitoring",
      "Alerting",
      "Incident response",
      "Sentry",
      "Rollbar",
      "AppSignal",
      "Logging",
      "Tracing",
      "Secure coding",
    ],
  },
  {
    title: "TOOLS & INTEGRATIONS",
    items: ["Git", "GitHub", "Jira", "Slack", "Gmail / Google APIs", "Stripe", "Twilio", "OneSignal", "CI/CD workflows"],
  },
];

export type Role = {
  range: string;
  duration: string;
  current?: boolean;
  title: string;
  org: string;
  type?: string;
  place: string;
  highlights: string[];
};

export const experience: Role[] = [
  {
    range: "JUN 2025 to PRESENT",
    duration: "1 yr 5 mos",
    current: true,
    title: "Senior Software Engineer & Team Lead",
    org: "AS-P",
    place: "Remote",
    highlights: [
      "Developed scalable backend services, REST APIs, and custom software solutions using modern development frameworks and technologies.",
      "Integrated AI-powered APIs and Large Language Models (LLMs), implementing RAG workflows and evaluation processes to assess output quality, latency, and cost.",
      "Designed and optimized data pipelines, database operations, and system integrations to improve data quality, processing efficiency, and reliability.",
      "Implemented robust error handling, retries, circuit breakers, idempotency, logging, and monitoring to enhance application stability and system resilience.",
      "Supported automated testing, CI/CD pipelines, cloud deployments, and performance optimization to deliver secure, maintainable, and production-ready applications.",
    ],
  },
  {
    range: "JUN 2022 to MAY 2025",
    duration: "3 yrs",
    title: "Senior Software Engineer",
    org: "TheAMLab",
    place: "Remote",
    highlights: [
      "Developed responsive web applications using React.js, Next.js, JavaScript, TypeScript, and modern frontend technologies.",
      "Built full-stack applications using the MERN stack, including MongoDB, Express.js, React.js, and Node.js.",
      "Developed cross-platform mobile applications using React Native and Expo, integrating REST APIs and Firebase services.",
      "Designed and integrated backend APIs, database solutions, and third-party services to deliver secure and scalable applications.",
      "Implemented testing, debugging, performance optimization, and CI/CD workflows to improve application reliability and deployment efficiency.",
    ],
  },
  {
    range: "FEB 2019 to MAY 2022",
    duration: "3 yrs 4 mos",
    title: "Senior Generative AI Engineer",
    org: "Orthogonal",
    place: "Remote",
    highlights: [
      "Developed AI-powered applications using Python, FastAPI, and modern backend technologies to deliver scalable and reliable solutions.",
      "Integrated Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), embeddings, and vector search for intelligent information retrieval.",
      "Built and optimized REST APIs, database integrations, and data processing workflows to improve application performance and reliability.",
      "Evaluated AI prompts and machine learning models using structured testing to assess output quality, accuracy, latency, and cost.",
      "Containerized applications using Docker and supported CI/CD workflows, cloud deployment, logging, and performance optimization.",
    ],
  },
  {
    range: "MAY 2017 to JAN 2019",
    duration: "1 yr 9 mos",
    title: "Software Engineer, Machine Learning",
    org: "Walmart",
    place: "Remote",
    highlights: [
      "Developed predictive failure-detection models for retail POS devices using historical error logs, device performance data, and severity indicators.",
      "Processed and analyzed large datasets using DB2, Hadoop, Scala, and Python to identify failure patterns and improve predictive analytics.",
      "Developed and maintained C#/.NET services and SQL Server stored procedures to support data processing, system integration, and reliable application performance.",
      "Created Power BI reports and dashboards to visualize device failures, monitor error trends, and support data-driven maintenance decisions.",
    ],
  },
];

export const education: { range: string; school: string; degree: string; place: string; grade?: string; activities?: string } = {
  range: "2018",
  school: "University of the Punjab",
  degree: "Bachelor of Science in Computer Science (BSCS)",
  place: "Lahore, Pakistan",
};

// Sites Daniel has worked on and with (confirmed by the team). The text says what each site is, not what
// his part was; add a "role" line per site once he supplies those details.
export const sites = [
  { name: "World Health Organization", url: "https://www.who.int/", text: "The United Nations agency for global public health." },
  { name: "Walmart", url: "https://www.walmart.com/", text: "Retail and e-commerce built around everyday low prices." },
  { name: "NextLine Solutions", url: "https://nextlinesolutions.com/", text: "AI engineering studio: agents, voice AI, automation and full-stack products." },
  { name: "Maruca Furniture", url: "https://www.marucafurniture.com/", text: "Furniture retail." },
  { name: "Expedia", url: "https://www.expedia.com/", text: "Online travel booking for flights, stays and cars." },
  { name: "Claudeter", url: "https://www.claudeter.ai/", text: "AI agency: voice agents, automation and healthcare workflow tools." },
  { name: "Chess Rocket", url: "https://chessrocket.com/", text: "Free chess training from beginner to master." },
  { name: "Booking.com", url: "https://www.booking.com/", text: "Online accommodation and travel booking." },
  { name: "Anurag Srivastav", url: "https://www.anuragsrivastav.in/", text: "Portfolio of an AI automation engineer in India." },
  { name: "Airbnb", url: "https://www.airbnb.com/", text: "Marketplace for vacation rentals and unique stays." },
];

// "cmd" is a decorative terminal-style line, not taken from the CV.
export const work = [
  {
    title: "Custom Software & SaaS",
    image: "/images/work/01-custom-software.webp",
    text: "Custom software, web and SaaS products on .NET, Node.js and modern frontends, built to scale.",
    cmd: "dotnet new webapi",
    tags: ["C#", ".NET", "React", "Next.js"],
  },
  {
    title: "AI Agents & Automation",
    image: "/images/work/02-ai-agents.webp",
    text: "LLM-powered agents with tool calling that automate workflows and business processes.",
    cmd: "agent run --tools mcp",
    tags: ["Python", "LangChain", "MCP"],
  },
  {
    title: "RAG & LLM Integration",
    image: "/images/work/03-rag-llm.webp",
    text: "RAG pipelines, embeddings and vector search, with evaluation for output quality, latency and cost.",
    cmd: "rag index --store pgvector",
    tags: ["OpenAI API", "Embeddings", "pgvector"],
  },
  {
    title: "API & System Integration",
    image: "/images/work/04-api-integration.webp",
    text: "REST and GraphQL APIs and third-party integrations, hardened with retries and idempotency.",
    cmd: "curl -s https://api/health",
    tags: ["REST", "GraphQL", "FastAPI"],
  },
  {
    title: "Data Pipelines & Analytics",
    image: "/images/work/05-data-pipelines.webp",
    text: "ETL/ELT, batch and streaming pipelines with validation, plus Power BI reporting.",
    cmd: "spark-submit pipeline.py",
    tags: ["Spark", "Kafka", "Power BI"],
  },
  {
    title: "Cloud & Delivery",
    image: "/images/work/06-cloud-delivery.webp",
    text: "Azure, AWS and GCP deployments with Docker, Kubernetes and CI/CD pipelines.",
    cmd: "kubectl rollout status",
    tags: ["Azure", "Kubernetes", "CI/CD"],
  },
];
