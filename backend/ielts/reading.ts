import { api } from "encore.dev/api";
import { ieltsDB } from "./db";
import * as fs from "node:fs";
import * as path from "node:path";

export interface ReadingPassage {
  id: number;
  title: string;
  content: string;
  paragraphs: PassageParagraph[];
  questions: ReadingQuestionGroup[];
  level: string; // 'academic' | 'general'
  estimatedTime: number; // in minutes
  createdAt?: string;
}

export interface PassageParagraph {
  id: string; // e.g., "P1", "P2"
  text: string;
}

export interface FlowChartNode {
  id: string;           // e.g., "node1", "gap27"
  type: 'stage' | 'gap' | 'decision';
  content?: string;     // For stage nodes
  gapNumber?: number;   // For gap nodes (e.g., 27)
  correctAnswer?: string;
  position?: number;    // Sequential order for linear charts
}

export interface FlowChartConnection {
  from: string;         // Node ID
  to: string;           // Node ID  
  label?: string;       // e.g., "then", "if condition met"
  style?: 'solid' | 'dashed';
}

export interface FlowChartStructure {
  title: string;        // e.g., "The Process of Coral Bleaching"
  orientation: 'vertical' | 'horizontal';
  nodes: FlowChartNode[];
  connections: FlowChartConnection[];
}

export interface ReadingQuestionGroup {
  id: number;
  type: 'matching-headings' | 'true-false-not-given' | 'gap-fill' | 'multiple-choice' | 'short-answer' | 'sentence-completion' | 'matching-features' | 'summary-completion' | 'note-completion' | 'table-completion' | 'flow-chart-completion'|'matching-information' | 'matching-sentence-endings';
  title: string;
  instructions: string;
  questions: ReadingQuestion[];
  completion_type?: 'summary' | 'notes' | 'table' | 'flow-chart';
  word_limit?: string;
  structure?: string;
  sentence_beginnings?: string[];  // Array of sentence beginnings
  sentence_endings?: Array<{ letter: string; text: string }>;  // Array of endings with letters
  flow_chart?: FlowChartStructure;
}

// Test APIs types
export interface ReadingTestMeta {
  testId: number;
  testName: string;
  totalQuestions: number;
}

export interface ReadingTestResponse {
  testId: number;
  testName: string;
  passages: ReadingPassage[];
}

function getReadingTestsDir(): string {
  // Resolve relative to repo root when running inside backend
  const dataDir = path.resolve(process.cwd(), "backend", "data", "reading-tests");
  // Fallback if process cwd is already in backend
  if (fs.existsSync(dataDir)) return dataDir;
  const alt = path.resolve(process.cwd(), "data", "reading-tests");
  return alt;
}

function loadAllTests(): Array<{ testId: number; testName: string; passages: ReadingPassage[] }> {
  const dir = getReadingTestsDir();
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  const tests: Array<{ testId: number; testName: string; passages: ReadingPassage[] }> = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const json = JSON.parse(raw);
      if (json && Array.isArray(json.passages) && typeof json.testId === "number") {
        tests.push({ testId: json.testId, testName: json.testName ?? `Test ${json.testId}`, passages: json.passages });
      }
    } catch {
      // ignore malformed files
    }
  }
  // Sort by testId asc
  tests.sort((a, b) => a.testId - b.testId);
  return tests;
}

function countQuestions(passages: ReadingPassage[]): number {
  return passages.reduce((sum, p) => sum + (Array.isArray(p.questions) ? p.questions.reduce((s, g) => s + (Array.isArray(g.questions) ? g.questions.length : 0), 0) : 0), 0);
}

// NEW: Get list of all tests
export const getReadingTests = api<void, { tests: ReadingTestMeta[] }>(
  { expose: true, method: "GET", path: "/reading/tests" },
  async () => {
    const tests = loadAllTests();
    const metas: ReadingTestMeta[] = tests.map(t => ({ testId: t.testId, testName: t.testName, totalQuestions: countQuestions(t.passages) }));
    return { tests: metas };
  }
);

// NEW: Get passages for a specific test
export const getReadingTestById = api<{ testId: number }, ReadingTestResponse>(
  { expose: true, method: "GET", path: "/reading/tests/:testId" },
  async ({ testId }) => {
    const tests = loadAllTests();
    const test = tests.find(t => t.testId === testId);
    if (!test) {
      throw new Error("Test not found");
    }
    // Basic validations per requirements
    if (!Array.isArray(test.passages) || test.passages.length !== 3) {
      // still return but do not crash; client can handle
    }
    return { testId: test.testId, testName: test.testName, passages: test.passages };
  }
);

export interface ReadingQuestion {
  id: number;
  questionText: string;
  options?: string[]; // For multiple choice or headings list
  correctAnswer: string | string[];
  explanation?: string;
  answerType?: 'single' | 'multiple'; // For gap-fill with multiple blanks
  gap_number?: number;
  context?: string;
  evidence_quote?: string;
  evidence_location?: string;
  answer_type?: 'noun' | 'adjective' | 'number' | 'date' | string;
}

export interface ReadingSubmission {
  userId: number;
  passageTitle: string;
  passageContent: string;
  questions: ReadingQuestion[];
  userAnswers: Record<number, string>;
  timeTaken?: number;
}

export interface ReadingResult {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: Record<number, string>;
  explanations: Record<number, string>;
}

export interface ReadingSession {
  id: number;
  passageTitle: string;
  score: number;
  totalQuestions: number;
  timeTaken?: number;
  createdAt: string;
}

export interface ReadingHighlight {
  id: number;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor: string;
  createdAt: string;
}

export interface CreateHighlightRequest {
  userId: number;
  passageTitle: string;
  highlightedText: string;
  startPosition: number;
  endPosition: number;
  highlightType: string;
  highlightColor?: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  definition?: string;
  exampleSentence?: string;
  audioUrl?: string;
}

export interface AddToVocabularyRequest {
  userId: number;
  text: string;
  definition: string;
  translation: string;
  targetLanguage: string;
  exampleSentence: string;
  topic?: string;
}

