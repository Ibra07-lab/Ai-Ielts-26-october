import { api } from "encore.dev/api";
import { ieltsDB } from "./db";

export interface ReadingPassage {
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface ReadingQuestion {
  id: number;
  type: string; // 'multiple-choice', 'true-false-not-given', 'matching', 'fill-in-blank'
  question: string;
  options?: string[];
  correctAnswer: string;
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
    title: "The Impact of Social Media on Modern Communication",
    content: `Social media has fundamentally transformed the way people communicate in the 21st century. Platforms like Facebook, Twitter, and Instagram have created new forms of interaction that were unimaginable just two decades ago. These platforms have enabled instant global communication, allowing people to connect across vast distances in real-time.

However, this digital revolution has also brought challenges. Critics argue that social media has led to a decline in face-to-face communication skills and has contributed to the spread of misinformation. Studies have shown that excessive use of social media can lead to feelings of isolation and depression, particularly among young people.

Despite these concerns, social media continues to play an increasingly important role in business, education, and social movements. Companies use these platforms for marketing and customer service, while educators leverage them for distance learning and student engagement. Social movements have also found social media to be a powerful tool for organizing and raising awareness about important issues.

The future of social media remains uncertain, but its impact on human communication is undeniable. As technology continues to evolve, society must find ways to harness the benefits of these platforms while mitigating their potential negative effects.`,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "According to the passage, social media has:",
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
        type: "true-false-not-given",
        question: "Social media platforms were widely used 30 years ago.",
        correctAnswer: "False"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which of the following is NOT mentioned as a use of social media?",
        options: [
          "Marketing",
          "Education",
          "Medical diagnosis",
          "Social movements"
        ],
        correctAnswer: "Medical diagnosis"
      }
    ]
  },
  {
    title: "Climate Change and Renewable Energy Solutions",
    content: `Climate change represents one of the most pressing challenges of our time, with global temperatures rising at an unprecedented rate due to human activities. The burning of fossil fuels for energy production has been identified as the primary contributor to greenhouse gas emissions, which trap heat in the Earth's atmosphere and lead to global warming.

In response to this crisis, governments and organizations worldwide have been investing heavily in renewable energy technologies. Solar power has emerged as one of the most promising alternatives, with the cost of solar panels decreasing dramatically over the past decade. Wind energy has also shown remarkable growth, particularly in coastal regions where wind patterns are most favorable.

Hydroelectric power, while not a new technology, continues to play a significant role in many countries' energy portfolios. However, the construction of large dams can have substantial environmental impacts, including the displacement of local communities and disruption of river ecosystems. This has led to increased interest in smaller-scale hydroelectric projects that minimize environmental damage.

Energy storage remains a critical challenge for renewable energy adoption. Unlike fossil fuel power plants, which can generate electricity on demand, renewable sources are dependent on weather conditions. Battery technology has improved significantly, but large-scale energy storage solutions are still expensive and limited in capacity.

The transition to renewable energy is not just an environmental imperative but also an economic opportunity. The renewable energy sector has created millions of jobs worldwide and has the potential to drive economic growth while reducing carbon emissions. However, this transition requires substantial investment in infrastructure and technology, as well as supportive government policies.`,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What is identified as the primary cause of greenhouse gas emissions?",
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
        type: "true-false-not-given",
        question: "Solar panel costs have increased over the past decade.",
        correctAnswer: "False"
      },
      {
        id: 3,
        type: "fill-in-blank",
        question: "Large dams can cause the _______ of local communities.",
        correctAnswer: "displacement"
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "According to the passage, what is a major challenge for renewable energy?",
        options: [
          "High installation costs",
          "Energy storage",
          "Government regulations",
          "Public acceptance"
        ],
        correctAnswer: "Energy storage"
      }
    ]
  },
  {
    title: "The Evolution of Urban Transportation",
    content: `Urban transportation systems have undergone dramatic changes throughout history, evolving from horse-drawn carriages to modern electric vehicles. The industrial revolution of the 19th century marked a turning point, introducing steam-powered trains and later, internal combustion engines that would dominate transportation for over a century.

The rise of the automobile in the early 20th century fundamentally reshaped urban landscapes. Cities expanded outward as people could live farther from their workplaces, leading to the development of suburban communities. However, this car-centric approach to urban planning has created numerous challenges, including traffic congestion, air pollution, and social inequality in access to transportation.

Public transportation systems have played a crucial role in addressing these challenges. Cities like London, New York, and Tokyo developed extensive subway networks that could move large numbers of people efficiently. Bus rapid transit systems have also gained popularity in developing countries as a cost-effective alternative to rail-based systems.

In recent years, there has been a growing emphasis on sustainable transportation solutions. Electric buses and trains are becoming more common, while bike-sharing programs have been implemented in cities worldwide. The concept of "complete streets" – designed to accommodate pedestrians, cyclists, public transit, and vehicles – is gaining traction among urban planners.

The emergence of ride-sharing services and autonomous vehicles promises to further transform urban transportation. These technologies could potentially reduce the need for private car ownership while improving accessibility for elderly and disabled populations. However, concerns remain about their impact on public transportation systems and employment in the transportation sector.

Looking ahead, the integration of various transportation modes through digital platforms and smart city technologies will likely define the future of urban mobility. The goal is to create seamless, efficient, and environmentally sustainable transportation networks that serve all members of society.`,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What marked a turning point in urban transportation history?",
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
        type: "true-false-not-given",
        question: "Car-centric urban planning has only had positive effects on cities.",
        correctAnswer: "False"
      },
      {
        id: 3,
        type: "fill-in-blank",
        question: "Bus rapid transit systems are popular in developing countries as a _______ alternative to rail systems.",
        correctAnswer: "cost-effective"
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "What does the concept of 'complete streets' aim to accommodate?",
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
        type: "true-false-not-given",
        question: "Autonomous vehicles will definitely replace all public transportation.",
        correctAnswer: "Not Given"
      }
    ]
  },
  {
    title: "The Science of Sleep and Its Impact on Learning",
    content: `Sleep is a fundamental biological process that plays a crucial role in human health and cognitive function. Despite spending approximately one-third of our lives asleep, the mechanisms and purposes of sleep remained largely mysterious until recent decades. Modern neuroscience has revealed that sleep is far from a passive state; instead, it is an active period during which the brain performs essential maintenance and consolidation activities.

One of the most significant discoveries in sleep research is the role of sleep in memory consolidation. During sleep, particularly during the deep sleep stages, the brain processes and organizes information acquired during waking hours. This process involves the transfer of memories from temporary storage in the hippocampus to more permanent storage in the cortex. Studies have consistently shown that people who get adequate sleep after learning new information perform significantly better on memory tests than those who are sleep-deprived.

The sleep cycle consists of several distinct stages, each serving different functions. Rapid Eye Movement (REM) sleep, characterized by vivid dreams, is particularly important for emotional processing and creative problem-solving. Non-REM sleep, which includes deep sleep stages, is crucial for physical restoration and memory consolidation. A complete sleep cycle typically lasts 90-120 minutes, and healthy adults usually experience 4-6 cycles per night.

Sleep deprivation has become increasingly common in modern society, with serious consequences for learning and academic performance. Students who consistently get less than the recommended 7-9 hours of sleep show decreased attention span, impaired decision-making abilities, and reduced capacity for creative thinking. Chronic sleep deprivation can also weaken the immune system and increase the risk of various health problems.

Educational institutions are beginning to recognize the importance of sleep for student success. Some schools have implemented later start times to align with adolescents' natural sleep patterns, while others have introduced sleep education programs. Research suggests that these interventions can lead to improved academic performance and better overall student well-being.

The relationship between sleep and learning extends beyond formal education. Professional development, skill acquisition, and even language learning are all enhanced by adequate sleep. As our understanding of sleep science continues to evolve, it becomes increasingly clear that prioritizing sleep is not a luxury but a necessity for optimal cognitive function and lifelong learning.`,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "According to the passage, what happens to memories during deep sleep?",
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
        type: "true-false-not-given",
        question: "REM sleep is characterized by the absence of dreams.",
        correctAnswer: "False"
      },
      {
        id: 3,
        type: "fill-in-blank",
        question: "A complete sleep cycle typically lasts _______ minutes.",
        correctAnswer: "90-120"
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "What is the recommended amount of sleep for healthy adults?",
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
        type: "true-false-not-given",
        question: "All educational institutions have implemented later start times.",
        correctAnswer: "False"
      },
      {
        id: 6,
        type: "multiple-choice",
        question: "Which of the following is NOT mentioned as a consequence of sleep deprivation?",
        options: [
          "Decreased attention span",
          "Impaired decision-making",
          "Increased appetite",
          "Reduced creative thinking"
        ],
        correctAnswer: "Increased appetite"
      }
    ]
  },
  {
    title: "The Digital Divide and Educational Inequality",
    content: `The digital divide refers to the gap between individuals and communities that have access to modern information and communication technologies and those that do not. This divide has become increasingly significant in the context of education, where digital literacy and access to technology are essential for academic success and future career prospects.

The COVID-19 pandemic highlighted the severity of the digital divide in education. When schools worldwide shifted to remote learning, millions of students found themselves unable to participate effectively due to lack of reliable internet access, appropriate devices, or digital skills. This situation disproportionately affected students from low-income families, rural communities, and marginalized groups, exacerbating existing educational inequalities.

Several factors contribute to the digital divide in education. Economic barriers are perhaps the most obvious, as many families cannot afford computers, tablets, or high-speed internet connections. Geographic location also plays a crucial role, with rural and remote areas often lacking adequate telecommunications infrastructure. Additionally, even when technology is available, differences in digital literacy skills among students, parents, and teachers can create barriers to effective use.

The consequences of the digital divide extend far beyond the classroom. Students without adequate access to technology may struggle to complete homework assignments, conduct research, or develop essential digital skills required in the modern workforce. This can lead to lower academic achievement, reduced college enrollment rates, and limited career opportunities, perpetuating cycles of poverty and inequality.

Governments and organizations worldwide have implemented various initiatives to address the digital divide. These include providing free or subsidized devices to students, expanding broadband infrastructure in underserved areas, and offering digital literacy training programs. Some countries have declared internet access a basic human right and have made significant investments in ensuring universal connectivity.

Educational institutions have also adapted their approaches to accommodate students with limited technology access. This includes providing printed materials as alternatives to digital resources, establishing computer labs with extended hours, and partnering with community organizations to create technology access points. However, these solutions often fall short of providing truly equitable access to digital learning opportunities.

The private sector has played an increasingly important role in bridging the digital divide. Technology companies have launched initiatives to provide affordable devices and internet access to underserved communities. Telecommunications companies have expanded their networks to reach remote areas, often with government incentives or requirements.

Despite these efforts, the digital divide remains a persistent challenge. As education becomes increasingly digitized and technology continues to evolve rapidly, ensuring equitable access to digital resources and skills becomes ever more critical for creating fair and inclusive educational systems.`,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What does the term 'digital divide' refer to?",
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
        type: "true-false-not-given",
        question: "The COVID-19 pandemic reduced educational inequalities.",
        correctAnswer: "False"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which groups are mentioned as being disproportionately affected by the digital divide?",
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
        type: "fill-in-blank",
        question: "Some countries have declared internet access a basic _______ right.",
        correctAnswer: "human"
      },
      {
        id: 5,
        type: "true-false-not-given",
        question: "All technology companies have successfully eliminated the digital divide.",
        correctAnswer: "Not Given"
      },
      {
        id: 6,
        type: "multiple-choice",
        question: "According to the passage, what is one way educational institutions have adapted to help students with limited technology access?",
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
      correctAnswers[question.id] = question.correctAnswer;
      const userAnswer = req.userAnswers[question.id];
      
      if (userAnswer === question.correctAnswer) {
        score++;
        explanations[question.id] = "Correct! Well done.";
      } else {
        explanations[question.id] = `Incorrect. The correct answer is: ${question.correctAnswer}`;
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
  { expose: true, method: "DELETE", path: "/users/:userId/reading/highlights/:highlightId" },
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
