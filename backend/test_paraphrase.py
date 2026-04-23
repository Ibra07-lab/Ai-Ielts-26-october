import asyncio
import os
import json
from agents.direct_llm_client import DirectLLMClient

async def test():
    client = DirectLLMClient()
    
    question = "The graph below shows the quantities of goods transported in the UK between 1974 and 2002 by four different modes of transport."
    intro = "The line graph illustrates the amount of goods transported in the UK from 1974 to 2002 by four different modes of transport."
    
    improve_sys = "You are an expert IELTS examiner providing feedback."
    improve_user = f"""The student copied too many words from the question prompt into their introduction.
Show them how a Band 9 level examiner would rewrite it to avoid any direct copying.

Original question prompt:
{question}

Student's introduction:
{intro}

Rewrite the student's introduction with these rules:
1. Paraphrase all content words — no direct copying of nouns, verbs, or adjectives from the prompt
2. You MAY keep: years, numbers, units of measurement (litres, km, %)
3. Keep the same meaning — do not add or remove information
4. Keep it to 1-2 sentences maximum
5. Write at Band 9 level — natural, academic, not robotic

Then list exactly what was changed in this format:
CHANGES:
- original word/phrase → paraphrased version
- original word/phrase → paraphrased version

Return JSON:
{{
  "improved_introduction": "...",
  "changes": [
    {{"original": "original word", "paraphrased": "new word"}},
    {{"original": "original word", "paraphrased": "new word"}}
  ]
}}"""
    
    try:
        resp_text = await client.call_openrouter_async(
            model="openai/gpt-4o-mini",
            system_prompt=improve_sys,
            user_prompt=improve_user,
            temperature=0.3,
            max_tokens=300
        )
        print("RAW RESPONSE:")
        print(resp_text)
        
        print("\nPARSING:")
        clean_resp = resp_text.strip("` \n")
        if clean_resp.startswith("json"):
            clean_resp = clean_resp[4:]
        
        print(f"CLEANED: '{clean_resp[:20]}...'")
        data = json.loads(clean_resp)
        print("Success:", data.keys())
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv("backend/.env")
    asyncio.run(test())