const samplePassages: ReadingPassage[] = [
  {
    id: 101,
    title: "The Impact of Social Media on Modern Communication",
    content: `Social media has fundamentally transformed the way people communicate in the 21st century. Platforms like Facebook, Twitter, and Instagram have created new forms of interaction that were unimaginable just two decades ago. These platforms have enabled instant global communication, allowing people to connect across vast distances in real-time.

However, this digital revolution has also brought challenges. Critics argue that social media has led to a decline in face-to-face communication skills and has contributed to the spread of misinformation. Studies have shown that excessive use of social media can lead to feelings of isolation and depression, particularly among young people.

Despite these concerns, social media continues to play an increasingly important role in business, education, and social movements. Companies use these platforms for marketing and customer service, while educators leverage them for distance learning and student engagement. Social movements have also found social media to be a powerful tool for organizing and raising awareness about important issues.

The future of social media remains uncertain, but its impact on human communication is undeniable. As technology continues to evolve, society must find ways to harness the benefits of these platforms while mitigating their potential negative effects.`,
    paragraphs: [
      { id: "P1", text: "Social media has fundamentally transformed the way people communicate in the 21st century." },
      { id: "P2", text: "However, this digital revolution has also brought challenges." },
      { id: "P3", text: "Despite these concerns, social media continues to play an increasingly important role." },
      { id: "P4", text: "The future of social media remains uncertain, but its impact is undeniable." },
    ],
    level: "academic",
    estimatedTime: 20,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        title: 'Questions 1–3',
        instructions: 'Choose the correct answer.',
        questions: [
          {
            id: 1,
            questionText: "According to the passage, social media has:",
            options: [
              "Only positive effects on communication",
              "Only negative effects on communication",
              "Both positive and negative effects on communication",
              "No significant impact on communication"
            ],
            correctAnswer: "Both positive and negative effects on communication"
          },
          {
            id: 2,
            questionText: "Social media platforms were widely used 30 years ago.",
            correctAnswer: "False"
          },
          {
            id: 3,
            questionText: "Which of the following is NOT mentioned as a use of social media?",
            options: [
              "Marketing",
              "Education",
              "Medical diagnosis",
              "Social movements"
            ],
            correctAnswer: "Medical diagnosis"
          }
        ]
      }
    ]
  },
  {
    id: 102,
    title: "Climate Change and Renewable Energy Solutions",
    content: `Climate change represents one of the most pressing challenges of our time, with global temperatures rising at an unprecedented rate due to human activities. The burning of fossil fuels for energy production has been identified as the primary contributor to greenhouse gas emissions, which trap heat in the Earth's atmosphere and lead to global warming.

In response to this crisis, governments and organizations worldwide have been investing heavily in renewable energy technologies. Solar power has emerged as one of the most promising alternatives, with the cost of solar panels decreasing dramatically over the past decade. Wind energy has also shown remarkable growth, particularly in coastal regions where wind patterns are most favorable.

Hydroelectric power, while not a new technology, continues to play a significant role in many countries' energy portfolios. However, the construction of large dams can have substantial environmental impacts, including the displacement of local communities and disruption of river ecosystems. This has led to increased interest in smaller-scale hydroelectric projects that minimize environmental damage.

Energy storage remains a critical challenge for renewable energy adoption. Unlike fossil fuel power plants, which can generate electricity on demand, renewable sources are dependent on weather conditions. Battery technology has improved significantly, but large-scale energy storage solutions are still expensive and limited in capacity.

The transition to renewable energy is not just an environmental imperative but also an economic opportunity. The renewable energy sector has created millions of jobs worldwide and has the potential to drive economic growth while reducing carbon emissions. However, this transition requires substantial investment in infrastructure and technology, as well as supportive government policies.`,
    paragraphs: [
      { id: "P1", text: "Climate change represents one of the most pressing challenges of our time." },
      { id: "P2", text: "In response to this crisis, investments in renewable energy have increased." },
      { id: "P3", text: "Hydroelectric power has environmental impacts; smaller projects are explored." },
      { id: "P4", text: "Energy storage remains a critical challenge for renewable adoption." },
    ],
    level: "academic",
    estimatedTime: 20,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        title: 'Questions 1–4',
        instructions: 'Choose the correct answer.',
        questions: [
          {
            id: 1,
            questionText: "What is identified as the primary cause of greenhouse gas emissions?",
            options: [
              "Deforestation",
              "Industrial manufacturing",
              "Burning of fossil fuels",
              "Transportation"
            ],
            correctAnswer: "Burning of fossil fuels"
          },
          {
            id: 2,
            questionText: "Solar panel costs have increased over the past decade.",
            correctAnswer: "False"
          },
          {
            id: 3,
            questionText: "Large dams can cause the _______ of local communities.",
            correctAnswer: "displacement"
          },
          {
            id: 4,
            questionText: "According to the passage, what is a major challenge for renewable energy?",
            options: [
              "High installation costs",
              "Energy storage",
              "Government regulations",
              "Public acceptance"
            ],
            correctAnswer: "Energy storage"
          }
        ]
      }
    ]
  },
  {
    id: 103,
    title: "The Evolution of Urban Transportation",
    content: `Urban transportation systems have undergone dramatic changes throughout history, evolving from horse-drawn carriages to modern electric vehicles. The industrial revolution of the 19th century marked a turning point, introducing steam-powered trains and later, internal combustion engines that would dominate transportation for over a century.

The rise of the automobile in the early 20th century fundamentally reshaped urban landscapes. Cities expanded outward as people could live farther from their workplaces, leading to the development of suburban communities. However, this car-centric approach to urban planning has created numerous challenges, including traffic congestion, air pollution, and social inequality in access to transportation.

Public transportation systems have played a crucial role in addressing these challenges. Cities like London, New York, and Tokyo developed extensive subway networks that could move large numbers of people efficiently. Bus rapid transit systems have also gained popularity in developing countries as a cost-effective alternative to rail-based systems.

In recent years, there has been a growing emphasis on sustainable transportation solutions. Electric buses and trains are becoming more common, while bike-sharing programs have been implemented in cities worldwide. The concept of "complete streets" – designed to accommodate pedestrians, cyclists, public transit, and vehicles – is gaining traction among urban planners.

The emergence of ride-sharing services and autonomous vehicles promises to further transform urban transportation. These technologies could potentially reduce the need for private car ownership while improving accessibility for elderly and disabled populations. However, concerns remain about their impact on public transportation systems and employment in the transportation sector.

Looking ahead, the integration of various transportation modes through digital platforms and smart city technologies will likely define the future of urban mobility. The goal is to create seamless, efficient, and environmentally sustainable transportation networks that serve all members of society.`,
    paragraphs: [
      { id: "P1", text: "Urban transportation systems have undergone dramatic changes throughout history." },
      { id: "P2", text: "The rise of the automobile reshaped cities but created challenges." },
      { id: "P3", text: "Public transportation addresses challenges; subways and BRT are examples." },
      { id: "P4", text: "Sustainable transportation solutions are emphasized in recent years." },
    ],
    level: "academic",
    estimatedTime: 20,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        title: 'Questions 1–5',
        instructions: 'Choose the correct answer.',
        questions: [
          {
            id: 1,
            questionText: "What marked a turning point in urban transportation history?",
            options: [
              "The invention of the wheel",
              "The industrial revolution",
              "The development of roads",
              "The creation of traffic laws"
            ],
            correctAnswer: "The industrial revolution"
          },
          {
            id: 2,
            questionText: "Car-centric urban planning has only had positive effects on cities.",
            correctAnswer: "False"
          },
          {
            id: 3,
            questionText: "Bus rapid transit systems are popular in developing countries as a _______ alternative to rail systems.",
            correctAnswer: "cost-effective"
          },
          {
            id: 4,
            questionText: "What does the concept of 'complete streets' aim to accommodate?",
            options: [
              "Only vehicles and buses",
              "Pedestrians, cyclists, public transit, and vehicles",
              "Only bicycles and pedestrians",
              "Emergency vehicles only"
            ],
            correctAnswer: "Pedestrians, cyclists, public transit, and vehicles"
          },
          {
            id: 5,
            questionText: "Autonomous vehicles will definitely replace all public transportation.",
            correctAnswer: "Not Given"
          }
        ]
      }
    ]
  },
  {
    id: 104,
    title: "The Science of Sleep and Its Impact on Learning",
    content: `Sleep is a fundamental biological process that plays a crucial role in human health and cognitive function. Despite spending approximately one-third of our lives asleep, the mechanisms and purposes of sleep remained largely mysterious until recent decades. Modern neuroscience has revealed that sleep is far from a passive state; instead, it is an active period during which the brain performs essential maintenance and consolidation activities.

One of the most significant discoveries in sleep research is the role of sleep in memory consolidation. During sleep, particularly during the deep sleep stages, the brain processes and organizes information acquired during waking hours. This process involves the transfer of memories from temporary storage in the hippocampus to more permanent storage in the cortex. Studies have consistently shown that people who get adequate sleep after learning new information perform significantly better on memory tests than those who are sleep-deprived.

The sleep cycle consists of several distinct stages, each serving different functions. Rapid Eye Movement (REM) sleep, characterized by vivid dreams, is particularly important for emotional processing and creative problem-solving. Non-REM sleep, which includes deep sleep stages, is crucial for physical restoration and memory consolidation. A complete sleep cycle typically lasts 90-120 minutes, and healthy adults usually experience 4-6 cycles per night.

Sleep deprivation has become increasingly common in modern society, with serious consequences for learning and academic performance. Students who consistently get less than the recommended 7-9 hours of sleep show decreased attention span, impaired decision-making abilities, and reduced capacity for creative thinking. Chronic sleep deprivation can also weaken the immune system and increase the risk of various health problems.

Educational institutions are beginning to recognize the importance of sleep for student success. Some schools have implemented later start times to align with adolescents' natural sleep patterns, while others have introduced sleep education programs. Research suggests that these interventions can lead to improved academic performance and better overall student well-being.

The relationship between sleep and learning extends beyond formal education. Professional development, skill acquisition, and even language learning are all enhanced by adequate sleep. As our understanding of sleep science continues to evolve, it becomes increasingly clear that prioritizing sleep is not a luxury but a necessity for optimal cognitive function and lifelong learning.`,
    paragraphs: [
      { id: "P1", text: "Sleep is a fundamental biological process essential to cognition." },
      { id: "P2", text: "Deep sleep plays a role in memory consolidation." },
      { id: "P3", text: "Sleep cycle consists of several stages; REM and Non-REM have roles." },
      { id: "P4", text: "Sleep deprivation harms academic performance and health." },
    ],
    level: "academic",
    estimatedTime: 20,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        title: 'Questions 1–6',
        instructions: 'Choose the correct answer.',
        questions: [
          {
            id: 1,
            questionText: "According to the passage, what happens to memories during deep sleep?",
            options: [
              "They are permanently deleted",
              "They are transferred from hippocampus to cortex",
              "They become more vivid",
              "They are only temporarily stored"
            ],
            correctAnswer: "They are transferred from hippocampus to cortex"
          },
          {
            id: 2,
            questionText: "REM sleep is characterized by the absence of dreams.",
            correctAnswer: "False"
          },
          {
            id: 3,
            questionText: "A complete sleep cycle typically lasts _______ minutes.",
            correctAnswer: "90-120"
          },
          {
            id: 4,
            questionText: "What is the recommended amount of sleep for healthy adults?",
            options: [
              "5-6 hours",
              "6-7 hours",
              "7-9 hours",
              "9-11 hours"
            ],
            correctAnswer: "7-9 hours"
          },
          {
            id: 5,
            questionText: "All educational institutions have implemented later start times.",
            correctAnswer: "False"
          },
          {
            id: 6,
            questionText: "Which of the following is NOT mentioned as a consequence of sleep deprivation?",
            options: [
              "Decreased attention span",
              "Impaired decision-making",
              "Increased appetite",
              "Reduced creative thinking"
            ],
            correctAnswer: "Increased appetite"
          }
        ]
      }
    ]
  },
  {
    id: 105,
    title: "The Digital Divide and Educational Inequality",
    content: `The digital divide refers to the gap between individuals and communities that have access to modern information and communication technologies and those that do not. This divide has become increasingly significant in the context of education, where digital literacy and access to technology are essential for academic success and future career prospects.

The COVID-19 pandemic highlighted the severity of the digital divide in education. When schools worldwide shifted to remote learning, millions of students found themselves unable to participate effectively due to lack of reliable internet access, appropriate devices, or digital skills. This situation disproportionately affected students from low-income families, rural communities, and marginalized groups, exacerbating existing educational inequalities.

Several factors contribute to the digital divide in education. Economic barriers are perhaps the most obvious, as many families cannot afford computers, tablets, or high-speed internet connections. Geographic location also plays a crucial role, with rural and remote areas often lacking adequate telecommunications infrastructure. Additionally, even when technology is available, differences in digital literacy skills among students, parents, and teachers can create barriers to effective use.

The consequences of the digital divide extend far beyond the classroom. Students without adequate access to technology may struggle to complete homework assignments, conduct research, or develop essential digital skills required in the modern workforce. This can lead to lower academic achievement, reduced college enrollment rates, and limited career opportunities, perpetuating cycles of poverty and inequality.

Governments and organizations worldwide have implemented various initiatives to address the digital divide. These include providing free or subsidized devices to students, expanding broadband infrastructure in underserved areas, and offering digital literacy training programs. Some countries have declared internet access a basic human right and have made significant investments in ensuring universal connectivity.

Educational institutions have also adapted their approaches to accommodate students with limited technology access. This includes providing printed materials as alternatives to digital resources, establishing computer labs with extended hours, and partnering with community organizations to create technology access points. However, these solutions often fall short of providing truly equitable access to digital learning opportunities.

The private sector has played an increasingly important role in bridging the digital divide. Technology companies have launched initiatives to provide affordable devices and internet access to underserved communities. Telecommunications companies have expanded their networks to reach remote areas, often with government incentives or requirements.

Despite these efforts, the digital divide remains a persistent challenge. As education becomes increasingly digitized and technology continues to evolve rapidly, ensuring equitable access to digital resources and skills becomes ever more critical for creating fair and inclusive educational systems.`,
    paragraphs: [
      { id: "P1", text: "The digital divide refers to gaps in access to ICT." },
      { id: "P2", text: "COVID-19 highlighted the severity of the digital divide in education." },
      { id: "P3", text: "Economic and geographic factors contribute to the divide." },
      { id: "P4", text: "Efforts exist but challenges remain; equitable access is critical." },
    ],
    level: "academic",
    estimatedTime: 20,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        title: 'Questions 1–6',
        instructions: 'Choose the correct answer.',
        questions: [
          {
            id: 1,
            questionText: "What does the term 'digital divide' refer to?",
            options: [
              "The difference between old and new technologies",
              "The gap between those with and without access to modern ICT",
              "The separation between online and offline learning",
              "The distinction between digital and analog devices"
            ],
            correctAnswer: "The gap between those with and without access to modern ICT"
          },
          {
            id: 2,
            questionText: "The COVID-19 pandemic reduced educational inequalities.",
            correctAnswer: "False"
          },
          {
            id: 3,
            questionText: "Which groups are mentioned as being disproportionately affected by the digital divide?",
            options: [
              "Urban students only",
              "High-income families",
              "Low-income families, rural communities, and marginalized groups",
              "Private school students"
            ],
            correctAnswer: "Low-income families, rural communities, and marginalized groups"
          },
          {
            id: 4,
            questionText: "Some countries have declared internet access a basic _______ right.",
            correctAnswer: "human"
          },
          {
            id: 5,
            questionText: "All technology companies have successfully eliminated the digital divide.",
            correctAnswer: "Not Given"
          },
          {
            id: 6,
            questionText: "According to the passage, what is one way educational institutions have adapted to help students with limited technology access?",
            options: [
              "Requiring all students to purchase devices",
              "Eliminating all digital learning",
              "Providing printed materials as alternatives",
              "Reducing homework assignments"
            ],
            correctAnswer: "Providing printed materials as alternatives"
          }
        ]
      }
    ]
  }
];

