# 🚀 PrePilot - AI-Powered Campus Placement Readiness Platform

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **PrePilot** is an intelligent, personalized campus placement preparation and readiness engine. It measures student competencies across 6 core assessment domains, calculates skill gaps, prioritizes high-impact practice tasks, and offers an AI-powered tutor for instant conceptual hints and explanations.

---

## 🌟 Key Features

- 📊 **6-Dimensional Readiness Evaluation**:
  - Quantitative Aptitude (Percentages, Time & Work, Permutations)
  - Logical Reasoning (Puzzles, Syllogisms, Pattern Recognition)
  - Verbal Ability (Reading Comprehension, Sentence Correction)
  - Core Technical (DSA, OOPS, DBMS, OS, Computer Networks)
  - System Design & Coding (Scalability, API Design, Complexities)
  - HR & Behavioral Interviews (STAR technique, situational questions)

- 🎯 **Smart Adaptive Priority Engine**:
  - Dynamically detects critical skill gaps and weak areas.
  - Factors in target company drive date, topic weightage, and current mastery.
  - Recommends the highest ROI task to boost your placement percentile.

- 🤖 **AI Placement Coach (Gemini AI)**:
  - Interactive "PrePilot AI Tutor" provides hints without spoiling answers.
  - In-depth answer breakdown, alternative solving approaches, and common pitfalls.

- 🔥 **Streak & Consistency Heatmap**:
  - Visual daily streak tracker to keep students accountable until placement day.
  - Daily goal targets and completion badges.

- 📱 **Progressive Web App (PWA) & Mobile-Ready**:
  - Native-like mobile experience with custom manifest, service workers, and offline support.
  - Installable directly to Android and iOS home screens.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion animations
- **Backend**: Node.js & Express server with Vite middleware integration
- **AI Integration**: Google GenAI TypeScript SDK (`@google/genai`)
- **Storage**: Browser LocalStorage & state caching with mock database fallbacks
- **PWA**: `vite-plugin-pwa` with custom service worker caching

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm
- (Optional) Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Lakshmeesha03ke/prepilot.git
cd prepilot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── public/                 # PWA icons, manifest, and service worker
├── scripts/                # Utility scripts for asset and icon generation
├── src/
│   ├── components/         # UI components (RadarChart, ReadinessGauge, Modals, Navbar)
│   ├── data/               # Curated question banks & placement benchmarks
│   ├── hooks/              # Custom hooks (PWA installer, notifications)
│   ├── services/           # Priority engine, local storage, API client
│   ├── types/              # TypeScript interfaces and data models
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # Application entry point
├── server.ts               # Express backend proxy for AI endpoints & git export
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration with Tailwind CSS & PWA plugins
```

---

## 🤝 Contributing

Contributions are warmly welcome! Feel free to open an issue or submit a pull request:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed by [Lakshmeesha03ke](https://github.com/Lakshmeesha03ke).
