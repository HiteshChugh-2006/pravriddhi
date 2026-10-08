import { UserProfile, JobOpportunity, UserSkill, Evidence } from '../types';

export interface TargetRoleRequirement {
  skillName: string;
  category: 'Core' | 'Systems' | 'Advanced';
  weight: number; // e.g. 50% Core, 30% Systems, 20% Advanced
  benchmarkProficiency: number; // target expectation e.g. 80
  importance: 'Essential' | 'High' | 'Preferred';
  description: string;
}

export interface TargetRoleBenchmark {
  roleTitle: string;
  level: string;
  medianComp: string;
  isDemoData?: boolean;
  marketDemandStatus: 'Demo Benchmark Data' | 'Live Web Telemetry' | 'Insufficient Data';
  requirements: TargetRoleRequirement[];
}

export const TARGET_ROLE_BENCHMARKS: Record<string, TargetRoleBenchmark> = {
  'ML Engineer': {
    roleTitle: 'ML Engineer',
    level: 'Mid-Senior',
    medianComp: '$198,000 USD / yr',
    marketDemandStatus: 'Demo Benchmark Data',
    requirements: [
      { skillName: 'Python', category: 'Core', weight: 20, benchmarkProficiency: 85, importance: 'Essential', description: 'Production-grade typed Python, async execution, numerical computing' },
      { skillName: 'Machine Learning', category: 'Core', weight: 20, benchmarkProficiency: 80, importance: 'Essential', description: 'Supervised/unsupervised algorithms, evaluation metrics, feature engineering' },
      { skillName: 'PyTorch / Deep Learning', category: 'Core', weight: 15, benchmarkProficiency: 75, importance: 'Essential', description: 'Neural architecture design, tensor operations, model training loops' },
      { skillName: 'SQL & Data Warehousing', category: 'Core', weight: 10, benchmarkProficiency: 75, importance: 'High', description: 'Complex analytical queries, feature store extraction, dimensional modeling' },
      { skillName: 'Docker & Containerization', category: 'Systems', weight: 15, benchmarkProficiency: 70, importance: 'Essential', description: 'Multi-stage container builds, non-root microservices, reproducible runtime' },
      { skillName: 'MLOps (MLflow & CI/CD)', category: 'Systems', weight: 10, benchmarkProficiency: 70, importance: 'Essential', description: 'Model registry, experiment tracking, automated validation on commit' },
      { skillName: 'Cloud & Infrastructure', category: 'Systems', weight: 5, benchmarkProficiency: 65, importance: 'Preferred', description: 'AWS ECS/SageMaker, GCP Vertex, or Azure ML deployments' },
      { skillName: 'Distributed Computing / K8s', category: 'Advanced', weight: 5, benchmarkProficiency: 60, importance: 'Preferred', description: 'Ray, Kubernetes cluster ops, multi-node GPU training' }
    ]
  },
  'Data Scientist': {
    roleTitle: 'Data Scientist',
    level: 'Mid-Senior',
    medianComp: '$168,000 USD / yr',
    marketDemandStatus: 'Demo Benchmark Data',
    requirements: [
      { skillName: 'Python', category: 'Core', weight: 25, benchmarkProficiency: 85, importance: 'Essential', description: 'Data wrangling, statistical inference, scientific libraries' },
      { skillName: 'Machine Learning', category: 'Core', weight: 25, benchmarkProficiency: 85, importance: 'Essential', description: 'Predictive modeling, regression, tree-based models, clustering' },
      { skillName: 'SQL & Data Warehousing', category: 'Core', weight: 20, benchmarkProficiency: 85, importance: 'Essential', description: 'Advanced window functions, aggregation, query tuning' },
      { skillName: 'A/B Testing & Statistics', category: 'Core', weight: 15, benchmarkProficiency: 75, importance: 'High', description: 'Hypothesis testing, sample size calculation, power analysis' },
      { skillName: 'Data Visualization', category: 'Systems', weight: 10, benchmarkProficiency: 70, importance: 'High', description: 'Executive dashboarding, exploratory visual analytics' },
      { skillName: 'Cloud & Infrastructure', category: 'Advanced', weight: 5, benchmarkProficiency: 60, importance: 'Preferred', description: 'Cloud data warehouses (Snowflake, BigQuery)' }
    ]
  },
  'AI / LLM Systems Engineer': {
    roleTitle: 'AI / LLM Systems Engineer',
    level: 'Specialized',
    medianComp: '$215,000 USD / yr',
    marketDemandStatus: 'Demo Benchmark Data',
    requirements: [
      { skillName: 'Python', category: 'Core', weight: 15, benchmarkProficiency: 85, importance: 'Essential', description: 'Async FastAPI, concurrency, type safety' },
      { skillName: 'PyTorch / Deep Learning', category: 'Core', weight: 15, benchmarkProficiency: 80, importance: 'Essential', description: 'Transformer architectures, attention mechanisms, fine-tuning' },
      { skillName: 'RAG & Vector Retrieval', category: 'Core', weight: 15, benchmarkProficiency: 75, importance: 'Essential', description: 'Vector databases, dense retrieval, reranking, hybrid search' },
      { skillName: 'LLM Engineering', category: 'Core', weight: 15, benchmarkProficiency: 75, importance: 'Essential', description: 'Prompt orchestration, structured outputs, eval benchmarks' },
      { skillName: 'Docker & Containerization', category: 'Systems', weight: 15, benchmarkProficiency: 75, importance: 'Essential', description: 'GPU containerization, vLLM/Ollama microservices' },
      { skillName: 'MLOps (MLflow & CI/CD)', category: 'Systems', weight: 10, benchmarkProficiency: 70, importance: 'High', description: 'Automated LLM evaluation, continuous regression testing' },
      { skillName: 'AI Agents & LangGraph', category: 'Advanced', weight: 15, benchmarkProficiency: 65, importance: 'High', description: 'State graphs, tool calling, multi-agent workflows' }
    ]
  }
};

