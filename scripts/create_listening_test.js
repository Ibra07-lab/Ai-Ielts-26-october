import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../backend/data/listening-tests');
const publicAudioDir = path.join(__dirname, '../frontend/public/audio');

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
    console.error(`Error: Data directory not found at ${dataDir}`);
    process.exit(1);
}

if (!fs.existsSync(publicAudioDir)) {
    console.log(`Creating audio directory at ${publicAudioDir}...`);
    fs.mkdirSync(publicAudioDir, { recursive: true });
}

// Find next ID
const files = fs.readdirSync(dataDir).filter(f => f.match(/^test-\d+\.json$/));
let maxId = 0;
files.forEach(file => {
    const match = file.match(/^test-(\d+)\.json$/);
    if (match) {
        const id = parseInt(match[1], 10);
        if (id > maxId) maxId = id;
    }
});

const newId = maxId + 1;
const newFileName = `test-${newId}.json`;
const newFilePath = path.join(dataDir, newFileName);

const template = {
    "id": newId,
    "title": `Practice Test ${newId}`,
    "section": 1,
    "difficulty": "medium",
    "audioFile": `/audio/test-${newId}.mp3`,
    "duration": 300,
    "instructions": "Listen to the audio and answer the questions.",
    "transcript": [
        {
            "speaker": "Speaker 1",
            "timestamp": "00:00",
            "text": "Transcript goes here..."
        }
    ],
    "questions": [
        {
            "id": 1,
            "type": "multiple-choice",
            "questionNumber": 1,
            "question": "Sample Question?",
            "options": ["Option A", "Option B", "Option C"],
            "correctAnswer": "Option A",
            "explanation": "Explanation for the answer."
        }
    ]
};

fs.writeFileSync(newFilePath, JSON.stringify(template, null, 4));

console.log(`\n✅ Created new test file: ${newFileName}`);
console.log(`📂 Location: ${newFilePath}`);
console.log(`\nNext Steps:`);
console.log(`1. Place your audio file in: frontend/public/audio/`);
console.log(`   (Recommended name: test-${newId}.mp3)`);
console.log(`2. Open the JSON file and update:`);
console.log(`   - "audioFile": Name of your mp3 file`);
console.log(`   - "questions": Add your questions`);
console.log(`   - "transcript": Add the transcript`);
