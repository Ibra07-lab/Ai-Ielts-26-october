#!/usr/bin/env bun
/**
 * Script to add reading passages to the database
 * Usage: bun run scripts/add-reading-passage.ts
 */

import { createReadingPassage } from "../ielts/reading";

// Your AI Labor Market passage data
const aiLaborMarketPassage = {
  id: 1,
  title: "The Transformative Influence of Artificial Intelligence on the Global Labor Market",
  content: "Full passage content combining all paragraphs...",
  level: "academic" as const,
  estimatedTime: 20,
  paragraphs: [
    {
      id: "P1",
      text: "The advent of artificial intelligence (AI) has ushered in an era of unprecedented technological advancement, profoundly reshaping the landscape of employment worldwide. As algorithms capable of learning from data proliferate, the integration of AI into various industries promises enhanced efficiency and innovation, yet it simultaneously raises concerns about job displacement and the obsolescence of certain skill sets. Central to this discourse is the notion that while AI automates routine tasks, it also fosters the emergence of novel roles that demand human ingenuity and adaptability. This duality underscores the need for strategic workforce development to mitigate potential disruptions. According to a 2023 report by the World Economic Forum, an estimated 85 million jobs may be displaced by AI by 2025, contrasted by the creation of 97 million new positions, highlighting a net positive shift contingent upon proactive reskilling initiatives."
    },
    {
      id: "P2",
      text: "Historically, technological revolutions have mirrored similar patterns of upheaval and renewal, with the Industrial Revolution of the late 18th century serving as a poignant analogy. During that period, mechanization supplanted artisanal labor in textile manufacturing, leading to widespread unemployment among handloom weavers; however, it eventually spurred urbanization and the growth of factory-based economies, engendering diverse employment opportunities. In contemporary terms, AI's incursion into the manufacturing sector exemplifies this trajectory. A case study from the automotive industry illustrates how Ford Motor Company, in collaboration with AI firm Cognizant, implemented predictive maintenance systems in 2022. These systems, leveraging machine learning to forecast equipment failures, reduced downtime by 30 percent and augmented productivity, thereby necessitating fewer manual inspectors but elevating demand for data analysts and AI ethicists to oversee algorithmic fairness."
    },
    {
      id: "P3",
      text: "Beyond manufacturing, the service sector faces equally transformative pressures from AI-driven automation. Customer service, once reliant on human agents for interpersonal interactions, now increasingly incorporates chatbots and virtual assistants that handle routine inquiries with remarkable speed and accuracy. A notable example is the deployment of IBM's Watson Assistant by JPMorgan Chase in 2021, which processed over 1.7 million client queries annually, achieving a 95 percent resolution rate without human intervention. This innovation not only curtails operational costs by an estimated 20 percent but also liberates employees to engage in higher-value tasks such as complex financial advising. Nevertheless, the transition has not been seamless; frontline workers, particularly in developing economies, report skill mismatches, prompting calls for inclusive training programs to bridge the digital divide."
    },
    {
      id: "P4",
      text: "The broader implications of AI's rise extend to socioeconomic equity and policy formulation. As automation disproportionately affects low-skilled occupations, income inequality may exacerbate, with projections from Oxford University's 2019 study indicating that up to 47 percent of jobs in the United States are at high risk of automation. To counteract this, governments and corporations are exploring universal basic income pilots and lifelong learning subsidies. In Singapore, for instance, the SkillsFuture initiative, launched in 2015 and enhanced with AI-focused modules by 2024, has empowered over 500,000 workers to upskill, fostering a resilient labor market. Such interventions underscore the imperative for collaborative efforts to harness AI's potential while safeguarding employment stability."
    }
  ],
  questions: [
    {
      id: 1,
      type: "matching-headings" as const,
      title: "Questions 1–4",
      instructions: "Choose the correct heading for paragraphs P1–P4 from the list of headings below. Write the correct number, i–vii, in boxes 1–4 on your answer sheet.",
      questions: [
        {
          id: 1,
          questionText: "Paragraph 1",
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
          questionText: "Paragraph 2",
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
          questionText: "Paragraph 3",
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
          questionText: "Paragraph 4",
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
      type: "true-false-not-given" as const,
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
      type: "gap-fill" as const,
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
};

async function main() {
  try {
    console.log("Adding AI Labor Market reading passage...");
    
    // In a real implementation, this would call the API or database directly
    const result = await createReadingPassage(aiLaborMarketPassage);
    
    console.log(`✅ Successfully added passage with ID: ${result.id}`);
    console.log("📚 Passage: The Transformative Influence of Artificial Intelligence on the Global Labor Market");
    console.log("📊 Question types: Matching Headings, True/False/Not Given, Gap Fill");
    console.log("⏱️  Estimated time: 20 minutes");
    
  } catch (error) {
    console.error("❌ Error adding passage:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
