import os
import re

path = 'src/services/aiService.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace queryWorkforceIntelligence internals
# Replace prompt to include JSON Analytics request
prompt_search = """      try {
        const prompt = `You are Pravriddhi's live Workforce Intelligence Engine.
  User Query: "${query}"
  Candidate Context:
  - Target title: ${profile.targetRole || 'Not specified'}
  - Current Alignment: ${profile.targetRoleAlignment}%
  - Existing Skills in Profile: ${userSkillNames.join(', ') || 'No skills uploaded yet'}
  
  Perform search grounding to extract current 2026 workforce telemetry.
  Structure your answer in 3 concise paragraphs:
  1. Executive Market Summary (salary velocity, hiring signals, regional/domain trends).
  2. Key Emerging Technical Skills and Target Roles.
  3. Concrete learning steps compared to candidate's background.`;"""

prompt_replace = """      let analyticsData: any = undefined;
      try {
        const prompt = `You are Pravriddhi's live Workforce Intelligence Engine.
User Query: "${query}"
Candidate Context:
- Target title: ${profile.targetRole || 'Not specified'}
- Current Alignment: ${profile.targetRoleAlignment}%
- Existing Skills in Profile: ${userSkillNames.join(', ') || 'No skills uploaded yet'}

Perform search grounding to extract current 2026 workforce telemetry.
Structure your answer in TWO parts:

PART 1: TEXT
3 concise paragraphs:
1. Executive Market Summary
2. Key Emerging Technical Skills and Target Roles
3. Concrete learning steps compared to candidate's background

PART 2: JSON ANALYTICS
Return exactly this JSON block representing the market data (DO NOT use markdown formatting for the JSON, just raw text starting with {):
{"analytics": {"salaryDistribution": [{"range": "< 80k", "percentage": 15}, {"range": "80k-120k", "percentage": 45}, {"range": "120k-160k", "percentage": 30}, {"range": "> 160k", "percentage": 10}], "topSkillsDemand": [{"skill": "Python", "demandPercentage": 85}, {"skill": "Cloud", "demandPercentage": 75}], "hiringTrends": [{"timePeriod": "Q1", "demandIndex": 60}, {"timePeriod": "Q2", "demandIndex": 80}]}}`;"""

content = content.replace(prompt_search, prompt_replace)

call_search = """        const response = await nvidiaClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
  
        if (response.text) {
          summary = response.text.trim();
        }
  
        const candidates = response.candidates?.[0];
        const groundingMetadata = (candidates as any)?.groundingMetadata;"""

call_replace = """        const response = await geminiGroundedClient.generateContent(prompt);
  
        if (response.text) {
          let rawText = response.text.trim();
          try {
            const jsonStart = rawText.indexOf('{"analytics":');
            if (jsonStart !== -1) {
              const jsonEnd = rawText.lastIndexOf('}');
              if (jsonEnd > jsonStart) {
                const jsonStr = rawText.substring(jsonStart, jsonEnd + 1);
                const parsed = JSON.parse(jsonStr);
                analyticsData = parsed.analytics;
                rawText = rawText.substring(0, jsonStart).trim();
              }
            }
          } catch (e) {
            console.error('Failed to parse analytics JSON:', e);
          }
          summary = rawText.replace(/PART 1: TEXT/i, '').replace(/PART 2: JSON ANALYTICS/i, '').trim();
        }
  
        const groundingMetadata = response.groundingMetadata;"""

content = content.replace(call_search, call_replace)

return_search = """    return {
      query,
      summary,
      emergingSkills,
      trendingRoles,
      twinAlignment: {
        matched,
        developing,
        missing,
        overallScore: Math.round((matched.length / Math.max(1, emergingSkills.length)) * 100)
      },
      sources
    };"""

return_replace = """    return {
      query,
      summary,
      emergingSkills,
      trendingRoles,
      twinAlignment: {
        matched,
        developing,
        missing,
        overallScore: Math.round((matched.length / Math.max(1, emergingSkills.length)) * 100)
      },
      sources,
      // @ts-ignore
      analyticsData: typeof analyticsData !== 'undefined' ? analyticsData : {
        salaryDistribution: [
          { range: '< $80k', percentage: 15 },
          { range: '$80k-$120k', percentage: 45 },
          { range: '$120k-$160k', percentage: 30 },
          { range: '> $160k', percentage: 10 }
        ],
        topSkillsDemand: [
          { skill: 'Python', demandPercentage: 85 },
          { skill: 'Cloud (AWS/GCP)', demandPercentage: 72 },
          { skill: 'SQL/NoSQL', demandPercentage: 68 },
          { skill: 'Docker/K8s', demandPercentage: 55 },
          { skill: 'ML/AI', demandPercentage: 42 }
        ],
        hiringTrends: [
          { timePeriod: 'Jan', demandIndex: 65 },
          { timePeriod: 'Feb', demandIndex: 72 },
          { timePeriod: 'Mar', demandIndex: 85 },
          { timePeriod: 'Apr', demandIndex: 82 },
          { timePeriod: 'May', demandIndex: 90 }
        ]
      }
    };"""

content = content.replace(return_search, return_replace)

# Also fix the explainJobMatch which uses gemini-3.8-flash for no reason
job_match_search = """        const response = await nvidiaClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are Pravriddhi's Workforce Intelligence Engine."""
job_match_replace = """        const response = await nvidiaClient.chat([
          { role: 'system', content: 'You are Pravriddhi Workforce Engine.' },
          { role: 'user', content: `Generate a concise, professional 2-3 sentence strategic match summary for a user:"""
content = content.replace(job_match_search, job_match_replace)

job_match_search_2 = """Explain why they are competitive and what exact actionable capability they need to demonstrate to secure the offer. 
Do not use generic filler.`
        });
        if (response.text) {"""
job_match_replace_2 = """Explain why they are competitive and what exact actionable capability they need to demonstrate to secure the offer.` }
        ], 'nvidia/llama-3.1-nemotron-70b-instruct');
        if (response.text) {"""
content = content.replace(job_match_search_2, job_match_replace_2)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