// Retrieves a random reading passage with questions.
export const getReadingPassage = api<void, ReadingPassage>(
  { expose: true, method: "GET", path: "/reading/passage" },
  async () => {
    const randomIndex = Math.floor(Math.random() * samplePassages.length);
    return samplePassages[randomIndex];
  }
);

// Submits reading answers for evaluation.
export const submitReading = api<ReadingSubmission, ReadingResult>(
  { expose: true, method: "POST", path: "/reading/submit" },
  async (req) => {
    let score = 0;
    const correctAnswers: Record<number, string> = {};
    const explanations: Record<number, string> = {};

    // Calculate score and prepare explanations
    req.questions.forEach(question => {
      // Ensure string correctAnswer for storage/compare
      const correct = Array.isArray((question as any).correctAnswer)
        ? (question as any).correctAnswer[0]
        : (question as any).correctAnswer;
      correctAnswers[question.id] = correct as string;
      const userAnswer = req.userAnswers[question.id];
      
      const providedExplanation = (question as any).explanation as string | undefined;

      if (userAnswer === correct) {
        score++;
        explanations[question.id] = providedExplanation || "Correct! Well done.";
      } else {
        explanations[question.id] = providedExplanation || `Incorrect. The correct answer is: ${correct}`;
      }
    });

    // Save session to database
    const session = await ieltsDB.queryRow<{ id: number }>`
      INSERT INTO reading_sessions 
      (user_id, passage_title, passage_content, questions, user_answers, correct_answers, 
       score, total_questions, time_taken)
      VALUES (${req.userId}, ${req.passageTitle}, ${req.passageContent}, 
              ${JSON.stringify(req.questions)}, ${JSON.stringify(req.userAnswers)}, 
              ${JSON.stringify(correctAnswers)}, ${score}, ${req.questions.length}, 
              ${req.timeTaken || null})
      RETURNING id
    `;

    if (!session) {
      throw new Error("Failed to save reading session");
    }

    return {
      id: session.id,
      score,
      totalQuestions: req.questions.length,
      correctAnswers,
      explanations,
    };
  }
);

