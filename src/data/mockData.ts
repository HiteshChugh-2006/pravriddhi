import {
  UserProfile,
  JobOpportunity,
  SkillTrend,
  CareerRoleNode
} from '../types';

export const mockJobs: JobOpportunity[] = [];

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
  isDemoMode: false,
  onboardingCompleted: false
};

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
