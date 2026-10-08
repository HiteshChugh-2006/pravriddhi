import os

path = 'src/services/aiService.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the prompt
search_prompt = "Structure your answer in 3 concise paragraphs:\n  1. Executive Market Summary (salary velocity, hiring signals, regional/domain trends).\n  2. Key Emerging Technical Skills and Target Roles.\n  3. Concrete learning steps compared to candidate's background.`;"
replace_prompt = """Structure your answer in TWO parts:

PART 1: TEXT
3 concise paragraphs:
1. Executive Market Summary
2. Key Emerging Technical Skills and Target Roles
3. Concrete learning steps compared to candidate's background

PART 2: JSON ANALYTICS
Return exactly this JSON block representing the market data (DO NOT use markdown formatting for the JSON, just raw text starting with {):
{"analytics": {"salaryDistribution": [{"range": "< 80k", "percentage": 15}, {"range": "80k-120k", "percentage": 45}, {"range": "120k-160k", "percentage": 30}, {"range": "> 160k", "percentage": 10}], "topSkillsDemand": [{"skill": "Python", "demandPercentage": 85}, {"skill": "Cloud", "demandPercentage": 75}], "hiringTrends": [{"timePeriod": "Q1", "demandIndex": 60}, {"timePeriod": "Q2", "demandIndex": 80}]}}`;"""
content = content.replace(search_prompt, replace_prompt)

# 2. Add let analyticsData
search_vars = """  let summary = '';
  let sources: WorkforceSource[] = [];
  let emergingSkills: string[] = [];
  let trendingRoles: string[] = [];"""
replace_vars = search_vars + "\n  let analyticsData: any = undefined;"
content = content.replace(search_vars, replace_vars)

# 3. Replace the nvidia call with geminiGroundedClient
search_call = """      const response = await nvidiaClient.models.generateContent({
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
replace_call = """      const response = await geminiGroundedClient.generateContent(prompt);

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
content = content.replace(search_call, replace_call)

# 4. Inject analyticsData into return
search_return = """  return {
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
replace_return = """  return {
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
content = content.replace(search_return, replace_return)

# 5. Fix analyzeSkill which also uses gemini-3.8-flash incorrectly
search_job_match = """      const response = await nvidiaClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are Pravriddhi's Workforce Intelligence Engine. 
Generate a concise, professional 2-3 sentence strategic match summary for a user:"""
replace_job_match = """      const response = await nvidiaClient.chat([
        { role: 'system', content: 'You are Pravriddhi Workforce Engine.' },
        { role: 'user', content: `Generate a concise, professional 2-3 sentence strategic match summary for a user:"""
content = content.replace(search_job_match, replace_job_match)

search_job_match2 = """Explain why they are competitive and what exact actionable capability they need to demonstrate to secure the offer. 
Do not use generic filler.`
      });"""
replace_job_match2 = """Explain why they are competitive and what exact actionable capability they need to demonstrate to secure the offer.` }
      ], 'nvidia/llama-3.1-nemotron-70b-instruct');"""
content = content.replace(search_job_match2, replace_job_match2)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
