// Utility for Gemini 1.5 Flash Integration (Free Tier)
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const GATEKEEPER_SYSTEM_PROMPT = `
You are the MeritSync AI Gatekeeper. Your task is to perform a contextual, weighted comparison between a Candidate Resume and a Job Description (JD). 
You must ignore rigid keyword matching and focus on semantic relevance. 
You are strictly forbidden from fabricating experience or skills. 
Your output must be a valid JSON object.

SCORING WEIGHTS (40/30/20/10 Rule):
- Hard Skills (40%): Tool mastery & semantic equivalents.
- Experience & Scale (30%): Depth and leadership.
- Domain Relevance (20%): Industry context.
- Verification (10%): Proven proficiency via Skill Quests (V).

STATUS LOGIC:
- Score >= 75: "QUALIFIED"
- Score 60-74: "FREELANCE_FLEX"
- Score < 60: "GATED"
`.trim();

export function generateGatekeeperPrompt(resume: any, jd: string) {
  return `
### INPUT DATA
Candidate Resume (JSON): ${JSON.stringify(resume)}
Job Description: ${jd}

### TASK
1. Calculate a suitability score (0-100) based on the 40/30/20/10 weighting rule.
2. Identify specific "Gaps" where the candidate fails to meet JD requirements.
3. Generate three "Explainable AI (XAI)" bullet points justifying the score.

### CONSTRAINTS
- If the score is < 75, identify suitability for a "Freelance Flex" project (60-74% range).
- Format the response as JSON only.

### OUTPUT SCHEMA
{
  "suitability_score": number,
  "status": "QUALIFIED" | "FREELANCE_FLEX" | "GATED",
  "xai_summary": [string, string, string],
  "gap_analysis": {
    "missing_skills": [string],
    "experience_concerns": string
  },
  "freelance_pitch_suggestion": string | null
}
  `.trim();
}

export async function callAI(prompt: string, systemInstruction?: string) {
  try {
    const chat = model.startChat({
      history: systemInstruction ? [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Understood. I will act according to these instructions." }] }
      ] : []
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("AI Call Failed:", error.message);
    if (error.message.includes("429")) {
      return "Rate limit reached. Please try again in a moment.";
    }
    throw error;
  }
}

export async function callAIJson(prompt: string, systemInstruction?: string) {
  const response = await callAI(prompt + "\n\nIMPORTANT: Output strictly valid JSON.", systemInstruction);
  try {
    // Basic JSON extraction if AI includes markdown blocks
    const jsonStr = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)?.[0] || response;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("JSON Parse Error:", response);
    throw new Error("AI failed to return valid JSON.");
  }
}
