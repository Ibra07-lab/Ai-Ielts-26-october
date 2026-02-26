import { TopicData } from "./types";

export const educationTopicData: TopicData = {
    topic: {
        id: 3,
        name: "Education",
        icon: "🎓",
        description: "Comprehensive vocabulary for Education topic, covering both Speaking and Writing.",
        wordsCount: 60,
        color: "bg-purple-500",
        ieltsSection: "speaking",
        status: "new",
        previewWords: ["pick up", "curriculum", "broaden horizons"],
        progress: 0,
    },
    words: [
        // ==========================================
        // BAND 6-8+ SPEAKING VOCABULARY (IDs 1-30)
        // ==========================================

        // Band 6 (Foundation Level) -> Difficulty 2
        {
            id: 1,
            word: "pick up",
            pronunciation: "/pɪk ʌp/",
            definition: "To learn something naturally without formal study.",
            exampleSentence: "I picked up my English skills mainly by watching movies and TV shows.",
            speakingExample: "I picked up my English skills mainly by watching movies and TV shows.",
            difficultyLevel: 2,
            partOfSpeech: "phrasal verb",
            topic: "Education",
            type: "phrasal_verb",
            collocations: ["pick up a skill", "pick up a language", "pick up knowledge", "quickly pick up"],
            synonyms: [
                { word: "acquire", level: "B2" },
                { word: "grasp", level: "C1" },
                { word: "master", level: "B2" }
            ],
            antonyms: ["struggle with", "forget"]
        },
        {
            id: 2,
            word: "fall behind",
            pronunciation: "/fɔːl bɪˈhaɪnd/",
            definition: "To progress slower than others.",
            exampleSentence: "I fell behind in math class when I missed two weeks of school.",
            speakingExample: "I fell behind in math class when I missed two weeks of school.",
            difficultyLevel: 2,
            partOfSpeech: "phrasal verb",
            topic: "Education",
            type: "phrasal_verb",
            collocations: ["fall behind in class", "fall behind with studies", "fall behind schedule"],
            synonyms: [
                { word: "lag behind", level: "C1" },
                { word: "trail", level: "C2" }
            ],
            antonyms: ["keep up", "catch up", "get ahead"]
        },
        {
            id: 3,
            word: "cram",
            pronunciation: "/kræm/",
            definition: "To study intensively in a short period of time before an exam.",
            exampleSentence: "Most students cram for exams the night before instead of studying regularly.",
            speakingExample: "Most students cram for exams the night before instead of studying regularly.",
            difficultyLevel: 2,
            partOfSpeech: "verb",
            topic: "Education",
            type: "academic",
            collocations: ["cram for an exam", "cram all night", "cramming session"],
            synonyms: [
                { word: "study intensively", level: "B2" },
                { word: "swot up", level: "C2" }
            ],
            antonyms: ["study consistently", "revise gradually"]
        },
        {
            id: 4,
            word: "drop out",
            pronunciation: "/drɒp aʊt/",
            definition: "To leave school or university before finishing the course.",
            exampleSentence: "Some students drop out of university because they cannot afford the tuition fees.",
            speakingExample: "Some students drop out of university because they cannot afford the tuition fees.",
            difficultyLevel: 2,
            partOfSpeech: "phrasal verb",
            topic: "Education",
            type: "phrasal_verb",
            collocations: ["drop out of school", "drop out of university", "high dropout rate"],
            synonyms: [
                { word: "leave", level: "A1" },
                { word: "withdraw", level: "B2" },
                { word: "quit", level: "B1" }
            ],
            antonyms: ["graduate", "complete", "finish"]
        },
        {
            id: 5,
            word: "hands-on learning",
            pronunciation: "/ˌhændzˈɒn ˈlɜːrnɪŋ/",
            definition: "Learning by doing practical skills and physical activities.",
            exampleSentence: "I prefer hands-on learning because I remember things better when I actually do them.",
            speakingExample: "I prefer hands-on learning because I remember things better when I actually do them.",
            difficultyLevel: 2,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["hands-on learning experience", "hands-on learning approach", "prefer hands-on learning"],
            synonyms: [
                { word: "practical learning", level: "B2" },
                { word: "experiential learning", level: "C2" }
            ],
            antonyms: ["theoretical learning", "book learning"]
        },
        {
            id: 6,
            word: "struggle with",
            pronunciation: "/ˈstrʌɡəl wɪð/",
            definition: "To find something very difficult.",
            exampleSentence: "A lot of students struggle with math because they find it too abstract.",
            speakingExample: "A lot of students struggle with math because they find it too abstract.",
            difficultyLevel: 2,
            partOfSpeech: "verb",
            topic: "Education",
            type: "academic",
            collocations: ["struggle with a subject", "struggle with exams", "struggle to understand"],
            synonyms: [
                { word: "find difficult", level: "A2" },
                { word: "have trouble with", level: "B1" },
                { word: "battle", level: "C1" }
            ],
            antonyms: ["excel in", "find easy", "breeze through"]
        },
        {
            id: 7,
            word: "bring out the best",
            pronunciation: "/brɪŋ aʊt ðə best/",
            definition: "To encourage someone to show their best qualities.",
            exampleSentence: "A good teacher can really bring out the best in students who lack confidence.",
            speakingExample: "A good teacher can really bring out the best in students who lack confidence.",
            difficultyLevel: 2,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["bring out the best in students", "bring out the best in children", "help bring out the best"],
            synonyms: [
                { word: "encourage", level: "B1" },
                { word: "inspire", level: "B2" },
                { word: "motivate", level: "B2" }
            ],
            antonyms: ["discourage", "stifle"]
        },
        {
            id: 8,
            word: "keep up with",
            pronunciation: "/kiːp ʌp wɪð/",
            definition: "To maintain the same level or pace as others.",
            exampleSentence: "Online learning made it hard for some students to keep up with their lessons.",
            speakingExample: "Online learning made it hard for some students to keep up with their lessons.",
            difficultyLevel: 2,
            partOfSpeech: "phrasal verb",
            topic: "Education",
            type: "phrasal_verb",
            collocations: ["keep up with classmates", "keep up with lessons", "keep up with the workload"],
            synonyms: [
                { word: "match pace", level: "C1" },
                { word: "stay abreast of", level: "C2" }
            ],
            antonyms: ["fall behind", "drop back"]
        },
        {
            id: 9,
            word: "school years",
            pronunciation: "/skuːl jɪərz/",
            definition: "The period of time spent in school.",
            exampleSentence: "My school years were some of the happiest times of my life.",
            speakingExample: "My school years were some of the happiest times of my life.",
            difficultyLevel: 2,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["early school years", "school years experience", "during my school years"],
            synonyms: [
                { word: "schooldays", level: "C1" },
                { word: "student days", level: "B2" }
            ],
            antonyms: ["adulthood", "working life"]
        },
        {
            id: 10,
            word: "motivate students",
            pronunciation: "/ˈməʊtɪveɪt ˈstjuːdənts/",
            definition: "To encourage students to want to learn.",
            exampleSentence: "Teachers who make lessons fun really motivate students to come to class every day.",
            speakingExample: "Teachers who make lessons fun really motivate students to come to class every day.",
            difficultyLevel: 2,
            partOfSpeech: "collocation",
            topic: "Education",
            type: "academic",
            collocations: ["motivate students to learn", "highly motivated students", "fail to motivate students"],
            synonyms: [
                { word: "encourage", level: "B1" },
                { word: "inspire", level: "B2" },
                { word: "stimulate interest", level: "C1" }
            ],
            antonyms: ["demotivate", "discourage"]
        },

        // Band 7 (Intermediate Level) -> Difficulty 3
        {
            id: 11,
            word: "broaden your horizons",
            pronunciation: "/ˈbrɔːdn jɔːr həˈraɪzənz/",
            definition: "To expand your knowledge, interests, and experiences.",
            exampleSentence: "Studying abroad really broadens your horizons and changes the way you see the world.",
            speakingExample: "Studying abroad really broadens your horizons and changes the way you see the world.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["broaden horizons through education", "broaden horizons by studying abroad", "help broaden horizons"],
            synonyms: [
                { word: "expand perspective", level: "C1" },
                { word: "open your mind", level: "B2" },
                { word: "widen exposure", level: "C2" }
            ],
            antonyms: ["limit", "narrow", "restrict"]
        },
        {
            id: 12,
            word: "learn the ropes",
            pronunciation: "/lɜːrn ðə rəʊps/",
            definition: "To learn how to do a job or activity.",
            exampleSentence: "It took me a few weeks to learn the ropes when I started university.",
            speakingExample: "It took me a few weeks to learn the ropes when I started university.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["learn the ropes at university", "learn the ropes quickly", "help someone learn the ropes"],
            synonyms: [
                { word: "get the hang of", level: "C1" },
                { word: "master the basics", level: "B2" },
                { word: "familiarize yourself", level: "C1" }
            ],
            antonyms: ["be clueless", "struggle"]
        },
        {
            id: 13,
            word: "go the extra mile",
            pronunciation: "/ɡəʊ ðə ˈekstrə maɪl/",
            definition: "To make more effort than is expected of you.",
            exampleSentence: "The best teachers always go the extra mile to make sure every student understands the lesson.",
            speakingExample: "The best teachers always go the extra mile to make sure every student understands the lesson.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["go the extra mile for students", "go the extra mile in studies", "willing to go the extra mile"],
            synonyms: [
                { word: "make extra effort", level: "B2" },
                { word: "exceed expectations", level: "C1" },
                { word: "bend over backwards", level: "C2" }
            ],
            antonyms: ["do the bare minimum", "slack off"]
        },
        {
            id: 14,
            word: "thirst for knowledge",
            pronunciation: "/θɜːrst fɔːr ˈnɒlɪdʒ/",
            definition: "A strong desire to learn new things.",
            exampleSentence: "Children naturally have a thirst for knowledge that teachers should encourage.",
            speakingExample: "Children naturally have a thirst for knowledge that teachers should encourage.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["have a thirst for knowledge", "thirst for knowledge grows", "satisfy one's thirst for knowledge"],
            synonyms: [
                { word: "curiosity", level: "B2" },
                { word: "eagerness to learn", level: "C1" },
                { word: "inquisitiveness", level: "C2" }
            ],
            antonyms: ["apathy", "indifference", "lack of interest"]
        },
        {
            id: 15,
            word: "well-rounded education",
            pronunciation: "/wel ˈraʊndɪd ˌedʒʊˈkeɪʃən/",
            definition: "An education that provides knowledge in many different areas.",
            exampleSentence: "I believe schools should provide a well-rounded education that includes sports and arts, not just academics.",
            speakingExample: "I believe schools should provide a well-rounded education that includes sports and arts, not just academics.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["provide well-rounded education", "well-rounded education system", "essential for well-rounded education"],
            synonyms: [
                { word: "holistic education", level: "C2" },
                { word: "balanced education", level: "B2" },
                { word: "comprehensive learning", level: "C1" }
            ],
            antonyms: ["narrow curriculum", "specialized training"]
        },
        {
            id: 16,
            word: "burning ambition",
            pronunciation: "/ˈbɜːrnɪŋ æmˈbɪʃən/",
            definition: "A very strong desire to achieve something.",
            exampleSentence: "She had a burning ambition to become a doctor from a very young age.",
            speakingExample: "She had a burning ambition to become a doctor from a very young age.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["burning ambition to succeed", "burning ambition to learn", "fuel a burning ambition"],
            synonyms: [
                { word: "strong drive", level: "C1" },
                { word: "determination", level: "B2" },
                { word: "fervent desire", level: "C2" }
            ],
            antonyms: ["apathy", "lack of direction"]
        },
        {
            id: 17,
            word: "shape your future",
            pronunciation: "/ʃeɪp jɔːr ˈfjuːtʃər/",
            definition: "To have a strong influence on what happens in your life.",
            exampleSentence: "I strongly believe that getting a good education can completely shape your future.",
            speakingExample: "I strongly believe that getting a good education can completely shape your future.",
            difficultyLevel: 3,
            partOfSpeech: "collocation",
            topic: "Education",
            type: "academic",
            collocations: ["education shapes your future", "shape the future of students", "help shape your future"],
            synonyms: [
                { word: "determine your future", level: "B2" },
                { word: "influence your path", level: "C1" },
                { word: "define your destiny", level: "C2" }
            ],
            antonyms: ["have no impact", "be irrelevant"]
        },
        {
            id: 18,
            word: "fall into place",
            pronunciation: "/fɔːl ˈɪntə pleɪs/",
            definition: "To become clear or easy to understand.",
            exampleSentence: "After practicing for months, everything suddenly fell into place and I understood the subject.",
            speakingExample: "After practicing for months, everything suddenly fell into place and I understood the subject.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["knowledge falls into place", "lessons fall into place", "things usually fall into place"],
            synonyms: [
                { word: "make sense", level: "B1" },
                { word: "click", level: "C1" },
                { word: "become clear", level: "B2" }
            ],
            antonyms: ["be confusing", "remain unclear"]
        },
        {
            id: 19,
            word: "open doors",
            pronunciation: "/ˈəʊpən dɔːrz/",
            definition: "To create new opportunities for success.",
            exampleSentence: "A university degree really opens doors to better career opportunities.",
            speakingExample: "A university degree really opens doors to better career opportunities.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["education opens doors", "open doors to opportunities", "open doors for graduates"],
            synonyms: [
                { word: "create opportunities", level: "B2" },
                { word: "unlock potential", level: "C1" },
                { word: "pave the way", level: "C2" }
            ],
            antonyms: ["close doors", "limit opportunities"]
        },
        {
            id: 20,
            word: "trial and error",
            pronunciation: "/ˈtraɪəl ənd ˈerər/",
            definition: "A method of learning or solving problems by trying different approaches until one works.",
            exampleSentence: "The best way to learn a new language is through trial and error rather than just memorizing rules.",
            speakingExample: "The best way to learn a new language is through trial and error rather than just memorizing rules.",
            difficultyLevel: 3,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["learn through trial and error", "trial and error approach", "process of trial and error"],
            synonyms: [
                { word: "experimentation", level: "C1" },
                { word: "learning by doing", level: "B2" }
            ],
            antonyms: ["theoretical study", "instruction"]
        },

        // Band 8+ (Advanced Level) -> Difficulty 4
        {
            id: 21,
            word: "instill a love of learning",
            pronunciation: "/ɪnˈstɪl ə lʌv ɒv ˈlɜːrnɪŋ/",
            definition: "To gradually put the idea of loving learning into someone's mind.",
            exampleSentence: "Parents and teachers should work together to instill a love of learning in children from an early age.",
            speakingExample: "Parents and teachers should work together to instill a love of learning in children from an early age.",
            difficultyLevel: 4,
            partOfSpeech: "phrase",
            topic: "Education",
            type: "academic",
            collocations: ["instill a love of learning in children", "instill a love of learning from early age", "aim to instill a love of learning"],
            synonyms: [
                { word: "encourage curiosity", level: "C1" },
                { word: "foster a passion for learning", level: "C2" },
                { word: "cultivate interest", level: "C1" }
            ],
            antonyms: ["stifle curiosity", "put off learning"]
        },
        {
            id: 22,
            word: "nurture talent",
            pronunciation: "/ˈnɜːrtʃər ˈtælənt/",
            definition: "To care for and encourage the growth of someone's ability.",
            exampleSentence: "Schools should do more to nurture the talent of students who are gifted in arts and music.",
            speakingExample: "Schools should do more to nurture the talent of students who are gifted in arts and music.",
            difficultyLevel: 4,
            partOfSpeech: "collocation",
            topic: "Education",
            type: "academic",
            collocations: ["nurture talent in students", "nurture young talent", "programs to nurture talent"],
            synonyms: [
                { word: "develop ability", level: "B2" },
                { word: "foster potential", level: "C1" },
                { word: "cultivate skills", level: "C2" }
            ],
            antonyms: ["neglect", "ignore", "suppress"]
        },
        {
            id: 23,
            word: "spark an interest",
            pronunciation: "/spɑːrk ən ˈɪntrəst/",
            definition: "To cause someone to become interested in something.",
            exampleSentence: "One passionate teacher can spark an interest in a subject that lasts a lifetime.",
            speakingExample: "One passionate teacher can spark an interest in a subject that lasts a lifetime.",
            difficultyLevel: 4,
            partOfSpeech: "collocation",
            topic: "Education",
            type: "academic",
            collocations: ["spark an interest in learning", "spark an interest in a subject", "spark an interest in science"],
            synonyms: [
                { word: "inspire interest", level: "C1" },
                { word: "ignite curiosity", level: "C2" },
                { word: "stimulate", level: "B2" }
            ],
            antonyms: ["bore", "kill interest"]
        },
        {
            id: 24,
            word: "thought-provoking",
            pronunciation: "/ˈθɔːt prəˈvəʊkɪŋ/",
            definition: "Making you think deeply about a subject.",
            exampleSentence: "The best lessons are thought-provoking and encourage students to question what they know.",
            speakingExample: "The best lessons are thought-provoking and encourage students to question what they know.",
            difficultyLevel: 4,
            partOfSpeech: "adjective",
            topic: "Education",
            type: "academic",
            collocations: ["thought-provoking lessons", "thought-provoking discussions", "thought-provoking questions"],
            synonyms: [
                { word: "stimulating", level: "C1" },
                { word: "insightful", level: "C2" },
                { word: "intriguing", level: "C1" }
            ],
            antonyms: ["shallow", "uninspiring", "dull"]
        },
        {
            id: 25,
            word: "strike a balance",
            pronunciation: "/straɪk ə ˈbæləns/",
            definition: "To find a compromise or fair arrangement between two things.",
            exampleSentence: "Schools need to strike a balance between academic pressure and student wellbeing.",
            speakingExample: "Schools need to strike a balance between academic pressure and student wellbeing.",
            difficultyLevel: 4,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["strike a balance between study and play", "strike a balance in education", "hard to strike a balance"],
            synonyms: [
                { word: "find a compromise", level: "B2" },
                { word: "achieve equilibrium", level: "C2" },
                { word: "juggle", level: "C1" }
            ],
            antonyms: ["favor one side", "be biased"]
        },
        {
            id: 26,
            word: "deeply ingrained",
            pronunciation: "/ˈdiːpli ɪnˈɡreɪnd/",
            definition: "Existing for a long time and very difficult to change.",
            exampleSentence: "The values we learn in childhood become deeply ingrained and stay with us for life.",
            speakingExample: "The values we learn in childhood become deeply ingrained and stay with us for life.",
            difficultyLevel: 4,
            partOfSpeech: "collocation",
            topic: "Education",
            type: "academic",
            collocations: ["deeply ingrained habits", "deeply ingrained values", "deeply ingrained beliefs"],
            synonyms: [
                { word: "entrenched", level: "C2" },
                { word: "rooted", level: "C1" },
                { word: "fixed", level: "B2" }
            ],
            antonyms: ["superficial", "temporary"]
        },
        {
            id: 27,
            word: "stand out from the crowd",
            pronunciation: "/stænd aʊt frɒm ðə kraʊd/",
            definition: "To be much better or more important than others.",
            exampleSentence: "Getting extra qualifications can help you stand out from the crowd when applying for jobs.",
            speakingExample: "Getting extra qualifications can help you stand out from the crowd when applying for jobs.",
            difficultyLevel: 4,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["stand out from the crowd academically", "help students stand out", "stand out from the crowd with skills"],
            synonyms: [
                { word: "distinguish oneself", level: "C1" },
                { word: "excel", level: "B2" },
                { word: "shine", level: "B2" }
            ],
            antonyms: ["blend in", "be average"]
        },
        {
            id: 28,
            word: "in the long run",
            pronunciation: "/ɪn ðə lɒŋ rʌn/",
            definition: "Relating to a long period of time in the future.",
            exampleSentence: "Investing time in education always pays off in the long run, even if it is tough at first.",
            speakingExample: "Investing time in education always pays off in the long run, even if it is tough at first.",
            difficultyLevel: 4,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["benefit in the long run", "pay off in the long run", "successful in the long run"],
            synonyms: [
                { word: "eventually", level: "B2" },
                { word: "ultimately", level: "C1" },
                { word: "over time", level: "B1" }
            ],
            antonyms: ["immediately", "in the short term"]
        },
        {
            id: 29,
            word: "go hand in hand",
            pronunciation: "/ɡəʊ hænd ɪn hænd/",
            definition: "To be closely connected or happen at the same time.",
            exampleSentence: "Hard work and academic success really go hand in hand in my opinion.",
            speakingExample: "Hard work and academic success really go hand in hand in my opinion.",
            difficultyLevel: 4,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["education and success go hand in hand", "learning and practice go hand in hand", "go hand in hand together"],
            synonyms: [
                { word: "are interconnected", level: "C1" },
                { word: "are linked", level: "B2" },
                { word: "accompany", level: "C2" }
            ],
            antonyms: ["are unrelated", "are separate"]
        },
        {
            id: 30,
            word: "food for thought",
            pronunciation: "/fuːd fɔːr θɔːt/",
            definition: "Something that warrants serious consideration.",
            exampleSentence: "My teacher's lessons always gave me plenty of food for thought even after class was over.",
            speakingExample: "My teacher's lessons always gave me plenty of food for thought even after class was over.",
            difficultyLevel: 4,
            partOfSpeech: "idiom",
            topic: "Education",
            type: "idiom",
            collocations: ["give food for thought", "provide food for thought", "offer food for thought"],
            synonyms: [
                { word: "something to think about", level: "B2" },
                { word: "mental stimulation", level: "C1" },
                { word: "insight", level: "C1" }
            ],
            antonyms: ["nonsense", "trivia"]
        },

        // ==========================================
        // BAND 6-8+ WRITING VOCABULARY (IDs 31-60)
        // ==========================================

        {
            id: 31,
            word: "educate",
            pronunciation: "/ˈedʒ.u.keɪt/",
            definition: "To give someone intellectual, moral, or social instruction.",
            exampleSentence: "Schools should educate students not only in academic subjects but also in essential life skills.",
            writingExample: "It is the responsibility of both parents and teachers to educate children about the importance of good citizenship.",
            difficultyLevel: 2,
            partOfSpeech: "verb",
            topic: "Education",
            type: "academic",
            collocations: ["educate students", "educate the public", "formally educate"],
            synonyms: [
                { word: "teach", level: "A1" },
                { word: "instruct", level: "B2" },
                { word: "train", level: "B1" }
            ],
            antonyms: ["learn", "mislead"]
        },
        {
            id: 32,
            word: "curriculum",
            pronunciation: "/kəˈrɪk.jə.ləm/",
            definition: "The subjects comprising a course of study in a school or college.",
            exampleSentence: "The national curriculum should be regularly updated to reflect the demands of the modern job market.",
            writingExample: "Many educators argue that the current school curriculum places too much emphasis on science and mathematics at the expense of creative subjects.",
            difficultyLevel: 2,
            partOfSpeech: "noun",
            topic: "Education",
            type: "academic",
            collocations: ["design a curriculum", "national curriculum", "school curriculum", "curriculum reform"],
            synonyms: [
                { word: "syllabus", level: "C1" },
                { word: "course content", level: "B2" }
            ],
            antonyms: []
        },
        {
            id: 33,
            word: "student performance",
            pronunciation: "/ˈstjuː.dənt pəˈfɔː.məns/",
            definition: "How well a student is doing in their studies and assessments.",
            exampleSentence: "Regular assessment is considered an effective way to monitor and improve student performance.",
            writingExample: "Studies have shown that a lack of sleep can significantly affect student performance in both examinations and daily classroom tasks.",
            difficultyLevel: 2,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["improve student performance", "measure student performance", "affect student performance"],
            synonyms: [
                { word: "academic achievement", level: "C1" },
                { word: "grades", level: "B1" }
            ],
            antonyms: []
        },
        {
            id: 34,
            word: "classroom",
            pronunciation: "/ˈklɑːs.ruːm/",
            definition: "A room in which a class of pupils or students is taught.",
            exampleSentence: "A positive classroom environment encourages students to participate actively in lessons.",
            writingExample: "Technology has transformed traditional classroom learning by giving students instant access to a vast range of information.",
            difficultyLevel: 2,
            partOfSpeech: "noun",
            topic: "Education",
            type: "academic",
            collocations: ["classroom environment", "classroom learning", "traditional classroom", "classroom interaction"],
            synonyms: [
                { word: "schoolroom", level: "B2" },
                { word: "teaching space", level: "C1" }
            ],
            antonyms: []
        },
        {
            id: 35,
            word: "examination",
            pronunciation: "/ɪɡˌzæm.ɪˈneɪ.ʃən/",
            definition: "A formal test of a person's knowledge or proficiency in a subject or skill.",
            exampleSentence: "Many students suffer from anxiety because of the excessive pressure associated with national examinations.",
            writingExample: "Some educators believe that sitting high-stakes examinations at a young age can cause long-term psychological harm to children.",
            difficultyLevel: 2,
            partOfSpeech: "noun",
            topic: "Education",
            type: "academic",
            collocations: ["sit an examination", "pass/fail an examination", "standardised examination", "examination pressure"],
            synonyms: [
                { word: "test", level: "A1" },
                { word: "assessment", level: "B2" },
                { word: "evaluations", level: "C1" }
            ],
            antonyms: []
        },
        {
            id: 36,
            word: "dropout rate",
            pronunciation: "/ˈdrɒp.aʊt reɪt/",
            definition: "The percentage of students who leave school or college before completing their qualification.",
            exampleSentence: "Governments must introduce financial support programmes to reduce the high dropout rate in secondary schools.",
            writingExample: "The school dropout rate in rural communities remains alarmingly high due to poverty and a lack of access to qualified teachers.",
            difficultyLevel: 2,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["high dropout rate", "reduce the dropout rate", "school dropout rate"],
            synonyms: [
                { word: "attrition rate", level: "C2" }
            ],
            antonyms: ["completion rate", "graduation rate"]
        },
        {
            id: 37,
            word: "tuition fees",
            pronunciation: "/tjuːˈɪʃ.ən fiːz/",
            definition: "Money that you pay to take lessons, especially at a college, university, or private school.",
            exampleSentence: "Rising tuition fees have made higher education inaccessible for students from low-income families.",
            writingExample: "Some governments have chosen to waive tuition fees for students studying in fields such as medicine and engineering to address skill shortages.",
            difficultyLevel: 2,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["pay tuition fees", "increase in tuition fees", "waive tuition fees", "afford tuition fees"],
            synonyms: [
                { word: "education costs", level: "B2" },
                { word: "school fees", level: "B1" }
            ],
            antonyms: ["free education", "scholarship"]
        },
        {
            id: 38,
            word: "literacy",
            pronunciation: "/ˈlɪt.ər.ə.si/",
            definition: "The ability to read and write.",
            exampleSentence: "Improving literacy rates in rural areas should be a top priority for developing governments.",
            writingExample: "In the digital age, promoting digital literacy among school children is just as important as teaching basic reading and writing skills.",
            difficultyLevel: 2,
            partOfSpeech: "noun",
            topic: "Education",
            type: "academic",
            collocations: ["promote literacy", "literacy rate", "basic literacy", "digital literacy", "improve literacy"],
            synonyms: [
                { word: "reading and writing", level: "B1" },
                { word: "education", level: "B2" }
            ],
            antonyms: ["illiteracy"]
        },
        {
            id: 39,
            word: "teacher",
            pronunciation: "/ˈtiː.tʃər/",
            definition: "A person who teaches, especially in a school.",
            exampleSentence: "A shortage of qualified teachers in rural regions continues to undermine the quality of education.",
            writingExample: "Reducing the teacher-student ratio is one of the most effective ways to ensure that every child receives adequate individual attention.",
            difficultyLevel: 2,
            partOfSpeech: "noun",
            topic: "Education",
            type: "academic",
            collocations: ["qualified teacher", "experienced teacher", "train teachers", "teacher shortage", "teacher-student ratio"],
            synonyms: [
                { word: "educator", level: "C1" },
                { word: "instructor", level: "B2" },
                { word: "tutor", level: "B2" }
            ],
            antonyms: ["student", "pupil", "learner"]
        },
        {
            id: 40,
            word: "learning environment",
            pronunciation: "/ˈlɜː.nɪŋ ɪnˈvaɪ.rən.mənt/",
            definition: "The physical, psychological, and social conditions in which learning takes place.",
            exampleSentence: "Teachers play a crucial role in creating a safe and supportive learning environment for all pupils.",
            writingExample: "Bullying and classroom disruption can seriously damage the learning environment and prevent students from reaching their full potential.",
            difficultyLevel: 2,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["safe learning environment", "supportive learning environment", "create a learning environment"],
            synonyms: [
                { word: "educational setting", level: "C1" },
                { word: "classroom atmosphere", level: "B2" }
            ],
            antonyms: []
        },

        // Band 7 (Intermediate Level) -> Difficulty 3
        {
            id: 41,
            word: "academic achievement",
            pronunciation: "/ˌæk.əˈdem.ɪk əˈtʃiːv.mənt/",
            definition: "Success in school or university studies.",
            exampleSentence: "Research consistently shows that parental involvement significantly boosts children's academic achievement.",
            writingExample: "The academic achievement gap between students from wealthy and disadvantaged backgrounds continues to widen despite government intervention.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["boost academic achievement", "measure academic achievement", "academic achievement gap"],
            synonyms: [
                { word: "scholastic success", level: "C2" },
                { word: "educational attainment", level: "C1" }
            ],
            antonyms: ["academic failure"]
        },
        {
            id: 42,
            word: "critical thinking",
            pronunciation: "/ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/",
            definition: "The objective analysis and evaluation of an issue in order to form a judgment.",
            exampleSentence: "Modern education systems must prioritise the development of critical thinking skills over rote memorisation.",
            writingExample: "Encouraging critical thinking in the classroom allows students to analyse information independently rather than simply accepting what they are told.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["develop critical thinking", "encourage critical thinking", "critical thinking skills", "apply critical thinking"],
            synonyms: [
                { word: "analytical thinking", level: "C1" },
                { word: "reasoning", level: "B2" }
            ],
            antonyms: ["blind acceptance"]
        },
        {
            id: 43,
            word: "vocational training",
            pronunciation: "/vəʊˈkeɪ.ʃən.əl ˈtreɪ.nɪŋ/",
            definition: "Training for a specific job or trade.",
            exampleSentence: "Governments should invest in vocational training programmes to prepare young people for skilled employment.",
            writingExample: "Many students who are not academically inclined would benefit greatly from access to high-quality vocational training in practical fields such as engineering and healthcare.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["provide vocational training", "vocational training programme", "vocational training centre"],
            synonyms: [
                { word: "job training", level: "B2" },
                { word: "technical education", level: "C1" }
            ],
            antonyms: ["academic education"]
        },
        {
            id: 44,
            word: "equal access",
            pronunciation: "/ˈiː.kwəl ˈæk.ses/",
            definition: "Where everyone has the same opportunity to enter or use something.",
            exampleSentence: "One of the central challenges facing policymakers is ensuring equal access to quality education for all children.",
            writingExample: "Girls in certain developing nations are still denied equal access to education, which significantly limits their future opportunities and economic independence.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["ensure equal access", "equal access to education", "equal access to resources", "deny equal access"],
            synonyms: [
                { word: "fair access", level: "B2" },
                { word: "nondiscriminatory access", level: "C2" }
            ],
            antonyms: ["inequality", "discrimination"]
        },
        {
            id: 45,
            word: "academic pressure",
            pronunciation: "/ˌæk.əˈdem.ɪk ˈpreʃ.ər/",
            definition: "Stress and anxiety related to schoolwork and exams.",
            exampleSentence: "Intense academic pressure from parents and schools can have severe consequences for students' mental health.",
            writingExample: "Many Asian countries are reconsidering their education systems due to growing concerns about the damaging effects of excessive academic pressure on young people.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["intense academic pressure", "reduce academic pressure", "cope with academic pressure"],
            synonyms: [
                { word: "exam stress", level: "B2" },
                { word: "scholastic stress", level: "C1" }
            ],
            antonyms: ["relaxed learning environment"]
        },
        {
            id: 46,
            word: "distance learning",
            pronunciation: "/ˈdɪs.təns ˈlɜː.nɪŋ/",
            definition: "A method of study where teachers and students do not meet in a classroom but use the internet, e-mail, mail, etc., to have classes.",
            exampleSentence: "The pandemic accelerated the widespread adoption of distance learning, revealing both its potential and its limitations.",
            writingExample: "Distance learning platforms have made it possible for students in remote areas to access world-class education without relocating to urban centres.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["adopt distance learning", "distance learning platform", "online distance learning", "promote distance learning"],
            synonyms: [
                { word: "remote learning", level: "B2" },
                { word: "e-learning", level: "B2" },
                { word: "online education", level: "B2" }
            ],
            antonyms: ["traditional classroom learning", "face-to-face learning"]
        },
        {
            id: 47,
            word: "extracurricular activities",
            pronunciation: "/ˌek.strə.kəˈrɪk.jə.lə ækˈtɪv.ə.tiz/",
            definition: "Activities that fall outside the realm of the normal curriculum of school or university education.",
            exampleSentence: "Participating in extracurricular activities helps students develop teamwork, leadership, and social skills.",
            writingExample: "Schools that offer a wide range of extracurricular activities tend to produce well-rounded graduates who are better prepared for the challenges of adult life.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["participate in extracurricular activities", "offer extracurricular activities", "benefit of extracurricular activities"],
            synonyms: [
                { word: "after-school activities", level: "A2" },
                { word: "co-curricular activities", level: "C1" }
            ],
            antonyms: []
        },
        {
            id: 48,
            word: "higher education",
            pronunciation: "/ˌhaɪ.ər edʒ.ʊˈkeɪ.ʃən/",
            definition: "Education at a college or university level.",
            exampleSentence: "Not all students need to pursue higher education, as vocational qualifications can be equally valuable.",
            writingExample: "Governments face the difficult challenge of deciding how to fund higher education institutions without placing an unreasonable financial burden on students.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["pursue higher education", "access to higher education", "higher education institution", "fund higher education"],
            synonyms: [
                { word: "tertiary education", level: "C1" },
                { word: "university education", level: "B2" }
            ],
            antonyms: ["secondary education", "compulsory education"]
        },
        {
            id: 49,
            word: "intellectual development",
            pronunciation: "/ˌɪn.təlˈek.tʃu.əl dɪˈvel.əp.mənt/",
            definition: "The growth of a child's ability to think and reason.",
            exampleSentence: "Reading widely is one of the most effective ways to support the intellectual development of young learners.",
            writingExample: "Exposure to diverse perspectives and cultures plays a vital role in promoting the intellectual development of university students.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["promote intellectual development", "support intellectual development", "intellectual development of children"],
            synonyms: [
                { word: "cognitive growth", level: "C2" },
                { word: "mental development", level: "B2" }
            ],
            antonyms: []
        },
        {
            id: 50,
            word: "standardised testing",
            pronunciation: "/ˈstæn.də.daɪzd ˈtes.tɪŋ/",
            definition: "A test that is administered and scored in a consistent, or standard, manner.",
            exampleSentence: "Critics argue that over-reliance on standardised testing fails to capture the full range of a student's abilities.",
            writingExample: "While standardised testing provides a useful benchmark for comparing student performance across schools, it should not be the sole measure of educational success.",
            difficultyLevel: 3,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["rely on standardised testing", "introduce standardised testing", "criticise standardised testing", "standardised testing system"],
            synonyms: [
                { word: "uniform testing", level: "C2" }
            ],
            antonyms: ["alternative assessment"]
        },

        // Band 8+ (Advanced Level) -> Difficulty 4
        {
            id: 51,
            word: "pedagogical approach",
            pronunciation: "/ˌped.əˈɡɒdʒ.ɪ.kəl əˈprəʊtʃ/",
            definition: "The method and practice of teaching.",
            exampleSentence: "Adopting a student-centred pedagogical approach has been shown to significantly enhance learner engagement and outcomes.",
            writingExample: "Teacher training programmes must equip educators with a variety of pedagogical approaches to address the diverse learning needs of their students.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["adopt a pedagogical approach", "student-centred pedagogical approach", "innovative pedagogical approach"],
            synonyms: [
                { word: "teaching method", level: "B2" },
                { word: "educational strategy", level: "C1" },
                { word: "teaching philosophy", level: "C2" }
            ],
            antonyms: []
        },
        {
            id: 52,
            word: "holistic education",
            pronunciation: "/həˈlɪs.tɪk ˌedʒ.ʊˈkeɪ.ʃən/",
            definition: "An approach to learning that emphasizes the importance of the physical, emotional, and psychological well-being of children, as well as their cognitive development.",
            exampleSentence: "Advocates of holistic education argue that schools must nurture students' emotional and social well-being alongside academic competence.",
            writingExample: "A truly holistic education system values artistic expression, physical health, and moral development as much as it values academic results.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["promote holistic education", "holistic education system", "advocate holistic education", "holistic educational framework"],
            synonyms: [
                { word: "comprehensive education", level: "C1" },
                { word: "well-rounded education", level: "C1" }
            ],
            antonyms: ["narrow curriculum", "exam-focused education"]
        },
        {
            id: 53,
            word: "socioeconomic disparity",
            pronunciation: "/ˌsəʊ.si.əʊˌek.əˈnɒm.ɪk dɪˈspær.ə.ti/",
            definition: "Inequality related to social and economic factors.",
            exampleSentence: "Socioeconomic disparity remains the most persistent barrier to achieving equitable educational outcomes across different communities.",
            writingExample: "Without targeted government policies, socioeconomic disparity will continue to determine the quality of education a child receives, regardless of their natural ability.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["address socioeconomic disparity", "widen socioeconomic disparity", "socioeconomic disparity in education"],
            synonyms: [
                { word: "inequality", level: "B2" },
                { word: "social gap", level: "C1" },
                { word: "wealth gap", level: "C1" }
            ],
            antonyms: ["equality", "equity"]
        },
        {
            id: 54,
            word: "cognitive development",
            pronunciation: "/ˈkɒɡ.nə.tɪv dɪˈvel.əp.mənt/",
            definition: "The construction of thought processes, including remembering, problem solving, and decision-making.",
            exampleSentence: "Early childhood education plays an indispensable role in stimulating cognitive development during the most formative years of a child's life.",
            writingExample: "Excessive screen time has been linked to delays in the cognitive development of young children, raising serious concerns among educators and child psychologists.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["stimulate cognitive development", "support cognitive development", "early cognitive development", "cognitive development of children"],
            synonyms: [
                { word: "mental growth", level: "B2" },
                { word: "intellectual maturation", level: "C2" }
            ],
            antonyms: []
        },
        {
            id: 55,
            word: "meritocratic system",
            pronunciation: "/ˌmer.ɪ.təˈkræt.ɪk ˈsɪs.təm/",
            definition: "A system in which people are chosen and moved into positions of success, power, and influence on the basis of their demonstrated abilities and merit.",
            exampleSentence: "Although many governments claim to operate a meritocratic system, children from privileged backgrounds continue to hold a significant advantage.",
            writingExample: "A genuinely meritocratic system would ensure that talent and hard work, rather than family wealth, determine a student's educational and professional trajectory.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["truly meritocratic system", "build a meritocratic system", "meritocratic education system", "undermine a meritocratic system"],
            synonyms: [
                { word: "meritocracy", level: "C2" }
            ],
            antonyms: ["nepotism", "favoritism"]
        },
        {
            id: 56,
            word: "rote memorisation",
            pronunciation: "/rəʊt ˌmem.ə.raɪˈzeɪ.ʃən/",
            definition: "Memorization by repetition, often without understanding.",
            exampleSentence: "An education system that relies excessively on rote memorisation stifles creativity and impedes the development of independent thinking.",
            writingExample: "Progressive educators advocate replacing rote memorisation with inquiry-based learning, which encourages students to question, explore, and discover knowledge for themselves.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["rely on rote memorisation", "discourage rote memorisation", "rote memorisation technique", "replace rote memorisation"],
            synonyms: [
                { word: "learning by heart", level: "B2" },
                { word: "parrot-fashion learning", level: "C2" }
            ],
            antonyms: ["critical thinking", "understanding", "comprehension"]
        },
        {
            id: 57,
            word: "interdisciplinary learning",
            pronunciation: "/ˌɪn.təˈdɪs.ɪ.plɪ.nər.i ˈlɜː.nɪŋ/",
            definition: "A method of learning that integrates concepts and theories from multiple disciplines.",
            exampleSentence: "Interdisciplinary learning allows students to make meaningful connections across subjects, fostering a more comprehensive understanding of complex issues.",
            writingExample: "The promotion of interdisciplinary learning in universities is essential for producing graduates who can tackle the multifaceted challenges of the modern world.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["promote interdisciplinary learning", "interdisciplinary learning approach", "benefit of interdisciplinary learning"],
            synonyms: [
                { word: "cross-curricular learning", level: "C2" },
                { word: "integrated learning", level: "C1" }
            ],
            antonyms: ["specialized learning", "compartmentalized learning"]
        },
        {
            id: 58,
            word: "privatisation of education",
            pronunciation: "/ˌpraɪ.və.taɪˈzeɪ.ʃən ɒv ˌedʒ.ʊˈkeɪ.ʃən/",
            definition: "The process of transferring ownership or management of educational institutions from the public to the private sector.",
            exampleSentence: "The growing privatisation of education risks transforming learning into a commodity available only to those who can afford it.",
            writingExample: "Opponents of the privatisation of education contend that when profit becomes the driving force behind schooling, the quality and accessibility of education inevitably suffer.",
            difficultyLevel: 4,
            partOfSpeech: "noun phrase",
            topic: "Education",
            type: "academic",
            collocations: ["oppose the privatisation of education", "accelerate the privatisation of education", "consequences of privatisation of education"],
            synonyms: [
                { word: "commercialization of education", level: "C2" }
            ],
            antonyms: ["public education", "state education"]
        },
        {
            id: 59,
            word: "nurture potential",
            pronunciation: "/ˈnɜː.tʃər pəˈten.ʃəl/",
            definition: "To care for and encourage the development of someone's natural ability.",
            exampleSentence: "The primary responsibility of any education system is to identify and nurture the unique potential of every individual student.",
            writingExample: "An overly rigid and exam-focused system often fails to nurture the creative and entrepreneurial potential of students who do not excel in traditional academic settings.",
            difficultyLevel: 4,
            partOfSpeech: "verb phrase",
            topic: "Education",
            type: "academic",
            collocations: ["nurture the potential of students", "nurture individual potential", "fail to nurture potential"],
            synonyms: [
                { word: "develop potential", level: "B2" },
                { word: "foster talent", level: "C1" },
                { word: "allow to flourish", level: "C2" }
            ],
            antonyms: ["stifle potential", "waste talent"]
        },
        {
            id: 60,
            word: "perpetuate inequality",
            pronunciation: "/pəˈpetʃ.u.eɪt ˌɪn.ɪˈkwɒl.ə.ti/",
            definition: "To make inequality continue indefinitely.",
            exampleSentence: "Without significant structural reform, underfunded public schools will continue to perpetuate inequality across generations.",
            writingExample: "When elite universities disproportionately admit students from wealthy families, they actively perpetuate social inequality rather than serving as engines of social mobility.",
            difficultyLevel: 4,
            partOfSpeech: "verb phrase",
            topic: "Education",
            type: "academic",
            collocations: ["perpetuate social inequality", "perpetuate educational inequality", "risk perpetuating inequality"],
            synonyms: [
                { word: "maintain inequality", level: "C1" },
                { word: "sustain disparity", level: "C2" }
            ],
            antonyms: ["reduce inequality", "bridge the gap"]
        }
    ],
    exercises: {
        synonymSwap: [
            {
                id: 1,
                instruction: "Replace the highlighted word with a more academic alternative.",
                sentence_original: "The government needs to teach young people about the dangers of misinformation online.",
                replace_this: "teach",
                target_word: "educate"
            },
            {
                id: 2,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Many teachers believe the set of subjects taught in school is outdated and needs immediate reform.",
                replace_this: "set of subjects taught in school",
                target_word: "curriculum"
            },
            {
                id: 3,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Teachers use regular tests to track and improve how well students do throughout the year.",
                replace_this: "how well students do",
                target_word: "student performance"
            },
            {
                id: 4,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Technology has completely changed the traditional room where lessons are taught experience.",
                replace_this: "room where lessons are taught",
                target_word: "classroom"
            },
            {
                id: 5,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Students often feel overwhelmed by the stress of sitting a high-stakes formal test at the end of the year.",
                replace_this: "formal test",
                target_word: "examination"
            },
            {
                id: 6,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Poverty is the leading cause of the high number of students who quit school early in developing nations.",
                replace_this: "number of students who quit school early",
                target_word: "dropout rate"
            },
            {
                id: 7,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Many families struggle to pay the cost of university study as costs continue to rise each year.",
                replace_this: "pay the cost of university study",
                target_word: "tuition fees"
            },
            {
                id: 8,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "The government launched a campaign to improve the ability to read and write among adults in rural areas.",
                replace_this: "the ability to read and write",
                target_word: "literacy"
            },
            {
                id: 9,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "The instructor shortage in remote villages is one of the most serious problems in the education system.",
                replace_this: "instructor shortage",
                target_word: "teacher shortage"
            },
            {
                id: 10,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Schools must work hard to create a safe and positive atmosphere for studying for all students.",
                replace_this: "atmosphere for studying",
                target_word: "learning environment"
            },
            {
                id: 11,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Parental support has been proven to significantly improve how well children do academically.",
                replace_this: "how well children do academically",
                target_word: "academic achievement"
            },
            {
                id: 12,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Schools must teach students the ability to analyse and evaluate information independently.",
                replace_this: "the ability to analyse and evaluate information independently",
                target_word: "critical thinking"
            },
            {
                id: 13,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Governments should fund practical skills education to prepare students for skilled labour markets.",
                replace_this: "practical skills education",
                target_word: "vocational training"
            },
            {
                id: 14,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Policymakers must ensure the same opportunities to study for children from all social backgrounds.",
                replace_this: "the same opportunities to study",
                target_word: "equal access"
            },
            {
                id: 15,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "The stress caused by schoolwork is leading to a mental health crisis among teenagers worldwide.",
                replace_this: "stress caused by schoolwork",
                target_word: "academic pressure"
            },
            {
                id: 16,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "The pandemic forced millions of students to switch to studying remotely using the internet.",
                replace_this: "studying remotely using the internet",
                target_word: "distance learning"
            },
            {
                id: 17,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Students who join after-school clubs and sports tend to develop stronger social and leadership skills.",
                replace_this: "after-school clubs and sports",
                target_word: "extracurricular activities"
            },
            {
                id: 18,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Not every student needs to pursue university-level education to build a successful career.",
                replace_this: "university-level education",
                target_word: "higher education"
            },
            {
                id: 19,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Reading diverse books significantly supports the growth of the mind in young children.",
                replace_this: "growth of the mind",
                target_word: "intellectual development"
            },
            {
                id: 20,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Many educators criticise uniform national tests for failing to measure creativity and problem-solving ability.",
                replace_this: "uniform national tests",
                target_word: "standardised testing"
            },
            {
                id: 21,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Universities must train teachers in a variety of teaching methods and strategies to meet diverse student needs.",
                replace_this: "teaching methods and strategies",
                target_word: "pedagogical approach"
            },
            {
                id: 22,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Many educators advocate for a well-rounded approach to education that values emotional and social growth.",
                replace_this: "well-rounded approach to education",
                target_word: "holistic education"
            },
            {
                id: 23,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "The gap in opportunities caused by income differences is the biggest obstacle to fair education worldwide.",
                replace_this: "gap in opportunities caused by income differences",
                target_word: "socioeconomic disparity"
            },
            {
                id: 24,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Early childhood programmes are designed to stimulate the growth of thinking and mental abilities in young children.",
                replace_this: "the growth of thinking and mental abilities",
                target_word: "cognitive development"
            },
            {
                id: 25,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Critics argue that elite universities undermine the idea of a system based purely on talent and effort.",
                replace_this: "system based purely on talent and effort",
                target_word: "meritocratic system"
            },
            {
                id: 26,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Progressive schools are moving away from learning through repetition and memorising facts toward inquiry-based methods.",
                replace_this: "learning through repetition and memorising facts",
                target_word: "rote memorisation"
            },
            {
                id: 27,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Universities should promote cross-subject learning to help students tackle complex global challenges.",
                replace_this: "cross-subject learning",
                target_word: "interdisciplinary learning"
            },
            {
                id: 28,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Many critics strongly oppose the handing over of schools to private companies as it reduces accessibility.",
                replace_this: "handing over of schools to private companies",
                target_word: "privatisation of education"
            },
            {
                id: 29,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Every school has a duty to identify and develop the hidden talents of each individual student.",
                replace_this: "develop the hidden talents",
                target_word: "nurture potential"
            },
            {
                id: 30,
                instruction: "Replace the highlighted phrase with a more academic alternative.",
                sentence_original: "Without serious reform, the current system will continue to keep unfairness going across generations.",
                replace_this: "keep unfairness going",
                target_word: "perpetuate inequality"
            }
        ],
        contextTetris: [
            {
                id: 1,
                instruction: "Drag (or click) the correct academic words into the sentence gaps.",
                word_bank: [
                    "curriculum", "dropout rate", "examination", "literacy",
                    "learning environment", "tuition fees", "educate",
                    "classroom", "teacher", "student performance"
                ],
                items: [
                    {
                        item_id: 1,
                        gap_sentence: "The government launched a new programme to ___ parents about the importance of sending their children to school regularly.",
                        answer: "educate"
                    },
                    {
                        item_id: 2,
                        gap_sentence: "A well-designed ___ should include not only core academic subjects but also arts, physical education, and life skills.",
                        answer: "curriculum"
                    },
                    {
                        item_id: 3,
                        gap_sentence: "The introduction of technology into the ___ has made lessons more interactive and engaging for young learners.",
                        answer: "classroom"
                    },
                    {
                        item_id: 4,
                        gap_sentence: "Schools use end-of-year reports to track ___ and identify students who may need additional support.",
                        answer: "student performance"
                    },
                    {
                        item_id: 5,
                        gap_sentence: "The pressure of sitting a final ___ causes many students to experience severe anxiety and sleep deprivation.",
                        answer: "examination"
                    },
                    {
                        item_id: 6,
                        gap_sentence: "The government introduced scholarship programmes to help talented students from poor families pay their ___.",
                        answer: "tuition fees"
                    },
                    {
                        item_id: 7,
                        gap_sentence: "Increasing ___ rates among adults in developing countries is essential for reducing poverty and improving quality of life.",
                        answer: "literacy"
                    },
                    {
                        item_id: 8,
                        gap_sentence: "A dedicated and experienced ___ can make an enormous difference to a child's confidence and love of learning.",
                        answer: "teacher"
                    },
                    {
                        item_id: 9,
                        gap_sentence: "Bullying must be addressed urgently because it destroys the ___ and prevents students from concentrating on their studies.",
                        answer: "learning environment"
                    },
                    {
                        item_id: 10,
                        gap_sentence: "Poverty, early marriage, and lack of school facilities are the main factors contributing to the high ___ in rural schools.",
                        answer: "dropout rate"
                    }
                ]
            },
            {
                id: 2,
                instruction: "Drag (or click) the correct academic words into the sentence gaps.",
                word_bank: [
                    "intellectual development", "equal access", "extracurricular activities",
                    "vocational training", "distance learning", "academic achievement",
                    "academic pressure", "standardised testing", "critical thinking",
                    "higher education"
                ],
                items: [
                    {
                        item_id: 11,
                        gap_sentence: "Children who grow up in book-rich households tend to show faster ___ compared to those with limited access to reading materials.",
                        answer: "intellectual development"
                    },
                    {
                        item_id: 12,
                        gap_sentence: "The government must take immediate action to guarantee ___ to quality schooling for children living in remote and disadvantaged areas.",
                        answer: "equal access"
                    },
                    {
                        item_id: 13,
                        gap_sentence: "Participating in ___ such as debate clubs, sports teams, and drama groups helps students build confidence and resilience.",
                        answer: "extracurricular activities"
                    },
                    {
                        item_id: 14,
                        gap_sentence: "Many students who struggle with traditional academics thrive when given the opportunity to pursue ___ in fields like plumbing, cooking, or graphic design.",
                        answer: "vocational training"
                    },
                    {
                        item_id: 15,
                        gap_sentence: "___ platforms such as Coursera and Khan Academy have democratised education by making world-class content available to anyone with an internet connection.",
                        answer: "distance learning"
                    },
                    {
                        item_id: 16,
                        gap_sentence: "Research clearly demonstrates that family support and encouragement are among the strongest predictors of long-term ___.",
                        answer: "academic achievement"
                    },
                    {
                        item_id: 17,
                        gap_sentence: "The excessive ___ placed on students in exam-driven systems has been directly linked to rising rates of depression and anxiety among teenagers.",
                        answer: "academic pressure"
                    },
                    {
                        item_id: 18,
                        gap_sentence: "Critics of ___ argue that a single score cannot fairly represent the full range of a student's intelligence, creativity, and potential.",
                        answer: "standardised testing"
                    },
                    {
                        item_id: 19,
                        gap_sentence: "Schools must actively encourage ___ by asking students to question assumptions, evaluate evidence, and form their own well-reasoned opinions.",
                        answer: "critical thinking"
                    },
                    {
                        item_id: 20,
                        gap_sentence: "The decision of whether to pursue ___ or enter the workforce directly after school is one of the most significant choices a young person will make.",
                        answer: "higher education"
                    }
                ]
            },
            {
                id: 3,
                instruction: "Drag (or click) the correct academic words into the sentence gaps.",
                word_bank: [
                    "meritocratic system", "cognitive development", "privatisation of education",
                    "rote memorisation", "nurture potential", "pedagogical approach",
                    "interdisciplinary learning", "perpetuate inequality", "socioeconomic disparity",
                    "holistic education"
                ],
                items: [
                    {
                        item_id: 21,
                        gap_sentence: "A system that rewards only those who can afford private tutoring can never truly be considered a ___.",
                        answer: "meritocratic system"
                    },
                    {
                        item_id: 22,
                        gap_sentence: "Neuroscientists have confirmed that play-based activities in early childhood are critical for healthy ___ in infants and toddlers.",
                        answer: "cognitive development"
                    },
                    {
                        item_id: 23,
                        gap_sentence: "The rapid ___ of schools in many countries has raised serious ethical questions about whether education should be treated as a business.",
                        answer: "privatisation of education"
                    },
                    {
                        item_id: 24,
                        gap_sentence: "An education system built on ___ produces students who can repeat information but struggle to apply it in real-world situations.",
                        answer: "rote memorisation"
                    },
                    {
                        item_id: 25,
                        gap_sentence: "Philosophers and educators alike argue that the true purpose of school is to ___ of every child, not merely prepare them for examinations.",
                        answer: "nurture potential"
                    },
                    {
                        item_id: 26,
                        gap_sentence: "A truly effective teacher does not rely on a single ___ but instead adapts their methods to suit the diverse needs of their students.",
                        answer: "pedagogical approach"
                    },
                    {
                        item_id: 27,
                        gap_sentence: "___ encourages students to draw connections between history, science, economics, and literature when analysing complex global issues.",
                        answer: "interdisciplinary learning"
                    },
                    {
                        item_id: 28,
                        gap_sentence: "Without bold and targeted investment in underserved communities, the education system will continue to ___ for decades to come.",
                        answer: "perpetuate inequality"
                    },
                    {
                        item_id: 29,
                        gap_sentence: "Campaigners argue that ___ between rich and poor families is the single greatest threat to building a fair and just society.",
                        answer: "socioeconomic disparity"
                    },
                    {
                        item_id: 30,
                        gap_sentence: "A school that embraces ___ recognises that academic grades alone cannot measure the full worth of a human being.",
                        answer: "holistic education"
                    }
                ]
            }
        ],
        speakToUnlock: []
    }
};
