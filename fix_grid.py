import os
import re

path = 'src/components/workforce/WorkforceIntelligenceView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix grid layout wrapper
search = """            {/* 📊 SAS-Style Market Analytics Dashboard */}
            {result.analyticsData && (
              <div className="mb-6">
                <MarketAnalyticsDashboard data={result.analyticsData} />
              </div>
            )}"""

replace = """            {/* 📊 SAS-Style Market Analytics Dashboard */}
            {result.analyticsData && (
              <div className="lg:col-span-12 mb-6">
                <MarketAnalyticsDashboard data={result.analyticsData} />
              </div>
            )}"""

content = content.replace(search, replace)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
