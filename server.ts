import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for safe AI calls with fallback
async function generateAiText(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return response.text || '';
  } catch (error: any) {
    console.error('Gemini API call failed:', error?.message || error);
    throw error;
  }
}

// 1. AI Explanation & Hints
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { question, options, selectedOption, correctOption, topic, area, mode } = req.body;
    
    let prompt = '';
    let systemInstruction = 'You are PrePilot AI Tutor, an expert campus placement coach. Provide concise, clear, encouraging, and technically precise help for college placement aspirants.';
    
    if (mode === 'hint') {
      prompt = `A student is stuck on this ${area} (${topic}) placement question:
Question: "${question}"
Options: ${JSON.stringify(options)}

Provide ONE sharp, guiding hint that points them toward the core principle or formula WITHOUT directly giving away which option (A, B, C, D) is correct. Keep it under 2 sentences.`;
    } else {
      prompt = `A college student answered a placement test question.
Area: ${area}
Topic: ${topic}
Question: "${question}"
Options: ${JSON.stringify(options)}
Student's Selected Answer: "${selectedOption}"
Correct Answer: "${correctOption}"

Please provide a structured explanation:
1. Direct Verdict & Correct Option
2. Step-by-Step Logic / Derivation / Key Rule
3. Common Trap / Why the student's answer was incorrect (if wrong)
4. Placement Pro-Tip / Time Complexity / Shortcut for exam speed`;
    }

    const result = await generateAiText(prompt, systemInstruction);
    res.json({ success: true, text: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate explanation',
      fallback: 'Core concept: Analyze the primary constraint and eliminate impossible choices using standard formulas.'
    });
  }
});

// 2. AI Weak-Topic Question Generator
app.post('/api/ai/generate-question', async (req, res) => {
  try {
    const { area, topic, difficulty, targetRole } = req.body;

    const prompt = `Generate 1 realistic, high-yield campus placement multiple choice question for a college student aiming for "${targetRole || 'Software Development Engineer'}".
Placement Area: ${area}
Topic: ${topic}
Difficulty: ${difficulty || 'Medium'}

Return ONLY a valid JSON object matching this schema without markdown code blocks:
{
  "question": "Clear question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Brief step-by-step breakdown of why this option is correct.",
  "difficulty": "${difficulty || 'Medium'}",
  "topic": "${topic}"
}`;

    const text = await generateAiText(prompt, 'You are an assessment author for top tech campus placement drives (TCS, Infosys, Amazon, Cognizant, Google, Wipro, Accenture). Return strictly valid JSON.');
    
    // Clean potential markdown fencing
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, question: parsed });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate question',
    });
  }
});

// 3. AI Interview Feedback (Technical & HR with STAR framework)
app.post('/api/ai/interview-eval', async (req, res) => {
  try {
    const { questionType, question, studentAnswer, targetRole } = req.body;

    const prompt = `You are an interviewer conducting a campus placement interview for role: "${targetRole || 'Software Engineer'}".
Question Type: ${questionType} (Technical or HR)
Interview Question: "${question}"
Candidate's Response: "${studentAnswer}"

Evaluate the candidate's answer thoroughly and provide:
1. Overall Rating (Score out of 10)
2. Strengths: What was articulated well
3. Critical Gaps: What was missing (e.g. lack of metric, STAR structure, technical depth, edge cases)
4. ${questionType === 'HR' ? 'STAR Framework Breakdown (Situation, Task, Action, Result)' : 'Technical Precision & Trade-offs'}
5. Model Ideal Answer (Concise, impactful version they can learn from)`;

    const text = await generateAiText(prompt, 'You are a Senior Hiring Manager and Campus Placement Interviewer. Provide constructive, high-impact feedback.');
    res.json({ success: true, feedback: text });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to evaluate interview answer',
    });
  }
});

// 4. AI Resume Bullet Point Enhancer
app.post('/api/ai/resume-bullet', async (req, res) => {
  try {
    const { rawBullet, projectTitle, role } = req.body;

    const prompt = `A college student wants to improve their resume bullet point for campus placement for role "${role || 'Software Engineer'}".
Project / Experience Title: "${projectTitle || 'Software Project'}"
Original Bullet: "${rawBullet}"

Transform this bullet into 3 distinct ATS-optimized, high-impact variations using Google's formula: "Accomplished [X] as measured by [Y], by doing [Z]" using strong action verbs (Architected, Engineered, Optimized, Streamlined).

Also list:
- Action Verbs used
- Quantifiable metrics added or suggested (%, ms, users, scale)
- Keywords for ATS filters`;

    const text = await generateAiText(prompt, 'You are an expert tech recruiter and resume specialist for university campus recruitment.');
    res.json({ success: true, suggestions: text });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to improve resume bullet',
    });
  }
});

