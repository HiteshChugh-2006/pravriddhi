import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import googleIt from 'google-it';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const nvidiaApiKey = process.env.NVIDIA_API_KEY;
const tavilyApiKey = process.env.TAVILY_API_KEY;

// 1. AI Analysis Endpoint (NVIDIA NIM)
app.post('/api/ai/generateContent', async (req, res) => {
  if (!nvidiaApiKey) {
    console.error('[Backend] NVIDIA API key missing.');
    return res.status(503).json({ error: 'NVIDIA API Key is missing. Please add it to .env.' });
  }

  try {
    const { model, messages, temperature, max_tokens } = req.body;
    
    const response = await fetch((process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1') + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaApiKey}`
      },
      body: JSON.stringify({
        model: model || process.env.NVIDIA_MODEL || 'deepseek-ai/deepseek-v4.1-flash',
        messages: messages,
        temperature: temperature || 0.2,
        max_tokens: max_tokens || 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Backend] NVIDIA API Error:', errorText);
      
      // GEMINI FALLBACK
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
        console.log('[Backend] Falling back to Gemini API...');
        try {
          const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = messages.map(m => m.role.toUpperCase() + ": " + m.content).join('\n\n');
          
          const geminiResponse = await genAI.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: prompt,
            config: {
              temperature: temperature || 0.2
            }
          });
          
          return res.json({
            text: geminiResponse.text || '',
            usage: null,
            _provider: 'gemini'
          });
        } catch (geminiErr) {
          console.error('[Backend] Gemini Fallback Error:', geminiErr);
          return res.status(response.status).json({ error: `Both NVIDIA and Gemini failed. NVIDIA: ${errorText}` });
        }
      }
      
      return res.status(response.status).json({ error: `NVIDIA API Error: ${errorText}` });
    }

    const data = await response.json();
    
    res.json({
      text: data.choices?.[0]?.message?.content || '',
      usage: data.usage
    });
  } catch (error) {
    console.error('[Backend] AI Generation Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Modular Job Search Layer (Tavily Fallback to Google)
app.post('/api/search', async (req, res) => {
  try {
    const { query, numResults = 10 } = req.body;
    console.log(`[Backend] Searching web for: "${query}"`);
    let results = [];

    if (tavilyApiKey) {
      console.log(`[Backend] Using Tavily Search API...`);
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyApiKey,
          query: query,
          search_depth: 'basic',
          max_results: numResults
        })
      });
      if (response.ok) {
        const data = await response.json();
        results = data.results.map(r => ({ title: r.title, url: r.url, snippet: r.content }));
      }
    } 

    if (results.length === 0) {
      console.log(`[Backend] Using Free Google Scraper Fallback...`);
      const googleResults = await googleIt({ query, limit: numResults, 'no-display': true });
      results = googleResults.map(r => ({ title: r.title, url: r.link, snippet: r.snippet }));
    }
    
    console.log(`[Backend] Search complete. Found ${results.length} results.`);
    res.json({ results });
  } catch (error) {
    console.error('[Backend] Search Pipeline Error:', error);
    res.status(500).json({ error: `Search Layer Failed: ${error.message}` });
  }
});


const adzunaAppId = process.env.ADZUNA_APP_ID;
const adzunaAppKey = process.env.ADZUNA_APP_KEY;

// Helper to map country names to Adzuna codes (defaults to 'us')
function getAdzunaCountryCode(countryName) {
  if (!countryName) return 'us';
  const name = countryName.toLowerCase();
  const map = {
    'india': 'in', 'in': 'in', 'united states': 'us', 'us': 'us', 'usa': 'us',
    'united kingdom': 'gb', 'uk': 'gb', 'canada': 'ca', 'australia': 'au',
    'germany': 'de', 'france': 'fr', 'netherlands': 'nl', 'singapore': 'sg',
    'new zealand': 'nz', 'brazil': 'br', 'south africa': 'za'
  };
  return map[name] || 'us';
}

