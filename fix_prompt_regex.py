import os
import re

path = 'src/services/aiService.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the prompt
pattern_prompt = r'Structure your answer in 3 concise paragraphs:\s*1\. Executive Market Summary.*?Concrete learning steps compared to candidate\'s background\.`;'
replace_prompt = """Structure your answer in TWO parts:

PART 1: TEXT
3 concise paragraphs:
1. Executive Market Summary
2. Key Emerging Technical Skills and Target Roles
3. Concrete learning steps compared to candidate's background

PART 2: JSON ANALYTICS
Return exactly this JSON block representing the market data (DO NOT use markdown formatting for the JSON, just raw text starting with {):
{"analytics": {"salaryDistribution": [{"range": "< 80k", "percentage": 15}, {"range": "80k-120k", "percentage": 45}, {"range": "120k-160k", "percentage": 30}, {"range": "> 160k", "percentage": 10}], "topSkillsDemand": [{"skill": "Python", "demandPercentage": 85}, {"skill": "Cloud", "demandPercentage": 75}], "hiringTrends": [{"timePeriod": "Q1", "demandIndex": 60}, {"timePeriod": "Q2", "demandIndex": 80}]}}`;"""

content = re.sub(pattern_prompt, replace_prompt, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
