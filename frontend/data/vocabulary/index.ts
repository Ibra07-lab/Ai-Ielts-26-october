/**
 * VOCABULARY DATA INDEX
 * 
 * This file imports and exports all vocabulary topics.
 * 
 * HOW TO ADD A NEW TOPIC:
 * 1. Create a new file in this directory (e.g., 'technology.ts')
 * 2. Follow the same structure as 'business.ts' or 'environment.ts'
 * 3. Import your new topic here
 * 4. Add it to the 'allTopics' array below
 * 5. Your topic will automatically appear in the Vocabulary Builder!
 */

import { TopicData } from "./types";
import { businessTopicData } from "./business";
import { environmentTopicData } from "./environment";

import { educationTopicData } from "./education";
import { speakingPart1TopicData } from "./speaking_part1";
import { speakingPart2TopicData } from "./speaking_part2";
import { speakingPart3TopicData } from "./speaking-part3";
import { shoppingTopicData } from "./shopping";
import { transportMobilityTopicData } from "./transport-mobility";
import { healthSocietyTopicData } from "./health-society";

// Export all topics
export const allTopics: TopicData[] = [
    businessTopicData,
    environmentTopicData,
    educationTopicData,
    speakingPart1TopicData,
    speakingPart2TopicData,
    speakingPart3TopicData,
    shoppingTopicData,
    transportMobilityTopicData,
    healthSocietyTopicData,
];

// Helper functions to get specific data
export const getAllTopics = () => allTopics.map(t => t.topic);

export const getTopicById = (id: number): TopicData | undefined => {
    return allTopics.find(t => t.topic.id === id);
};

export const getWordsByTopicId = (topicId: number) => {
    const topic = getTopicById(topicId);
    return topic?.words || [];
};

export const getExercisesByTopicId = (topicId: number) => {
    const topic = getTopicById(topicId);
    return topic?.exercises || { synonymSwap: [], writingSynonymSwap: [], contextTetris: [], speakToUnlock: [] };
};

// Export types for convenience
export * from "./types";
