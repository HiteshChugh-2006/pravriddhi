import {
  UserProfile,
  JobOpportunity,
  SkillTrend,
  CareerRoleNode
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_guest',
  name: '',
  title: '',
  location: '',
  targetRole: '',
  targetRoleAlignment: 0,
  alignmentTrend: 0,
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  education: [],
  hasUploadedResume: false,
  uploadedResumeName: '',
  activeResumeId: '',
  isDemoMode: false
};

export const mockJobs: JobOpportunity[] = [
  {
    id: 'job_ml_stripe',
    role: 'Machine Learning Engineer — Risk & Fraud',
    company: 'Stripe',
    companyLogo: 'S',
    location: 'San Francisco, CA',
    workplaceType: 'Hybrid',
    salary: '$185,000 – $225,000 + Equity',
    experienceLevel: 'Mid-Level',
    postedDate: '2 days ago',
    matchScore: 86,
    strongMatches: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'FastAPI'],
    developingSkills: ['Cloud (AWS)', 'Docker'],
    missingSkills: ['MLOps (Kubeflow / Ray)', 'Distributed Training'],
    aiExplanation: 'Your profile has exceptionally strong alignment with core statistical modeling, Python, and real-time inference APIs. To reach candidate top-tier, demonstrate production MLOps pipeline orchestration and distributed training frameworks.',
    description: 'We are seeking an ML Engineer to design, train, and deploy models that protect hundreds of billions of dollars in global commerce. You will collaborate with risk infrastructure teams to build low-latency scoring pipelines and train adaptive models against evolving fraud tactics.',
    requirements: [
      '3+ years experience developing production machine learning systems.',
      'Proficiency in Python and deep learning frameworks (PyTorch or TensorFlow).',
      'Solid foundations in distributed data processing (Spark, SQL, Ray).',
      'Experience containerizing and monitoring models in production.'
    ],
    responsibilities: [
      'Build end-to-end ML models predicting transaction risk and identity verification.',
      'Collaborate with systems engineers on millisecond-latency serving pipelines.',
      'Establish automated retraining and drift monitoring loops.'
    ],
    saved: true
  },
  {
    id: 'job_ai_anthropic',
    role: 'AI Systems Engineer — Applied Evaluation',
    company: 'Anthropic',
    companyLogo: 'A',
    location: 'San Francisco, CA',
    workplaceType: 'On-site',
    salary: '$200,000 – $260,000 + Equity',
    experienceLevel: 'Mid-Level',
    postedDate: '3 days ago',
    matchScore: 78,
    strongMatches: ['Python', 'Deep Learning (PyTorch)', 'RAG & Vector Embeddings', 'FastAPI'],
    developingSkills: ['Cloud Computing', 'SQL'],
    missingSkills: ['LLM Fine-tuning (LoRA/QLoRA)', 'Kubernetes', 'Prompt Benchmarking'],
    aiExplanation: 'Your demonstrated PyTorch and hybrid RAG work matches Anthropic’s experimental rigor. Closing the gap on parameter-efficient fine-tuning (LoRA) and Kubernetes-based evaluation clusters will push your compatibility above 90%.',
    description: 'Join Anthropic’s Applied Evaluation team building scalable benchmark suites, behavioral harnesses, and safety red-teaming pipelines for next-generation frontier Claude models.',
    requirements: [
      'Extensive hands-on expertise building evaluation harnesses or benchmark datasets.',
      'Strong PyTorch foundations and familiarity with transformer architectures.',
      'Experience with scalable job execution on cloud clusters.'
    ],
    responsibilities: [
      'Design automated evaluation pipelines for frontier reasoning models.',
      'Diagnose model hallucinations, jailbreak vulnerabilities, and capability frontiers.',
      'Publish internal capability scorecards for model safety releases.'
    ],
    saved: false
  },
  {
    id: 'job_mlops_databricks',
    role: 'MLOps Engineer — Model Serving Infrastructure',
    company: 'Databricks',
    companyLogo: 'D',
    location: 'Mountain View, CA',
    workplaceType: 'Hybrid',
    salary: '$190,000 – $235,000',
    experienceLevel: 'Mid-Level',
    postedDate: '1 week ago',
    matchScore: 68,
    strongMatches: ['Python', 'SQL', 'FastAPI'],
    developingSkills: ['Docker', 'Cloud Computing', 'Machine Learning'],
    missingSkills: ['MLOps (MLflow / Kubeflow)', 'Kubernetes', 'CI/CD Automation', 'Terraform'],
    aiExplanation: 'You have solid coding and API serving foundations, but this role requires heavy infrastructure tooling (Kubernetes, Terraform, automated CI/CD). Your profile shows MLOps as a claimed skill rather than a demonstrated one with production evidence.',
    description: 'Databricks Model Serving provides serverless, highly available endpoints for real-time generative AI and custom LLM inference. Help us push throughput and zero-scale response latency.',
    requirements: [
      'Proven experience building MLOps pipelines and managing Kubernetes clusters.',
      'Proficiency with MLflow, Kubeflow, Triton Inference Server, or vLLM.',
      'Strong Python and Go/C++ familiarity for performance-critical systems.'
    ],
    responsibilities: [
      'Manage high-throughput GPU model serving clusters on multi-cloud environments.',
      'Implement zero-downtime canary deployment strategies for custom models.',
      'Optimize GPU memory utilization and tensor parallelism configurations.'
    ],
    saved: false
  },
  {
    id: 'job_ai_scale',
    role: 'Senior Applied AI / RAG Engineer',
    company: 'Scale AI',
    companyLogo: 'S',
    location: 'San Francisco, CA',
    workplaceType: 'Remote',
    salary: '$195,000 – $240,000',
    experienceLevel: 'Senior',
    postedDate: 'Just now',
    matchScore: 82,
    strongMatches: ['Python', 'RAG & Vector Embeddings', 'FastAPI', 'Machine Learning'],
    developingSkills: ['PyTorch', 'SQL', 'Docker'],
    missingSkills: ['AI Agents (LangGraph/Autogen)', 'Vector DB Tuning at Scale', 'AWS Bedrock'],
    aiExplanation: 'Your verified hybrid RAG repository provides concrete evidence for Scale AI’s enterprise search contracts. Expanding into multi-agent orchestration frameworks (LangGraph) will solidify a senior-level offer.',
    description: 'We build enterprise generative AI platforms for global defense, automotive, and Fortune 100 leaders. You will architect custom retrieval, guardrail, and agentic workflows.',
    requirements: [
      'Proven track record implementing production RAG systems with dense/sparse retrieval.',
      'Experience handling vector database indexing (Milvus, Pinecone, Qdrant).',
      'Solid software engineering habits (testing, typing, CI/CD).'
    ],
    responsibilities: [
      'Deliver tailored agentic workflows for enterprise customers.',
      'Implement evaluation and continuous calibration metrics for generative accuracy.',
      'Contribute to open-source agent and evaluation frameworks.'
    ],
    saved: true
  },
  {
    id: 'job_ds_openai',
    role: 'Data Scientist — Growth & Model Usage',
    company: 'OpenAI',
    companyLogo: 'O',
    location: 'San Francisco, CA',
    workplaceType: 'On-site',
    salary: '$210,000 – $270,000 + Equity',
    experienceLevel: 'Mid-Level',
    postedDate: '4 days ago',
    matchScore: 89,
    strongMatches: ['Python', 'SQL & Data Warehousing', 'Machine Learning', 'Statistical Modeling'],
    developingSkills: ['Cloud Computing', 'FastAPI'],
    missingSkills: ['Causal Inference', 'Advanced A/B Testing at Scale'],
    aiExplanation: 'Extremely high match due to your dual background in quantitative data analysis and production ML. You have demonstrated evidence in both statistical rigor and query optimization.',
    description: 'Help OpenAI understand how hundreds of millions of developers and consumers interact with ChatGPT and API services. You will conduct rigorous causal studies and design experimentation metrics.',
    requirements: [
      'Advanced degree in Quantitative discipline or 3+ years relevant data science experience.',
      'Deep mastery of SQL, Python statistical libraries, and experimentation methodologies.',
      'Demonstrated skill translating behavioral data into product hypotheses.'
    ],
    responsibilities: [
      'Design and interpret high-volume experimentation across OpenAI products.',
      'Uncover usage patterns and retention drivers for frontier models.',
      'Present strategic data findings to engineering and research leadership.'
    ],
    saved: false
  },
  {
    id: 'job_mle_snowflake',
    role: 'Machine Learning Infrastructure Engineer',
    company: 'Snowflake',
    companyLogo: '❄',
    location: 'San Mateo, CA',
    workplaceType: 'Hybrid',
    salary: '$175,000 – $220,000',
    experienceLevel: 'Mid-Level',
    postedDate: '5 days ago',
    matchScore: 74,
    strongMatches: ['SQL & Data Warehousing', 'Python', 'FastAPI'],
    developingSkills: ['Machine Learning', 'Cloud (AWS/GCP)', 'Docker'],
    missingSkills: ['Snowpark ML', 'Kubernetes', 'Distributed Systems'],
    aiExplanation: 'Your strong SQL and Snowflake optimization credentials give you a distinct advantage. Adding container orchestration and distributed system guarantees will bridge the remaining gap.',
    description: 'Snowflake ML empowers developers to run model training, feature stores, and inference natively inside the Data Cloud. Help engineer foundational compute and storage runtimes.',
    requirements: [
      'Experience building scalable data and machine learning platforms.',
      'Solid Python and SQL foundation; familiarity with C++ or Rust is a plus.',
      'Understanding of database internals, concurrency, and cloud architectures.'
    ],
    responsibilities: [
      'Scale ML compute instances within secure tenant boundaries.',
      'Optimize vectorized query and UDF execution for deep learning models.',
      'Collaborate with open-source communities on data interoperability.'
    ],
    saved: false
  }
];

