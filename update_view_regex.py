import os
import re

path = 'src/components/workforce/WorkforceIntelligenceView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to insert the dashboard right before the <div className="lg:col-span-5 space-y-6"> which starts the right column
pattern = r'( +)({\/\* Right Column: Personalized CareerTwin Mapping \(5 Cols\) \*\/})'
replacement = r'\1{/* 📊 SAS-Style Market Analytics Dashboard */}\n\1{result.analyticsData && (\n\1  <div className="mb-6">\n\1    <MarketAnalyticsDashboard data={result.analyticsData} />\n\1  </div>\n\1)}\n\n\1\2'

new_content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
