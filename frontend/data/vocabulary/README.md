# Vocabulary Data Management

This directory contains all vocabulary words and exercises organized by topic.

## 📁 File Structure

```
frontend/data/vocabulary/
├── types.ts          # TypeScript type definitions
├── index.ts          # Main export file
├── business.ts       # Business & Work vocabulary
├── environment.ts    # Environment vocabulary
└── [your-topic].ts   # Add new topic files here
```

## ✨ How to Add a New Topic

### Step 1: Create a New Topic File

Create a new file like `technology.ts` in this directory.

### Step 2: Copy the Template

```typescript
import { TopicData } from "./types";

export const technologyTopicData: TopicData = {
    topic: {
        id: 3,  // Use a unique number
        name: "Technology",
        icon: "💻",  // Choose an emoji icon
        description: "Technology and innovation vocabulary",
        wordsCount: 5,  // Update based on actual words
        color: "bg-purple-500",  // Choose a color
    },

    words: [
        {
            id: 11,  // Must be unique across ALL topics
            word: "innovative",
            definition: "Introducing new ideas; original and creative",
            exampleSentence: "The company is known for its innovative approach to problem-solving.",
            difficultyLevel: 7,
            topic: "Technology",
            partOfSpeech: "adjective",
            context: "Great for Writing Task 2 (Technology essays)",
            collocations: ["Innovative solution", "Innovative approach", "Highly innovative"],
            synonyms: [
                { word: "New", level: "Basic" },
                { word: "Creative", level: "Better" },
                { word: "Innovative", level: "Band 9" }
            ]
        },
        // Add more words here
    ],

    exercises: {
        synonymSwap: [
            {
                sentence: "This is a new idea that will change the industry.",
                targetWord: "new",
                options: [
                    { id: "1", text: "innovative", isCorrect: true, feedback: "Perfect!" },
                    { id: "2", text: "different", isCorrect: false, feedback: "Too simple." },
                    { id: "3", text: "fresh", isCorrect: false, feedback: "Not academic enough." }
                ]
            }
        ],
        contextTetris: [
            // Add Context Tetris exercises
```        ],
        speakToUnlock: [
            {
                question: "How has technology changed our lives?",
                targetWords: ["innovative", "transform", "revolutionize"]
            }
        ]
    }
};
```

### Step 3: Register Your Topic

1. Open `index.ts`
2. Import your topic:
   ```typescript
   import { technologyTopicData } from "./technology";
   ```
3. Add it to the `allTopics` array:
   ```typescript
   export const allTopics: TopicData[] = [
       businessTopicData,
       environmentTopicData,
       technologyTopicData,  // Add your new topic here
   ];
   ```

### Step 4: Test!

Your new topic will automatically appear in the Vocabulary Builder!

## 📝 How to Add Words to an Existing Topic

1. Open the topic file (e.g., `business.ts`)
2. Add a new object to the `words` array
3. Make sure the `id` is unique
4. Update the `wordsCount` in the topic metadata

## 💡 Tips

- **Word IDs**: Must be unique across ALL topics
- **Topic IDs**: Must be unique (1, 2, 3, etc.)
- **Icons**: Use emojis for best display
- **Colors**: Choose from: `bg-blue-500`, `bg-green-500`, `bg-purple-500`, `bg-red-500`, `bg-yellow-500`, `bg-pink-500`, `bg-indigo-500`, `bg-lime-500`

## 🎮 Exercise Types

### Synonym Swap
Replace a basic word with an academic synonym.

### Context Tetris
Fill in gaps with appropriate words.

### Speak to Unlock
Use target words in spoken responses.

## 📚 Example Topics You Could Add

- Health & Fitness
- Education
- Culture & Society
- Science & Research
- Travel & Tourism
- Media & Entertainment
- Sports & Recreation

---

Need help? Check the existing `business.ts` and `environment.ts` files for complete examples!