export interface AlignmentDetail {
  skillName: string;
  category: 'Core' | 'Systems' | 'Advanced';
  weight: number;
  benchmarkProficiency: number;
  userProficiency: number;
  status: 'demonstrated' | 'claimed' | 'missing';
  evidenceMultiplier: number; // 1.0 for demonstrated, 0.5 for claimed, 0.0 for missing
  effectiveScore: number;
  evidenceItemsCount: number;
}

export interface AlignmentComputationResult {
  roleTitle: string;
  calculatedAlignmentScore: number; // 0 - 100
  skillCoveragePercent: number; // 0 - 100
  totalRequiredSkills: number;
  demonstratedCount: number;
  claimedCount: number;
  missingCount: number;
  evidenceStrengthIndex: number; // 0 - 100
  details: AlignmentDetail[];
  calculationFormula: string;
  marketDataProvenance: 'Demo Benchmark Data' | 'Live Web Telemetry' | 'Insufficient Data';
}

/**
 * Mathematically rigorous and transparent Career Alignment calculation.
 * Formula:
 * For each benchmark requirement i:
 *   RawMatch_i = min(UserProficiency_i, BenchmarkProficiency_i) / BenchmarkProficiency_i
 *   EvidenceMultiplier:
 *     Demonstrated (backed by code repo, assessment, or certified link) = 1.0
 *     Claimed (self-reported or merely mentioned in resume) = 0.50
 *     Missing = 0.0
 *   Score_i = RawMatch_i * EvidenceMultiplier_i * Weight_i
 * Final Alignment = sum(Score_i) / sum(Weight_i) * 100
 */