export const mockSkillTrends: SkillTrend[] = [
  {
    id: 'tr_llm_eng',
    name: 'LLM Engineering',
    category: 'Emerging Tech',
    growthRate: '+142%',
    growthScore: 98,
    trendLevel: 'Surging',
    arrows: '↑↑↑',
    demandIndex: 96,
    activeJobCount: 14820,
    avgSalary: '$215,000',
    relatedRoles: ['AI Engineer', 'ML Engineer', 'Staff Research Scientist'],
    relatedSkills: ['Prompt Engineering', 'LoRA / QLoRA', 'vLLM', 'Tokenizer Systems'],
    userProficiency: 65,
    marketSummary: 'Exponential demand surge across enterprise AI adoptions. Companies prioritizing practitioners who can fine-tune, quantize, and reliably benchmark open-weights models.'
  },
  {
    id: 'tr_rag',
    name: 'RAG & Vector Retrieval',
    category: 'Emerging Tech',
    growthRate: '+118%',
    growthScore: 94,
    trendLevel: 'Surging',
    arrows: '↑↑↑',
    demandIndex: 92,
    activeJobCount: 18450,
    avgSalary: '$198,000',
    relatedRoles: ['Applied AI Engineer', 'Data Systems Architect', 'Fullstack AI Engineer'],
    relatedSkills: ['Vector DBs (Qdrant/Pinecone)', 'Embedding Models', 'Chunking Strategies', 'Hybrid Search'],
    userProficiency: 64,
    marketSummary: 'Foundational architecture for enterprise knowledge search. Shift from naive similarity search toward hybrid lexical/dense retrieval and cross-encoder re-ranking.'
  },
  {
    id: 'tr_ai_agents',
    name: 'AI Agents & Multi-Agent Swarms',
    category: 'Emerging Tech',
    growthRate: '+89%',
    growthScore: 91,
    trendLevel: 'Surging',
    arrows: '↑↑',
    demandIndex: 88,
    activeJobCount: 9640,
    avgSalary: '$210,000',
    relatedRoles: ['Autonomous Systems Engineer', 'AI Solutions Architect', 'Staff ML Engineer'],
    relatedSkills: ['LangGraph', 'Tool Calling', 'State Machines', 'Memory Buffers'],
    userProficiency: null,
    marketSummary: 'Rapid evolution from single-turn chat into multi-step autonomous workflows with tool execution, planning loops, and robust human-in-the-loop checkpoints.'
  },
  {
    id: 'tr_mlops',
    name: 'MLOps & Observability',
    category: 'Software & Infrastructure',
    growthRate: '+64%',
    growthScore: 88,
    trendLevel: 'High Growth',
    arrows: '↑↑',
    demandIndex: 90,
    activeJobCount: 22100,
    avgSalary: '$202,000',
    relatedRoles: ['MLOps Engineer', 'Platform Engineer', 'ML Infrastructure Engineer'],
    relatedSkills: ['Docker', 'Kubernetes', 'MLflow', 'Ray', 'Grafana', 'Triton Server'],
    userProficiency: 42,
    marketSummary: 'Organizations transition from experimental proof-of-concepts into mission-critical production. High demand for engineers who manage model drift, cost governance, and GPU scheduling.'
  },
  {
    id: 'tr_cloud',
    name: 'Cloud Infrastructure (AWS/GCP/Azure)',
    category: 'Cloud & Systems',
    growthRate: '+24%',
    growthScore: 79,
    trendLevel: 'High Growth',
    arrows: '↑',
    demandIndex: 94,
    activeJobCount: 46200,
    avgSalary: '$182,000',
    relatedRoles: ['DevOps Engineer', 'Cloud Architect', 'Backend Engineer'],
    relatedSkills: ['Terraform', 'Kubernetes', 'IAM Policies', 'VPC Networking', 'S3/GCS'],
    userProficiency: 58,
    marketSummary: 'Consistent backbone requirement for all modern software and data workloads. Focus has shifted toward GPU cluster orchestration and serverless auto-scaling.'
  },
  {
    id: 'tr_python',
    name: 'Python',
    category: 'Core AI/ML',
    growthRate: '+12%',
    growthScore: 76,
    trendLevel: 'Stable',
    arrows: '→',
    demandIndex: 99,
    activeJobCount: 68500,
    avgSalary: '$178,000',
    relatedRoles: ['ML Engineer', 'Data Scientist', 'Backend Developer', 'Data Engineer'],
    relatedSkills: ['FastAPI', 'NumPy', 'Pandas', 'AsyncIO', 'Type Hinting'],
    userProficiency: 91,
    marketSummary: 'The undisputed lingua franca of artificial intelligence, data science, and scientific computing. High supply of junior developers; premium paid for production-grade, typed, async mastery.'
  },
  {
    id: 'tr_docker_k8s',
    name: 'Containerization & Kubernetes',
    category: 'Software & Infrastructure',
    growthRate: '+38%',
    growthScore: 84,
    trendLevel: 'High Growth',
    arrows: '↑',
    demandIndex: 89,
    activeJobCount: 31200,
    avgSalary: '$190,000',
    relatedRoles: ['Platform Engineer', 'ML Infrastructure Engineer', 'SRE'],
    relatedSkills: ['Docker', 'Helm', 'Containerd', 'Istio', 'Kubeflow'],
    userProficiency: 48,
    marketSummary: 'Standard deployment substrate across tech enterprises. Vital for reproducing machine learning workloads across on-prem clusters and hyperscaler clouds.'
  },
  {
    id: 'tr_sql',
    name: 'SQL & Data Warehousing',
    category: 'Data & Analytics',
    growthRate: '+8%',
    growthScore: 72,
    trendLevel: 'Stable',
    arrows: '→',
    demandIndex: 95,
    activeJobCount: 54100,
    avgSalary: '$165,000',
    relatedRoles: ['Data Analyst', 'Data Engineer', 'Analytics Engineer', 'Data Scientist'],
    relatedSkills: ['Snowflake', 'BigQuery', 'dbt', 'PostgreSQL', 'DuckDB'],
    userProficiency: 84,
    marketSummary: 'Universal data querying standard. Enduring relevance bolstered by modern analytics engineering frameworks (dbt) and embedded OLAP engines (DuckDB).'
  }
];