// 3. Adzuna Live Job Data Provider
app.get('/api/jobs', async (req, res) => {
  if (!adzunaAppId || !adzunaAppKey) {
    return res.status(503).json({ error: 'Adzuna API credentials missing in backend.' });
  }

  try {
    const { query, location, country, page = 1, limit = 20 } = req.query;
    console.log(`[Backend] Fetching Adzuna Jobs: query="${query}" loc="${location}" country="${country}"`);
    
    const countryCode = getAdzunaCountryCode(country);
    
    // Build Adzuna URL
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}`);
    url.searchParams.append('app_id', adzunaAppId);
    url.searchParams.append('app_key', adzunaAppKey);
    url.searchParams.append('results_per_page', limit);
    if (query) url.searchParams.append('what', query);
    if (location) url.searchParams.append('where', location);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Backend] Adzuna API Error:', errorText);
      return res.status(response.status).json({ error: `Adzuna API Error: ${errorText}` });
    }

    const data = await response.json();
    
    
    function formatSalary(min, max, countryCode) {
      if (!min && !max) return 'Salary not disclosed';
      
      const map = {
        'in': { symbol: '₹', code: 'INR' },
        'us': { symbol: '$', code: 'USD' },
        'gb': { symbol: '£', code: 'GBP' },
        'au': { symbol: 'A$', code: 'AUD' },
        'ca': { symbol: 'C$', code: 'CAD' },
        'de': { symbol: '€', code: 'EUR' },
        'fr': { symbol: '€', code: 'EUR' },
        'sg': { symbol: 'S$', code: 'SGD' }
      };
      const c = map[countryCode] || map['us'];
      
      const formatNum = (num) => {
        if (c.code === 'INR') return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
      };
      
      let normalized = '';
      if (min && max && min !== max) {
        normalized = `${c.symbol}${formatNum(min)} - ${c.symbol}${formatNum(max)} / yr`;
      } else {
        normalized = `${c.symbol}${formatNum(min || max)} / yr`;
      }
      
      console.log('[Salary Debug Pipeline]', {
        country: countryCode,
        currency: c.code,
        source: 'adzuna',
        period: 'year',
        rawSalary: `min: ${min}, max: ${max}`,
        normalizedSalary: normalized
      });
      return normalized;
    }

    // Helper to extract company name safely
    function extractCompanyName(job) {
      let cName = null;
      let source = 'unknown';

      // Priority 1: Adzuna official
      if (job.company && job.company.display_name) {
        cName = job.company.display_name;
        source = 'adzuna';
      }

      // Priority 3: Description extraction
      if (!cName && job.description) {
        const desc = job.description;
        const patterns = [
          /This job is with\s+([A-Z][\w\s]+?)(?:,|\.)/i,
          /About\s+([A-Z][a-zA-Z0-9\s&]+?)\s*:/i,
          /Join\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\.|!)/i,
          /([A-Z][a-zA-Z0-9\s&]+?)\s+is a/i,
          /Company:\s*([A-Z][a-zA-Z0-9\s&]+)/i,
          /Employer:\s*([A-Z][a-zA-Z0-9\s&]+)/i
        ];
        for (const p of patterns) {
          const match = desc.match(p);
          if (match && match[1]) {
            let extracted = match[1].trim();
            const generic = ['apply now', 'hiring', 'recruitment', 'job description', 'the', 'our', 'a'];
            if (extracted.length > 2 && extracted.length < 40 && !generic.some(g => extracted.toLowerCase() === g || extracted.toLowerCase().includes(g + ' '))) {
              cName = extracted;
              source = 'description';
              break;
            }
          }
        }
      }

      // Final fallback
      if (!cName || cName.toLowerCase() === 'unknown company' || cName.toLowerCase() === 'n/a' || cName === 'undefined' || cName === 'null') {
        cName = 'Company not disclosed';
      } else {
        cName = cName.replace(/^[,.\s]+|[,.\s]+$/g, '').trim();
      }

      return { companyName: cName, companyNameSource: source };
    }

    // Map to normalized format
    const jobs = (data.results || []).map(job => {
      const extracted = extractCompanyName(job);
      return {
        title: job.title,
        companyName: extracted.companyName,
        company: extracted.companyName,
        companyNameSource: extracted.companyNameSource,
        location: job.location?.display_name || location || country,
        description: job.description,
        salary: formatSalary(job.salary_min, job.salary_max, countryCode),
        postedDate: job.created,
        url: job.redirect_url,
        source: 'Adzuna'
      };
    });

    console.log(`[Backend] Adzuna returned ${jobs.length} jobs.`);
    res.json({ jobs });
  } catch (error) {
    console.error('[Backend] Adzuna Job Fetch Error:', error);
    res.status(500).json({ error: `Job Data Provider Failed: ${error.message}` });
  }
});


// 2. Gemini Grounded AI Endpoint (For Live Search Telemetry)
app.post('/api/ai/groundedContent', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is missing.' });
  }

  try {
    const { prompt, responseMimeType } = req.body;
    
    // Explicitly using Gemini client for tools/grounding
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const config = { tools: [{ googleSearch: {} }] };
    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }

    const response = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config
    });

    const candidates = response.candidates?.[0];
    const groundingMetadata = candidates?.groundingMetadata;

    res.json({
      text: response.text || '',
      groundingMetadata: groundingMetadata || null
    });

  } catch (err) {
    console.error('[Backend] Gemini Grounded Error:', err);
    res.status(500).json({ error: 'Internal Server Error processing Grounded request' });
  }
});


// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend Server listening on port ${PORT}`);
  console.log('--- STARTUP DIAGNOSTICS ---');
  console.log(`NVIDIA_API_KEY: ${nvidiaApiKey ? 'configured' : 'not configured'}`);
  console.log(`ADZUNA_APP_ID: ${adzunaAppId ? 'configured' : 'not configured'}`);
  console.log(`ADZUNA_APP_KEY: ${adzunaAppKey ? 'configured' : 'not configured'}`);
  console.log('---------------------------');
});
