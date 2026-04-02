import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "../auth/auth";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

export interface ChatRequest {
  message: string;
  context?: string;
}

export interface ChatResponse {
  reply: string;
}

// Enhanced interfaces for essay analysis
export interface EssayAnalysisRequest {
  essay: string;
  taskType: number; // 1 or 2
  userId: string;
}

export interface EssayAnalysisResponse {
  overallScore: number;
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  feedback: string;
  suggestions: string[];
}

// Vocabulary enhancement interfaces
export interface VocabularyRequest {
  word: string;
}

export interface VocabularyResponse {
  examples: string[];
  synonyms: string[];
  collocations: string[];
  difficulty: string;
}

// Essay Analysis with LangChain
export const analyzeEssay = api<EssayAnalysisRequest, EssayAnalysisResponse>(
  { expose: true, method: "POST", path: "/ai/analyze-essay", auth: true },
  async (req) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== req.userId) {
      throw APIError.permissionDenied("You can only analyze essays for yourself");
    }

    const analysisPrompt = ChatPromptTemplate.fromMessages([
      ["system", `You are an expert IELTS writing examiner. Analyze the following Task ${req.taskType} essay and provide detailed feedback.

Scoring criteria (0-9 scale):
- Task Response: How well the essay addresses the task
- Coherence & Cohesion: Organization and logical flow
- Lexical Resource: Vocabulary range and accuracy
- Grammatical Range & Accuracy: Grammar complexity and correctness

Provide scores for each criterion and overall band score. Return your response in this format:
TASK_RESPONSE: [score]
COHERENCE_COHESION: [score]
LEXICAL_RESOURCE: [score]
GRAMMATICAL_RANGE: [score]
OVERALL_SCORE: [score]

FEEDBACK:
[detailed feedback]

SUGGESTIONS:
- [suggestion 1]
- [suggestion 2]
- [suggestion 3]`],
      ["human", "Essay to analyze:\n\n{essay}"]
    ]);

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",  // Use consistent model
      temperature: 0.1, // Lower temperature for consistent scoring
    });

    const chain = analysisPrompt.pipe(model).pipe(new StringOutputParser());

    const analysis = await chain.invoke({ essay: req.essay });

    // Parse the AI response (simplified parsing - in production, use more robust parsing)
    const taskResponse = extractScore(analysis, "TASK_RESPONSE") || 6.0;
    const coherenceCohesion = extractScore(analysis, "COHERENCE_COHESION") || 6.0;
    const lexicalResource = extractScore(analysis, "LEXICAL_RESOURCE") || 6.0;
    const grammaticalRange = extractScore(analysis, "GRAMMATICAL_RANGE") || 6.0;
    const overallScore = extractScore(analysis, "OVERALL_SCORE") ||
      Math.round(((taskResponse + coherenceCohesion + lexicalResource + grammaticalRange) / 4) * 10) / 10;

    const suggestions = extractSuggestions(analysis);

    return {
      overallScore,
      taskResponse,
      coherenceCohesion,
      lexicalResource,
      grammaticalRange,
      feedback: analysis,
      suggestions
    };
  }
);

// Enhanced Vocabulary with LangChain
export const getVocabularyEnhancement = api<VocabularyRequest, VocabularyResponse>(
  { expose: true, method: "GET", path: "/ai/vocabulary/:word/enhance", auth: true },
  async ({ word }) => {
    const vocabPrompt = ChatPromptTemplate.fromMessages([
      ["system", `Provide comprehensive vocabulary enhancement for IELTS preparation.

For the word "{word}", provide:
1. 3 IELTS-level example sentences
2. 5 synonyms suitable for IELTS writing
3. 3 common collocations
4. Difficulty level (Beginner/Intermediate/Advanced)

Format your response as:
EXAMPLES:
- [example 1]
- [example 2]  
- [example 3]

SYNONYMS:
- [synonym 1]
- [synonym 2]
- [synonym 3]
- [synonym 4]
- [synonym 5]

COLLOCATIONS:
- [collocation 1]
- [collocation 2]
- [collocation 3]

DIFFICULTY: [level]`],
      ["human", "Word: {word}"]
    ]);

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.5,
    });

    const chain = vocabPrompt.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({ word });

    // Parse response
    const examples = extractListItems(response, "EXAMPLES");
    const synonyms = extractListItems(response, "SYNONYMS");
    const collocations = extractListItems(response, "COLLOCATIONS");
    const difficulty = extractField(response, "DIFFICULTY") || "Intermediate";

    return {
      examples: examples.length > 0 ? examples : [
        `The ${word} was evident in the analysis.`,
        `She demonstrated ${word} in her approach.`,
        `The importance of ${word} cannot be understated.`
      ],
      synonyms: synonyms.length > 0 ? synonyms : ["alternative", "substitute", "replacement"],
      collocations: collocations.length > 0 ? collocations : [`strong ${word}`, `clear ${word}`, `obvious ${word}`],
      difficulty
    };
  }
);

// Helper functions for parsing AI responses
function extractScore(text: string, scoreType: string): number | null {
  const regex = new RegExp(`${scoreType}:\\s*([0-9](?:\\.[0-9])?)`, 'i');
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : null;
}

function extractField(text: string, fieldName: string): string | null {
  const regex = new RegExp(`${fieldName}:\\s*(.+?)(?=\\n|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractListItems(text: string, sectionName: string): string[] {
  const regex = new RegExp(`${sectionName}:[\\s\\S]*?(?=\\n[A-Z_]+:|$)`, 'i');
  const section = text.match(regex);
  if (!section) return [];

  const items = section[0].match(/- (.+)/g);
  return items ? items.map(item => item.replace(/^- /, '').trim()) : [];
}

function extractSuggestions(text: string): string[] {
  const suggestions = extractListItems(text, "SUGGESTIONS");
  return suggestions.length > 0 ? suggestions : [
    "Use more complex sentence structures",
    "Include more topic-specific vocabulary",
    "Improve paragraph transitions"
  ];
}

