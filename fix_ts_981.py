import os

path = 'src/services/aiService.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const groundingMetadata = response.groundingMetadata;", "const groundingMetadata = response.candidates?.[0]?.groundingMetadata;")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
