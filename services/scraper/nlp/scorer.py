import os
import json
import google.generativeai as genai

# Configure Google Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

generation_config = {
  "temperature": 0.2,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

def evaluate_match(resume_text: str, job_description: str) -> dict:
    """
    Evaluates a candidate's resume against a job description.
    Uses the AI Gatekeeper weights:
    - Hard Skills (40%)
    - Experience & Scale (30%)
    - Domain Relevance (20%)
    - Verification (10%)
    """
    prompt = f"""
    You are an expert AI recruiter scoring a candidate against a job description.
    Analyze the candidate's resume and the job description, then generate a strict scoring report.
    
    Weights:
    - hard_skills_score (out of 40)
    - experience_score (out of 30)
    - domain_score (out of 20)
    - verification_score (out of 10) - Bonus points for active GitHub links or portfolios.
    
    Also calculate total_score (out of 100).
    
    If total_score >= 75: opportunity_type = "FULL_TIME"
    If total_score between 60 and 74: opportunity_type = "FREELANCE_FLEX"
    If total_score < 60: opportunity_type = "GATED"
    
    Provide 'xai_notes' as a list of 3 strings explaining the 'Why' behind the score.
    If FREELANCE_FLEX, make the first note a contextual 'Pitch' for a specific freelance project based on their strongest matching skills.
    If GATED, make the notes a Transparency & Gap Report.
    
    Output JSON format:
    {{
      "hard_skills_score": int,
      "experience_score": int,
      "domain_score": int,
      "verification_score": int,
      "total_score": int,
      "opportunity_type": string,
      "xai_notes": [string, string, string]
    }}
    
    Resume Text:
    {resume_text}
    
    Job Description:
    {job_description}
    """
    
    response = model.generate_content(prompt)
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {
            "error": "Failed to generate scores",
            "total_score": 0,
            "opportunity_type": "GATED",
            "xai_notes": ["Error parsing AI response."]
        }
