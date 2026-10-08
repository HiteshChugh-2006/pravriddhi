import os

path = 'src/types/index.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

search_str = """export interface WorkforceIntelligenceResult {
  query: string;
  summary: string;
  emergingSkills: string[];
  trendingRoles: string[];
  twinAlignment: {
    matched: string[];
    developing: string[];
    missing: string[];
    overallScore: number;
  };
  sources: WorkforceSource[];
}"""

replace_str = """export interface MarketAnalytics {
  salaryDistribution: { range: string; percentage: number }[];
  topSkillsDemand: { skill: string; demandPercentage: number }[];
  hiringTrends: { timePeriod: string; demandIndex: number }[];
}

export interface WorkforceIntelligenceResult {
  query: string;
  summary: string;
  emergingSkills: string[];
  trendingRoles: string[];
  twinAlignment: {
    matched: string[];
    developing: string[];
    missing: string[];
    overallScore: number;
  };
  sources: WorkforceSource[];
  analyticsData?: MarketAnalytics;
}"""

content = content.replace(search_str, replace_str)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
