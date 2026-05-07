import os
import json
import google.generativeai as genai

# Configure Google Gemini
# Requires GEMINI_API_KEY in environment variables
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

generation_config = {
  "temperature": 0.1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

def extract_job_details(raw_text: str) -> dict:
    """
    Extracts structured data from raw scraped job HTML or text.
    """
    prompt = f"""
    Extract the following information from the provided job description text into a clean JSON object:
    - title (string)
    - company (string)
    - location (string)
    - hard_skills (list of strings)
    - soft_skills (list of strings)
    - experience_level (string, e.g., 'Junior', 'Mid', 'Senior')
    - domain (string, e.g., 'Fintech', 'Healthcare')
    
    Job Description:
    {raw_text}
    """
    response = model.generate_content(prompt)
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON", "raw": response.text}

def extract_resume_details(raw_text: str) -> dict:
    """
    Extracts structured data from raw parsed resume text.
    """
    prompt = f"""
    Extract the following information from the provided resume text into a clean JSON object:
    - name (string)
    - hard_skills (list of strings)
    - total_years_experience (integer)
    - domains (list of strings, e.g., 'E-commerce', 'Banking')
    - has_portfolio_or_github (boolean)
    
    Resume Text:
    {raw_text}
    """
    response = model.generate_content(prompt)
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON", "raw": response.text}