export const mockCareerNodes: CareerRoleNode[] = [
  {
    id: 'role_da',
    title: 'Data Analyst',
    level: 'Foundational',
    userAlignment: 94,
    industryDemand: 'High',
    medianComp: '$115,000',
    openingsCount: '24,000+ jobs',
    timeToTransition: 'Achieved',
    requiredSkills: ['SQL', 'Data Visualization', 'Statistical Analysis', 'Python (Pandas)', 'A/B Testing'],
    skillGaps: [],
    nextSteps: ['Role accomplished during career progression', 'Focus on deeper ML modeling and engineering'],
    connections: ['role_ds'],
    coordinates: { x: 120, y: 220 }
  },
  {
    id: 'role_ds',
    title: 'Data Scientist',
    level: 'Mid',
    userAlignment: 89,
    industryDemand: 'High',
    medianComp: '$168,000',
    openingsCount: '18,500+ jobs',
    timeToTransition: 'Immediate Fit',
    requiredSkills: ['Python', 'SQL & Data Warehousing', 'Machine Learning', 'Statistical Modeling', 'Scikit-Learn'],
    skillGaps: ['Causal Inference', 'Advanced Bayesian Methods'],
    nextSteps: ['Publish end-to-end econometric or predictive projects', 'Expand from tabular models into deep learning'],
    connections: ['role_mle', 'role_aie'],
    coordinates: { x: 380, y: 220 }
  },
  {
    id: 'role_mle',
    title: 'ML Engineer',
    level: 'Target',
    userAlignment: 72,
    industryDemand: 'Very High',
    medianComp: '$198,000',
    openingsCount: '15,200+ jobs',
    timeToTransition: '2 – 3 months',
    requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'MLOps & CI/CD', 'Docker', 'Cloud (AWS/GCP)', 'Feature Stores'],
    skillGaps: ['MLOps & CI/CD Pipelines', 'Docker & Containerization', 'Distributed Model Serving'],
    nextSteps: [
      'Containerize existing PyTorch inference projects with Docker',
      'Set up automated GitHub Actions CI/CD with MLflow tracking',
      'Deploy on AWS ECS / EKS with live Prometheus telemetry'
    ],
    connections: ['role_mlops', 'role_staff_ai'],
    coordinates: { x: 680, y: 130 }
  },
  {
    id: 'role_aie',
    title: 'AI / LLM Systems Engineer',
    level: 'Target',
    userAlignment: 68,
    industryDemand: 'Very High',
    medianComp: '$212,000',
    openingsCount: '12,800+ jobs',
    timeToTransition: '3 – 4 months',
    requiredSkills: ['Python', 'PyTorch', 'RAG & Vector Retrieval', 'LLM Fine-tuning (LoRA)', 'FastAPI', 'Evaluation Benchmarks'],
    skillGaps: ['LoRA / QLoRA Fine-tuning', 'AI Agent Orchestration', 'vLLM Serving'],
    nextSteps: [
      'Build end-to-end multi-agent workflow using LangGraph or AutoGen',
      'Benchmark quantized HuggingFace models with vLLM engine',
      'Integrate automated LLM judge evaluations'
    ],
    connections: ['role_staff_ai'],
    coordinates: { x: 680, y: 310 }
  },
  {
    id: 'role_mlops',
    title: 'MLOps Infrastructure Engineer',
    level: 'Specialized',
    userAlignment: 54,
    industryDemand: 'Very High',
    medianComp: '$208,000',
    openingsCount: '9,400+ jobs',
    timeToTransition: '4 – 6 months',
    requiredSkills: ['Docker & Containerization', 'Kubernetes', 'MLflow / Kubeflow', 'Terraform', 'CI/CD Pipelines', 'GPU Clustering'],
    skillGaps: ['Kubernetes cluster management', 'Terraform Infrastructure-as-Code', 'Distributed training frameworks (Ray)'],
    nextSteps: [
      'Provision multi-node Kubernetes cluster on cloud provider',
      'Implement automated model rollback and canary releases with Istio/Helm',
      'Earn CKA (Certified Kubernetes Administrator) credential'
    ],
    connections: ['role_staff_ai'],
    coordinates: { x: 960, y: 130 }
  },
  {
    id: 'role_staff_ai',
    title: 'Staff AI Systems Architect',
    level: 'Executive',
    userAlignment: 41,
    industryDemand: 'Growing',
    medianComp: '$285,000',
    openingsCount: '3,200+ jobs',
    timeToTransition: '18 – 24 months',
    requiredSkills: ['System Design at Scale', 'Distributed ML', 'Team Leadership', 'Cost Optimization', 'Governance & Risk'],
    skillGaps: ['Large-scale GPU cluster architecture', 'Cross-organizational AI governance', 'Multi-tenant serving platforms'],
    nextSteps: [
      'Lead cross-functional ML deployment initiatives across organizations',
      'Author architectural blueprints and technical RFCs',
      'Optimize multi-million dollar annual cloud compute budgets'
    ],
    connections: [],
    coordinates: { x: 960, y: 310 }
  }
];