// 5. AI Day-wise Drive Planner
app.post('/api/ai/drive-plan', async (req, res) => {
  try {
    const { daysLeft, dailyHours, targetRole, readinessScore, skillScores } = req.body;

    const prompt = `A college student has an upcoming campus placement drive in ${daysLeft} days.
Daily study availability: ${dailyHours} hours/day.
Target Role: ${targetRole || 'Software Engineer'}
Current Placement Readiness Score: ${readinessScore} / 100
Current Area Scores: ${JSON.stringify(skillScores)}

Create a day-by-day or phased preparation sprint roadmap.
Prioritize their lowest-scoring areas while maintaining revision for their strengths.
Divide the timeline logically into:
- Phase 1: Heavy Skill Gap Closure
- Phase 2: Timed Mock Tests & Spaced Revision
- Phase 3: Final Tech & HR Interview Polish + Resume Quick Reviews
Keep the daily action items realistic for ${dailyHours} hrs/day.`;

    const text = await generateAiText(prompt, 'You are PrePilot Placement Coach. Generate a sharp, highly actionable study plan.');
    res.json({ success: true, plan: text });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate drive plan',
    });
  }
});

// 5. Export Codebase as clean ZIP archive
app.get('/api/export/zip', (_req, res) => {
  try {
    const zipPath = path.resolve('/tmp', 'prepilot-source.zip');
    // Ensure any modified files are committed or archive current HEAD
    try {
      execSync('git add -A && git commit -m "Auto-commit before export" || true', { stdio: 'pipe' });
    } catch {
      // ignore if already clean
    }
    execSync(`git archive --format=zip HEAD -o "${zipPath}"`, { stdio: 'pipe' });

    if (!fs.existsSync(zipPath)) {
      return res.status(500).json({ success: false, error: 'Could not generate zip archive' });
    }

    res.download(zipPath, 'prepilot-placement-platform.zip', (err) => {
      if (err) {
        console.error('Error sending zip file:', err);
      }
    });
  } catch (error: any) {
    console.error('Zip export failed:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to export zip' });
  }
});

// 6. Direct GitHub Push with Personal Access Token
app.post('/api/github/push', async (req, res) => {
  const { username = 'Lakshmeesha03ke', repoName = 'prepilot', token, isPrivate = false } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'GitHub Personal Access Token is required.',
    });
  }

  const cleanRepoName = repoName.trim().replace(/[^a-zA-Z0-9._-]/g, '-');
  if (!cleanRepoName) {
    return res.status(400).json({ success: false, error: 'Valid repository name is required.' });
  }

  const trimmedToken = token.trim();

  try {
    // 1. Try to auto-create repo if it doesn't already exist on GitHub
    try {
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trimmedToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'PrePilot-App',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanRepoName,
          description: 'PrePilot - AI-Powered Campus Placement Preparation & Readiness Platform',
          private: Boolean(isPrivate),
          auto_init: false,
        }),
      });

      const createData = await createRes.json();
      // 201 = Created, 422 = Repo already exists (which is fine)
      if (createRes.status !== 201 && createRes.status !== 422) {
        console.warn('GitHub Repo creation response:', createRes.status, createData);
      }
    } catch (apiErr) {
      console.warn('GitHub API check warning:', apiErr);
    }

    // 2. Commit any pending local changes
    try {
      execSync('git add -A && git commit -m "feat: complete PrePilot placement readiness platform" || true', { stdio: 'pipe' });
    } catch {
      // Nothing to commit
    }

    // Ensure branch is named main
    execSync('git branch -M main', { stdio: 'pipe' });

    // 3. Configure temporary remote with token credentials
    const cleanUser = username.trim();
    const encodedToken = encodeURIComponent(trimmedToken);
    const remoteUrl = `https://${encodedToken}@github.com/${cleanUser}/${cleanRepoName}.git`;

    try {
      execSync('git remote remove origin || true', { stdio: 'pipe' });
      execSync(`git remote add origin "${remoteUrl}"`, { stdio: 'pipe' });
      
      // Push to main branch (forcing to set upstream)
      execSync('git push -u origin main --force', { stdio: 'pipe', timeout: 30000 });

      const finalRepoUrl = `https://github.com/${cleanUser}/${cleanRepoName}`;
      res.json({
        success: true,
        repoUrl: finalRepoUrl,
        message: `Successfully pushed PrePilot to ${finalRepoUrl}!`,
      });
    } finally {
      // Always remove credentials from remote configuration immediately
      try {
        execSync('git remote remove origin || true', { stdio: 'pipe' });
      } catch {
        // cleanup ignore
      }
    }
  } catch (error: any) {
    console.error('Git push operation failed:', error?.message || error);
    let errorMessage = error?.message || 'Failed to push to GitHub';
    if (errorMessage.includes('Authentication failed') || errorMessage.includes('403') || errorMessage.includes('Invalid credentials')) {
      errorMessage = 'GitHub Authentication failed. Please check your Personal Access Token and ensure it has "repo" permissions.';
    } else if (errorMessage.includes('Repository not found')) {
      errorMessage = `Repository ${cleanRepoName} was not found on your GitHub account or token lacks permissions to create it.`;
    }
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Explicit PWA Endpoints for 100% Android Chrome Installability
app.get('/sw.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

app.get(['/manifest.webmanifest', '/manifest.json'], (_req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

// Serve public assets (PWA icons, manifest)
app.use(express.static(path.resolve(__dirname, 'public')));

// Vite Middleware for dev / Static file serving for prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PrePilot server running on http://localhost:${PORT}`);
  });
}

startServer();
