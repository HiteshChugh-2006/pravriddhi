import os
import re

path = 'src/components/workforce/WorkforceIntelligenceView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# First, remove it from where it currently is:
content = re.sub(r' +{\/\* 📊 SAS-Style Market Analytics Dashboard \*\/}\n +{result\.analyticsData && \(\n +<div className="lg:col-span-12 mb-6">\n +<MarketAnalyticsDashboard data={result\.analyticsData} \/>\n +<\/div>\n +\)}\n+', '', content)

# Second, find the END of the Left Column block and insert it just before the closing </div>
# The Left Column ends with:
#                 </div>
#               </div>
#             </div>
#
#             {/* Right Column: Personalized CareerTwin Mapping (5 Cols) */}
# Let's target this exact sequence:

pattern = r'( +)(<\/div>\n +)(<\/div>\n +)(<\/div>\n +)({\/\* Right Column: Personalized CareerTwin Mapping \(5 Cols\) \*\/})'

replacement = r'\1{/* 📊 SAS-Style Market Analytics Dashboard */}\n\1{result.analyticsData && (\n\1  <div className="mt-6">\n\1    <MarketAnalyticsDashboard data={result.analyticsData} />\n\1  </div>\n\1)}\n\1\2\3\4\5'

content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