export const simulationAvailableSkills = [
  { id: 'sim_docker', name: 'Docker & Containerization', category: 'Software & Infrastructure', demand: 'High', difficulty: '2 weeks', alignmentImpact: 7 },
  { id: 'sim_mlops', name: 'MLOps (MLflow & CI/CD)', category: 'Software & Infrastructure', demand: 'Surging', difficulty: '4 weeks', alignmentImpact: 10 },
  { id: 'sim_k8s', name: 'Kubernetes Cluster Ops', category: 'Software & Infrastructure', demand: 'High', difficulty: '5 weeks', alignmentImpact: 6 },
  { id: 'sim_aws_adv', name: 'AWS SageMaker & Cloud Arch', category: 'Cloud & Systems', demand: 'High', difficulty: '3 weeks', alignmentImpact: 5 },
  { id: 'sim_lora', name: 'LLM Fine-tuning (LoRA/QLoRA)', category: 'Emerging Tech', demand: 'Surging', difficulty: '3 weeks', alignmentImpact: 6 },
  { id: 'sim_agents', name: 'AI Agents & LangGraph', category: 'Emerging Tech', demand: 'Surging', difficulty: '2 weeks', alignmentImpact: 5 },
  { id: 'sim_ray', name: 'Ray Distributed Computing', category: 'Core AI/ML', demand: 'Surging', difficulty: '4 weeks', alignmentImpact: 7 },
  { id: 'sim_triton', name: 'Triton / vLLM Model Serving', category: 'Software & Infrastructure', demand: 'Surging', difficulty: '3 weeks', alignmentImpact: 6 }
];

export const initialCareerRoles = mockCareerNodes;
