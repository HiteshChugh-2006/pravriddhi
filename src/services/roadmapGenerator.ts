/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import {
  RoadmapPhase,
  RoadmapMilestone,
  CareerRoadmapState,
  MilestoneStatus,
  LearningResource
} from '../types/roadmap';

const STORAGE_PREFIX = 'pravriddhi_roadmap_';

// Default role milestone blueprints
const ROLE_ROADMAP_BLUEPRINTS: Record<
  string,
  {
    level: string;
    medianComp: string;
    estimatedTimeToReadiness: string;
    phases: Array<{
      id: string;
      phaseNumber: number;
      title: string;
      subtitle: string;
      estimatedTimeline: string;
      milestones: Array<Omit<RoadmapMilestone, 'phaseId' | 'status' | 'progressPercent'>>;
    }>;
  }
> = {
  'ML Engineer': {
    level: 'Mid to Senior MLE',
    medianComp: '$198,000 / yr',
    estimatedTimeToReadiness: '8 – 12 weeks',
    phases: [
      {
        id: 'phase_1',
        phaseNumber: 1,
        title: 'Core Foundations & Engineering Rigor',
        subtitle: 'Production Python, vector calculus, and model evaluation protocols',
        estimatedTimeline: 'Month 1 · Weeks 1–3',
        milestones: [
          {
            id: 'mle_m1',
            title: 'Master Typed Async Python & Performance Profiling',
            category: 'skill',
            estimatedDuration: '2 weeks',
            description: 'Refactor research Python code into modular, typed packages with Pytest, cProfile, and asynchronous FastAPI services.',
            alignmentImpact: 12,
            keySkills: ['Python', 'FastAPI'],
            deliverable: 'Async microservice with Pydantic v2 schemas and 95%+ test coverage.',
            subtasks: [
              { id: 'st_1', title: 'Complete typed async FastAPI microservice', completed: true },
              { id: 'st_2', title: 'Set up Pytest test suite with mock fixtures', completed: true },
              { id: 'st_3', title: 'Profile execution bottleneck with cProfile & memory_profiler', completed: false }
            ]
          },
          {
            id: 'mle_m2',
            title: 'Advanced SQL & Data Feature Warehousing',
            category: 'skill',
            estimatedDuration: '2 weeks',
            description: 'Design analytical schemas and window functions for offline feature generation and training data extraction.',
            alignmentImpact: 8,
            keySkills: ['SQL & Data Warehousing', 'Data & Analytics'],
            deliverable: 'Reproducible feature extraction queries for multi-table event logs.',
            subtasks: [
              { id: 'st_4', title: 'Write window analytical queries for rolling aggregations', completed: true },
              { id: 'st_5', title: 'Build partition strategy to optimize query scanning costs', completed: true },
              { id: 'st_6', title: 'Validate data distribution shifts and missing values', completed: true }
            ]
          }
        ]
      },
      {
        id: 'phase_2',
        phaseNumber: 2,
        title: 'Deep Learning & Applied Modeling',
        subtitle: 'PyTorch neural architectures, custom training loops, and loss convergence',
        estimatedTimeline: 'Month 1–2 · Weeks 4–6',
        milestones: [
          {
            id: 'mle_m3',
            title: 'Production PyTorch Custom Training Loop & Checkpointing',
            category: 'project',
            estimatedDuration: '3 weeks',
            description: 'Implement distributed PyTorch training pipeline with gradient accumulation, mixed precision (AMP), and early stopping callbacks.',
            alignmentImpact: 15,
            keySkills: ['PyTorch / Deep Learning', 'Machine Learning'],
            deliverable: 'Modular training repository with TensorBoard metrics and checkpoint resume.',
            subtasks: [
              { id: 'st_7', title: 'Implement PyTorch Dataset and DataLoader with worker prefetching', completed: true },
              { id: 'st_8', title: 'Add automatic mixed precision (torch.cuda.amp) for faster throughput', completed: false },
              { id: 'st_9', title: 'Save and test load best model checkpoints with state_dict validation', completed: false }
            ]
          },
          {
            id: 'mle_m4',
            title: 'High-Throughput Model Serving & Docker Containerization',
            category: 'systems',
            estimatedDuration: '2 weeks',
            description: 'Package deep learning models inside lightweight, hardened multi-stage Docker containers with ONNX Runtime or TorchScript optimization.',
            alignmentImpact: 14,
            keySkills: ['Docker & Containerization', 'FastAPI'],
            deliverable: 'Multi-stage Dockerfile running non-root inference server achieving <15ms p99 latency.',
            subtasks: [
              { id: 'st_10', title: 'Convert trained weights to TorchScript / ONNX format', completed: false },
              { id: 'st_11', title: 'Build hardened non-root Docker container with minimal base image', completed: false },
              { id: 'st_12', title: 'Benchmark concurrent throughput with Locust or k6 load tests', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_3',
        phaseNumber: 3,
        title: 'MLOps Pipeline & Automated Delivery',
        subtitle: 'Continuous training, experiment registry, and drift detection',
        estimatedTimeline: 'Month 2–3 · Weeks 7–9',
        milestones: [
          {
            id: 'mle_m5',
            title: 'End-to-End MLOps Pipeline with MLflow & GitHub Actions',
            category: 'systems',
            estimatedDuration: '3 weeks',
            description: 'Automate model training triggers, artifact versioning, model registry stages (Staging -> Production), and unit/integration tests in CI/CD.',
            alignmentImpact: 18,
            keySkills: ['MLOps (MLflow & CI/CD)', 'Docker & Containerization'],
            deliverable: 'Complete GitHub Actions workflow with MLflow tracking server integration.',
            subtasks: [
              { id: 'st_13', title: 'Configure remote MLflow tracking server with S3 artifact backend', completed: false },
              { id: 'st_14', title: 'Write GitHub Actions CI pipeline to trigger smoke tests on PRs', completed: false },
              { id: 'st_15', title: 'Implement automated model registry transition gates based on test accuracy', completed: false }
            ]
          },
          {
            id: 'mle_m6',
            title: 'Cloud Infrastructure & Telemetry (AWS/GCP)',
            category: 'certification',
            estimatedDuration: '2 weeks',
            description: 'Deploy inference microservice on AWS ECS Fargate or Google Cloud Run with CloudWatch/Prometheus metrics and latency alerts.',
            alignmentImpact: 11,
            keySkills: ['Cloud & Infrastructure', 'Docker & Containerization'],
            deliverable: 'Live cloud endpoint with Prometheus metrics, request logging, and autoscaling triggers.',
            subtasks: [
              { id: 'st_16', title: 'Provision containerized service on Cloud Run / ECS', completed: false },
              { id: 'st_17', title: 'Set up Prometheus scrape endpoints for latency, RPS, and error rates', completed: false },
              { id: 'st_18', title: 'Configure automated alert policies for high p99 latency', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_4',
        phaseNumber: 4,
        title: 'Distributed Scale & Senior Hiring Readiness',
        subtitle: 'Multi-GPU clusters, system design mock reviews, and interview portfolio',
        estimatedTimeline: 'Month 3 · Weeks 10–12',
        milestones: [
          {
            id: 'mle_m7',
            title: 'Distributed Inference & Ray / Kubernetes Exploration',
            category: 'architecture',
            estimatedDuration: '3 weeks',
            description: 'Scale model batch predictions using Ray Core or deploy inference replicas on Kubernetes with horizontal pod autoscalers (HPA).',
            alignmentImpact: 12,
            keySkills: ['Distributed Computing / K8s', 'MLOps (MLflow & CI/CD)'],
            deliverable: 'Ray batch scoring cluster processing 1M+ rows with distributed actors.',
            subtasks: [
              { id: 'st_19', title: 'Write distributed Ray task pipeline with remote actors', completed: false },
              { id: 'st_20', title: 'Configure Kubernetes deployment manifests with resource limits and readiness probes', completed: false }
            ]
          },
          {
            id: 'mle_m8',
            title: 'Senior MLE System Design Capstone & Technical Pitch',
            category: 'project',
            estimatedDuration: '2 weeks',
            description: 'Prepare end-to-end architecture blueprint: ingest, storage, offline/online feature store, model retraining, and canary deployments.',
            alignmentImpact: 10,
            keySkills: ['Python', 'Machine Learning', 'MLOps (MLflow & CI/CD)'],
            deliverable: 'Comprehensive technical design document with architecture diagram and live demo video.',
            subtasks: [
              { id: 'st_21', title: 'Draft comprehensive system design doc covering SLOs, data flow, and failure modes', completed: false },
              { id: 'st_22', title: 'Conduct peer or mentor architectural mock review', completed: false },
              { id: 'st_23', title: 'Publish polished GitHub portfolio repository with verified demonstration badge', completed: false }
            ]
          }
        ]
      }
    ]
  },

  'AI / LLM Systems Engineer': {
    level: 'Specialized AI Engineer',
    medianComp: '$215,000 / yr',
    estimatedTimeToReadiness: '10 – 14 weeks',
    phases: [
      {
        id: 'phase_1',
        phaseNumber: 1,
        title: 'Prompt Architecture & Foundation Retrieval',
        subtitle: 'Vector embeddings, chunking strategies, and hybrid semantic retrieval',
        estimatedTimeline: 'Month 1 · Weeks 1–3',
        milestones: [
          {
            id: 'llm_m1',
            title: 'Implement Hybrid RAG Pipeline (Dense + Sparse Search)',
            category: 'project',
            estimatedDuration: '3 weeks',
            description: 'Construct enterprise search engine combining dense vector embeddings with BM25 keyword search and cross-encoder re-ranking.',
            alignmentImpact: 16,
            keySkills: ['RAG & Vector Retrieval', 'Python'],
            deliverable: 'Production hybrid RAG service with Cohere/BGE re-ranking.',
            subtasks: [
              { id: 'st_llm_1', title: 'Index unstructured technical documentation in vector database', completed: true },
              { id: 'st_llm_2', title: 'Implement Reciprocal Rank Fusion (RRF) for dense + sparse scores', completed: true },
              { id: 'st_llm_3', title: 'Add cross-encoder re-ranking to boost top-3 precision to >85%', completed: false }
            ]
          },
          {
            id: 'llm_m2',
            title: 'FastAPI Structured Generation Microservice',
            category: 'skill',
            estimatedDuration: '2 weeks',
            description: 'Deploy inference endpoint using instructor or native JSON schema enforcement with strict schema validation.',
            alignmentImpact: 12,
            keySkills: ['FastAPI', 'LLM Engineering'],
            deliverable: 'Guaranteed JSON schema output service with streaming SSE support.',
            subtasks: [
              { id: 'st_llm_4', title: 'Enforce Pydantic schema validation on model outputs', completed: true },
              { id: 'st_llm_5', title: 'Implement streaming Server-Sent Events (SSE) responses', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_2',
        phaseNumber: 2,
        title: 'Agentic Workflows & Multi-Step Reasoning',
        subtitle: 'LangGraph state machines, tool calling, and human-in-the-loop loops',
        estimatedTimeline: 'Month 2 · Weeks 4–7',
        milestones: [
          {
            id: 'llm_m3',
            title: 'Build Stateful Autonomous Agent with LangGraph',
            category: 'project',
            estimatedDuration: '3 weeks',
            description: 'Architect a multi-step agent with cyclic graph execution, memory checkpoints, external tool invocation, and human review interrupts.',
            alignmentImpact: 18,
            keySkills: ['AI Agents & LangGraph', 'LLM Engineering'],
            deliverable: 'Live multi-step research agent executing SQL queries and API requests with state checkpoints.',
            subtasks: [
              { id: 'st_llm_6', title: 'Define cyclic state graph with conditional routing nodes', completed: false },
              { id: 'st_llm_7', title: 'Equip agent with custom sandboxed execution tools', completed: false },
              { id: 'st_llm_8', title: 'Add human-in-the-loop approval gate for sensitive operations', completed: false }
            ]
          },
          {
            id: 'llm_m4',
            title: 'Containerized LLM Serving with vLLM / Ollama',
            category: 'systems',
            estimatedDuration: '2 weeks',
            description: 'Deploy open-weights models (Llama 3 / Mistral) with continuous batching, PagedAttention, and GPU memory optimization.',
            alignmentImpact: 14,
            keySkills: ['Docker & Containerization', 'PyTorch / Deep Learning'],
            deliverable: 'High-throughput vLLM OpenAI-compatible endpoint achieving 100+ tokens/sec.',
            subtasks: [
              { id: 'st_llm_9', title: 'Run vLLM container with GPU acceleration and FP8/AWQ quantization', completed: false },
              { id: 'st_llm_10', title: 'Benchmark token latency under 20 concurrent simulated users', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_3',
        phaseNumber: 3,
        title: 'Fine-Tuning & Evaluation Harnesses',
        subtitle: 'LoRA/QLoRA adaptation and automated LLM-as-a-judge benchmarking',
        estimatedTimeline: 'Month 3 · Weeks 8–11',
        milestones: [
          {
            id: 'llm_m5',
            title: 'LoRA / QLoRA Parameter-Efficient Fine-Tuning',
            category: 'skill',
            estimatedDuration: '3 weeks',
            description: 'Adapt a foundation model on domain-specific dataset using Unsloth or Hugging Face PEFT with 4-bit quantization.',
            alignmentImpact: 15,
            keySkills: ['PyTorch / Deep Learning', 'LLM Engineering'],
            deliverable: 'Quantized LoRA adapter weights with loss convergence curves.',
            subtasks: [
              { id: 'st_llm_11', title: 'Curate and clean instruction-tuning JSONL dataset', completed: false },
              { id: 'st_llm_12', title: 'Run supervised fine-tuning job with target rank and alpha params', completed: false },
              { id: 'st_llm_13', title: 'Evaluate validation perplexity vs baseline base model', completed: false }
            ]
          },
          {
            id: 'llm_m6',
            title: 'Automated Evaluation Harness & Safety Red-Teaming',
            category: 'architecture',
            estimatedDuration: '2 weeks',
            description: 'Implement automated benchmark suite testing faithfulness, answer relevance, prompt injection resistance, and hallucination rate.',
            alignmentImpact: 12,
            keySkills: ['MLOps (MLflow & CI/CD)', 'LLM Engineering'],
            deliverable: 'CI-integrated evaluation scorecard with regression alerts.',
            subtasks: [
              { id: 'st_llm_14', title: 'Build synthetic test suite with 200+ challenging question pairs', completed: false },
              { id: 'st_llm_15', title: 'Set up LLM-as-a-judge scoring with strict grading rubric', completed: false },
              { id: 'st_llm_16', title: 'Block PR merges if hallucination rate exceeds 2% threshold', completed: false }
            ]
          }
        ]
      }
    ]
  },

  'Data Scientist': {
    level: 'Mid to Senior Data Scientist',
    medianComp: '$168,000 / yr',
    estimatedTimeToReadiness: '6 – 8 weeks',
    phases: [
      {
        id: 'phase_1',
        phaseNumber: 1,
        title: 'Exploratory Rigor & Statistical Foundations',
        subtitle: 'Hypothesis testing, multivariate analysis, and robust query optimization',
        estimatedTimeline: 'Month 1 · Weeks 1–3',
        milestones: [
          {
            id: 'ds_m1',
            title: 'Modern Analytics Engineering with SQL & dbt',
            category: 'skill',
            estimatedDuration: '2 weeks',
            description: 'Structure reproducible data transformation pipelines with automated schema tests and documentation in dbt.',
            alignmentImpact: 14,
            keySkills: ['SQL & Data Warehousing', 'Data & Analytics'],
            deliverable: 'dbt repository with staging and mart layers and column-level tests.',
            subtasks: [
              { id: 'st_ds_1', title: 'Write modular CTE SQL transformations', completed: true },
              { id: 'st_ds_2', title: 'Add schema and freshness tests to ensure data integrity', completed: true },
              { id: 'st_ds_3', title: 'Generate visual data lineage graph', completed: true }
            ]
          },
          {
            id: 'ds_m2',
            title: 'Causal Inference & Advanced A/B Testing Framework',
            category: 'project',
            estimatedDuration: '3 weeks',
            description: 'Design experimentation framework handling variance reduction (CUPED), sample ratio mismatch checks, and sequential testing.',
            alignmentImpact: 18,
            keySkills: ['A/B Testing & Statistics', 'Machine Learning'],
            deliverable: 'Experimentation power calculator and automated reporting notebook.',
            subtasks: [
              { id: 'st_ds_4', title: 'Implement CUPED variance reduction algorithm in Python', completed: false },
              { id: 'st_ds_5', title: 'Simulate power curves across varying effect sizes', completed: false },
              { id: 'st_ds_6', title: 'Publish executive experiment synthesis slide deck', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_2',
        phaseNumber: 2,
        title: 'Predictive Modeling & Feature Engineering',
        subtitle: 'Tree-based ensembles, hyperparameter search, and explainability',
        estimatedTimeline: 'Month 2 · Weeks 4–6',
        milestones: [
          {
            id: 'ds_m3',
            title: 'Production XGBoost / LightGBM Churn & Lifetime Value Models',
            category: 'project',
            estimatedDuration: '3 weeks',
            description: 'Build end-to-end tabular predictive pipeline with Optuna hyperparameter tuning, SHAP explainability, and cost-benefit calibration.',
            alignmentImpact: 16,
            keySkills: ['Machine Learning', 'Python'],
            deliverable: 'Calibrated predictive model with SHAP waterfall plots for business decision-makers.',
            subtasks: [
              { id: 'st_ds_7', title: 'Conduct automated feature selection to eliminate multicollinearity', completed: true },
              { id: 'st_ds_8', title: 'Run Bayesian hyperparameter search with Optuna across 50 trials', completed: false },
              { id: 'st_ds_9', title: 'Calculate SHAP values and deliver interpretability summary', completed: false }
            ]
          },
          {
            id: 'ds_m4',
            title: 'Cloud Data Warehouse Optimization (Snowflake / BigQuery)',
            category: 'systems',
            estimatedDuration: '2 weeks',
            description: 'Optimize clustering keys, materialization, and query execution plans across multi-terabyte data partitions.',
            alignmentImpact: 12,
            keySkills: ['Cloud & Infrastructure', 'SQL & Data Warehousing'],
            deliverable: 'Query profile analysis reducing compute credits by 40%.',
            subtasks: [
              { id: 'st_ds_10', title: 'Inspect and optimize spilled bytes in Snowflake / BigQuery profile', completed: false },
              { id: 'st_ds_11', title: 'Configure incremental materialization to avoid full table scans', completed: false }
            ]
          }
        ]
      }
    ]
  },

  'MLOps Infrastructure Engineer': {
    level: 'Specialized Platform Engineer',
    medianComp: '$208,000 / yr',
    estimatedTimeToReadiness: '12 – 16 weeks',
    phases: [
      {
        id: 'phase_1',
        phaseNumber: 1,
        title: 'Containers & Cluster Orchestration',
        subtitle: 'Multi-stage Docker images and Kubernetes production deployments',
        estimatedTimeline: 'Month 1 · Weeks 1–4',
        milestones: [
          {
            id: 'mlops_m1',
            title: 'Hardened Docker Containerization & GPU Runtimes',
            category: 'systems',
            estimatedDuration: '2 weeks',
            description: 'Configure multi-stage Docker builds with NVIDIA Container Toolkit for accelerated ML runtimes.',
            alignmentImpact: 14,
            keySkills: ['Docker & Containerization', 'Cloud & Infrastructure'],
            deliverable: 'Optimized Docker images with NVIDIA runtime support and non-root security.',
            subtasks: [
              { id: 'st_mlo_1', title: 'Configure NVIDIA container toolkit on local/cloud host', completed: true },
              { id: 'st_mlo_2', title: 'Optimize base image layer caching for PyTorch dependencies', completed: false }
            ]
          },
          {
            id: 'mlops_m2',
            title: 'Production Kubernetes (K8s) Cluster Deployment',
            category: 'certification',
            estimatedDuration: '4 weeks',
            description: 'Deploy and manage microservices on Kubernetes with Helm charts, Ingress routing, and Horizontal Pod Autoscalers.',
            alignmentImpact: 20,
            keySkills: ['Kubernetes Cluster Ops', 'Docker & Containerization'],
            deliverable: 'Helm chart deploying model inference replicas with autoscaling.',
            subtasks: [
              { id: 'st_mlo_3', title: 'Deploy local cluster via Minikube / Kind and cloud EKS/GKE', completed: false },
              { id: 'st_mlo_4', title: 'Author Helm chart with configurable replica and resource requests', completed: false },
              { id: 'st_mlo_5', title: 'Test HPA scaling based on CPU and memory thresholds', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_2',
        phaseNumber: 2,
        title: 'Continuous Delivery & Observability',
        subtitle: 'Automated canary rollouts, drift monitoring, and Prometheus/Grafana dashboards',
        estimatedTimeline: 'Month 2–3 · Weeks 5–10',
        milestones: [
          {
            id: 'mlops_m3',
            title: 'Automated Model Registry & Canary Deployments',
            category: 'systems',
            estimatedDuration: '3 weeks',
            description: 'Implement zero-downtime canary deployments using Istio service mesh and automated rollback upon elevated 5xx rates.',
            alignmentImpact: 18,
            keySkills: ['MLOps (MLflow & CI/CD)', 'Kubernetes Cluster Ops'],
            deliverable: 'Automated progressive delivery pipeline with canary traffic split.',
            subtasks: [
              { id: 'st_mlo_6', title: 'Configure Istio VirtualService for 90/10 traffic splitting', completed: false },
              { id: 'st_mlo_7', title: 'Automate rollback trigger on error rate threshold breach', completed: false }
            ]
          },
          {
            id: 'mlops_m4',
            title: 'Prometheus & Grafana ML System Observability',
            category: 'systems',
            estimatedDuration: '2 weeks',
            description: 'Build comprehensive Grafana dashboards tracking GPU utilization, p95/p99 inference latency, and feature drift metrics.',
            alignmentImpact: 15,
            keySkills: ['MLOps (MLflow & CI/CD)', 'Python'],
            deliverable: 'Production dashboard monitoring GPU VRAM, queue depth, and throughput.',
            subtasks: [
              { id: 'st_mlo_8', title: 'Export custom model metrics via prometheus-client', completed: false },
              { id: 'st_mlo_9', title: 'Build Grafana dashboard displaying real-time p99 latency', completed: false }
            ]
          }
        ]
      }
    ]
  },

  'Staff AI Systems Architect': {
    level: 'Executive / Staff Level',
    medianComp: '$285,000 / yr',
    estimatedTimeToReadiness: '16 – 24 weeks',
    phases: [
      {
        id: 'phase_1',
        phaseNumber: 1,
        title: 'Cross-Organizational Architecture & RFCs',
        subtitle: 'Enterprise AI system blueprints, multi-tenant governance, and cloud cost management',
        estimatedTimeline: 'Month 1–2 · Weeks 1–8',
        milestones: [
          {
            id: 'staff_m1',
            title: 'Author Enterprise Generative AI Architecture RFC',
            category: 'architecture',
            estimatedDuration: '4 weeks',
            description: 'Write comprehensive technical Request for Comments (RFC) establishing enterprise tenant boundaries, vector retrieval protocols, and data privacy guardrails.',
            alignmentImpact: 22,
            keySkills: ['System Design at Scale', 'Governance & Risk'],
            deliverable: 'Approved architectural RFC adopted across multiple engineering squads.',
            subtasks: [
              { id: 'st_stf_1', title: 'Specify data residency and zero-retention API contracts', completed: true },
              { id: 'st_stf_2', title: 'Design multi-tenant rate limiting and token quota allocation', completed: false },
              { id: 'st_stf_3', title: 'Conduct architecture review board defense with engineering leads', completed: false }
            ]
          },
          {
            id: 'staff_m2',
            title: 'Multi-Million Dollar Cloud GPU Compute Optimization Strategy',
            category: 'architecture',
            estimatedDuration: '3 weeks',
            description: 'Implement Spot instance interruption handling, GPU memory virtualization, and autoscaling down to zero to reduce annual compute spend by >35%.',
            alignmentImpact: 18,
            keySkills: ['Cost Optimization', 'Cloud & Infrastructure'],
            deliverable: 'Financial optimization roadmap with proven 35%+ cost reduction.',
            subtasks: [
              { id: 'st_stf_4', title: 'Audit GPU allocation and identify idle cluster hours', completed: false },
              { id: 'st_stf_5', title: 'Deploy dynamic spot instance fallback pools with checkpointing', completed: false }
            ]
          }
        ]
      },
      {
        id: 'phase_2',
        phaseNumber: 2,
        title: 'Technical Leadership & Industry Impact',
        subtitle: 'Mentorship, open-source technical benchmarks, and cross-functional delivery',
        estimatedTimeline: 'Month 3–4 · Weeks 9–16',
        milestones: [
          {
            id: 'staff_m3',
            title: 'Lead Multi-Team Production AI Release',
            category: 'leadership',
            estimatedDuration: '6 weeks',
            description: 'Direct cross-functional squads (data, platform, frontend, legal) to successfully launch customer-facing AI system at scale.',
            alignmentImpact: 20,
            keySkills: ['Team Leadership', 'System Design at Scale'],
            deliverable: 'High-visibility production launch serving 500k+ active weekly queries.',
            subtasks: [
              { id: 'st_stf_6', title: 'Establish release roadmap and unblock technical dependencies', completed: false },
              { id: 'st_stf_7', title: 'Publish internal post-mortem and operational runbooks', completed: false }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Evaluates whether a user's skills and evidence satisfy a milestone.
 */
function evaluateMilestoneStatus(
  milestone: Omit<RoadmapMilestone, 'phaseId' | 'status' | 'progressPercent'>,
  profile: UserProfile,
  savedOverrides?: { status?: MilestoneStatus; progress?: number; subtasks?: Record<string, boolean> }
): { status: MilestoneStatus; progressPercent: number; subtasks: RoadmapMilestone['subtasks'] } {
  // If user has saved subtask status, use it
  const updatedSubtasks = milestone.subtasks.map((st) => {
    if (savedOverrides?.subtasks && savedOverrides.subtasks[st.id] !== undefined) {
      return { ...st, completed: savedOverrides.subtasks[st.id] };
    }
    return st;
  });

  // Calculate task completion ratio
  const completedTasks = updatedSubtasks.filter((t) => t.completed).length;
  const totalTasks = updatedSubtasks.length || 1;
  const taskProgress = Math.round((completedTasks / totalTasks) * 100);

  // Check user skills proficiency
  let matchingProficiencySum = 0;
  let matchesCount = 0;
  let hasDemonstratedEvidence = false;

  milestone.keySkills.forEach((keySkill) => {
    const userSkill = profile.skills.find(
      (s) => s.name.toLowerCase().includes(keySkill.toLowerCase()) || keySkill.toLowerCase().includes(s.name.toLowerCase())
    );
    if (userSkill) {
      matchesCount++;
      matchingProficiencySum += userSkill.proficiency;
      if (userSkill.type === 'demonstrated' || (userSkill.evidence && userSkill.evidence.length > 0)) {
        hasDemonstratedEvidence = true;
      }
    }
  });

  const avgSkillProficiency = matchesCount > 0 ? matchingProficiencySum / matchesCount : 0;

  // Manual status override takes top precedence
  if (savedOverrides?.status) {
    const overrideStatus = savedOverrides.status;
    let overrideProgress = savedOverrides.progress ?? (overrideStatus === 'completed' ? 100 : overrideStatus === 'upcoming' ? 0 : Math.max(25, taskProgress));
    return {
      status: overrideStatus,
      progressPercent: overrideProgress,
      subtasks: updatedSubtasks
    };
  }

  // If all subtasks are checked off, it is completed
  if (completedTasks === totalTasks && totalTasks > 0) {
    return {
      status: 'completed',
      progressPercent: 100,
      subtasks: updatedSubtasks
    };
  }

  // If user already has high demonstrated skill proficiency for this milestone
  if (avgSkillProficiency >= 80 && hasDemonstratedEvidence && completedTasks >= 1) {
    return {
      status: 'completed',
      progressPercent: 100,
      subtasks: updatedSubtasks.map((t) => ({ ...t, completed: true }))
    };
  }

  // If user has started tasks or has partial proficiency
  if (completedTasks > 0 || avgSkillProficiency > 40) {
    const computedProgress = Math.min(95, Math.max(20, Math.round(taskProgress * 0.6 + avgSkillProficiency * 0.4)));
    return {
      status: 'in_progress',
      progressPercent: computedProgress,
      subtasks: updatedSubtasks
    };
  }

  return {
    status: 'upcoming',
    progressPercent: 0,
    subtasks: updatedSubtasks
  };
}

export function getDefaultResourcesForSkills(skills: string[]): LearningResource[] {
  const resources: LearningResource[] = [];
  const normalized = skills.map((s) => s.toLowerCase());

  if (normalized.some((s) => s.includes('python') || s.includes('fastapi'))) {
    resources.push(
      {
        id: 'res_fastapi',
        title: 'FastAPI Production Tutorial & Asynchronous Microservices',
        provider: 'Tiangolo Docs',
        type: 'Documentation',
        url: 'https://fastapi.tiangolo.com/tutorial/',
        duration: '6 hours',
        isFree: true
      },
      {
        id: 'res_python_profile',
        title: 'High-Performance Python: Profiling & Async Concurrency',
        provider: "O'Reilly Media",
        type: 'Book',
        url: 'https://github.com/tiangolo/fastapi',
        duration: '12 hours',
        isFree: false
      }
    );
  }

  if (normalized.some((s) => s.includes('pytorch') || s.includes('deep learning') || s.includes('machine learning'))) {
    resources.push(
      {
        id: 'res_pytorch_amp',
        title: 'PyTorch Automatic Mixed Precision (AMP) & Distributed Training Guide',
        provider: 'PyTorch Official Docs',
        type: 'Documentation',
        url: 'https://pytorch.org/docs/stable/amp.html',
        duration: '4 hours',
        isFree: true
      },
      {
        id: 'res_fastai',
        title: 'Practical Deep Learning for Coders',
        provider: 'Fast.ai',
        type: 'Course',
        url: 'https://course.fast.ai/',
        duration: '24 hours',
        isFree: true
      }
    );
  }

  if (normalized.some((s) => s.includes('docker') || s.includes('container'))) {
    resources.push(
      {
        id: 'res_docker_ml',
        title: 'Hardened Multi-Stage Docker Containers for Production ML',
        provider: 'Docker Documentation',
        type: 'Documentation',
        url: 'https://docs.docker.com/develop/develop-images/multistage-build/',
        duration: '3 hours',
        isFree: true
      },
      {
        id: 'res_nvidia_container',
        title: 'NVIDIA Container Toolkit & CUDA Runtimes',
        provider: 'NVIDIA Developer',
        type: 'Interactive Lab',
        url: 'https://github.com/NVIDIA/nvidia-container-toolkit',
        duration: '2 hours',
        isFree: true
      }
    );
  }

  if (normalized.some((s) => s.includes('mlops') || s.includes('ci/cd') || s.includes('mlflow'))) {
    resources.push(
      {
        id: 'res_mlflow',
        title: 'MLflow Tracking, Model Registry & Automated CI/CD Pipelines',
        provider: 'Databricks / MLflow.org',
        type: 'Documentation',
        url: 'https://mlflow.org/docs/latest/index.html',
        duration: '5 hours',
        isFree: true
      },
      {
        id: 'res_dl_mlops',
        title: 'Machine Learning Engineering for Production (MLOps) Specialization',
        provider: 'DeepLearning.AI',
        type: 'Course',
        url: 'https://www.deeplearning.ai/courses/machine-learning-engineering-for-production-mlops/',
        duration: '30 hours',
        isFree: false
      }
    );
  }

  if (normalized.some((s) => s.includes('rag') || s.includes('vector') || s.includes('llm') || s.includes('agents'))) {
    resources.push(
      {
        id: 'res_rag_pinecone',
        title: 'Dense vs Sparse Hybrid Retrieval & Cross-Encoder Reranking',
        provider: 'Pinecone Learning Center',
        type: 'Documentation',
        url: 'https://www.pinecone.io/learn/hybrid-search-intro/',
        duration: '4 hours',
        isFree: true
      },
      {
        id: 'res_langgraph',
        title: 'Stateful Agentic Workflows with LangGraph',
        provider: 'LangChain Academy',
        type: 'Course',
        url: 'https://academy.langchain.com/',
        duration: '8 hours',
        isFree: true
      },
      {
        id: 'res_vllm',
        title: 'High-Throughput Model Serving with vLLM & PagedAttention',
        provider: 'vLLM Project',
        type: 'Repository',
        url: 'https://github.com/vllm-project/vllm',
        duration: '3 hours',
        isFree: true
      }
    );
  }

  if (normalized.some((s) => s.includes('kubernetes') || s.includes('k8s') || s.includes('ray'))) {
    resources.push(
      {
        id: 'res_k8s_hard_way',
        title: 'Kubernetes the Hard Way & Production Cluster Hardening',
        provider: 'Linux Foundation / GitHub',
        type: 'Interactive Lab',
        url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way',
        duration: '16 hours',
        isFree: true
      },
      {
        id: 'res_ray_core',
        title: 'Distributed Compute and Batch Scoring with Ray Core',
        provider: 'Anyscale Documentation',
        type: 'Documentation',
        url: 'https://docs.ray.io/en/latest/',
        duration: '6 hours',
        isFree: true
      }
    );
  }

  if (normalized.some((s) => s.includes('sql') || s.includes('dbt') || s.includes('analytics') || s.includes('statistics'))) {
    resources.push(
      {
        id: 'res_dbt',
        title: 'dbt Fundamentals & Analytics Engineering Best Practices',
        provider: 'dbt Labs',
        type: 'Course',
        url: 'https://courses.getdbt.com/',
        duration: '5 hours',
        isFree: true
      },
      {
        id: 'res_cuped',
        title: 'Variance Reduction in A/B Testing: CUPED Methodologies',
        provider: 'Netflix / Microsoft Research',
        type: 'Documentation',
        url: 'https://exp-platform.com/cuped/',
        duration: '3 hours',
        isFree: true
      }
    );
  }

  if (resources.length === 0) {
    resources.push({
      id: 'res_gen_1',
      title: `Industry Technical Reference Architecture: ${skills.join(', ')}`,
      provider: 'AI Engineering Foundation',
      type: 'Documentation',
      url: 'https://github.com',
      duration: '4 hours',
      isFree: true
    });
  }

  return resources;
}

class RoadmapService {
  /**
   * Generates or loads the complete Career Roadmap state for the given profile and target role
   */
  public getRoadmapForUser(profile: UserProfile, targetRoleOverride?: string): CareerRoadmapState {
    const activeTargetRole = targetRoleOverride || profile.targetRole || 'ML Engineer';
    const blueprintKey = ROLE_ROADMAP_BLUEPRINTS[activeTargetRole]
      ? activeTargetRole
      : 'ML Engineer';

    const blueprint = ROLE_ROADMAP_BLUEPRINTS[blueprintKey];

    // Load saved user adjustments for this user + role
    const storageKey = `${STORAGE_PREFIX}${profile.id || 'guest'}_${encodeURIComponent(activeTargetRole)}`;
    let savedState: any = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        savedState = JSON.parse(stored);
      }
    } catch {}

    const customMilestones: RoadmapMilestone[] = savedState?.customMilestones || [];

    // Construct phases and evaluate status for each milestone
    const phases: RoadmapPhase[] = blueprint.phases.map((phase) => {
      const milestones: RoadmapMilestone[] = phase.milestones.map((m) => {
        const savedOverrides = savedState?.milestoneOverrides?.[m.id];
        const evaluated = evaluateMilestoneStatus(m, profile, savedOverrides);

        return {
          ...m,
          phaseId: phase.id,
          status: evaluated.status,
          progressPercent: evaluated.progressPercent,
          subtasks: evaluated.subtasks,
          completedDate: evaluated.status === 'completed' ? (savedOverrides?.completedDate || 'Recently Verified') : undefined,
          learningResources: m.learningResources || getDefaultResourcesForSkills(m.keySkills)
        };
      });

      // Append any custom milestones belonging to this phase
      const customForPhase = customMilestones.filter((cm) => cm.phaseId === phase.id).map((cm) => ({
        ...cm,
        learningResources: cm.learningResources || getDefaultResourcesForSkills(cm.keySkills)
      }));
      return {
        ...phase,
        milestones: [...milestones, ...customForPhase]
      };
    });

    // Calculate overall roadmap progress percentage
    let totalMilestones = 0;
    let earnedPoints = 0;

    phases.forEach((phase) => {
      phase.milestones.forEach((m) => {
        totalMilestones++;
        earnedPoints += m.progressPercent;
      });
    });

    const overallProgressPercent = totalMilestones > 0
      ? Math.round(earnedPoints / totalMilestones)
      : Math.min(100, profile.targetRoleAlignment || 50);

    return {
      targetRole: activeTargetRole,
      targetRoleLevel: blueprint.level,
      medianComp: blueprint.medianComp,
      estimatedTimeToReadiness: blueprint.estimatedTimeToReadiness,
      overallProgressPercent,
      phases,
      customMilestones,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Updates a milestone's status, progress, or subtask completion state
   */
  public updateMilestone(
    userId: string,
    targetRole: string,
    milestoneId: string,
    updates: {
      status?: MilestoneStatus;
      progress?: number;
      completedDate?: string;
      subtaskId?: string;
      subtaskCompleted?: boolean;
      evidenceUrl?: string;
      evidenceNote?: string;
    }
  ): void {
    const storageKey = `${STORAGE_PREFIX}${userId || 'guest'}_${encodeURIComponent(targetRole)}`;
    let savedState: any = {};
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) savedState = JSON.parse(stored);
    } catch {}

    if (!savedState.milestoneOverrides) {
      savedState.milestoneOverrides = {};
    }
    if (!savedState.milestoneOverrides[milestoneId]) {
      savedState.milestoneOverrides[milestoneId] = {};
    }

    const current = savedState.milestoneOverrides[milestoneId];

    if (updates.status !== undefined) current.status = updates.status;
    if (updates.progress !== undefined) current.progress = updates.progress;
    if (updates.completedDate !== undefined) current.completedDate = updates.completedDate;
    if (updates.evidenceUrl !== undefined) current.evidenceUrl = updates.evidenceUrl;
    if (updates.evidenceNote !== undefined) current.evidenceNote = updates.evidenceNote;

    if (updates.subtaskId) {
      if (!current.subtasks) current.subtasks = {};
      current.subtasks[updates.subtaskId] = updates.subtaskCompleted;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(savedState));
    } catch {}
  }

  /**
   * Adds a user-created custom milestone to a phase
   */
  public addCustomMilestone(userId: string, targetRole: string, milestone: RoadmapMilestone): void {
    const storageKey = `${STORAGE_PREFIX}${userId || 'guest'}_${encodeURIComponent(targetRole)}`;
    let savedState: any = {};
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) savedState = JSON.parse(stored);
    } catch {}

    if (!savedState.customMilestones) {
      savedState.customMilestones = [];
    }

    savedState.customMilestones.push(milestone);

    try {
      localStorage.setItem(storageKey, JSON.stringify(savedState));
    } catch {}
  }

  /**
   * Resets customized milestone states back to defaults
   */
  public resetRoadmap(userId: string, targetRole: string): void {
    const storageKey = `${STORAGE_PREFIX}${userId || 'guest'}_${encodeURIComponent(targetRole)}`;
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }

  /**
   * Returns list of supported blueprint roles
   */
  public getAvailableRoles(): string[] {
    return Object.keys(ROLE_ROADMAP_BLUEPRINTS);
  }
}

export const roadmapService = new RoadmapService();
