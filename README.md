<div align="center">
  <img src="public/logo.png" alt="Pravriddhi Logo" width="120" height="120" style="border-radius: 20px;"/>
  <h1>🌟 Pravriddhi</h1>
  <p><strong>Your AI-Powered Career Digital Twin & Intelligence Platform</strong></p>
  
  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-Build-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
</div>

---

Pravriddhi is an advanced, autonomous Career Digital Twin that acts as your personal AI Career Mentor. By seamlessly integrating **NVIDIA NIM** and **Google Gemini 2.5 Flash** with Live Web Search Grounding, Pravriddhi constructs a hyper-personalized roadmap for your professional journey.

## ✨ Core Features

### 📄 AI Resume Studio & ATS Optimizer
- **100% Data Extraction:** Intelligently parses PDFs and Word documents, capturing your experience, education, languages, interests, and custom sections without leaving anything behind.
- **Split-Pane Architecture:** A gorgeous workspace featuring a real-time editor on the left and a Live ATS-formatted preview on the right.
- **STAR Methodology Engine:** Automatically re-frames your verified evidence using the STAR method without hallucinating fake data.
- **Live ATS Scoring:** Dynamically calculates your resume's keyword alignment against your target role.

### 🌐 Live Workforce Intelligence
- **Google Search Grounding:** Powered by a secure backend proxy to Gemini 2.5 Flash, Pravriddhi fetches real-time 2026 market telemetry directly from live web sources.
- **Skill Radar:** Analyzes your exact skill gaps based on live industry trends.

### 🧠 Intelligent Backend Architecture
- **NVIDIA & Gemini Dual-Core:** Uses NVIDIA NIM for lightning-fast completions, with a seamless, invisible failover to Gemini if quota limits or account errors occur. 
- **Zero Frontend API Exposure:** All AI requests and web-grounding commands are strictly proxied through the Express backend, keeping your API keys securely hidden.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HiteshChugh-2006/pravriddhi.git
   cd pravriddhi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   NVIDIA_API_KEY=your_nvidia_key
   GEMINI_API_KEY=your_gemini_key
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The Vite frontend will launch on `http://localhost:3000` and the Express backend will start on `http://localhost:3001`.*

## 🛡️ AI Truth Policy
Pravriddhi strictly adheres to an **AI Resume Truth Policy**. We never fabricate unearned roles, fake dates, or hallucinated claims. Every suggestion is verifiably grounded in the authentic evidence you provide.

---
<div align="center">
  Built with ❤️ by Hitesh Chugh
</div>