import os

path = 'src/components/workforce/MarketAnalyticsDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Add types to map
content = content.replace("(entry, index)", "(entry: any, index: number)")

# Fix 2: Cast value in formatter
content = content.replace("formatter={(value: number)", "formatter={(value: any)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
