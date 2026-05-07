import re
import json
import os
from typing import List, Dict
import google.generativeai as genai

class SocialListeningEngine:
    def __init__(self, confidence_threshold=0.85):
        self.confidence_threshold = confidence_threshold
        # Pre-filter Regex: Intent-heavy keywords
        self.hiring_regex = re.compile(r"\b(hiring|looking for|gig|we are recruiting|join our team|freelance role)\b", re.IGNORECASE)
        self.discard_regex = re.compile(r"\b(i am looking for|i need a job|hire me|help me find)\b", re.IGNORECASE)
        
        # Configure Gemini
        genai.configure(api_key=os.environ.get("GOOGLE_AI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def pre_filter(self, posts: List[Dict]) -> List[Dict]:
        """Pass 1: Fast Regex filtering to reduce LLM costs."""
        high_signal_posts = []
        for post in posts:
            text = post.get("text", "")
            if self.hiring_regex.search(text) and not self.discard_regex.search(text):
                high_signal_posts.append(post)
        return high_signal_posts

    def classify_intent_batch(self, posts: List[Dict]) -> List[Dict]:
        """Pass 2: Batch classification using Gemini 1.5 Flash."""
        if not posts:
            return []

        prompt = "Classify the following social media posts. For each, determine if it is a HIRING post (offering a job) or SEEKING (looking for a job).\n"
        prompt += "If HIRING, extract: Role, Company, Location, Type (Full-Time or Freelance), and Confidence (0.0-1.0).\n"
        prompt += "Return ONLY a JSON list of objects.\n\n"
        
        for i, post in enumerate(posts):
            prompt += f"Post {i}: {post['text']}\n"

        try:
            response = self.model.generate_content(prompt)
            # Basic JSON extraction
            json_str = re.search(r"\[.*\]", response.text, re.DOTALL).group(0)
            llm_results = json.loads(json_str)
            
            final_results = []
            for i, result in enumerate(llm_results):
                if result.get("Confidence", 0) > self.confidence_threshold:
                    final_results.append({
                        "original_post_url": posts[i].get("url"),
                        "text": posts[i]["text"],
                        "role": result.get("Role", "Social Opportunity"),
                        "company": result.get("Company", "Unknown"),
                        "location": result.get("Location", "Remote"),
                        "opportunity_type": "FREELANCE_FLEX" if result.get("Type") == "Freelance" else "FULL_TIME",
                        "source": posts[i].get("platform", "X/Twitter"),
                        "confidence": result.get("Confidence")
                    })
            return final_results
        except Exception as e:
            print(f"Gemini Batch Processing Error: {e}")
            return []

    def ingest_signals(self, raw_data: List[Dict]):
        """Main pipeline entry point."""
        # 1. Filter out the noise
        filtered = self.pre_filter(raw_data)
        
        # 2. Batch process with AI
        batch_size = 50
        processed_signals = []
        for i in range(0, len(filtered), batch_size):
            batch = filtered[i:i + batch_size]
            processed_signals.extend(self.classify_intent_batch(batch))
            
        return processed_signals

# Example usage
if __name__ == "__main__":
    listener = SocialListeningEngine()
    mock_posts = [
        {"text": "We are hiring a React Developer for a 3-month freelance gig! DM me.", "url": "https://x.com/post1", "platform": "X"},
        {"text": "I am looking for a job as a React dev. Help me out!", "url": "https://x.com/post2", "platform": "X"}
    ]
    
    signals = listener.ingest_signals(mock_posts)
    print(json.dumps(signals, indent=2))
