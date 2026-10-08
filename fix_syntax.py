import os

path = 'src/services/aiService.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad_ending = "Explain why they are competitive and what exact actionable capability they need to demonstrate to secure the offer. Do not use generic filler.`\n      });"
good_ending = "Explain why they are competitive and what exact actionable capability they need to demonstrate to secure the offer. Do not use generic filler.` }\n      ], 'nvidia/llama-3.1-nemotron-70b-instruct');"

content = content.replace(bad_ending, good_ending)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