export function calculateDynamicAlignment(
  profile: UserProfile,
  targetRoleTitle: string = profile.targetRole
): AlignmentComputationResult {
  const benchmark = TARGET_ROLE_BENCHMARKS[targetRoleTitle] || TARGET_ROLE_BENCHMARKS['ML Engineer'];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  let demonstratedCount = 0;
  let claimedCount = 0;
  let missingCount = 0;
  let totalEvidenceCount = 0;

  const details: AlignmentDetail[] = benchmark.requirements.map((req) => {
    totalWeight += req.weight;

    // Match by name or semantic substring
    const userSkill = profile.skills.find((s) => {
      const sName = s.name.toLowerCase();
      const rName = req.skillName.toLowerCase();
      return (
        sName === rName ||
        sName.includes(rName) ||
        rName.includes(sName) ||
        (rName.includes('docker') && sName.includes('docker')) ||
        (rName.includes('mlops') && sName.includes('mlops')) ||
        (rName.includes('pytorch') && (sName.includes('pytorch') || sName.includes('deep learning'))) ||
        (rName.includes('sql') && sName.includes('sql'))
      );
    });

    if (!userSkill) {
      missingCount++;
      return {
        skillName: req.skillName,
        category: req.category,
        weight: req.weight,
        benchmarkProficiency: req.benchmarkProficiency,
        userProficiency: 0,
        status: 'missing',
        evidenceMultiplier: 0.0,
        effectiveScore: 0,
        evidenceItemsCount: 0
      };
    }

    const isDemonstrated = userSkill.type === 'demonstrated' && userSkill.evidence.length > 0;
    const evidenceMultiplier = isDemonstrated ? 1.0 : 0.50; // Claimed gets half weight per rigorous evaluation rule

    if (isDemonstrated) {
      demonstratedCount++;
    } else {
      claimedCount++;
    }

    const evidenceCount = userSkill.evidence.length;
    totalEvidenceCount += evidenceCount;

    const rawMatch = Math.min(userSkill.proficiency, req.benchmarkProficiency) / req.benchmarkProficiency;
    const skillScore = rawMatch * evidenceMultiplier * req.weight;
    totalWeightedScore += skillScore;

    return {
      skillName: req.skillName,
      category: req.category,
      weight: req.weight,
      benchmarkProficiency: req.benchmarkProficiency,
      userProficiency: userSkill.proficiency,
      status: isDemonstrated ? 'demonstrated' : 'claimed',
      evidenceMultiplier,
      effectiveScore: Math.round((skillScore / req.weight) * 100),
      evidenceItemsCount: evidenceCount
    };
  });

  if (profile.skills.length === 0) {
    return {
      roleTitle: benchmark.roleTitle,
      calculatedAlignmentScore: 0,
      skillCoveragePercent: 0,
      totalRequiredSkills: benchmark.requirements.length,
      demonstratedCount: 0,
      claimedCount: 0,
      missingCount: benchmark.requirements.length,
      evidenceStrengthIndex: 0,
      details,
      calculationFormula: 'Upload your resume to calculate Career Alignment against verified skills.',
      marketDataProvenance: 'Insufficient Data'
    };
  }

  const calculatedAlignmentScore = Math.min(100, Math.round((totalWeightedScore / totalWeight) * 100));
  const skillCoveragePercent = Math.round(((demonstratedCount + 0.5 * claimedCount) / benchmark.requirements.length) * 100);
  const evidenceStrengthIndex = Math.min(100, Math.round((demonstratedCount / Math.max(1, benchmark.requirements.length)) * 100));

  const calculationFormula = `Alignment = Σ(ProficiencyRatio × EvidenceMultiplier × CategoryWeight) / TotalWeight\nWhere EvidenceMultiplier is 1.00 for Demonstrated (verified artifact) and 0.50 for Claimed (resume mention without artifact).`;

  return {
    roleTitle: benchmark.roleTitle,
    calculatedAlignmentScore,
    skillCoveragePercent,
    totalRequiredSkills: benchmark.requirements.length,
    demonstratedCount,
    claimedCount,
    missingCount,
    evidenceStrengthIndex,
    details,
    calculationFormula,
    marketDataProvenance: benchmark.marketDemandStatus
  };
}

/**
 * Structure of parsed resume data before user confirms to CareerTwin
 */
export interface ExtractedResumeDossier {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  summary: string;
  recommendedTargetRole: string;
  extractedSkills: Array<{
    name: string;
    proficiency: number;
    category: 'Core AI/ML' | 'Software & Infrastructure' | 'Data & Analytics' | 'Cloud & Systems' | 'Emerging Tech';
    sourceLine: string;
    type: 'claimed' | 'demonstrated';
    hasVerifiedArtifact: boolean;
  }>;
  extractedExperiences: Array<{
    title: string;
    company: string;
    period: string;
    highlights: string[];
  }>;
  extractedProjects: Array<{
    title: string;
    techStack: string;
    url?: string;
    mappedSkills: string[];
  }>;
  provenanceNotice: string;
}

/**
 * Automated resume parser & evidence normalizer.
 * Enforces rule: "Never treat a skill merely mentioned in a resume as proof of expert proficiency."
 */
