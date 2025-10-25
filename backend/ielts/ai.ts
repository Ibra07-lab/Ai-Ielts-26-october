import { api } from "encore.dev/api";
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
  userId: number;
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

// Speaking analysis interfaces
export interface SpeakingAnalysisRequest {
  transcription: string;
  question: string;
  part: number;
  userId: number;
}

export interface SpeakingAnalysisResponse {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
  overallBand: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
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

// Simple AI chat endpoint backed by OpenAI via LangChain.
// LangSmith tracing is automatically enabled via env vars:
//   LANGSMITH_TRACING, LANGSMITH_ENDPOINT, LANGSMITH_API_KEY, LANGSMITH_PROJECT
export const chatWithCoach = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/ai/chat" },
  async (req) => {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an expert IELTS coach. Provide concise, actionable guidance. If the user asks about IELTS skills (writing, speaking, reading, listening), give tips, examples, and next steps. Keep responses under 180 words unless more detail is requested.",
      ],
      [
        "user",
        "Context (optional): {context}\n\nUser message: {message}",
      ],
    ]);

    const model = new ChatOpenAI({
      // Use a small, cost-effective model by default; override with env OPENAI_API_KEY.
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      // temperature can be tuned later via query/body if desired
      temperature: 0.3,
    });

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const reply = await chain.invoke({
      message: req.message,
      context: req.context ?? "",
    });

    return { reply };
  }
);

// Enhanced chat with conversation memory
export const chatWithCoachMemory = api<ChatRequest & { userId: number }, ChatResponse>(
  { expose: true, method: "POST", path: "/ai/chat-memory" },
  async (req) => {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are an expert IELTS coach. Provide concise, actionable guidance. Remember our conversation context and build on previous discussions. Keep responses under 180 words unless more detail is requested."],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"]
    ]);

    const model = new ChatOpenAI({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
    });

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    
    // Simple in-memory conversation storage (in production, use persistent storage)
    const messageHistory = new ChatMessageHistory();
    
    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: () => messageHistory,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });

    const reply = await chainWithHistory.invoke(
      { input: req.message },
      { configurable: { sessionId: `user_${req.userId}` } }
    );

    return { reply };
  }
);

// Essay Analysis with LangChain
export const analyzeEssay = api<EssayAnalysisRequest, EssayAnalysisResponse>(
  { expose: true, method: "POST", path: "/ai/analyze-essay" },
  async (req) => {
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

// Speaking Analysis with LangChain
export const analyzeSpeaking = api<SpeakingAnalysisRequest, SpeakingAnalysisResponse>(
  { expose: true, method: "POST", path: "/ai/analyze-speaking" },
  async (req) => {
    const speakingPrompt = ChatPromptTemplate.fromMessages([
      ["system", `You are an expert IELTS speaking examiner for Part ${req.part}.

Analyze this speaking response and provide scores (0-9) for:
- Fluency and Coherence
- Lexical Resource
- Grammatical Range and Accuracy  
- Pronunciation (estimate from transcription quality)

Question: {question}
Response: {transcription}

Format your response as:
FLUENCY_COHERENCE: [score]
LEXICAL_RESOURCE: [score]
GRAMMATICAL_RANGE: [score]
PRONUNCIATION: [score]
OVERALL_BAND: [score]

FEEDBACK:
[detailed feedback]

STRENGTHS:
- [strength 1]
- [strength 2]

IMPROVEMENTS:
- [improvement 1]
- [improvement 2]`],
      ["human", "Provide detailed analysis with scores and feedback."]
    ]);

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    const chain = speakingPrompt.pipe(model).pipe(new StringOutputParser());
    
    const analysis = await chain.invoke({
      question: req.question,
      transcription: req.transcription
    });

    // Parse scores from AI response
    const fluencyCoherence = extractScore(analysis, "FLUENCY_COHERENCE") || 6.0;
    const lexicalResource = extractScore(analysis, "LEXICAL_RESOURCE") || 6.0;
    const grammaticalRange = extractScore(analysis, "GRAMMATICAL_RANGE") || 6.0;
    const pronunciation = extractScore(analysis, "PRONUNCIATION") || 6.0;
    const overallBand = extractScore(analysis, "OVERALL_BAND") || 
      Math.round(((fluencyCoherence + lexicalResource + grammaticalRange + pronunciation) / 4) * 10) / 10;

    const strengths = extractListItems(analysis, "STRENGTHS");
    const improvements = extractListItems(analysis, "IMPROVEMENTS");

    return {
      fluencyCoherence,
      lexicalResource,
      grammaticalRange,
      pronunciation,
      overallBand,
      feedback: analysis,
      strengths,
      improvements
    };
  }
);

// Enhanced Vocabulary with LangChain
export const getVocabularyEnhancement = api<VocabularyRequest, VocabularyResponse>(
  { expose: true, method: "GET", path: "/ai/vocabulary/:word/enhance" },
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
