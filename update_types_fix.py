import os
import re

path = 'src/types/index.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add MarketAnalytics definition
market_analytics_def = """
export interface MarketAnalytics {
  salaryDistribution: { range: string; percentage: number }[];
  topSkillsDemand: { skill: string; demandPercentage: number }[];
  hiringTrends: { timePeriod: string; demandIndex: number }[];
}

"""

if 'MarketAnalytics' not in content:
    content = content.replace("export interface WorkforceIntelligenceResult {", market_analytics_def + "export interface WorkforceIntelligenceResult {")

# Add analyticsData to WorkforceIntelligenceResult
if 'analyticsData?: MarketAnalytics' not in content:
    content = re.sub(r'(sources: WorkforceSource\[\];)', r'\1\n  analyticsData?: MarketAnalytics;', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