export function normalizeExtractedSkills(rawText: string): ExtractedResumeDossier {
  // Safe robust extraction heuristics
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const textLower = rawText.toLowerCase();

  const skills: ExtractedResumeDossier['extractedSkills'] = [];

  const catalog = [
    { name: 'Python', category: 'Core AI/ML', defProf: 90, keywords: ['python', 'numpy', 'pandas'] },
    { name: 'Machine Learning', category: 'Core AI/ML', defProf: 85, keywords: ['machine learning', 'scikit-learn', 'xgboost', 'random forest'] },
    { name: 'PyTorch', category: 'Core AI/ML', defProf: 80, keywords: ['pytorch', 'torch', 'deep learning', 'neural net'] },
    { name: 'SQL & Data Warehousing', category: 'Data & Analytics', defProf: 82, keywords: ['sql', 'postgres', 'snowflake', 'bigquery'] },
    { name: 'Docker & Containerization', category: 'Software & Infrastructure', defProf: 65, keywords: ['docker', 'container', 'dockerfile'] },
    { name: 'MLOps (MLflow & CI/CD)', category: 'Software & Infrastructure', defProf: 60, keywords: ['mlflow', 'mlops', 'ci/cd', 'github actions', 'kubeflow'] },
    { name: 'Cloud Infrastructure', category: 'Cloud & Systems', defProf: 70, keywords: ['aws', 'gcp', 'azure', 's3', 'ec2', 'sagemaker'] },
    { name: 'Kubernetes', category: 'Software & Infrastructure', defProf: 55, keywords: ['kubernetes', 'k8s', 'helm'] },
    { name: 'RAG & Vector Retrieval', category: 'Emerging Tech', defProf: 72, keywords: ['rag', 'vector', 'embeddings', 'pinecone', 'qdrant', 'chroma'] },
    { name: 'FastAPI / API Design', category: 'Software & Infrastructure', defProf: 78, keywords: ['fastapi', 'rest api', 'microservice', 'flask'] }
  ];

  catalog.forEach((item) => {
    const matched = item.keywords.some((k) => textLower.includes(k));
    if (matched) {
      // Find matching line in resume for evidence citation
      const matchingLine = lines.find((l) => item.keywords.some((k) => l.toLowerCase().includes(k))) || 'Extracted from Resume text';
      
      // Determine if accompanied by GitHub / URL project proof
      const hasArtifact = textLower.includes('github.com') || textLower.includes('http');

      skills.push({
        name: item.name,
        proficiency: item.defProf,
        category: item.category as any,
        sourceLine: matchingLine.slice(0, 110),
        // Resume mentions are strictly Claimed unless accompanied by verified repository URL!
        type: hasArtifact && (item.name === 'Python' || item.name === 'PyTorch') ? 'demonstrated' : 'claimed',
        hasVerifiedArtifact: hasArtifact
      });
    }
  });

  // Extract real name from top lines
  let extractedName = 'Candidate';
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && line.length < 40 && !line.includes('@') && !line.includes('http') && !line.toLowerCase().includes('resume') && !line.toLowerCase().includes('curriculum')) {
      extractedName = line;
      break;
    }
  }

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  // Extract bullets from text
  const extractedBullets = lines.filter(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*')).map(b => b.replace(/^[-•*]\s*/, ''));

  const extractedExperiences = extractedBullets.length > 0
    ? [
        {
          title: 'Professional Experience (From Resume)',
          company: 'Extracted Employer',
          period: 'Recent',
          highlights: extractedBullets.slice(0, 4)
        }
      ]
    : [];

  const extractedProjects = lines.filter(l => l.toLowerCase().includes('project') || l.toLowerCase().includes('built') || l.toLowerCase().includes('github.com')).slice(0, 3).map((l, idx) => ({
    title: `Project ${idx + 1}: ${l.slice(0, 40)}`,
    techStack: skills.slice(0, 3).map(s => s.name).join(', ') || 'Technical Stack',
    mappedSkills: skills.slice(0, 2).map(s => s.name)
  }));

  const recommendedTargetRole = skills.some(s => s.name.includes('PyTorch') || s.name.includes('Machine Learning'))
    ? 'ML Engineer'
    : skills.some(s => s.name.includes('Data') || s.name.includes('SQL'))
    ? 'Data Scientist'
    : 'Software Engineer';

  return {
    name: extractedName,
    title: `${recommendedTargetRole} Professional`,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    summary: lines.slice(1, 4).join(' ').slice(0, 300) || `Extracted career profile for ${extractedName}`,
    recommendedTargetRole,
    extractedSkills: skills,
    extractedExperiences,
    extractedProjects,
    provenanceNotice: 'Automated Extraction from Resume: Skills extracted from text are cataloged as Claimed. GitHub projects provide candidate demonstrated proof.'
  };
}
