import os

path = 'src/components/workforce/WorkforceIntelligenceView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'MarketAnalyticsDashboard' not in content:
    content = content.replace("import { MarkdownRenderer } from '../common/MarkdownRenderer';", "import { MarkdownRenderer } from '../common/MarkdownRenderer';\nimport { MarketAnalyticsDashboard } from './MarketAnalyticsDashboard';")

# 2. Inject right after the text summary or emerging skills
search_block = """            {/* Live Sources */}
            {result.sources && result.sources.length > 0 && ("""

replace_block = """            {/* 📊 SAS-Style Market Analytics Dashboard */}
            {result.analyticsData && (
              <div className="mt-8">
                <MarketAnalyticsDashboard data={result.analyticsData} />
              </div>
            )}

            {/* Live Sources */}
            {result.sources && result.sources.length > 0 && ("""

content = content.replace(search_block, replace_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