// Retrieves user's reading session history.
export const getReadingSessions = api<{ userId: number }, { sessions: ReadingSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/reading/sessions" },
  async ({ userId }) => {
    const sessions = await ieltsDB.queryAll<ReadingSession>`
      SELECT id, passage_title as "passageTitle", score, total_questions as "totalQuestions",
             time_taken as "timeTaken", created_at as "createdAt"
      FROM reading_sessions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return { sessions };
  }
);

// Creates a new highlight for a reading passage.
export const createHighlight = api<CreateHighlightRequest, ReadingHighlight>(
  { expose: true, method: "POST", path: "/reading/highlights" },
  async (req) => {
    const highlight = await ieltsDB.queryRow<ReadingHighlight>`
      INSERT INTO reading_highlights 
      (user_id, passage_title, highlighted_text, start_position, end_position, highlight_type, highlight_color)
      VALUES (${req.userId}, ${req.passageTitle}, ${req.highlightedText}, 
              ${req.startPosition}, ${req.endPosition}, ${req.highlightType}, 
              ${req.highlightColor || 'yellow'})
      ON CONFLICT (user_id, passage_title, start_position, end_position)
      DO UPDATE SET 
        highlighted_text = ${req.highlightedText},
        highlight_type = ${req.highlightType},
        highlight_color = ${req.highlightColor || 'yellow'}
      RETURNING id, highlighted_text as "highlightedText", start_position as "startPosition",
                end_position as "endPosition", highlight_type as "highlightType",
                highlight_color as "highlightColor", created_at as "createdAt"
    `;

    if (!highlight) {
      throw new Error("Failed to create highlight");
    }

    return highlight;
  }
);

// Retrieves highlights for a specific passage and user.
export const getHighlights = api<{ userId: number; passageTitle: string }, { highlights: ReadingHighlight[] }>(
  { expose: true, method: "GET", path: "/users/:userId/reading/highlights/:passageTitle" },
  async ({ userId, passageTitle }) => {
    const highlights = await ieltsDB.queryAll<ReadingHighlight>`
      SELECT id, highlighted_text as "highlightedText", start_position as "startPosition",
             end_position as "endPosition", highlight_type as "highlightType",
             highlight_color as "highlightColor", created_at as "createdAt"
      FROM reading_highlights 
      WHERE user_id = ${userId} AND passage_title = ${passageTitle}
      ORDER BY start_position ASC
    `;

    return { highlights };
  }
);

// Deletes a highlight.
export const deleteHighlight = api<{ userId: number; highlightId: number }, void>(
  { expose: true, method: "DELETE", path: "/users/:userId/reading/highlights/delete/:highlightId" },
  async ({ userId, highlightId }) => {
    await ieltsDB.exec`
      DELETE FROM reading_highlights 
      WHERE id = ${highlightId} AND user_id = ${userId}
    `;
  }
);

// Translates text to the target language.
export const translateText = api<TranslationRequest, TranslationResponse>(
  { expose: true, method: "POST", path: "/reading/translate" },
  async (req) => {
    // Mock translation service - in a real app, this would call a translation API
    const translations: Record<string, Record<string, string>> = {
      "social media": {
        "uz": "ijtimoiy tarmoqlar",
        "ru": "социальные сети",
        "en": "social media"
      },
      "communication": {
        "uz": "aloqa",
        "ru": "общение",
        "en": "communication"
      },
      "technology": {
        "uz": "texnologiya",
        "ru": "технология",
        "en": "technology"
      },
      "platform": {
        "uz": "platforma",
        "ru": "платформа",
        "en": "platform"
      },
      "digital": {
        "uz": "raqamli",
        "ru": "цифровой",
        "en": "digital"
      },
      "revolution": {
        "uz": "inqilob",
        "ru": "революция",
        "en": "revolution"
      },
      "misinformation": {
        "uz": "noto'g'ri ma'lumot",
        "ru": "дезинформация",
        "en": "misinformation"
      },
      "isolation": {
        "uz": "izolyatsiya",
        "ru": "изоляция",
        "en": "isolation"
      },
      "depression": {
        "uz": "depressiya",
        "ru": "депрессия",
        "en": "depression"
      },
      "engagement": {
        "uz": "jalb qilish",
        "ru": "вовлечение",
        "en": "engagement"
      },
      "climate change": {
        "uz": "iqlim o'zgarishi",
        "ru": "изменение климата",
        "en": "climate change"
      },
      "renewable energy": {
        "uz": "qayta tiklanadigan energiya",
        "ru": "возобновляемая энергия",
        "en": "renewable energy"
      },
      "fossil fuels": {
        "uz": "qazilma yoqilg'i",
        "ru": "ископаемое топливо",
        "en": "fossil fuels"
      },
      "greenhouse gas": {
        "uz": "issiqxona gazi",
        "ru": "парниковый газ",
        "en": "greenhouse gas"
      },
      "solar power": {
        "uz": "quyosh energiyasi",
        "ru": "солнечная энергия",
        "en": "solar power"
      },
      "wind energy": {
        "uz": "shamol energiyasi",
        "ru": "ветровая энергия",
        "en": "wind energy"
      },
      "transportation": {
        "uz": "transport",
        "ru": "транспорт",
        "en": "transportation"
      },
      "urban": {
        "uz": "shahar",
        "ru": "городской",
        "en": "urban"
      },
      "sustainable": {
        "uz": "barqaror",
        "ru": "устойчивый",
        "en": "sustainable"
      },
      "infrastructure": {
        "uz": "infratuzilma",
        "ru": "инфраструктура",
        "en": "infrastructure"
      },
      "sleep": {
        "uz": "uyqu",
        "ru": "сон",
        "en": "sleep"
      },
      "memory": {
        "uz": "xotira",
        "ru": "память",
        "en": "memory"
      },
      "learning": {
        "uz": "o'rganish",
        "ru": "обучение",
        "en": "learning"
      },
      "education": {
        "uz": "ta'lim",
        "ru": "образование",
        "en": "education"
      },
      "digital divide": {
        "uz": "raqamli tafovut",
        "ru": "цифровое неравенство",
        "en": "digital divide"
      },
      "inequality": {
        "uz": "tengsizlik",
        "ru": "неравенство",
        "en": "inequality"
      },
      "access": {
        "uz": "kirish",
        "ru": "доступ",
        "en": "access"
      },
      "internet": {
        "uz": "internet",
        "ru": "интернет",
        "en": "internet"
      }
    };

    const lowerText = req.text.toLowerCase().trim();
    const translatedText = translations[lowerText]?.[req.targetLanguage] || `[Translation for "${req.text}" not available]`;

    // Mock definition and example
    const definition = `Definition of "${req.text}" - a comprehensive explanation would be provided here.`;
    const exampleSentence = `Example: "${req.text}" is commonly used in modern contexts.`;

    return {
      originalText: req.text,
      translatedText,
      targetLanguage: req.targetLanguage,
      definition,
      exampleSentence,
      audioUrl: `/audio/${req.text.toLowerCase().replace(/\s+/g, '-')}.mp3`
    };
  }
);

// Adds highlighted text to user's vocabulary.
export const addToVocabulary = api<AddToVocabularyRequest, { success: boolean; wordId: number }>(
  { expose: true, method: "POST", path: "/reading/add-to-vocabulary" },
  async (req) => {
    // First, check if the word already exists
    let word = await ieltsDB.queryRow<{ id: number }>`
      SELECT id FROM vocabulary_words WHERE LOWER(word) = LOWER(${req.text})
    `;

    let wordId: number;

    if (!word) {
      // Create new vocabulary word
      const newWord = await ieltsDB.queryRow<{ id: number }>`
        INSERT INTO vocabulary_words (word, definition, example_sentence, topic, difficulty_level)
        VALUES (${req.text}, ${req.definition}, ${req.exampleSentence}, ${req.topic || 'Reading'}, 2)
        RETURNING id
      `;
      
      if (!newWord) {
        throw new Error("Failed to create vocabulary word");
      }
      
      wordId = newWord.id;
    } else {
      wordId = word.id;
    }

    // Add translation
    await ieltsDB.exec`
      INSERT INTO vocabulary_translations (word_id, language, translation)
      VALUES (${wordId}, ${req.targetLanguage}, ${req.translation})
      ON CONFLICT (word_id, language)
      DO UPDATE SET translation = ${req.translation}
    `;

    // Add to user's vocabulary
    await ieltsDB.exec`
      INSERT INTO user_vocabulary (user_id, word_id, status)
      VALUES (${req.userId}, ${wordId}, 'learning')
      ON CONFLICT (user_id, word_id)
      DO NOTHING
    `;

    return { success: true, wordId };
  }
);

// API endpoint to create a new reading passage
export const createReadingPassage = api<ReadingPassage, { id: number }>(
  { expose: true, method: "POST", path: "/reading/passages" },
  async (passage) => {
    // In a real implementation, you would save to database
    // For now, we'll return a mock ID
    const id = Date.now();
    
    // TODO: Save to database
    // await ieltsDB.exec`INSERT INTO reading_passages ...`
    
    return { id };
  }
);

// API endpoint to get all reading passages
export const getReadingPassages = api<void, { passages: ReadingPassage[] }>(
  { expose: true, method: "GET", path: "/reading/passages" },
  async () => {
    // Mock data for now - replace with database query
    const passages: ReadingPassage[] = [
      {
        id: 1,
        title: "The Transformative Influence of Artificial Intelligence on the Global Labor Market",
        content: "Full passage content...",
        level: "academic",
        estimatedTime: 20,
        paragraphs: [
          {
            id: "A",
            text: "A. The advent of artificial intelligence (AI) has ushered in an era of unprecedented technological advancement, profoundly reshaping the landscape of employment worldwide. As algorithms capable of learning from data proliferate, the integration of AI into various industries promises enhanced efficiency and innovation, yet it simultaneously raises concerns about job displacement and the obsolescence of certain skill sets. Central to this discourse is the notion that while AI automates routine tasks, it also fosters the emergence of novel roles that demand human ingenuity and adaptability. This duality underscores the need for strategic workforce development to mitigate potential disruptions. According to a 2023 report by the World Economic Forum, an estimated 85 million jobs may be displaced by AI by 2025, contrasted by the creation of 97 million new positions, highlighting a net positive shift contingent upon proactive reskilling initiatives."
          },
          {
            id: "B", 
            text: "B. Historically, technological revolutions have mirrored similar patterns of upheaval and renewal, with the Industrial Revolution of the late 18th century serving as a poignant analogy. During that period, mechanization supplanted artisanal labor in textile manufacturing, leading to widespread unemployment among handloom weavers; however, it eventually spurred urbanization and the growth of factory-based economies, engendering diverse employment opportunities. In contemporary terms, AI's incursion into the manufacturing sector exemplifies this trajectory. A case study from the automotive industry illustrates how Ford Motor Company, in collaboration with AI firm Cognizant, implemented predictive maintenance systems in 2022. These systems, leveraging machine learning to forecast equipment failures, reduced downtime by 30 percent and augmented productivity, thereby necessitating fewer manual inspectors but elevating demand for data analysts and AI ethicists to oversee algorithmic fairness."
          },
          {
            id: "C",
            text: "Beyond manufacturing, the service sector faces equally transformative pressures from AI-driven automation. Customer service, once reliant on human agents for interpersonal interactions, now increasingly incorporates chatbots and virtual assistants that handle routine inquiries with remarkable speed and accuracy. A notable example is the deployment of IBM's Watson Assistant by JPMorgan Chase in 2021, which processed over 1.7 million client queries annually, achieving a 95 percent resolution rate without human intervention. This innovation not only curtails operational costs by an estimated 20 percent but also liberates employees to engage in higher-value tasks such as complex financial advising. Nevertheless, the transition has not been seamless; frontline workers, particularly in developing economies, report skill mismatches, prompting calls for inclusive training programs to bridge the digital divide."
          },
          {
            id: "D",
            text: "The broader implications of AI's rise extend to socioeconomic equity and policy formulation. As automation disproportionately affects low-skilled occupations, income inequality may exacerbate, with projections from Oxford University's 2019 study indicating that up to 47 percent of jobs in the United States are at high risk of automation. To counteract this, governments and corporations are exploring universal basic income pilots and lifelong learning subsidies. In Singapore, for instance, the SkillsFuture initiative, launched in 2015 and enhanced with AI-focused modules by 2024, has empowered over 500,000 workers to upskill, fostering a resilient labor market. Such interventions underscore the imperative for collaborative efforts to harness AI's potential while safeguarding employment stability."
          }
        ],
        questions: [
          {
            id: 1,
            type: "matching-headings",
            title: "Questions 1–4",
            instructions: "Choose the correct heading for paragraphs P1–P4 from the list of headings below. Write the correct number, i–vii, in boxes 1–4 on your answer sheet.",
            questions: [
              {
                id: 1,
                questionText: "Paragraph A",
                options: [
                  "AI's dual impact on employment",
                  "Historical parallels in manufacturing", 
                  "Automation transforming service roles",
                  "Policy measures against job inequality",
                  "AI advancements in medical diagnostics",
                  "Erosion of artistic professions",
                  "Worldwide standards for AI governance"
                ],
                correctAnswer: "AI's dual impact on employment"
              },
              {
                id: 2,
                questionText: "Paragraph B", 
                options: [
                  "AI's dual impact on employment",
                  "Historical parallels in manufacturing", 
                  "Automation transforming service roles",
                  "Policy measures against job inequality",
                  "AI advancements in medical diagnostics",
                  "Erosion of artistic professions",
                  "Worldwide standards for AI governance"
                ],
                correctAnswer: "Historical parallels in manufacturing"
              },
              {
                id: 3,
                questionText: "Paragraph C",
                options: [
                  "AI's dual impact on employment",
                  "Historical parallels in manufacturing", 
                  "Automation transforming service roles",
                  "Policy measures against job inequality",
                  "AI advancements in medical diagnostics",
                  "Erosion of artistic professions",
                  "Worldwide standards for AI governance"
                ],
                correctAnswer: "Automation transforming service roles"
              },
              {
                id: 4,
                questionText: "Paragraph D",
                options: [
                  "AI's dual impact on employment",
                  "Historical parallels in manufacturing", 
                  "Automation transforming service roles",
                  "Policy measures against job inequality",
                  "AI advancements in medical diagnostics",
                  "Erosion of artistic professions",
                  "Worldwide standards for AI governance"
                ],
                correctAnswer: "Policy measures against job inequality"
              }
            ]
          },
          {
            id: 2,
            type: "true-false-not-given",
            title: "Questions 5–9",
            instructions: "Do the following statements agree with the information in the Reading Passage? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
            questions: [
              {
                id: 5,
                questionText: "AI will lead to a net loss of jobs globally by 2025.",
                correctAnswer: "NO",
                explanation: "The passage states that 85 million jobs may be displaced but 97 million new positions will be created, resulting in a net positive shift."
              },
              {
                id: 6,
                questionText: "Technological revolutions always cause long-term unemployment.",
                correctAnswer: "NO",
                explanation: "The passage mentions that the Industrial Revolution eventually led to diverse employment opportunities despite initial unemployment."
              },
              {
                id: 7,
                questionText: "AI automation primarily benefits high-skilled workers.",
                correctAnswer: "NOT GIVEN",
                explanation: "The passage doesn't specifically state that AI primarily benefits high-skilled workers."
              },
              {
                id: 8,
                questionText: "Governments should implement universal basic income to address AI impacts.",
                correctAnswer: "NOT GIVEN", 
                explanation: "The passage mentions that governments are exploring UBI but doesn't state they should implement it."
              },
              {
                id: 9,
                questionText: "The SkillsFuture program has failed to upskill workers effectively.",
                correctAnswer: "NO",
                explanation: "The passage states that SkillsFuture has empowered over 500,000 workers to upskill."
              }
            ]
          },
          {
            id: 3,
            type: "gap-fill",
            title: "Questions 10–14", 
            instructions: "Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 10–14.",
            questions: [
              {
                id: 10,
                questionText: "AI raises concerns about job displacement and the obsolescence of certain ___ sets.",
                correctAnswer: "skill"
              },
              {
                id: 11,
                questionText: "Mechanization in textile manufacturing caused unemployment among ___ weavers.",
                correctAnswer: "handloom"
              },
              {
                id: 12,
                questionText: "Increased automation created a need for data ___ and AI ethicists.",
                correctAnswer: "analysts"
              },
              {
                id: 13,
                questionText: "Employees were freed to focus on tasks such as ___ financial advising.",
                correctAnswer: "complex"
              },
              {
                id: 14,
                questionText: "Automation may worsen income inequality, which could ___ according to Oxford projections.",
                correctAnswer: "exacerbate"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "The Printing Press: Revolutionizing the Dissemination of Knowledge",
        content: "Full passage content...",
        level: "academic",
        estimatedTime: 20,
        paragraphs: [
          {
            id: "P1",
            text: "The invention of the movable-type printing press in the mid-15th century marked a pivotal turning point in the history of human knowledge, fundamentally altering the mechanisms of information production and distribution. Prior to this innovation, the replication of texts relied predominantly on laborious manual copying by scribes, a process that was not only time-consuming but also prone to errors and limited in scale. Johannes Gutenberg's groundbreaking press, operational by approximately 1450 in Mainz, Germany, introduced an assembly-line approach utilizing reusable metal type, ink, and paper, thereby enabling the mass production of books at a fraction of the previous cost and time. This technological leap democratized access to written materials, shifting knowledge from the exclusive domain of ecclesiastical and aristocratic elites to a broader populace. A statistical milestone underscores this transformation: by the year 1500, European presses had produced an estimated 20 million volumes, compared to fewer than 100,000 manuscripts circulating in the preceding millennium, illustrating the exponential acceleration in textual output."
          },
          {
            id: "P2",
            text: "The ramifications of this invention extended profoundly into the realm of education and literacy, fostering an environment conducive to widespread intellectual awakening. In the decades following Gutenberg's debut, the proliferation of printed textbooks and scholarly treatises facilitated the standardization of curricula in burgeoning universities across Europe. A compelling case study emerges from the University of Paris, where, by the 1470s, the availability of affordable printed legal and theological texts reduced the dependency on rare handwritten codices, allowing students from modest backgrounds to engage with complex doctrines previously inaccessible. This democratization not only elevated literacy rates—rising from around 10 percent in the early 1400s to over 30 percent by the mid-16th century in urban centers—but also stimulated critical thinking and debate, as readers could now own and annotate personal copies. Such developments laid the groundwork for the Renaissance humanism movement, wherein the rediscovery of classical Greek and Roman works, disseminated through print, ignited a cultural renaissance emphasizing empirical inquiry over dogmatic adherence."
          },
          {
            id: "P3",
            text: "Beyond academia, the printing press exerted a transformative influence on scientific progress, accelerating the validation and dissemination of empirical findings. Prior to mechanized printing, scientific knowledge advanced sluggishly due to the scarcity of shared resources; however, the press enabled the rapid circulation of illustrated diagrams and experimental reports, fostering collaborative networks among scholars. Nicolaus Copernicus's seminal 1543 treatise, 'De revolutionibus orbium coelestium,' exemplifies this catalytic role: printed in Nuremberg by Johannes Petreius, it challenged the geocentric model of the universe, reaching astronomers and mathematicians across continents within months rather than generations. This swift propagation not only corroborated Copernicus's heliocentric theory through subsequent peer reviews but also inspired figures like Galileo Galilei, whose own printed defenses amplified the Scientific Revolution. Historians attribute a significant portion of the era's innovations—such as advancements in anatomy and navigation—to the press's capacity for visual and textual precision, which minimized interpretive discrepancies and promoted methodological rigor."
          },
          {
            id: "P4",
            text: "The socio-political dimensions of the printing press's impact were equally profound, as it empowered reformist voices and reshaped power dynamics in society. In the context of the Protestant Reformation, Martin Luther's Ninety-Five Theses, penned in 1517 and swiftly printed as pamphlets, circulated widely, igniting public discourse and challenging the Catholic Church's monopoly on religious interpretation. This case study reveals how print technology amplified dissenting opinions, with over 300,000 copies of Luther's works distributed by 1520, fueling a schism that fragmented Christendom and promoted vernacular translations of the Bible, thereby enhancing lay comprehension. Yet, this accessibility also precipitated challenges, including the spread of misinformation and censorship efforts by authorities wary of uncontrolled narratives. Ultimately, the press's legacy resides in its facilitation of ideological pluralism, which not only eroded feudal hierarchies but also sowed the seeds for modern concepts of individual agency and informed citizenship, influencing Enlightenment thinkers and the foundations of democratic governance."
          }
        ],
        questions: [
          {
            id: 1,
            type: "true-false-not-given",
            title: "Questions 1–7",
            instructions: "Do the following statements agree with the information in the Reading Passage? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say.",
            questions: [
              { id: 1, questionText: "Johannes Gutenberg's printing press was operational by approximately 1450 in Mainz, Germany.", correctAnswer: "YES" },
              { id: 2, questionText: "Prior to the printing press, scribes produced more than 100,000 manuscripts in Europe.", correctAnswer: "NO" },
              { id: 3, questionText: "By the year 1500, European presses had produced an estimated 20 million volumes.", correctAnswer: "YES" },
              { id: 4, questionText: "The printing press initially lowered literacy rates in rural areas.", correctAnswer: "NO" },
              { id: 5, questionText: "Nicolaus Copernicus's 1543 treatise was printed in Nuremberg.", correctAnswer: "YES" },
              { id: 6, questionText: "Martin Luther's Ninety-Five Theses were distributed as handwritten letters only.", correctAnswer: "NO" },
              { id: 7, questionText: "Galileo Galilei collaborated directly with Johannes Petreius on printing.", correctAnswer: "NOT GIVEN" }
            ]
          },
          {
            id: 2,
            type: "multiple-choice",
            title: "Questions 8–11",
            instructions: "Choose the correct option that best matches each prompt.",
            questions: [
              {
                id: 8,
                questionText: "Johannes Gutenberg",
                options: [
                  "Reduced dependency on rare handwritten codices by the 1470s",
                  "Challenged the geocentric model with a 1543 treatise",
                  "Invented the movable-type printing press around 1450",
                  "Distributed over 300,000 copies of works by 1520",
                  "Promoted empirical inquiry during the Renaissance",
                  "Authored defenses that amplified the Scientific Revolution"
                ],
                correctAnswer: "Invented the movable-type printing press around 1450"
              },
              {
                id: 9,
                questionText: "University of Paris",
                options: [
                  "Reduced dependency on rare handwritten codices by the 1470s",
                  "Challenged the geocentric model with a 1543 treatise",
                  "Invented the movable-type printing press around 1450",
                  "Distributed over 300,000 copies of works by 1520",
                  "Promoted empirical inquiry during the Renaissance",
                  "Authored defenses that amplified the Scientific Revolution"
                ],
                correctAnswer: "Reduced dependency on rare handwritten codices by the 1470s"
              },
              {
                id: 10,
                questionText: "Nicolaus Copernicus",
                options: [
                  "Reduced dependency on rare handwritten codices by the 1470s",
                  "Challenged the geocentric model with a 1543 treatise",
                  "Invented the movable-type printing press around 1450",
                  "Distributed over 300,000 copies of works by 1520",
                  "Promoted empirical inquiry during the Renaissance",
                  "Authored defenses that amplified the Scientific Revolution"
                ],
                correctAnswer: "Challenged the geocentric model with a 1543 treatise"
              },
              {
                id: 11,
                questionText: "Martin Luther",
                options: [
                  "Reduced dependency on rare handwritten codices by the 1470s",
                  "Challenged the geocentric model with a 1543 treatise",
                  "Invented the movable-type printing press around 1450",
                  "Distributed over 300,000 copies of works by 1520",
                  "Promoted empirical inquiry during the Renaissance",
                  "Authored defenses that amplified the Scientific Revolution"
                ],
                correctAnswer: "Distributed over 300,000 copies of works by 1520"
              }
            ]
          },
          {
            id: 3,
            type: "gap-fill",
            title: "Questions 12–17",
            instructions: "Answer the questions briefly.",
            questions: [
              { id: 12, questionText: "Where was Johannes Gutenberg's printing press operational?", correctAnswer: "Mainz, Germany" },
              { id: 13, questionText: "How many volumes had European presses produced by 1500?", correctAnswer: "20 million" },
              { id: 14, questionText: "In which decade did the University of Paris reduce dependency on handwritten codices?", correctAnswer: "1470s" },
              { id: 15, questionText: "What was the literacy rate in the early 1400s?", correctAnswer: "10 percent" },
              { id: 16, questionText: "In what year was Copernicus's treatise published?", correctAnswer: "1543" },
              { id: 17, questionText: "When were Martin Luther's Ninety-Five Theses written?", correctAnswer: "1517" }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "Mars Colonization: Overcoming the Barriers to Human Settlement",
        content: "Full passage content...",
        level: "academic",
        estimatedTime: 20,
        paragraphs: [
          {
            id: "P1",
            text: "The prospect of establishing permanent human settlements on Mars has captivated scientists and policymakers for decades, yet the technical and physiological obstacles remain formidable. Unlike the Apollo missions to the Moon, which required only short-term survival in hostile environments, Martian colonization demands sustainable life-support systems capable of functioning independently for years. The Red Planet's atmospheric composition, consisting of 95% carbon dioxide with negligible oxygen, necessitates sophisticated terraforming technologies or enclosed habitation modules. According to the International Mars Research Consortium's 2019 feasibility study, the estimated cost of transporting essential materials to Mars exceeds $2.4 billion per metric ton, making self-sufficiency a critical prerequisite for any viable colony. This economic reality underscores the imperative for developing in-situ resource utilization techniques that can harness Martian materials for construction, fuel production, and sustenance."
          },
          {
            id: "P2",
            text: "The physiological challenges confronting prospective Martian colonists are equally daunting, with prolonged exposure to reduced gravity and cosmic radiation posing significant health risks. Mars' gravitational force is approximately 38% of Earth's, leading to rapid bone density loss and muscle atrophy in human subjects. Dr. Elena Vasquez's longitudinal study at the European Space Medicine Institute, conducted between 2020 and 2023, documented a 12% decrease in bone mass among astronauts after just six months in simulated Martian gravity conditions. Furthermore, the planet's thin atmosphere provides minimal protection against galactic cosmic rays, exposing inhabitants to radiation levels 100 times higher than those experienced on Earth. These findings suggest that effective countermeasures, including artificial gravity generation and radiation shielding, are indispensable for maintaining colonist health over extended periods."
          },
          {
            id: "P3",
            text: "Technological innovations in life support systems represent another critical frontier in Mars colonization efforts, with closed-loop ecological systems emerging as a promising solution. The Mars Habitat Simulation Project, initiated by the Planetary Settlement Foundation in 2021, successfully demonstrated a self-sustaining ecosystem capable of supporting four individuals for 18 months. This breakthrough utilized advanced hydroponic cultivation methods and atmospheric recycling technologies to achieve 94% resource efficiency. However, the psychological implications of prolonged isolation in confined spaces remain inadequately understood. Preliminary observations from the simulation revealed elevated stress hormones and interpersonal conflicts among participants after the 12-month mark, highlighting the need for comprehensive mental health support systems."
          },
          {
            id: "P4",
            text: "The logistical complexities of establishing supply chains between Earth and Mars present additional obstacles that must be addressed through innovative transportation solutions. Current propulsion technologies require approximately nine months for interplanetary transit, creating narrow launch windows that occur only every 26 months due to orbital mechanics. The Aerospace Engineering Collaborative's 2022 analysis projected that nuclear thermal propulsion could reduce travel time to four months while increasing payload capacity by 40%. Nevertheless, the development and testing of such advanced propulsion systems demand substantial financial investment and international cooperation. Historical precedents, such as the International Space Station partnership established in 1998, demonstrate that collaborative frameworks can overcome technical and political barriers to ambitious space ventures."
          },
          {
            id: "P5",
            text: "Despite these multifaceted challenges, recent technological advances and growing international interest suggest that Mars colonization may transition from science fiction to reality within the next three decades. The successful deployment of autonomous rovers and the extraction of oxygen from Martian atmosphere by NASA's Perseverance mission in 2021 marked significant milestones in demonstrating the feasibility of resource utilization. Moreover, private sector involvement, exemplified by companies investing in reusable launch vehicles and habitat construction technologies, has accelerated innovation timelines. The convergence of these developments indicates that while the path to Mars colonization remains arduous, the fundamental barriers are gradually yielding to human ingenuity and determination. Success will ultimately depend on sustained commitment to addressing the interconnected challenges of transportation, life support, human health, and international cooperation."
          }
        ],
        questions: [
          {
            id: 1,
            type: "multiple-choice",
            title: "Questions 1–5",
            instructions: "Choose the correct letter, A, B, C or D.",
            questions: [
              {
                id: 1,
                questionText: "According to the passage, what makes Mars colonization economically challenging compared to lunar missions?",
                options: [
                  "The enormous expense of shipping materials to Mars",
                  "The lack of international funding partnerships",
                  "The failure of previous robotic missions",
                  "The absence of valuable minerals on Mars"
                ],
                correctAnswer: "The enormous expense of shipping materials to Mars"
              },
              {
                id: 2,
                questionText: "What can be inferred about the health effects of Mars' gravitational conditions on human colonists?",
                options: [
                  "They would be immediately life-threatening",
                  "They would require ongoing medical intervention",
                  "They would only affect elderly colonists",
                  "They would improve cardiovascular fitness"
                ],
                correctAnswer: "They would require ongoing medical intervention"
              },
              {
                id: 3,
                questionText: "The primary focus of the passage is to:",
                options: [
                  "Advocate for increased government funding of Mars missions",
                  "Compare Mars colonization with lunar exploration programs",
                  "Examine the major obstacles facing Mars settlement efforts",
                  "Describe the timeline for establishing Mars colonies"
                ],
                correctAnswer: "Examine the major obstacles facing Mars settlement efforts"
              },
              {
                id: 4,
                questionText: "Based on information from multiple paragraphs, what appears to be the most critical factor for successful Mars colonization?",
                options: [
                  "Developing faster spacecraft propulsion systems",
                  "Achieving complete resource independence from Earth",
                  "Recruiting psychologically stable colonists",
                  "Establishing communication networks with Earth"
                ],
                correctAnswer: "Achieving complete resource independence from Earth"
              },
              {
                id: 5,
                questionText: "In the context of the passage, what does 'formidable' most likely mean?",
                options: [
                  "Impressive and admirable",
                  "Extremely difficult to overcome",
                  "Requiring advanced technology",
                  "Previously unsolved by scientists"
                ],
                correctAnswer: "Extremely difficult to overcome"
              }
            ]
          },
          {
            id: 2,
            type: "gap-fill",
            title: "Questions 6–9",
            instructions: "Complete the sentences below. Choose NO MORE THAN THREE WORDS from the passage for each answer.",
            questions: [
              { id: 6, questionText: "The Martian atmosphere is composed of 95% carbon dioxide and contains almost no ___________.", correctAnswer: "oxygen" },
              { id: 7, questionText: "According to the International Mars Research Consortium's feasibility study, transporting materials to Mars costs more than ___________ per metric ton.", correctAnswer: "$2.4 billion" },
              { id: 8, questionText: "Dr. Elena Vasquez's study found that astronauts experienced a 12% reduction in ___________ after six months in simulated Martian gravity.", correctAnswer: "bone mass" },
              { id: 9, questionText: "The Aerospace Engineering Collaborative's analysis suggested that ___________ could decrease Mars travel time to four months.", correctAnswer: "nuclear thermal propulsion" }
            ]
          }
        ]
      }
    ];
    
    return { passages };
  }
);

// API endpoint to get a specific reading passage by ID
export const getReadingPassageById = api<{ id: number }, ReadingPassage>(
  { expose: true, method: "GET", path: "/reading/passages/:id" },
  async ({ id }) => {
    // Mock implementation - replace with database query
    const passages = await getReadingPassages();
    const passage = passages.passages.find(p => p.id === id);
    
    if (!passage) {
      throw new Error("Passage not found");
    }
    
    return passage;
  }
);
