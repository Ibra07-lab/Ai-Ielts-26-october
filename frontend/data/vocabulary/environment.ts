import { TopicData } from "./types";

export const environmentTopicData: TopicData = {
    topic: {
        id: 2,
        name: "Environment",
        icon: "🌍",
        description: "Key environmental and sustainability vocabulary for speaking and writing",
        wordsCount: 60,
        color: "bg-green-500",
        ieltsSection: "speaking",
        status: "new",
        previewWords: ["pollution", "climate change", "go green"],
        progress: 0,
    },

    words: [
        // ==========================================
        // BAND 6-8+ SPEAKING VOCABULARY (IDs 1-30)
        // ==========================================

        // BAND 6 VOCABULARY
        {
            id: 1,
            word: "pollution",
            definition: "Dirty or harmful substances that damage the air, water, or land around us",
            exampleSentence: "In my city, air pollution is a really big problem, especially during rush hour when there are so many cars on the road.",
            speakingExample: "I think pollution has gotten so much worse over the last few years, and honestly it really worries me.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["air pollution", "noise pollution", "deal with pollution", "pollution levels"],
            context: "🗣️ Speaking Tip: Use phrases like 'honestly', 'I think', and 'really' to sound more natural and conversational."
        },
        {
            id: 2,
            word: "rubbish / litter",
            definition: "Waste material or garbage that is thrown away carelessly in public places",
            exampleSentence: "It really annoys me when people just drop litter in the street instead of finding a bin.",
            speakingExample: "Our local park used to be beautiful, but now it's covered in rubbish and it's such a shame.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["drop litter", "pick up rubbish", "rubbish bin", "throw away rubbish"],
            context: "🗣️ Speaking Tip: 'Rubbish' and 'litter' are more natural in speaking than the word 'waste' which sounds more formal and written."
        },
        {
            id: 3,
            word: "recycle",
            definition: "To process used items so they can be used again instead of being thrown away",
            exampleSentence: "My family tries to recycle as much as possible — we separate glass, paper, and plastic every week.",
            speakingExample: "To be honest, I didn't used to recycle at all, but then I watched a documentary about ocean plastic and it completely changed my mindset.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "verb",
            type: "academic",
            collocations: ["recycle bottles", "recycle paper", "recycling bin", "recycling centre"],
            context: "🗣️ Speaking Tip: Sharing a personal story like this makes your speaking answer much more interesting and memorable for the examiner."
        },
        {
            id: 4,
            word: "climate change",
            definition: "The long-term change in Earth's weather and temperature patterns, mainly caused by human activity",
            exampleSentence: "Climate change is something I feel really strongly about because I think it's going to affect my generation the most.",
            speakingExample: "You can already see the effects of climate change — the summers are getting hotter and the weather is much more unpredictable than it used to be.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["worried about climate change", "tackle climate change", "effects of climate change"],
            context: "🗣️ Speaking Tip: Use 'I feel strongly about' or 'it concerns me that' to express opinions confidently in Part 3."
        },
        {
            id: 5,
            word: "global warming",
            definition: "The gradual heating of the Earth's surface caused by greenhouse gases trapping heat in the atmosphere",
            exampleSentence: "I learned at school that global warming is mainly caused by burning coal and oil, and I think that's something we really need to stop.",
            speakingExample: "The scary thing about global warming is that if we don't act now, the consequences could be absolutely devastating for future generations.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["caused by global warming", "global warming crisis", "slow down global warming"],
            context: "🗣️ Speaking Tip: Words like 'scary', 'devastating', and 'absolutely' add emotion and emphasis which the examiner wants to hear in speaking."
        },
        {
            id: 6,
            word: "endangered animals",
            definition: "Animals that are at serious risk of dying out completely because their numbers have become very low",
            exampleSentence: "I watched a documentary about endangered animals last month and I was shocked by how many species are close to extinction.",
            speakingExample: "I think we have a responsibility to protect endangered animals, even if it costs money, because once they're gone they're gone forever.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["protect endangered animals", "endangered animals list", "save endangered animals"],
            context: "🗣️ Speaking Tip: Notice the use of 'once they're gone they're gone forever' — short punchy phrases like this sound very natural and fluent in speaking."
        },
        {
            id: 7,
            word: "deforestation",
            definition: "The cutting down of large areas of trees and forests, usually to make space for farming or building",
            exampleSentence: "Deforestation is a huge problem in my opinion because trees are so important for absorbing carbon dioxide from the atmosphere.",
            speakingExample: "I find it really upsetting that so many rainforests are being destroyed just to make room for cattle farming.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["deforestation is a huge problem", "cause deforestation", "stop deforestation"],
            context: "🗣️ Speaking Tip: 'I find it really upsetting that...' is a great phrase for expressing strong feelings in IELTS Speaking Part 3."
        },
        {
            id: 8,
            word: "natural disasters",
            definition: "Terrible events like floods, earthquakes, or hurricanes that happen naturally and cause a lot of destruction",
            exampleSentence: "Where I'm from, we sometimes get really bad floods, so natural disasters are something our community takes very seriously.",
            speakingExample: "I think natural disasters are becoming more frequent because of climate change, and it's really frightening to think about.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["survive a natural disaster", "natural disaster relief", "caused by natural disasters"],
            context: "🗣️ Speaking Tip: Relating topics to your own country or personal experience always makes Part 1 and Part 2 answers more authentic and interesting."
        },
        {
            id: 9,
            word: "go green",
            definition: "To change your lifestyle or habits in order to be more environmentally friendly",
            exampleSentence: "My whole family decided to go green last year — we started using reusable bags, cycling more, and cutting down on meat.",
            speakingExample: "I think more businesses should go green because they produce so much more waste than individual households do.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "idiom",
            type: "idiom",
            collocations: ["go green at home", "try to go green", "encourage people to go green"],
            context: "🗣️ Speaking Tip: Using idioms like 'go green' shows the examiner you have a wide range of vocabulary and can use informal expressions naturally."
        },
        {
            id: 10,
            word: "cut down on",
            definition: "To reduce the amount of something you use or do",
            exampleSentence: "I've been trying to cut down on single-use plastic by carrying a reusable water bottle everywhere I go.",
            speakingExample: "If everyone just cut down on the amount of meat they eat, it would make a massive difference to greenhouse gas emissions.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "phrasal verb",
            type: "phrasal_verb",
            collocations: ["cut down on plastic", "cut down on energy", "cut down on meat", "cut down on driving"],
            context: "🗣️ Speaking Tip: Phrasal verbs like 'cut down on' are very natural in spoken English and will impress the examiner more than overly formal alternatives."
        },

        // BAND 7 VOCABULARY
        {
            id: 11,
            word: "renewable energy",
            definition: "Energy that comes from sources that naturally replenish themselves, like the sun, wind, or water",
            exampleSentence: "I genuinely believe that switching to renewable energy is the most important thing governments can do right now to fight climate change.",
            speakingExample: "In my country, we've started investing a lot more in renewable energy like solar panels, which I think is a really positive step forward.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["switch to renewable energy", "invest in renewable energy", "renewable energy sources"],
            context: "🗣️ Speaking Tip: 'I genuinely believe' and 'I think...which is really a positive step' show confident opinion-giving which is rewarded in Part 3."
        },
        {
            id: 12,
            word: "carbon footprint",
            definition: "The total amount of harmful gases your lifestyle or activities release into the environment",
            exampleSentence: "I've been thinking a lot about my carbon footprint lately and I've started taking the bus instead of asking my parents to drive me everywhere.",
            speakingExample: "Wealthy countries have a much larger carbon footprint than poorer ones, so I think they have a greater responsibility to make changes.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["reduce my carbon footprint", "have a large carbon footprint", "think about carbon footprint"],
            context: "🗣️ Speaking Tip: Showing awareness of global issues like this demonstrates sophisticated thinking, which helps you achieve Band 7+ in Part 3."
        },
        {
            id: 13,
            word: "environmentally friendly",
            definition: "Not harmful to the natural environment; designed or done in a way that protects nature",
            exampleSentence: "I always try to buy environmentally friendly products, even if they cost a little bit more, because I think it's worth it.",
            speakingExample: "Some companies just pretend to be environmentally friendly for marketing purposes, but they don't actually change their practices at all.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "adjective phrase",
            type: "academic",
            collocations: ["environmentally friendly product", "environmentally friendly lifestyle", "more environmentally friendly"],
            context: "🗣️ Speaking Tip: The second example shows critical thinking — the ability to see both sides of an issue — which is essential for Band 7+."
        },
        {
            id: 14,
            word: "raise awareness",
            definition: "To make more people understand and care about an important issue",
            exampleSentence: "I think social media has been really powerful in raising awareness about environmental issues among young people.",
            speakingExample: "Schools should do more to raise awareness about climate change because children are the ones who will have to deal with its consequences.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "verb phrase",
            type: "academic",
            collocations: ["raise awareness about pollution", "raise environmental awareness", "campaign to raise awareness"],
            context: "🗣️ Speaking Tip: This phrase is very useful in Part 3 discussion questions about what people or governments should do to solve environmental problems."
        },
        {
            id: 15,
            word: "biodiversity",
            definition: "The wide variety of different plants and animals living in a particular place or on Earth as a whole",
            exampleSentence: "I think protecting biodiversity is just as important as reducing pollution because every species plays a role in keeping ecosystems balanced.",
            speakingExample: "My country has incredibly rich biodiversity, so it's really sad to see so much of it being destroyed by development projects.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["protect biodiversity", "loss of biodiversity", "rich biodiversity", "biodiversity is threatened"],
            context: "🗣️ Speaking Tip: Talking about your own country's environment makes your answers more personal and helps you speak at length naturally."
        },
        {
            id: 16,
            word: "make a difference",
            definition: "To have a positive and meaningful impact on a situation or problem",
            exampleSentence: "I know some people feel like individual actions don't matter, but I genuinely think that small changes in behaviour can make a real difference over time.",
            speakingExample: "If enough people make the effort to change their habits, it really can make a difference — we've already seen this with the reduction in plastic bag use.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "phrase",
            type: "idiom",
            collocations: ["make a real difference", "make a difference to the environment", "small actions make a difference"],
            context: "🗣️ Speaking Tip: This is a very natural and fluent phrase that sounds much better in speaking than more formal alternatives like 'have a significant impact.'"
        },
        {
            id: 17,
            word: "sustainable",
            definition: "Able to continue over a long period of time without damaging the environment or using up natural resources",
            exampleSentence: "I try to make more sustainable choices in my daily life, like buying second-hand clothes instead of always buying new ones.",
            speakingExample: "The problem is that sustainable products are often more expensive, which makes it really difficult for people on lower incomes to make greener choices.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "adjective",
            type: "academic",
            collocations: ["sustainable lifestyle", "sustainable choices", "sustainable farming", "live sustainably"],
            context: "🗣️ Speaking Tip: Acknowledging barriers and challenges like cost shows balanced and mature thinking, which is rewarded highly by examiners."
        },
        {
            id: 18,
            word: "take responsibility",
            definition: "To accept that you have a duty to deal with a problem or situation",
            exampleSentence: "I think both governments and individuals need to take responsibility for environmental damage rather than always blaming each other.",
            speakingExample: "It frustrates me when big corporations refuse to take responsibility for the pollution they cause and just pass the blame onto consumers.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "verb phrase",
            type: "academic",
            collocations: ["take responsibility for the environment", "take personal responsibility", "take collective responsibility"],
            context: "🗣️ Speaking Tip: Expressing frustration, concern, or passion about a topic makes your speaking much more engaging and memorable for the examiner."
        },
        {
            id: 19,
            word: "environmentally conscious",
            definition: "Being aware of and concerned about the impact your actions have on the natural environment",
            exampleSentence: "I think young people today are much more environmentally conscious than previous generations because we've grown up seeing the effects of climate change.",
            speakingExample: "Being environmentally conscious doesn't mean you have to completely change your life — even small decisions like refusing a plastic straw can add up.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "adjective phrase",
            type: "academic",
            collocations: ["become more environmentally conscious", "environmentally conscious consumer", "environmentally conscious generation"],
            context: "🗣️ Speaking Tip: Comparing generations or groups of people is a great way to develop your answer and speak at length in Part 3."
        },
        {
            id: 20,
            word: "natural habitat",
            definition: "The natural environment in which a particular animal or plant normally lives and grows",
            exampleSentence: "It breaks my heart to see animals losing their natural habitat because humans keep expanding into wild areas for farming and construction.",
            speakingExample: "I visited a nature reserve last summer that was specifically set up to protect the natural habitat of several endangered bird species, and it was absolutely beautiful.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["destroy natural habitat", "protect natural habitat", "loss of natural habitat", "animal's natural habitat"],
            context: "🗣️ Speaking Tip: 'It breaks my heart' is a powerful emotional expression that makes speaking answers sound genuinely passionate and fluent."
        },

        // BAND 8+ VOCABULARY
        {
            id: 21,
            word: "environmental impact",
            definition: "The effect that human activities have on the natural world, which can be positive or negative",
            exampleSentence: "I think every company should be legally required to assess the environmental impact of their products before putting them on the market.",
            speakingExample: "People often underestimate the environmental impact of their food choices — meat production, for example, uses an enormous amount of water and land.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["reduce environmental impact", "assess environmental impact", "serious environmental impact", "environmental impact of industry"],
            context: "🗣️ Speaking Tip: Using phrases like 'people often underestimate' shows critical and analytical thinking which is characteristic of Band 8 responses."
        },
        {
            id: 22,
            word: "vicious cycle",
            definition: "A situation where one problem causes another problem, which then makes the first problem worse, creating a continuous and worsening loop",
            exampleSentence: "It's a real vicious cycle — poverty forces people to exploit natural resources to survive, which then leads to more environmental damage, which then leads to more poverty.",
            speakingExample: "We need to break this vicious cycle of consuming more and producing more waste before it becomes completely impossible to reverse.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "idiom",
            type: "idiom",
            collocations: ["trapped in a vicious cycle", "break the vicious cycle", "create a vicious cycle"],
            context: "🗣️ Speaking Tip: Idioms like 'vicious cycle' demonstrate a very high level of vocabulary range and will really impress your examiner at Band 8+."
        },
        {
            id: 23,
            word: "turn a blind eye",
            definition: "To deliberately ignore something that you know is wrong or harmful",
            exampleSentence: "For decades, governments turned a blind eye to the environmental damage caused by large corporations because they were more concerned about economic growth.",
            speakingExample: "We can't keep turning a blind eye to deforestation and hope that the problem goes away on its own — we need real action now.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "idiom",
            type: "idiom",
            collocations: ["turn a blind eye to pollution", "turn a blind eye to environmental damage"],
            context: "🗣️ Speaking Tip: This idiom works brilliantly in Part 3 answers about government responsibility and is a strong indicator of Band 8+ lexical range."
        },
        {
            id: 24,
            word: "at the expense of",
            definition: "Causing harm or disadvantage to something else in order to achieve a goal",
            exampleSentence: "For too long, countries have pursued economic growth at the expense of the environment, and we're now starting to see the consequences of that approach.",
            speakingExample: "I don't think we should have to choose between development and conservation — surely we can achieve progress without doing it at the expense of the natural world.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "prepositional phrase",
            type: "idiom",
            collocations: ["economic growth at the expense of the environment", "development at the expense of nature"],
            context: "🗣️ Speaking Tip: This phrase is excellent for comparing trade-offs, which is a very common theme in IELTS Speaking Part 3 environment questions."
        },
        {
            id: 25,
            word: "bear the brunt of",
            definition: "To suffer the worst or largest part of something unpleasant",
            exampleSentence: "It's deeply unfair that developing nations bear the brunt of climate change when it's the wealthy industrialised countries that have caused most of the damage.",
            speakingExample: "Coastal communities are bearing the brunt of rising sea levels, yet they have contributed the least to the problem of global warming.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "idiom",
            type: "idiom",
            collocations: ["bear the brunt of climate change", "bear the brunt of environmental damage"],
            context: "🗣️ Speaking Tip: This idiom adds sophistication and fairness awareness to your answer and shows the examiner you can discuss complex issues with nuance."
        },
        {
            id: 26,
            word: "a drop in the ocean",
            definition: "A very small and insufficient amount compared to what is actually needed",
            exampleSentence: "Sometimes I feel like my individual efforts to protect the environment are just a drop in the ocean compared to the damage being done by large industries.",
            speakingExample: "The funding that most governments allocate to environmental protection is honestly a drop in the ocean compared to what is actually needed to solve the crisis.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "idiom",
            type: "idiom",
            collocations: ["just a drop in the ocean", "feel like a drop in the ocean"],
            context: "🗣️ Speaking Tip: This idiom is very natural in spoken English and is perfect for expressing the feeling that efforts are not enough — a very common opinion in environment discussions."
        },
        {
            id: 27,
            word: "wake-up call",
            definition: "An event or experience that makes people suddenly realise they need to take urgent action about a serious problem",
            exampleSentence: "I think the COVID-19 pandemic was actually a wake-up call for humanity to reconsider how we treat the natural world.",
            speakingExample: "Extreme weather events like the Australian wildfires should have been a wake-up call for world leaders, but unfortunately not enough has changed since then.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "idiom",
            type: "idiom",
            collocations: ["serve as a wake-up call", "be a wake-up call for governments", "need a wake-up call"],
            context: "🗣️ Speaking Tip: Referring to real-world events like wildfires or floods shows that you are well-informed and can discuss the topic with depth and confidence."
        },
        {
            id: 28,
            word: "strike a balance",
            definition: "To find a fair and sensible middle point between two opposing needs or demands",
            exampleSentence: "I think the biggest challenge for modern governments is to strike a balance between economic development and environmental protection — it's incredibly difficult but absolutely necessary.",
            speakingExample: "Farmers need to strike a balance between producing enough food to feed the population and doing so in a way that doesn't destroy the land for future generations.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "phrase",
            type: "idiom",
            collocations: ["strike a balance between development and conservation", "strike a balance between economy and environment"],
            context: "🗣️ Speaking Tip: This phrase is perfect for Part 3 discussion questions that ask you to consider both sides of an environmental debate."
        },
        {
            id: 29,
            word: "in the long run",
            definition: "Over a long period of time; considering what will happen in the future rather than right now",
            exampleSentence: "Investing in renewable energy might be expensive at first, but in the long run it will save governments huge amounts of money and protect the planet.",
            speakingExample: "I always think about the long run when it comes to environmental decisions — short-term profits are never worth the long-term damage to our ecosystems.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "phrase",
            type: "idiom",
            collocations: ["better in the long run", "pay off in the long run", "think about the long run"],
            context: "🗣️ Speaking Tip: This phrase helps you extend your answers naturally and shows the examiner you can think beyond the immediate and consider future consequences."
        },
        {
            id: 30,
            word: "it goes without saying",
            definition: "Something is so obvious that it does not even need to be stated",
            exampleSentence: "It goes without saying that we have a responsibility to leave the planet in a better condition than we found it — the question is whether we actually have the willpower to do so.",
            speakingExample: "It goes without saying that clean air and water are basic human rights, yet millions of people around the world are being denied both because of industrial pollution.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "phrase",
            type: "idiom",
            collocations: ["it goes without saying that we need to protect the environment"],
            context: "🗣️ Speaking Tip: This phrase is a sophisticated discourse marker that makes your speaking sound very fluent and natural — perfect for opening a strong Part 3 opinion statement."
        },

        // ==========================================
        // BAND 6-8+ WRITING VOCABULARY (IDs 31-60)
        // ==========================================

        {
            id: 31,
            word: "pollution",
            definition: "The presence of harmful or poisonous substances in the natural environment, making it dirty and dangerous",
            exampleSentence: "Air pollution in major cities has reached dangerously high levels, posing serious health risks to millions of residents.",
            writingExample: "Governments must introduce stricter regulations to reduce industrial pollution before irreversible damage is done to natural ecosystems.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["air pollution", "water pollution", "cause pollution", "reduce pollution", "pollution levels"]
        },
        {
            id: 32,
            word: "climate change",
            definition: "Long-term shifts in global temperatures and weather patterns, largely caused by human industrial activity",
            exampleSentence: "The effects of climate change are becoming increasingly visible through rising sea levels and more frequent extreme weather events.",
            writingExample: "World leaders must cooperate more effectively to address climate change before it reaches a point of no return.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["address climate change", "combat climate change", "effects of climate change", "climate change policy"]
        },
        {
            id: 33,
            word: "deforestation",
            definition: "The large-scale cutting down and removal of forests, usually to make land available for farming or construction",
            exampleSentence: "Rapid deforestation in the Amazon rainforest is destroying one of the world's most important carbon sinks.",
            writingExample: "Governments must introduce stronger laws to prevent deforestation driven by agricultural expansion and illegal logging.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["cause deforestation", "prevent deforestation", "rapid deforestation", "deforestation rate", "combat deforestation"]
        },
        {
            id: 34,
            word: "recycle",
            definition: "To convert used or waste materials into new products in order to reduce waste and conserve natural resources",
            exampleSentence: "Many countries have introduced mandatory recycling programmes to reduce the amount of waste sent to landfill sites.",
            writingExample: "Encouraging citizens to recycle household waste is one of the simplest yet most effective ways to protect the environment.",
            difficultyLevel: 5,
            topic: "Environment",
            partOfSpeech: "verb",
            type: "academic",
            collocations: ["recycle waste", "recycle materials", "encourage recycling", "recycling programme", "recycling rate"]
        },
        {
            id: 35,
            word: "endangered species",
            definition: "A type of animal or plant that exists in very small numbers and is at serious risk of becoming extinct",
            exampleSentence: "The destruction of natural habitats is the leading cause of the growing number of endangered species worldwide.",
            writingExample: "Governments must allocate greater funding to protect endangered species from the threat of extinction caused by human activity.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["protect endangered species", "endangered species list", "threatened endangered species", "conserve endangered species"]
        },
        {
            id: 36,
            word: "fossil fuels",
            definition: "Natural fuels such as coal, oil, and gas that were formed millions of years ago from the remains of living organisms and release carbon dioxide when burned",
            exampleSentence: "The continued burning of fossil fuels is the primary driver of greenhouse gas emissions and global warming.",
            writingExample: "Nations must urgently reduce their dependence on fossil fuels and transition to cleaner and more sustainable energy sources.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["burn fossil fuels", "dependence on fossil fuels", "reduce fossil fuel use", "fossil fuel emissions"]
        },
        {
            id: 37,
            word: "waste",
            definition: "Unwanted or unusable materials, substances, or by-products that result from human activity or industrial processes",
            exampleSentence: "Poor waste management in developing countries has led to severe contamination of rivers and groundwater supplies.",
            writingExample: "Consumers can play a significant role in protecting the environment simply by reducing the amount of household waste they produce.",
            difficultyLevel: 5,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["reduce waste", "produce waste", "household waste", "industrial waste", "waste management", "toxic waste"]
        },
        {
            id: 38,
            word: "natural disaster",
            definition: "A catastrophic event caused by natural forces such as earthquakes, floods, hurricanes, or wildfires that causes widespread destruction",
            exampleSentence: "Scientists warn that climate change is increasing both the frequency and intensity of natural disasters such as hurricanes and floods.",
            writingExample: "Developing nations are often the least equipped to recover from natural disasters despite contributing the least to global carbon emissions.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["cause a natural disaster", "natural disaster relief", "frequency of natural disasters", "survive a natural disaster"]
        },
        {
            id: 39,
            word: "global warming",
            definition: "The gradual increase in the overall temperature of the Earth's atmosphere caused by the buildup of greenhouse gases",
            exampleSentence: "The effects of global warming are already being felt through melting polar ice caps and rising ocean temperatures.",
            writingExample: "Without immediate and coordinated international action, scientists predict that global warming will reach catastrophic levels within this century.",
            difficultyLevel: 6,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["cause global warming", "slow global warming", "effects of global warming", "global warming crisis", "global warming targets"]
        },
        {
            id: 40,
            word: "conservation",
            definition: "The careful protection and preservation of the natural environment, wildlife, and natural resources to prevent their destruction",
            exampleSentence: "Wildlife conservation programmes have successfully helped several species recover from the brink of extinction.",
            writingExample: "Environmental conservation must be treated as a shared global responsibility rather than the obligation of individual nations alone.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["wildlife conservation", "conservation effort", "promote conservation", "conservation programme", "environmental conservation"]
        },
        {
            id: 41,
            word: "greenhouse gas emissions",
            definition: "The release of gases such as carbon dioxide and methane into the atmosphere that trap heat and contribute to global warming",
            exampleSentence: "Reducing greenhouse gas emissions is the single most important step the international community can take to slow climate change.",
            writingExample: "Many developed nations have committed to cutting greenhouse gas emissions by at least fifty percent before the year 2050.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["reduce greenhouse gas emissions", "greenhouse gas emissions target", "cut greenhouse gas emissions", "greenhouse gas emissions levels"]
        },
        {
            id: 42,
            word: "renewable energy",
            definition: "Energy generated from natural sources that are constantly replenished, such as sunlight, wind, and water, and do not produce harmful emissions",
            exampleSentence: "Investing heavily in renewable energy sources such as solar and wind power is essential for achieving a carbon-neutral future.",
            writingExample: "Governments that fail to develop renewable energy infrastructure risk falling behind both environmentally and economically in the coming decades.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["invest in renewable energy", "renewable energy source", "switch to renewable energy", "renewable energy policy", "develop renewable energy"]
        },
        {
            id: 43,
            word: "carbon footprint",
            definition: "The total amount of greenhouse gases, particularly carbon dioxide, that are produced directly or indirectly by a person, organisation, or activity",
            exampleSentence: "Individuals can significantly reduce their carbon footprint by choosing public transport over private car use.",
            writingExample: "Companies are under increasing pressure from consumers and regulators to measure and lower their carbon footprint across all areas of operation.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["reduce carbon footprint", "calculate carbon footprint", "large carbon footprint", "lower carbon footprint"]
        },
        {
            id: 44,
            word: "biodiversity",
            definition: "The variety of plant and animal life found in a particular habitat or on Earth as a whole, which is essential for healthy and stable ecosystems",
            exampleSentence: "The rapid loss of biodiversity caused by habitat destruction poses a serious threat to the stability of global ecosystems.",
            writingExample: "Protecting biodiversity is not merely an environmental concern but also an economic one, as many industries depend on healthy and functioning ecosystems.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun",
            type: "academic",
            collocations: ["protect biodiversity", "loss of biodiversity", "biodiversity crisis", "preserve biodiversity", "threaten biodiversity"]
        },
        {
            id: 45,
            word: "sustainable development",
            definition: "Economic and social progress that meets the needs of the present without compromising the ability of future generations to meet their own needs",
            exampleSentence: "The United Nations has outlined seventeen sustainable development goals designed to balance economic growth with environmental protection.",
            writingExample: "Achieving sustainable development requires governments, businesses, and citizens to work together toward long-term environmental and social responsibility.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["promote sustainable development", "sustainable development goal", "achieve sustainable development", "sustainable development policy"]
        },
        {
            id: 46,
            word: "habitat destruction",
            definition: "The process by which a natural environment is altered or destroyed to the point where it can no longer support the species that lived there",
            exampleSentence: "Widespread habitat destruction caused by urban expansion is pushing countless animal and plant species toward extinction.",
            writingExample: "Preventing further habitat destruction must be prioritised in national environmental policies if governments are serious about preserving wildlife.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["cause habitat destruction", "habitat destruction rate", "prevent habitat destruction", "widespread habitat destruction"]
        },
        {
            id: 47,
            word: "carbon emissions",
            definition: "The release of carbon dioxide and other carbon compounds into the atmosphere as a result of burning fossil fuels and other industrial processes",
            exampleSentence: "Many countries have pledged to reach net-zero carbon emissions by 2050 as part of international climate agreements.",
            writingExample: "Heavy industries such as steel production and aviation are among the most challenging sectors to decarbonise due to their high carbon emissions.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["cut carbon emissions", "carbon emissions target", "reduce carbon emissions", "carbon emissions trading", "net-zero carbon emissions"]
        },
        {
            id: 48,
            word: "environmental awareness",
            definition: "An understanding and appreciation of the natural environment and the importance of protecting it from human-caused damage",
            exampleSentence: "Raising environmental awareness among young people through school education is one of the most effective long-term strategies for protecting the planet.",
            writingExample: "Despite growing environmental awareness, consumer behaviour has not changed significantly enough to make a meaningful difference to global pollution levels.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["raise environmental awareness", "promote environmental awareness", "lack of environmental awareness", "environmental awareness campaign"]
        },
        {
            id: 49,
            word: "eco-friendly",
            definition: "Describing products, practices, or lifestyles that cause little or no harm to the natural environment",
            exampleSentence: "Many supermarkets are now switching to eco-friendly packaging in response to growing consumer demand for sustainable products.",
            writingExample: "Adopting an eco-friendly lifestyle does not require dramatic sacrifices but rather a series of small, consistent changes in daily habits.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "adjective",
            type: "academic",
            collocations: ["eco-friendly product", "eco-friendly lifestyle", "eco-friendly packaging", "adopt eco-friendly practices", "eco-friendly alternative"]
        },
        {
            id: 50,
            word: "natural resources",
            definition: "Materials and substances that occur naturally in the environment and can be used by humans, such as water, timber, oil, and minerals",
            exampleSentence: "The rapid depletion of natural resources such as freshwater and timber threatens the long-term survival of both human and animal populations.",
            writingExample: "Governments must introduce sustainable policies to manage natural resources responsibly and prevent their irreversible exhaustion.",
            difficultyLevel: 7,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["deplete natural resources", "manage natural resources", "exploit natural resources", "protect natural resources", "natural resource consumption"]
        },
        {
            id: 51,
            word: "ecological footprint",
            definition: "A measure of the demand that human activity places on the Earth's natural ecosystems, expressed in terms of the amount of land and water required to sustain it",
            exampleSentence: "Wealthy nations have a disproportionately large ecological footprint compared to developing countries, yet often bear less of the consequences of environmental damage.",
            writingExample: "Measuring the ecological footprint of cities allows urban planners to identify the most resource-intensive areas and develop targeted sustainability strategies.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["reduce ecological footprint", "measure ecological footprint", "large ecological footprint", "ecological footprint of a nation"]
        },
        {
            id: 52,
            word: "carbon neutrality",
            definition: "A state in which the amount of carbon dioxide released into the atmosphere is balanced by an equivalent amount being removed, resulting in no net increase",
            exampleSentence: "Achieving carbon neutrality by 2050 will require a complete transformation of how nations produce energy, manufacture goods, and organise transportation.",
            writingExample: "Several major corporations have committed to carbon neutrality, though critics argue that many of these pledges lack the concrete action plans needed to be meaningful.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["achieve carbon neutrality", "commit to carbon neutrality", "carbon neutrality target", "path to carbon neutrality"]
        },
        {
            id: 53,
            word: "environmental degradation",
            definition: "The deterioration of the natural environment through the depletion of resources, destruction of ecosystems, and accumulation of pollutants caused by human activity",
            exampleSentence: "Unchecked industrial activity has accelerated environmental degradation to a point where some ecosystems may be beyond recovery.",
            writingExample: "Environmental degradation disproportionately affects the world's poorest communities, who depend most heavily on healthy natural environments for their livelihoods.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["cause environmental degradation", "prevent environmental degradation", "environmental degradation crisis", "accelerate environmental degradation"]
        },
        {
            id: 54,
            word: "anthropogenic climate change",
            definition: "Climate change that is caused or significantly influenced by human activities, particularly the burning of fossil fuels and large-scale deforestation",
            exampleSentence: "The scientific consensus on anthropogenic climate change is overwhelming, yet political resistance continues to slow meaningful policy reform.",
            writingExample: "Anthropogenic climate change, driven primarily by industrial emissions and deforestation, represents the defining environmental challenge of the twenty-first century.",
            difficultyLevel: 9,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["evidence of anthropogenic climate change", "address anthropogenic climate change", "caused by anthropogenic factors"]
        },
        {
            id: 55,
            word: "ecosystem collapse",
            definition: "The complete breakdown of an ecosystem when it can no longer support the species and processes that depend on it, often leading to mass extinction",
            exampleSentence: "Scientists warn that the continued destruction of coral reefs could trigger a wider ecosystem collapse with devastating consequences for marine biodiversity.",
            writingExample: "The risk of ecosystem collapse in the Amazon basin has intensified dramatically due to the combined pressures of deforestation, drought, and wildfires.",
            difficultyLevel: 9,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["risk of ecosystem collapse", "prevent ecosystem collapse", "trigger ecosystem collapse", "ecosystem collapse crisis"]
        },
        {
            id: 56,
            word: "circular economy",
            definition: "An economic system designed to eliminate waste by keeping materials and products in use for as long as possible through reuse, repair, and recycling",
            exampleSentence: "Transitioning to a circular economy, in which waste is minimised and materials are continuously reused, is essential for achieving genuine long-term sustainability.",
            writingExample: "A circular economy model challenges the traditional linear approach of producing, consuming, and discarding, replacing it with a regenerative system that eliminates waste.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["adopt a circular economy", "transition to a circular economy", "circular economy model", "circular economy principle"]
        },
        {
            id: 57,
            word: "environmental legislation",
            definition: "Laws and regulations introduced by governments to protect the natural environment and control human activities that cause pollution or ecological damage",
            exampleSentence: "Strengthening environmental legislation is essential to holding corporations accountable for the ecological damage caused by their operations.",
            writingExample: "Without robust environmental legislation backed by meaningful penalties, many industries will continue to prioritise profit over ecological responsibility.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["strengthen environmental legislation", "introduce environmental legislation", "enforce environmental legislation", "weaken environmental legislation"]
        },
        {
            id: 58,
            word: "climate refugee",
            definition: "A person who is forced to leave their home or country due to the devastating effects of climate change, such as rising sea levels, drought, or extreme weather events",
            exampleSentence: "Rising sea levels and prolonged droughts are expected to create hundreds of millions of climate refugees by the end of this century.",
            writingExample: "The international community has yet to establish a clear legal framework to protect climate refugees, leaving them in a deeply vulnerable position.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["climate refugee crisis", "become a climate refugee", "climate refugee displacement", "protect climate refugees"]
        },
        {
            id: 59,
            word: "irreversible damage",
            definition: "Harm or destruction caused to the environment that is permanent and cannot be undone or repaired, regardless of future human effort",
            exampleSentence: "Scientists warn that unless carbon emissions are drastically reduced within the next decade, irreversible damage to the planet's climate systems will be unavoidable.",
            writingExample: "The mass extinction of pollinator species such as bees could cause irreversible damage to global food production systems that humanity depends upon for survival.",
            difficultyLevel: 8,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["cause irreversible damage", "prevent irreversible damage", "irreversible damage to ecosystems", "risk of irreversible damage"]
        },
        {
            id: 60,
            word: "intergenerational responsibility",
            definition: "The moral obligation of the current generation to protect the environment and preserve natural resources so that future generations can enjoy the same quality of life",
            exampleSentence: "Protecting the environment is an intergenerational responsibility, meaning that the decisions made today will directly determine the quality of life available to future generations.",
            writingExample: "The concept of intergenerational responsibility compels current policymakers to look beyond short-term economic gains and consider the long-term environmental legacy they leave behind.",
            difficultyLevel: 9,
            topic: "Environment",
            partOfSpeech: "noun phrase",
            type: "academic",
            collocations: ["intergenerational responsibility for the environment", "fulfil intergenerational responsibility", "concept of intergenerational responsibility"]
        }
    ],
    exercises: {
        synonymSwap: [
            {
                id: 1,
                sentence: "In my city, harmful substances in the air has become a really serious problem, especially near busy roads and factories.",
                targetWord: "harmful substances in the air",
                options: [
                    { id: "A", text: "Smog", isCorrect: false, feedback: "Incorrect. Smog is a type of air pollution, but not the general term." },
                    { id: "B", text: "Air pollution", isCorrect: true, feedback: "Correct! Air pollution refers to harmful substances in the air." },
                    { id: "C", text: "Global warming", isCorrect: false, feedback: "Incorrect. This refers to the rising temperature of the planet." },
                    { id: "D", text: "Toxic waste", isCorrect: false, feedback: "Incorrect. Toxic waste usually refers to harmful solid or liquid materials." }
                ]
            },
            {
                id: 2,
                sentence: "I think the dirtying of our rivers and oceans is one of the most devastating environmental problems we face today.",
                targetWord: "the dirtying of our rivers and oceans",
                options: [
                    { id: "A", text: "Oil spill", isCorrect: false, feedback: "Incorrect. An oil spill is one cause of water pollution." },
                    { id: "B", text: "Contamination", isCorrect: false, feedback: "Incorrect. This is a general term for making something dirty." },
                    { id: "C", text: "Water pollution", isCorrect: true, feedback: "Correct! The dirtying of water bodies is water pollution." },
                    { id: "D", text: "Acid rain", isCorrect: false, feedback: "Incorrect. Acid rain is a result of air pollution affecting rain." }
                ]
            },
            {
                id: 3,
                sentence: "It really annoys me when people throw waste carelessly on the ground in public parks instead of using a bin.",
                targetWord: "throw waste carelessly on the ground",
                options: [
                    { id: "A", text: "Throw away", isCorrect: false, feedback: "Incorrect. Throw away is a neutral term for discarding things." },
                    { id: "B", text: "Drop litter", isCorrect: true, feedback: "Correct! Throwing waste on the ground is dropping litter." },
                    { id: "C", text: "Recycle", isCorrect: false, feedback: "Incorrect. Recycling is the opposite of throwing waste away." },
                    { id: "D", text: "Pollute", isCorrect: false, feedback: "Incorrect. Pollution is the result, dropping litter is the action." }
                ]
            },
            {
                id: 4,
                sentence: "Our local beach used to be absolutely beautiful, but now it's completely covered in carelessly discarded waste and it makes me so sad.",
                targetWord: "carelessly discarded waste",
                options: [
                    { id: "A", text: "Debris", isCorrect: false, feedback: "Incorrect. Debris is usually scattered remains or fragments." },
                    { id: "B", text: "Rubbish", isCorrect: true, feedback: "Correct! Carelessly discarded waste is commonly called rubbish or litter." },
                    { id: "C", text: "Clutter", isCorrect: false, feedback: "Incorrect. Clutter is a collection of things lying around untidily." },
                    { id: "D", text: "Compost", isCorrect: false, feedback: "Incorrect. Compost is organic matter used as fertilizer." }
                ]
            },
            {
                id: 5,
                sentence: "My family tries really hard to process used materials so they can be used again — we separate glass, plastic, and paper every single week.",
                targetWord: "process used materials so they can be used again",
                options: [
                    { id: "A", text: "Reuse", isCorrect: false, feedback: "Incorrect. Reuse means using the same item again, not processing it." },
                    { id: "B", text: "Recycle", isCorrect: true, feedback: "Correct! Processing materials to use them again is recycling." },
                    { id: "C", text: "Reduce", isCorrect: false, feedback: "Incorrect. Reducing is using less of something." },
                    { id: "D", text: "Repurpose", isCorrect: false, feedback: "Incorrect. Repurposing is finding a new use for an item as it is." }
                ]
            },
            {
                id: 6,
                sentence: "I didn't used to care about turning old items into new ones at all, but watching a documentary about ocean plastic completely changed the way I think.",
                targetWord: "turning old items into new ones",
                options: [
                    { id: "A", text: "Upcycling", isCorrect: false, feedback: "Incorrect. Upcycling is turning waste into something of higher value." },
                    { id: "B", text: "Recycling", isCorrect: true, feedback: "Correct! Turning old items into new ones is the core of recycling." },
                    { id: "C", text: "Processing", isCorrect: false, feedback: "Incorrect. This is too broad a term." },
                    { id: "D", text: "Sorting", isCorrect: false, feedback: "Incorrect. Sorting is the step before recycling or disposal." }
                ]
            },
            {
                id: 7,
                sentence: "The long-term shift in global temperatures caused by human activity is something I feel really strongly about because it will affect my generation the most.",
                targetWord: "the long-term shift in global temperatures caused by human activity",
                options: [
                    { id: "A", text: "Global warming", isCorrect: false, feedback: "Incorrect. Global warming is one aspect of climate change." },
                    { id: "B", text: "Climate change", isCorrect: true, feedback: "Correct! Long-term shift in temperatures and weather is climate change." },
                    { id: "C", text: "Weather shifts", isCorrect: false, feedback: "Incorrect. Weather shift is short term." },
                    { id: "D", text: "Environmental shift", isCorrect: false, feedback: "Incorrect. This is too vague." }
                ]
            },
            {
                id: 8,
                sentence: "You can already see the signs of shifts in the Earth's weather patterns all around us — the summers are hotter and storms are much more intense than they used to be.",
                targetWord: "shifts in the Earth's weather patterns",
                options: [
                    { id: "A", text: "Natural disaster", isCorrect: false, feedback: "Incorrect. This is a single catastrophic event." },
                    { id: "B", text: "Climate change", isCorrect: true, feedback: "Correct! Shifts in weather patterns are a hallmark of climate change." },
                    { id: "C", text: "Seasonal rotation", isCorrect: false, feedback: "Incorrect. This is the normal change of seasons." },
                    { id: "D", text: "Atmospheric pressure", isCorrect: false, feedback: "Incorrect. This is a scientific measure of air weight." }
                ]
            },
            {
                id: 9,
                sentence: "I learned at school that the gradual heating up of the Earth's surface is mainly caused by burning coal and oil, and I think that's something we urgently need to stop.",
                targetWord: "the gradual heating up of the Earth's surface",
                options: [
                    { id: "A", text: "Greenhouse effect", isCorrect: false, feedback: "Incorrect. This is the process that causes global warming." },
                    { id: "B", text: "Global warming", isCorrect: true, feedback: "Correct! The gradual heating of the Earth is global warming." },
                    { id: "C", text: "Carbon increase", isCorrect: false, feedback: "Incorrect. This is one cause, not the name of the phenomenon." },
                    { id: "D", text: "Heatwave", isCorrect: false, feedback: "Incorrect. A heatwave is a short period of very hot weather." }
                ]
            },
            {
                id: 10,
                sentence: "The scary thing about the planet getting hotter and hotter over time is that if we don't act now, the consequences could be absolutely catastrophic.",
                targetWord: "the planet getting hotter and hotter over time",
                options: [
                    { id: "A", text: "Climate change", isCorrect: false, feedback: "Incorrect. Climate change is the broader category." },
                    { id: "B", text: "Global warming", isCorrect: true, feedback: "Correct! The planet getting hotter is global warming." },
                    { id: "C", text: "Environmental degradation", isCorrect: false, feedback: "Incorrect. This is the general wearing down of the environment." },
                    { id: "D", text: "Resource depletion", isCorrect: false, feedback: "Incorrect. This means using up all natural materials." }
                ]
            },
            {
                id: 11,
                sentence: "I watched a documentary last month about animals that are close to dying out completely and I was absolutely shocked by how many species are at risk.",
                targetWord: "animals that are close to dying out completely",
                options: [
                    { id: "A", text: "Extinct species", isCorrect: false, feedback: "Incorrect. Extinct species are already gone." },
                    { id: "B", text: "Endangered animals", isCorrect: true, feedback: "Correct! Animals at risk of dying out are endangered." },
                    { id: "C", text: "Wildlife", isCorrect: false, feedback: "Incorrect. Wildlife refers to all wild animals generally." },
                    { id: "D", text: "Biodiversity", isCorrect: false, feedback: "Incorrect. Biodiversity is the variety of species." }
                ]
            },
            {
                id: 12,
                sentence: "I think we have a real moral responsibility to protect creatures whose numbers have dropped so low they might disappear forever, even if conservation costs a lot of money.",
                targetWord: "creatures whose numbers have dropped so low they might disappear forever",
                options: [
                    { id: "A", text: "Rare creatures", isCorrect: false, feedback: "Incorrect. Rare doesn't necessarily mean they are at risk of disappearing." },
                    { id: "B", text: "Endangered animals", isCorrect: true, feedback: "Correct! Animals at risk of disappearing are endangered." },
                    { id: "C", text: "Protected species", isCorrect: false, feedback: "Incorrect. This is a legal status, not the description of risk." },
                    { id: "D", text: "Conservation list", isCorrect: false, feedback: "Incorrect. This is a list, not the group of animals themselves." }
                ]
            },
            {
                id: 13,
                sentence: "The large-scale cutting down of rainforests is a huge problem in my opinion because trees are absolutely essential for absorbing carbon dioxide from the atmosphere.",
                targetWord: "the large-scale cutting down of rainforests",
                options: [
                    { id: "A", text: "Logging", isCorrect: false, feedback: "Incorrect. Logging is the business of cutting down trees for timber." },
                    { id: "B", text: "Deforestation", isCorrect: true, feedback: "Correct! Large-scale removal of forests is deforestation." },
                    { id: "C", text: "Wood cutting", isCorrect: false, feedback: "Incorrect. This is too informal and small-scale." },
                    { id: "D", text: "Forest clearance", isCorrect: false, feedback: "Incorrect. While similar, 'deforestation' is the standard academic term." }
                ]
            },
            {
                id: 14,
                sentence: "I find it really upsetting that so many forests are being destroyed through the removal of trees on a massive scale just to make room for cattle farming and agriculture.",
                targetWord: "the removal of trees on a massive scale",
                options: [
                    { id: "A", text: "Urban sprawl", isCorrect: false, feedback: "Incorrect. Urban sprawl is the expansion of cities." },
                    { id: "B", text: "Deforestation", isCorrect: true, feedback: "Correct! Massive removal of trees is deforestation." },
                    { id: "C", text: "Habitat loss", isCorrect: false, feedback: "Incorrect. Habitat loss is a result of deforestation." },
                    { id: "D", text: "Desertification", isCorrect: false, feedback: "Incorrect. This is the process of land becoming desert." }
                ]
            },
            {
                id: 15,
                sentence: "Scientists are warning that climate change is making terrible events like floods and hurricanes caused by nature much more frequent and much more powerful.",
                targetWord: "terrible events like floods and hurricanes caused by nature",
                options: [
                    { id: "A", text: "Extreme weather", isCorrect: false, feedback: "Incorrect. This is a general term for severe weather." },
                    { id: "B", text: "Natural disasters", isCorrect: true, feedback: "Correct! Floods and hurricanes are types of natural disasters." },
                    { id: "C", text: "Environmental crises", isCorrect: false, feedback: "Incorrect. This could include pollution or other issues." },
                    { id: "D", text: "Geological events", isCorrect: false, feedback: "Incorrect. These are usually earthquakes or volcanoes." }
                ]
            },
            {
                id: 16,
                sentence: "Where I come from, we sometimes experience really severe catastrophic weather events, so it's something our community takes incredibly seriously and prepares for every year.",
                targetWord: "catastrophic weather events",
                options: [
                    { id: "A", text: "Storm events", isCorrect: false, feedback: "Incorrect. Storm events is too specific and less formal." },
                    { id: "B", text: "Natural disasters", isCorrect: true, feedback: "Correct! Catastrophic weather events are natural disasters." },
                    { id: "C", text: "Weather emergencies", isCorrect: false, feedback: "Incorrect. This is an immediate state, not the general noun." },
                    { id: "D", text: "Climate impacts", isCorrect: false, feedback: "Incorrect. This refers to the effects of climate change." }
                ]
            },
            {
                id: 17,
                sentence: "My whole family decided to start living in a more environmentally friendly way last year — we began cycling more, using reusable bags, and cutting down on meat.",
                targetWord: "start living in a more environmentally friendly way",
                options: [
                    { id: "A", text: "Save the planet", isCorrect: false, feedback: "Incorrect. This is a very broad slogan." },
                    { id: "B", text: "Go green", isCorrect: true, feedback: "Correct! To 'go green' means to adopt an eco-friendly lifestyle." },
                    { id: "C", text: "Live simply", isCorrect: false, feedback: "Incorrect. This doesn't necessarily mean eco-friendly." },
                    { id: "D", text: "Be sustainable", isCorrect: false, feedback: "Incorrect. While related, 'go green' is the standard idiom used here." }
                ]
            },
            {
                id: 18,
                sentence: "I think more businesses should adopt eco-friendly practices and habits because companies produce so much more waste than individual households do.",
                targetWord: "adopt eco-friendly practices and habits",
                options: [
                    { id: "A", text: "Eco-friendly", isCorrect: false, feedback: "Incorrect. This is the adjective describing the practices." },
                    { id: "B", text: "Go green", isCorrect: true, feedback: "Correct! Adopting eco-friendly practices is 'going green'." },
                    { id: "C", text: "Carbon neutral", isCorrect: false, feedback: "Incorrect. This is a specific emission goal." },
                    { id: "D", text: "Sustainable living", isCorrect: false, feedback: "Incorrect. This usually refers to individuals, not businesses." }
                ]
            },
            {
                id: 19,
                sentence: "I've been trying really hard to use less single-use plastic by carrying a reusable water bottle and coffee cup wherever I go.",
                targetWord: "use less",
                options: [
                    { id: "A", text: "Eliminate", isCorrect: false, feedback: "Incorrect. Eliminate means to stop completely." },
                    { id: "B", text: "Cut down on", isCorrect: true, feedback: "Correct! To 'cut down on' means to reduce usage." },
                    { id: "C", text: "Minimize", isCorrect: false, feedback: "Incorrect. This is more formal and less natural in this context." },
                    { id: "D", text: "Decrease", isCorrect: false, feedback: "Incorrect. This is a more formal verb." }
                ]
            },
            {
                id: 20,
                sentence: "If everyone just reduced the amount of meat they eat each week, it would honestly make a massive difference to global greenhouse gas emissions.",
                targetWord: "reduced the amount of",
                options: [
                    { id: "A", text: "Stop", isCorrect: false, feedback: "Incorrect. Stop means to quit entirely." },
                    { id: "B", text: "Cut down on", isCorrect: true, feedback: "Correct! Reducing consumption is 'cutting down on'." },
                    { id: "C", text: "Limit", isCorrect: false, feedback: "Incorrect. Limit often implies a hard ceiling." },
                    { id: "D", text: "Abstain from", isCorrect: false, feedback: "Incorrect. This means to not do something at all." }
                ]
            },
            {
                id: 21,
                sentence: "I genuinely believe that switching to power generated from natural sources that never run out, like the sun and wind is the most important step governments can take to fight climate change.",
                targetWord: "power generated from natural sources that never run out, like the sun and wind",
                options: [
                    { id: "A", text: "Fossil fuels", isCorrect: false, feedback: "Incorrect. Fossil fuels are non-renewable sources like coal and oil." },
                    { id: "B", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect. This refers to the gases released, not the power source." },
                    { id: "C", text: "Renewable energy", isCorrect: true, feedback: "Correct! Renewable energy comes from sources that don't run out." },
                    { id: "D", text: "Natural resources", isCorrect: false, feedback: "Incorrect. This is a general term for anything from nature." }
                ]
            },
            {
                id: 22,
                sentence: "In my country, we've been investing a lot more in electricity produced from sources that naturally replenish themselves like solar panels and wind farms, which I think is a really positive development.",
                targetWord: "electricity produced from sources that naturally replenish themselves",
                options: [
                    { id: "A", text: "Global warming solutions", isCorrect: false, feedback: "Incorrect. This is too broad for the specific description." },
                    { id: "B", text: "Renewable energy", isCorrect: true, feedback: "Correct! Solar panels and wind farms are key sources of renewable energy." },
                    { id: "C", text: "Sustainable development", isCorrect: false, feedback: "Incorrect. This refers to a general approach to growth." },
                    { id: "D", text: "Carbon neutrality", isCorrect: false, feedback: "Incorrect. This is a state of balanced emissions." }
                ]
            },
            {
                id: 23,
                sentence: "I've been thinking a lot lately about the total amount of harmful gases my lifestyle releases into the atmosphere and I've started taking public transport instead of travelling by car.",
                targetWord: "the total amount of harmful gases my lifestyle releases into the atmosphere",
                options: [
                    { id: "A", text: "Environmental impact", isCorrect: false, feedback: "Incorrect. Environmental impact is a more general term." },
                    { id: "B", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect. Ecological footprint measures total resource demand." },
                    { id: "C", text: "Carbon footprint", isCorrect: true, feedback: "Correct! Carbon footprint specifically measures greenhouse gas emissions." },
                    { id: "D", text: "Greenhouse gas emissions", isCorrect: false, feedback: "Incorrect. While related, 'carbon footprint' is the standard term for personal impact." }
                ]
            },
            {
                id: 24,
                sentence: "Wealthy countries have a much larger environmental impact measured by the gases they produce than poorer nations, so I think they have a far greater responsibility to make changes first.",
                targetWord: "environmental impact measured by the gases they produce",
                options: [
                    { id: "A", text: "Natural resource consumption", isCorrect: false, feedback: "Incorrect. This refers to using up materials like water or wood." },
                    { id: "B", text: "Carbon footprint", isCorrect: true, feedback: "Correct! The 'environmental impact measured by gases' is your carbon footprint." },
                    { id: "C", text: "Ecological damage", isCorrect: false, feedback: "Incorrect. This describes the harm done, not the measure of emissions." },
                    { id: "D", text: "Vicious cycle", isCorrect: false, feedback: "Incorrect. A vicious cycle is a self-reinforcing problem loop." }
                ]
            },
            {
                id: 25,
                sentence: "I always try to buy products that cause little or no harm to nature, even if they cost a little bit more, because I genuinely believe it's worth it.",
                targetWord: "products that cause little or no harm to nature",
                options: [
                    { id: "A", text: "Sustainable products", isCorrect: false, feedback: "Incorrect. Sustainable refers more to long-term viability." },
                    { id: "B", text: "Recycled goods", isCorrect: false, feedback: "Incorrect. Recycled goods are a specific type of eco-friendly product." },
                    { id: "C", text: "Eco-conscious items", isCorrect: false, feedback: "Incorrect. 'Environmentally friendly' is the more standard term requested here." },
                    { id: "D", text: "Environmentally friendly products", isCorrect: true, feedback: "Correct! These are products designed to minimize nature damage." }
                ]
            },
            {
                id: 26,
                sentence: "Some companies just pretend to be harmless to the natural world for marketing purposes, but they don't actually change their business practices at all — it's really dishonest.",
                targetWord: "harmless to the natural world",
                options: [
                    { id: "A", text: "Carbon neutral", isCorrect: false, feedback: "Incorrect. Carbon neutral refers specifically to balanced CO2 emissions." },
                    { id: "B", text: "Environmentally friendly", isCorrect: true, feedback: "Correct! Harmless to the natural world means environmentally friendly." },
                    { id: "C", text: "Sustainable", isCorrect: false, feedback: "Incorrect. Sustainable means able to continue without depletion." },
                    { id: "D", text: "Eco-conscious", isCorrect: false, feedback: "Incorrect. Eco-conscious usually describes people or mindsets." }
                ]
            },
            {
                id: 27,
                sentence: "I think social media has been incredibly powerful in helping more people understand and care about environmental issues, especially among younger generations.",
                targetWord: "helping more people understand and care about",
                options: [
                    { id: "A", text: "Taking responsibility for", isCorrect: false, feedback: "Incorrect. Taking responsibility means accepting duty to act." },
                    { id: "B", text: "Making a difference about", isCorrect: false, feedback: "Incorrect. Making a difference means having a positive impact." },
                    { id: "C", text: "Raising awareness about", isCorrect: true, feedback: "Correct! Helping people understand and care is raising awareness." },
                    { id: "D", text: "Going green about", isCorrect: false, feedback: "Incorrect. Going green means changing your lifestyle habits." }
                ]
            },
            {
                id: 28,
                sentence: "Schools should do much more to make students informed and concerned about climate change because children are the ones who will have to deal with its consequences in the future.",
                targetWord: "make students informed and concerned about",
                options: [
                    { id: "A", text: "Strike a balance about", isCorrect: false, feedback: "Incorrect. Striking a balance means finding a middle ground." },
                    { id: "B", text: "Raise awareness about", isCorrect: true, feedback: "Correct! Making people informed and concerned is raising awareness." },
                    { id: "C", text: "Bear the brunt of", isCorrect: false, feedback: "Incorrect. Bearing the brunt means suffering the worst effects." },
                    { id: "D", text: "Cut down on", isCorrect: false, feedback: "Incorrect. Cutting down on means reducing consumption." }
                ]
            },
            {
                id: 29,
                sentence: "I think protecting the wide variety of different plants and animals that share our planet is just as important as reducing pollution, because every species plays a vital role in keeping ecosystems healthy.",
                targetWord: "the wide variety of different plants and animals that share our planet",
                options: [
                    { id: "A", text: "Natural habitat", isCorrect: false, feedback: "Incorrect. Natural habitat is where an animal or plant lives." },
                    { id: "B", text: "Conservation", isCorrect: false, feedback: "Incorrect. Conservation is the act of protecting nature." },
                    { id: "C", text: "Biodiversity", isCorrect: true, feedback: "Correct! Biodiversity is the variety of life on Earth." },
                    { id: "D", text: "Ecosystem", isCorrect: false, feedback: "Incorrect. An ecosystem is the interaction of living things and environment." }
                ]
            },
            {
                id: 30,
                sentence: "My country has incredibly rich variety of wildlife and plant life, so it's really heartbreaking to see so much of it being destroyed by construction and agricultural expansion.",
                targetWord: "variety of wildlife and plant life",
                options: [
                    { id: "A", text: "Deforestation", isCorrect: false, feedback: "Incorrect. Deforestation is the specific loss of forests." },
                    { id: "B", text: "Biodiversity", isCorrect: true, feedback: "Correct! Biodiversity covers the variety of all wildlife and plants." },
                    { id: "C", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect. Carbon emissions are gases released into the air." },
                    { id: "D", text: "Natural resources", isCorrect: false, feedback: "Incorrect. Natural resources are materials used by humans." }
                ]
            },
            {
                id: 31,
                sentence: "I know some people feel like individual actions don't matter, but I genuinely believe that small changes in daily behaviour can have a real positive impact on the environment over time.",
                targetWord: "have a real positive impact",
                options: [
                    { id: "A", text: "Raise awareness", isCorrect: false, feedback: "Incorrect. Raising awareness is about educating others." },
                    { id: "B", text: "Go green", isCorrect: false, feedback: "Incorrect. Going green is shifting to eco-friendly habits." },
                    { id: "C", text: "Take responsibility", isCorrect: false, feedback: "Incorrect. Taking responsibility is accepting duty." },
                    { id: "D", text: "Make a real difference", isCorrect: true, feedback: "Correct! To have a positive impact is to make a difference." }
                ]
            },
            {
                id: 32,
                sentence: "If enough people change their habits, it really can create meaningful change — we've already seen this with the huge reduction in plastic bag use since governments introduced charges.",
                targetWord: "create meaningful change",
                options: [
                    { id: "A", text: "Strike a balance", isCorrect: false, feedback: "Incorrect. Striking a balance is finding a compromise." },
                    { id: "B", text: "Make a difference", isCorrect: true, feedback: "Correct! Creating meaningful change is making a difference." },
                    { id: "C", text: "Bear the brunt", isCorrect: false, feedback: "Incorrect. Bearing the brunt is suffering the worst impact." },
                    { id: "D", text: "Turn a blind eye", isCorrect: false, feedback: "Incorrect. Turning a blind eye is ignoring a problem." }
                ]
            },
            {
                id: 33,
                sentence: "I try to make more environmentally responsible choices that can continue long-term in my daily life, like buying second-hand clothes instead of always purchasing brand new ones.",
                targetWord: "environmentally responsible choices that can continue long-term",
                options: [
                    { id: "A", text: "Eco-friendly", isCorrect: false, feedback: "Incorrect. Eco-friendly describes lack of harm, not necessarily longevity." },
                    { id: "B", text: "Renewable", isCorrect: false, feedback: "Incorrect. Renewable usually refers to energy sources." },
                    { id: "C", text: "Sustainable", isCorrect: true, feedback: "Correct! Sustainable means able to continue long-term without damage." },
                    { id: "D", text: "Conscious", isCorrect: false, feedback: "Incorrect. Conscious describes a person's awareness level." }
                ]
            },
            {
                id: 34,
                sentence: "The problem is that eco-conscious products that don't harm the future of the planet are often more expensive, which makes it really hard for people on lower incomes to make greener choices.",
                targetWord: "eco-conscious products that don't harm the future of the planet",
                options: [
                    { id: "A", text: "Recycled products", isCorrect: false, feedback: "Incorrect. Recycled is only one way to be sustainable." },
                    { id: "B", text: "Sustainable products", isCorrect: true, feedback: "Correct! Products that don't harm the future are sustainable." },
                    { id: "C", text: "Carbon neutral goods", isCorrect: false, feedback: "Incorrect. Carbon neutral refers only to emissions balance." },
                    { id: "D", text: "Renewable materials", isCorrect: false, feedback: "Incorrect. Renewable refers to the source, not the product's impact." }
                ]
            },
            {
                id: 35,
                sentence: "I think both governments and individuals need to accept their duty to deal with environmental damage rather than constantly blaming each other and doing nothing.",
                targetWord: "accept their duty to deal with",
                options: [
                    { id: "A", text: "Raise awareness about", isCorrect: false, feedback: "Incorrect. Raising awareness is about educating people." },
                    { id: "B", text: "Make a difference to", isCorrect: false, feedback: "Incorrect. Making a difference is the result of action." },
                    { id: "C", text: "Take responsibility for", isCorrect: true, feedback: "Correct! Accepting duty is taking responsibility." },
                    { id: "D", text: "Strike a balance with", isCorrect: false, feedback: "Incorrect. Striking a balance is finding a middle ground." }
                ]
            },
            {
                id: 36,
                sentence: "It really frustrates me when big corporations refuse to acknowledge their obligation to fix the pollution they cause and simply pass all the blame onto ordinary consumers.",
                targetWord: "acknowledge their obligation to fix",
                options: [
                    { id: "A", text: "Go green about", isCorrect: false, feedback: "Incorrect. Going green is adopting better habits." },
                    { id: "B", text: "Take responsibility for", isCorrect: true, feedback: "Correct! Acknowledging obligation to fix is taking responsibility." },
                    { id: "C", text: "Bear the brunt of", isCorrect: false, feedback: "Incorrect. Bearing the brunt is suffering the consequences." },
                    { id: "D", text: "Turn a blind eye to", isCorrect: false, feedback: "Incorrect. Turning a blind eye is ignoring the issue." }
                ]
            },
            {
                id: 37,
                sentence: "I think young people today are much more aware of and concerned about the impact of their actions on nature than previous generations because we've grown up witnessing the effects of climate change firsthand.",
                targetWord: "aware of and concerned about the impact of their actions on nature",
                options: [
                    { id: "A", text: "Environmentally friendly", isCorrect: false, feedback: "Incorrect. This describes habits or products, not the person's awareness." },
                    { id: "B", text: "Ecologically aware", isCorrect: false, feedback: "Incorrect. 'Environmentally conscious' is the specific term requested." },
                    { id: "C", text: "Environmentally conscious", isCorrect: true, feedback: "Correct! Being aware and concerned makes you environmentally conscious." },
                    { id: "D", text: "Sustainably minded", isCorrect: false, feedback: "Incorrect. This is a common phrase but not the target vocabulary word." }
                ]
            },
            {
                id: 38,
                sentence: "Being mindful of how your lifestyle affects the planet doesn't mean you have to completely change your life — even small daily decisions like refusing a plastic straw can really add up.",
                targetWord: "mindful of how your lifestyle affects the planet",
                options: [
                    { id: "A", text: "Carbon neutral", isCorrect: false, feedback: "Incorrect. Carbon neutral refers to emissions balance." },
                    { id: "B", text: "Environmentally conscious", isCorrect: true, feedback: "Correct! Being mindful of your impact is being environmentally conscious." },
                    { id: "C", text: "Sustainably developed", isCorrect: false, feedback: "Incorrect. Sustainable development is a policy approach." },
                    { id: "D", text: "Ecologically friendly", isCorrect: false, feedback: "Incorrect. 'Eco-friendly' describes products/practices, not people." }
                ]
            },
            {
                id: 39,
                sentence: "It breaks my heart to see animals being forced out of the wild environment where they naturally live because humans keep expanding into untouched areas for farming and construction.",
                targetWord: "the wild environment where they naturally live",
                options: [
                    { id: "A", text: "Biodiversity zone", isCorrect: false, feedback: "Incorrect. Biodiversity refers to the variety of life." },
                    { id: "B", text: "Conservation area", isCorrect: false, feedback: "Incorrect. Conservation areas are protected zones." },
                    { id: "C", text: "Natural habitat", isCorrect: true, feedback: "Correct! The environment where an animal naturally lives is its habitat." },
                    { id: "D", text: "Ecosystem network", isCorrect: false, feedback: "Incorrect. Ecosystem is the interaction system, not just the environment." }
                ]
            },
            {
                id: 40,
                sentence: "I visited a nature reserve last summer that was specifically created to protect the original environment that certain birds depend on to survive, and it was one of the most beautiful places I have ever seen.",
                targetWord: "the original environment that certain birds depend on to survive",
                options: [
                    { id: "A", text: "Endangered zone", isCorrect: false, feedback: "Incorrect. 'Endangered' refers to the species, not the zone type." },
                    { id: "B", text: "Natural habitat", isCorrect: true, feedback: "Correct! The environment species depend on is their natural habitat." },
                    { id: "C", text: "Wildlife corridor", isCorrect: false, feedback: "Incorrect. A corridor is a path connecting habitats." },
                    { id: "D", text: "Conservation park", isCorrect: false, feedback: "Incorrect. While a nature reserve is a type of park, 'natural habitat' describes the environment itself." }
                ]
            },
            {
                id: 41,
                sentence: "I think every company should be legally required to assess the effect their products and operations have on the natural world before they are allowed to put anything on the market.",
                targetWord: "the effect their products and operations have on the natural world",
                options: [
                    { id: "A", text: "Carbon footprint", isCorrect: false, feedback: "Incorrect. Carbon footprint specifically measures greenhouse gas emissions." },
                    { id: "B", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect. This usually refers to the resources required to support an individual or population." },
                    { id: "C", text: "Environmental impact", isCorrect: true, feedback: "Correct! The effect on the natural world is the environmental impact." },
                    { id: "D", text: "Sustainability report", isCorrect: false, feedback: "Incorrect. This is a document that reports on environmental and social performance." }
                ]
            },
            {
                id: 42,
                sentence: "People often underestimate how much damage their food choices cause to the planet — meat production, for example, uses an enormous amount of water, land, and energy.",
                targetWord: "how much damage their food choices cause to the planet",
                options: [
                    { id: "A", text: "The carbon neutrality of their diet", isCorrect: false, feedback: "Incorrect. Carbon neutrality is the balance of emissions." },
                    { id: "B", text: "The environmental impact of their food choices", isCorrect: true, feedback: "Correct! The damage caused by food choices is their environmental impact." },
                    { id: "C", text: "The ecological footprint of farming", isCorrect: false, feedback: "Incorrect. This is too specific to farming generally." },
                    { id: "D", text: "The vicious cycle of consumption", isCorrect: false, feedback: "Incorrect. This describes a repeating loop of problems." }
                ]
            },
            {
                id: 43,
                sentence: "It's a real situation where one problem keeps making another problem worse in a continuous loop — poverty forces people to exploit natural resources, which causes more environmental damage, which then leads to more poverty.",
                targetWord: "situation where one problem keeps making another problem worse in a continuous loop",
                options: [
                    { id: "A", text: "Wake-up call", isCorrect: false, feedback: "Incorrect. A wake-up call is an urgent warning signal." },
                    { id: "B", text: "Drop in the ocean", isCorrect: false, feedback: "Incorrect. A drop in the ocean is something very small and insignificant." },
                    { id: "C", text: "Vicious cycle", isCorrect: true, feedback: "Correct! A self-reinforcing loop of problems is a vicious cycle." },
                    { id: "D", text: "Blind eye", isCorrect: false, feedback: "Incorrect. Turning a blind eye is ignoring something." }
                ]
            },
            {
                id: 44,
                sentence: "We desperately need to break this never-ending loop of destruction of consuming more and producing more waste before it becomes completely and utterly impossible to reverse.",
                targetWord: "never-ending loop of destruction",
                options: [
                    { id: "A", text: "Strike a balance", isCorrect: false, feedback: "Incorrect. Striking a balance is finding a middle ground." },
                    { id: "B", text: "Long run", isCorrect: false, feedback: "Incorrect. The long run refers to a long period of time." },
                    { id: "C", text: "Blind eye", isCorrect: false, feedback: "Incorrect. This means ignoring a problem." },
                    { id: "D", text: "Vicious cycle", isCorrect: true, feedback: "Correct! A never-ending loop of destruction is a vicious cycle." }
                ]
            },
            {
                id: 45,
                sentence: "For decades, governments have deliberately ignored the environmental damage caused by large corporations because they were far more concerned about short-term economic growth.",
                targetWord: "deliberately ignored",
                options: [
                    { id: "A", text: "Borne the brunt of", isCorrect: false, feedback: "Incorrect. Bearing the brunt is suffering the worst of something." },
                    { id: "B", text: "Turned a blind eye to", isCorrect: true, feedback: "Correct! Deliberately ignoring something is turning a blind eye to it." },
                    { id: "C", text: "Struck a balance with", isCorrect: false, feedback: "Incorrect. Striking a balance is finding a compromise." },
                    { id: "D", text: "Made a drop in the ocean of", isCorrect: false, feedback: "Incorrect. This refers to an insignificant amount." }
                ]
            },
            {
                id: 46,
                sentence: "We simply cannot keep pretending not to notice the destruction of our forests and oceans and hope that the problem will somehow resolve itself — we need urgent and decisive action right now.",
                targetWord: "pretending not to notice",
                options: [
                    { id: "A", text: "Bearing the brunt of", isCorrect: false, feedback: "Incorrect. This means suffering the worst impact." },
                    { id: "B", text: "Making a drop in the ocean of", isCorrect: false, feedback: "Incorrect. This means contributing a very small amount." },
                    { id: "C", text: "Turning a blind eye to", isCorrect: true, feedback: "Correct! Pretending not to notice is turning a blind eye." },
                    { id: "D", text: "Striking a balance with", isCorrect: false, feedback: "Incorrect. This means finding a middle ground." }
                ]
            },
            {
                id: 47,
                sentence: "For far too long, countries have pursued rapid economic growth by causing harm to the environment, and we are now starting to see the devastating long-term consequences of that reckless approach.",
                targetWord: "by causing harm to",
                options: [
                    { id: "A", text: "In the long run of", isCorrect: false, feedback: "Incorrect. The long run refers to time duration." },
                    { id: "B", text: "At the expense of", isCorrect: true, feedback: "Correct! If something is done by causing harm to another, it's done at their expense." },
                    { id: "C", text: "By bearing the brunt of", isCorrect: false, feedback: "Incorrect. This means suffering the worst consequences." },
                    { id: "D", text: "As a wake-up call for", isCorrect: false, feedback: "Incorrect. A wake-up call is a warning sign." }
                ]
            },
            {
                id: 48,
                sentence: "I don't think we should have to choose between development and conservation — surely we can make progress without damaging or sacrificing the natural world in the process.",
                targetWord: "without damaging or sacrificing",
                options: [
                    { id: "A", text: "Without turning a blind eye to", isCorrect: false, feedback: "Incorrect. This means not ignoring something." },
                    { id: "B", text: "Without bearing the brunt of", isCorrect: false, feedback: "Incorrect. This means not suffering the worst impact." },
                    { id: "C", text: "Without it going without saying about", isCorrect: false, feedback: "Incorrect. This is not a logical phrase." },
                    { id: "D", text: "Without doing it at the expense of", isCorrect: true, feedback: "Correct! Damaging or sacrificing something to achieve a goal is doing it 'at the expense of' that thing." }
                ]
            },
            {
                id: 49,
                sentence: "It's deeply unfair that developing nations suffer the worst consequences of climate change when it's the wealthy industrialised countries that have historically caused the majority of the damage.",
                targetWord: "suffer the worst consequences of",
                options: [
                    { id: "A", text: "Turn a blind eye to", isCorrect: false, feedback: "Incorrect. This means ignoring something." },
                    { id: "B", text: "Strike a balance with", isCorrect: false, feedback: "Incorrect. This means finding a compromise." },
                    { id: "C", text: "Bear the brunt of", isCorrect: true, feedback: "Correct! To suffer the worst consequences is to bear the brunt of something." },
                    { id: "D", text: "Make a drop in the ocean of", isCorrect: false, feedback: "Incorrect. This means making an insignificant contribution." }
                ]
            },
            {
                id: 50,
                sentence: "Coastal communities are experiencing the most severe effects of rising sea levels, yet they have contributed the least to the global problem of warming temperatures.",
                targetWord: "experiencing the most severe effects of",
                options: [
                    { id: "A", text: "Going green because of", isCorrect: false, feedback: "Incorrect. Going green is adopting an eco-friendly lifestyle." },
                    { id: "B", text: "Bearing the brunt of", isCorrect: true, feedback: "Correct! To experience the most severe effects is to bear the brunt." },
                    { id: "C", text: "Making a difference to", isCorrect: false, feedback: "Incorrect. This means having a positive impact." },
                    { id: "D", text: "Striking a balance with", isCorrect: false, feedback: "Incorrect. This means finding a middle ground." }
                ]
            },
            {
                id: 51,
                sentence: "Sometimes I honestly feel like my individual efforts to protect the environment are completely insignificant and insufficient compared to the massive scale of damage being done by large industries every single day.",
                targetWord: "completely insignificant and insufficient",
                options: [
                    { id: "A", text: "A wake-up call", isCorrect: false, feedback: "Incorrect. A wake-up call is an urgent warning signal." },
                    { id: "B", text: "A vicious cycle", isCorrect: false, feedback: "Incorrect. A vicious cycle is a loop of problems." },
                    { id: "C", text: "A drop in the ocean", isCorrect: true, feedback: "Correct! Something that is tiny and insignificant compared to the whole is a drop in the ocean." },
                    { id: "D", text: "A blind eye", isCorrect: false, feedback: "Incorrect. This means ignoring something." }
                ]
            },
            {
                id: 52,
                sentence: "The funding that most governments currently allocate to environmental protection is honestly far too small to make any real difference compared to what is actually needed to address the scale of the crisis.",
                targetWord: "far too small to make any real difference",
                options: [
                    { id: "A", text: "In the long run", isCorrect: false, feedback: "Incorrect. This refers to the distant future." },
                    { id: "B", text: "At the expense of everything", isCorrect: false, feedback: "Incorrect. This means sacrificed for something else." },
                    { id: "C", text: "A drop in the ocean", isCorrect: true, feedback: "Correct! An amount that is far too small to matter is a drop in the ocean." },
                    { id: "D", text: "A wake-up call", isCorrect: false, feedback: "Incorrect. This is a warning signal." }
                ]
            },
            {
                id: 53,
                sentence: "I think the COVID-19 pandemic was actually an urgent signal that forced humanity to reconsider how we treat and interact with the natural world around us.",
                targetWord: "an urgent signal that forced humanity to reconsider",
                options: [
                    { id: "A", text: "A vicious cycle for", isCorrect: false, feedback: "Incorrect. This is a repeating loop of problems." },
                    { id: "B", text: "A drop in the ocean for", isCorrect: false, feedback: "Incorrect. This means something insignificant." },
                    { id: "C", text: "A blind eye for", isCorrect: false, feedback: "Incorrect. This means ignoring something." },
                    { id: "D", text: "A wake-up call for", isCorrect: true, feedback: "Correct! An urgent signal that forces reconsideration is a wake-up call." }
                ]
            },
            {
                id: 54,
                sentence: "Extreme weather events like the devastating Australian wildfires should have been a shocking event that made world leaders realise they must act immediately, but unfortunately very little has changed since then.",
                targetWord: "a shocking event that made world leaders realise they must act immediately",
                options: [
                    { id: "A", text: "A drop in the ocean", isCorrect: false, feedback: "Incorrect. This means an insignificant amount." },
                    { id: "B", text: "A wake-up call", isCorrect: true, feedback: "Correct! A shocking event that demands immediate action is a wake-up call." },
                    { id: "C", text: "A vicious cycle", isCorrect: false, feedback: "Incorrect. This is a loop of problems." },
                    { id: "D", text: "A blind eye", isCorrect: false, feedback: "Incorrect. This means ignoring a problem." }
                ]
            },
            {
                id: 55,
                sentence: "I think the biggest challenge for modern governments is to find a sensible middle ground between economic development and environmental protection — it's incredibly difficult but absolutely essential.",
                targetWord: "find a sensible middle ground between",
                options: [
                    { id: "A", text: "Bear the brunt of", isCorrect: false, feedback: "Incorrect. This means suffering the worst impact." },
                    { id: "B", text: "Turn a blind eye between", isCorrect: false, feedback: "Incorrect. This means ignoring something." },
                    { id: "C", text: "Strike a balance between", isCorrect: true, feedback: "Correct! Finding a middle ground is striking a balance." },
                    { id: "D", text: "Make a drop in the ocean between", isCorrect: false, feedback: "Incorrect. This means an insignificant contribution." }
                ]
            },
            {
                id: 56,
                sentence: "Farmers genuinely need to find an equilibrium between producing enough food to feed the growing population and doing so in a way that doesn't destroy the land for future generations.",
                targetWord: "find an equilibrium between",
                options: [
                    { id: "A", text: "Go green between", isCorrect: false, feedback: "Incorrect. Going green is shifting to an eco-friendly lifestyle." },
                    { id: "B", text: "Raise awareness between", isCorrect: false, feedback: "Incorrect. This is about education." },
                    { id: "C", text: "Take responsibility between", isCorrect: false, feedback: "Incorrect. This is about accepting duty." },
                    { id: "D", text: "Strike a balance between", isCorrect: true, feedback: "Correct! Finding an equilibrium or compromise is striking a balance." }
                ]
            },
            {
                id: 57,
                sentence: "Investing in renewable energy might seem very expensive at first, but over a long period of time it will save governments enormous amounts of money while also protecting the planet.",
                targetWord: "over a long period of time",
                options: [
                    { id: "A", text: "At the expense of everything", isCorrect: false, feedback: "Incorrect. This means sacrificed for something else." },
                    { id: "B", text: "In the long run", isCorrect: true, feedback: "Correct! A result that happens over a long period of time happens in the long run." },
                    { id: "C", text: "As a drop in the ocean", isCorrect: false, feedback: "Incorrect. This means insignificant." },
                    { id: "D", text: "As a wake-up call", isCorrect: false, feedback: "Incorrect. This is a warning signal." }
                ]
            },
            {
                id: 58,
                sentence: "I always think about what will happen in the future when it comes to environmental decisions because short-term profits are never worth the long-term damage caused to our precious ecosystems.",
                targetWord: "what will happen in the future",
                options: [
                    { id: "A", text: "The vicious cycle", isCorrect: false, feedback: "Incorrect. This is a repeating loop of problems." },
                    { id: "B", text: "The blind eye", isCorrect: false, feedback: "Incorrect. This is ignoring something." },
                    { id: "C", text: "The long run", isCorrect: true, feedback: "Correct! Thinking about what happens in the future is thinking about the long run." },
                    { id: "D", text: "The drop in the ocean", isCorrect: false, feedback: "Incorrect. This means insignificant." }
                ]
            },
            {
                id: 59,
                sentence: "It is so obvious it barely needs to be stated that we have a responsibility to leave the planet in a better condition than we found it — the real question is whether we have the willpower to actually do so.",
                targetWord: "it is so obvious it barely needs to be stated that",
                options: [
                    { id: "A", text: "In the long run", isCorrect: false, feedback: "Incorrect. This refers to the future." },
                    { id: "B", text: "It goes without saying that", isCorrect: true, feedback: "Correct! Something that is so obvious it doesn't need to be said 'goes without saying'." },
                    { id: "C", text: "At the expense of the fact that", isCorrect: false, feedback: "Incorrect. This is not a logical phrase." },
                    { id: "D", text: "As a wake-up call that", isCorrect: false, feedback: "Incorrect. This is a warning signal." }
                ]
            }
        ],
        writingSynonymSwap: [
            {
                id: 1,
                sentence: "The government must take immediate action to reduce harmful and toxic substances released into the air, water, and land before the damage becomes completely irreversible.",
                targetWord: "harmful and toxic substances released into the air, water, and land",
                options: [
                    { id: "A", text: "Deforestation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Global warming", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Pollution", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Natural disaster", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 2,
                sentence: "Industrial contamination of the natural environment has reached such alarming levels that entire river ecosystems are now unable to support any form of aquatic life.",
                targetWord: "contamination of the natural environment",
                options: [
                    { id: "A", text: "Conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Pollution", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Waste management", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Deforestation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 3,
                sentence: "Scientists have provided overwhelming evidence that the long-term alteration of global temperature and weather patterns is primarily driven by human industrial activity.",
                targetWord: "the long-term alteration of global temperature and weather patterns",
                options: [
                    { id: "A", text: "Global warming", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Natural disaster", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Deforestation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Climate change", isCorrect: true, feedback: "Correct! This is the right term." }
                ]
            },
            {
                id: 4,
                sentence: "World leaders must cooperate far more effectively to address the gradual and dangerous transformation of the Earth's weather systems before it reaches a point of no return.",
                targetWord: "the gradual and dangerous transformation of the Earth's weather systems",
                options: [
                    { id: "A", text: "Pollution", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Climate change", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Fossil fuel dependency", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 5,
                sentence: "The widespread destruction and removal of forested areas across South America is threatening the survival of thousands of plant and animal species that depend on these ecosystems.",
                targetWord: "the widespread destruction and removal of forested areas",
                options: [
                    { id: "A", text: "Pollution", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Global warming", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Deforestation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Natural disaster", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 6,
                sentence: "Governments must introduce far stronger international laws to combat the mass clearing of trees and forests driven by agricultural expansion and the illegal logging industry.",
                targetWord: "the mass clearing of trees and forests",
                options: [
                    { id: "A", text: "Littering", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Recycling", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Deforestation", isCorrect: true, feedback: "Correct! This is the right term." }
                ]
            },
            {
                id: 7,
                sentence: "Many countries have now introduced mandatory programmes that require citizens to process and convert used materials into new usable products rather than simply throwing everything away.",
                targetWord: "process and convert used materials into new usable products",
                options: [
                    { id: "A", text: "Conserve", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Recycle", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Reduce", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Restore", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 8,
                sentence: "One of the simplest yet most effective things individuals can do to protect the environment is to reprocess their household waste so it can be given a second life instead of sending it to landfill.",
                targetWord: "reprocess their household waste so it can be given a second life",
                options: [
                    { id: "A", text: "Pollute", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Deforest", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Recycle", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Conserve", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 9,
                sentence: "The destruction of natural habitats is the primary cause of the rapidly growing number of plants and animals that are at serious risk of becoming permanently extinct.",
                targetWord: "plants and animals that are at serious risk of becoming permanently extinct",
                options: [
                    { id: "A", text: "Natural resources", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Endangered species", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Wildlife conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Biodiversity loss", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 10,
                sentence: "Governments must significantly increase funding dedicated to protecting vulnerable creatures and plants whose populations have fallen to critically low levels from the ongoing threat of human-caused extinction.",
                targetWord: "vulnerable creatures and plants whose populations have fallen to critically low levels",
                options: [
                    { id: "A", text: "Fossil fuels", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Natural disasters", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Endangered species", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 11,
                sentence: "The continued burning of ancient organic materials such as coal, oil, and gas is widely recognised as the primary driver of greenhouse gas emissions and accelerating global warming.",
                targetWord: "ancient organic materials such as coal, oil, and gas",
                options: [
                    { id: "A", text: "Renewable energy", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Natural resources", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Fossil fuels", isCorrect: true, feedback: "Correct! This is the right term." }
                ]
            },
            {
                id: 12,
                sentence: "Nations around the world must urgently reduce their dangerous over-reliance on non-renewable energy sources formed from the remains of prehistoric living organisms and transition rapidly to cleaner alternatives.",
                targetWord: "non-renewable energy sources formed from the remains of prehistoric living organisms",
                options: [
                    { id: "A", text: "Fossil fuels", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "B", text: "Greenhouse gases", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Solar power", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Natural disasters", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 13,
                sentence: "Poor management of unwanted materials and by-products generated by human activity in developing countries has led to severe and widespread contamination of rivers and underground water supplies.",
                targetWord: "unwanted materials and by-products generated by human activity",
                options: [
                    { id: "A", text: "Pollution", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Deforestation", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Waste", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Conservation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 14,
                sentence: "Consumers have a significant role to play in protecting the environment simply by reducing the volume of discarded and unwanted substances they generate through their everyday purchasing and consumption habits.",
                targetWord: "discarded and unwanted substances",
                options: [
                    { id: "A", text: "Fossil fuels", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Natural resources", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Waste", isCorrect: true, feedback: "Correct! This is the right term." }
                ]
            },
            {
                id: 15,
                sentence: "Scientists are issuing urgent warnings that climate change is significantly increasing both the frequency and devastating intensity of catastrophic events triggered by the forces of nature such as hurricanes, floods, and wildfires.",
                targetWord: "catastrophic events triggered by the forces of nature",
                options: [
                    { id: "A", text: "Natural disasters", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "B", text: "Global warming", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Pollution levels", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 16,
                sentence: "Developing nations are consistently the least equipped and least resourced to recover effectively from devastating events caused by uncontrollable natural forces, despite contributing the least to the global problem of climate change.",
                targetWord: "devastating events caused by uncontrollable natural forces",
                options: [
                    { id: "A", text: "Endangered species", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Fossil fuel dependency", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Natural disasters", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Deforestation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 17,
                sentence: "The measurable effects of the progressive increase in the overall temperature of the Earth's atmosphere are already clearly visible through melting polar ice caps and rising ocean temperatures worldwide.",
                targetWord: "the progressive increase in the overall temperature of the Earth's atmosphere",
                options: [
                    { id: "A", text: "Deforestation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Climate change", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Global warming", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Pollution", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 18,
                sentence: "Without immediate and genuinely coordinated international action, scientists predict that the continuous rise in the planet's average surface temperature will reach truly catastrophic and irreversible levels within this century.",
                targetWord: "the continuous rise in the planet's average surface temperature",
                options: [
                    { id: "A", text: "Natural disaster", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Fossil fuel emissions", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Littering", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Global warming", isCorrect: true, feedback: "Correct! This is the right term." }
                ]
            },
            {
                id: 19,
                sentence: "Well-funded wildlife programmes focused on the careful protection and preservation of animals and their environments have successfully helped several critically threatened species recover from the very brink of extinction.",
                targetWord: "the careful protection and preservation of animals and their environments",
                options: [
                    { id: "A", text: "Recycling", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Conservation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Legislation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Pollution control", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 20,
                sentence: "The responsible protection of the natural world and its resources must be treated as a shared global responsibility rather than the sole obligation of individual nations acting in isolation.",
                targetWord: "the responsible protection of the natural world and its resources",
                options: [
                    { id: "A", text: "Deforestation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Global warming", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Conservation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Fossil fuel reduction", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 21,
                sentence: "Reducing the release of heat-trapping gases such as carbon dioxide and methane into the atmosphere is widely considered the single most critical step the international community can take to meaningfully slow climate change.",
                targetWord: "the release of heat-trapping gases such as carbon dioxide and methane into the atmosphere",
                options: [
                    { id: "A", text: "Carbon footprint", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Fossil fuel dependency", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Greenhouse gas emissions", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 22,
                sentence: "Many of the world's most developed nations have made formal commitments to cutting the volume of warming gases discharged into the Earth's atmosphere through industrial and energy processes by at least fifty percent before the year 2050.",
                targetWord: "the volume of warming gases discharged into the Earth's atmosphere through industrial and energy processes",
                options: [
                    { id: "A", text: "Natural resource consumption", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Greenhouse gas emissions", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological damage", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Habitat destruction", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 23,
                sentence: "Investing significantly and consistently in power derived from naturally replenishing sources such as sunlight, wind, and flowing water is now considered absolutely essential for achieving a genuinely carbon-neutral global future.",
                targetWord: "power derived from naturally replenishing sources such as sunlight, wind, and flowing water",
                options: [
                    { id: "A", text: "Fossil fuels", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Renewable energy", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Natural gas", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 24,
                sentence: "Governments that consistently fail to develop adequate clean energy infrastructure based on sources that naturally restore themselves risk falling dangerously behind both environmentally and economically in the coming critical decades.",
                targetWord: "clean energy infrastructure based on sources that naturally restore themselves",
                options: [
                    { id: "A", text: "Global warming solutions", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Renewable energy", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Sustainable development", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Carbon neutrality", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 25,
                sentence: "Individuals can make a meaningful contribution to protecting the environment by taking practical steps to reduce the total volume of greenhouse gases that their daily lifestyle and consumption habits release into the atmosphere.",
                targetWord: "the total volume of greenhouse gases that their daily lifestyle and consumption habits release into the atmosphere",
                options: [
                    { id: "A", text: "Environmental impact", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Carbon footprint", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Greenhouse gas emissions", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 26,
                sentence: "Companies across all industries are facing increasing pressure from both consumers and regulators to accurately measure and significantly lower the quantity of carbon-based pollution generated by their entire range of business operations.",
                targetWord: "the quantity of carbon-based pollution generated by their entire range of business operations",
                options: [
                    { id: "A", text: "Natural resource consumption", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon footprint", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological damage", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Vicious cycle of production", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 27,
                sentence: "The alarmingly rapid loss of the rich and complex variety of living organisms that inhabit a particular environment or the planet as a whole poses an increasingly serious threat to the long-term stability of global ecosystems.",
                targetWord: "the rich and complex variety of living organisms that inhabit a particular environment or the planet as a whole",
                options: [
                    { id: "A", text: "Natural habitat", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Biodiversity", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecosystem services", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 28,
                sentence: "Protecting the enormous variety of plant and animal life found across the Earth's different environments is not merely an environmental concern but also a critical economic one, since many major industries depend entirely on healthy and fully functioning ecosystems.",
                targetWord: "the enormous variety of plant and animal life found across the Earth's different environments",
                options: [
                    { id: "A", text: "Deforestation patterns", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Biodiversity", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Natural resources", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 29,
                sentence: "The United Nations has outlined seventeen ambitious goals designed specifically to promote economic and social progress that responsibly meets present needs without compromising the ability of future generations to meet their own.",
                targetWord: "economic and social progress that responsibly meets present needs without compromising the ability of future generations to meet their own",
                options: [
                    { id: "A", text: "Environmental conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon neutrality", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Sustainable development", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecological restoration", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 30,
                sentence: "Achieving genuine long-term growth that balances human prosperity with the protection of the natural environment requires governments, businesses, and individual citizens to work together with shared commitment and responsibility.",
                targetWord: "long-term growth that balances human prosperity with the protection of the natural environment",
                options: [
                    { id: "A", text: "Fossil fuel reduction", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Sustainable development", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Wildlife conservation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Carbon offsetting", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 31,
                sentence: "The ongoing and widespread degradation and elimination of the natural environments that animals and plants depend upon for survival caused by relentless urban expansion is pushing countless species dangerously close to extinction.",
                targetWord: "degradation and elimination of the natural environments that animals and plants depend upon for survival",
                options: [
                    { id: "A", text: "Carbon emissions", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Habitat destruction", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Deforestation rate", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 32,
                sentence: "Preventing any further irreversible loss and damage to the ecosystems that wildlife relies upon must be made an absolute top priority in national environmental policies if governments are genuinely serious about preserving the world's wildlife.",
                targetWord: "irreversible loss and damage to the ecosystems that wildlife relies upon",
                options: [
                    { id: "A", text: "Greenhouse gas pollution", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Natural resource depletion", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Habitat destruction", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Carbon neutrality failure", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 33,
                sentence: "Many countries around the world have made formal international pledges to reach net-zero the discharge of carbon-based gases produced through burning fuels and industrial manufacturing processes by the middle of this century.",
                targetWord: "the discharge of carbon-based gases produced through burning fuels and industrial manufacturing processes",
                options: [
                    { id: "A", text: "Greenhouse gas targets", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Fossil fuel consumption", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Carbon emissions", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecological damage", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 34,
                sentence: "Heavy industries such as steel production, cement manufacturing, and commercial aviation are widely recognised as among the most technically challenging economic sectors to decarbonise due to the extraordinarily high levels of CO2 and other carbon compounds they release during operation.",
                targetWord: "CO2 and other carbon compounds they release during operation",
                options: [
                    { id: "A", text: "Natural resource use", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon emissions", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Environmental degradation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 35,
                sentence: "Raising public understanding of and genuine concern for the importance of protecting the natural world from human-caused damage among young people through formal school education is one of the most powerful and effective long-term strategies available.",
                targetWord: "public understanding of and genuine concern for the importance of protecting the natural world from human-caused damage",
                options: [
                    { id: "A", text: "Carbon neutrality", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Environmental awareness", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Sustainable development", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Ecological conservation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 36,
                sentence: "Despite a notable and measurable increase in people's knowledge about and concern for environmental issues across many societies, consumer behaviour has unfortunately not changed significantly enough to make a truly meaningful difference to global pollution levels.",
                targetWord: "people's knowledge about and concern for environmental issues",
                options: [
                    { id: "A", text: "Ecological footprint", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon consciousness", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Environmental awareness", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Sustainable thinking", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 37,
                sentence: "Many major supermarket chains are now actively switching to packaging that is designed and produced in a way that causes minimal harm to the natural environment in direct response to rapidly growing consumer demand for more sustainable products.",
                targetWord: "packaging that is designed and produced in a way that causes minimal harm to the natural environment",
                options: [
                    { id: "A", text: "Sustainable packaging", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Recycled materials", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Eco-friendly packaging", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Carbon neutral containers", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 38,
                sentence: "Adopting a genuinely nature-conscious and low-impact lifestyle does not necessarily require dramatic or overwhelming sacrifices but rather a committed series of small, consistent, and meaningful changes in everyday habits and purchasing decisions.",
                targetWord: "nature-conscious and low-impact lifestyle",
                options: [
                    { id: "A", text: "Carbon neutral", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Eco-friendly", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Sustainably developed", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Ecologically restored", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 39,
                sentence: "The alarming and rapidly accelerating depletion of materials and substances that exist in the environment and can be used by humans, such as freshwater, timber, and minerals poses a severe long-term threat to the survival of both human civilisation and countless animal populations.",
                targetWord: "materials and substances that exist in the environment and can be used by humans, such as freshwater, timber, and minerals",
                options: [
                    { id: "A", text: "Fossil fuel reserves", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Natural resources", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological assets", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Carbon deposits", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 40,
                sentence: "Governments at both national and international levels must introduce genuinely sustainable and enforceable policies to manage the Earth's raw materials and environmental assets responsibly and prevent their complete and irreversible exhaustion.",
                targetWord: "the Earth's raw materials and environmental assets",
                options: [
                    { id: "A", text: "Carbon reserves", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Greenhouse gases", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Natural resources", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecological systems", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 41,
                sentence: "Wealthy and highly industrialised nations carry a disproportionately large measure of the total demand that human activity places on the Earth's natural ecosystems and resources compared to developing countries, yet they frequently bear far fewer of the direct consequences of environmental destruction.",
                targetWord: "measure of the total demand that human activity places on the Earth's natural ecosystems and resources",
                options: [
                    { id: "A", text: "Carbon footprint", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Environmental impact score", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Ecological footprint", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Sustainability index", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 42,
                sentence: "Accurately measuring the quantified environmental demand that cities and their populations place on the planet's natural systems allows urban planners and policymakers to identify the most resource-intensive areas and develop highly targeted sustainability strategies.",
                targetWord: "quantified environmental demand that cities and their populations place on the planet's natural systems",
                options: [
                    { id: "A", text: "Carbon neutrality level", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecological footprint", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Environmental degradation index", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Sustainability benchmark", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 43,
                sentence: "Achieving the condition in which the total amount of carbon dioxide released into the atmosphere is fully balanced by an equivalent amount being permanently removed or offset by 2050 will require a complete and fundamental transformation of how nations produce energy and organise their economies.",
                targetWord: "the condition in which the total amount of carbon dioxide released into the atmosphere is fully balanced by an equivalent amount being permanently removed or offset",
                options: [
                    { id: "A", text: "Zero deforestation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Carbon neutrality", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological balance", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Environmental restoration", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 44,
                sentence: "Several of the world's largest and most influential corporations have made highly publicised commitments to achieving a state of net-zero carbon impact on the atmosphere, though independent critics argue that many of these pledges lack the concrete and verifiable action plans needed to be genuinely meaningful.",
                targetWord: "a state of net-zero carbon impact on the atmosphere",
                options: [
                    { id: "A", text: "Ecological sustainability", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Zero pollution", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Carbon neutrality", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Environmental equilibrium", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 45,
                sentence: "Largely unchecked and poorly regulated industrial activity across multiple sectors has dramatically accelerated the progressive worsening and deterioration of the natural environment through pollution, resource depletion, and ecosystem destruction to a critical point where some ecosystems may already be entirely beyond recovery.",
                targetWord: "the progressive worsening and deterioration of the natural environment through pollution, resource depletion, and ecosystem destruction",
                options: [
                    { id: "A", text: "Climate disruption", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecological imbalance", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Environmental degradation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Natural resource exhaustion", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 46,
                sentence: "The systematic deterioration and destruction of natural environments caused by human activity disproportionately and unjustly affects the world's poorest and most vulnerable communities, who depend most heavily on healthy and productive natural environments for their basic livelihoods and food security.",
                targetWord: "the systematic deterioration and destruction of natural environments caused by human environments",
                options: [
                    { id: "A", text: "Habitat fragmentation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Environmental degradation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological disruption", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Carbon accumulation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 47,
                sentence: "The overwhelming and near-universal scientific consensus regarding the transformation of global climate systems that is directly caused and driven by human industrial and agricultural activities continues to grow stronger, yet deeply entrenched political resistance in many nations continues to dangerously slow meaningful policy reform.",
                targetWord: "the transformation of global climate systems that is directly caused and driven by human industrial and agricultural activities",
                options: [
                    { id: "A", text: "Natural climate variation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Anthropogenic climate change", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Geological climate shift", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Atmospheric temperature increase", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 48,
                sentence: "The man-made alteration of the Earth's climate driven primarily by fossil fuel combustion and large-scale deforestation represents without question the most defining, complex, and urgent environmental challenge that humanity has ever faced in its entire history.",
                targetWord: "the man-made alteration of the Earth's climate driven primarily by fossil fuel combustion and large-scale deforestation",
                options: [
                    { id: "A", text: "Natural global warming", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Seasonal climate variation", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Anthropogenic climate change", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Geological temperature shift", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 49,
                sentence: "Leading marine biologists and environmental scientists are issuing urgent warnings that the continued and accelerating destruction of coral reef systems around the world could trigger the complete and catastrophic breakdown of entire marine ecological systems with truly devastating and long-lasting consequences for global ocean biodiversity.",
                targetWord: "the complete and catastrophic breakdown of entire marine ecological systems",
                options: [
                    { id: "A", text: "Biodiversity reduction", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Habitat fragmentation", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Ecosystem collapse", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Marine degradation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 50,
                sentence: "The very real and rapidly increasing risk of the total and irreversible failure of natural ecological systems to support the species and biological processes that depend on them in the Amazon basin has intensified dramatically due to the devastating combined pressures of deforestation, prolonged drought, and increasingly frequent wildfires.",
                targetWord: "the total and irreversible failure of natural ecological systems to support the species and biological processes that depend on them",
                options: [
                    { id: "A", text: "Habitat destruction", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecosystem collapse", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Environmental degradation", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Biodiversity crisis", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 51,
                sentence: "Making a successful transition to an economic model specifically designed to eliminate waste by ensuring that materials and products remain in active use for as long as possible through continuous reuse, repair, and recycling is now widely considered absolutely essential for achieving genuine and lasting long-term environmental sustainability.",
                targetWord: "an economic model specifically designed to eliminate waste by ensuring that materials and products remain in active use for as long as possible through continuous reuse, repair, and recycling",
                options: [
                    { id: "A", text: "Green economy", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Circular economy", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Sustainable market", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Zero-waste system", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 52,
                sentence: "A regenerative economic system that fundamentally challenges the traditional linear approach of producing, consuming, and discarding by keeping resources continuously in use offers one of the most promising and comprehensive frameworks for simultaneously addressing both environmental sustainability and long-term economic resilience.",
                targetWord: "a regenerative economic system that fundamentally challenges the traditional linear approach of producing, consuming, and discarding by keeping resources continuously in use",
                options: [
                    { id: "A", text: "Sustainable development model", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Green industrial framework", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Circular economy", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecological market system", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 53,
                sentence: "Significantly strengthening and rigorously enforcing the body of laws and regulations introduced by governments specifically to protect the natural environment and control ecologically damaging human activities is now widely considered absolutely essential to holding powerful corporations fully accountable for the serious ecological harm caused by their operations.",
                targetWord: "the body of laws and regulations introduced by governments specifically to protect the natural environment and control ecologically damaging human activities",
                options: [
                    { id: "A", text: "Conservation policy", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Environmental legislation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological governance", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Green regulation framework", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 54,
                sentence: "Without truly robust and comprehensive legally binding rules designed to prevent industries from causing ecological harm, backed by meaningful financial penalties and genuine enforcement mechanisms, many powerful industries will continue to prioritise short-term profit generation over long-term ecological responsibility.",
                targetWord: "legally binding rules designed to prevent industries from causing ecological harm",
                options: [
                    { id: "A", text: "Carbon trading schemes", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Sustainability targets", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Environmental legislation", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Ecological guidelines", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 55,
                sentence: "The alarming and rapidly accelerating rise of global sea levels combined with increasingly severe and prolonged droughts is widely projected to create hundreds of millions of people forcibly displaced from their homes due to the devastating and unliveable effects of climate change by the end of this century.",
                targetWord: "people forcibly displaced from their homes due to the devastating and unliveable effects of climate change",
                options: [
                    { id: "A", text: "Environmental migrants", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Climate refugees", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Ecological displaced persons", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Carbon victims", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 56,
                sentence: "The international community has thus far completely failed to establish any clear, comprehensive, or enforceable legal framework to adequately protect and support individuals who are forced to abandon their homelands as a direct consequence of climate-related environmental catastrophes, leaving millions of vulnerable people in a position of profound legal and humanitarian uncertainty.",
                targetWord: "individuals who are forced to abandon their homelands as a direct consequence of climate-related environmental catastrophes",
                options: [
                    { id: "A", text: "Environmental activists", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecological migrants", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Climate refugees", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Carbon displaced persons", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 57,
                sentence: "The world's leading climate scientists are issuing the most urgent warnings yet that unless global carbon emissions are drastically and immediately reduced within the next critical decade, permanent and unrecoverable harm to the planet's fundamental climate systems will become an absolute and unavoidable certainty.",
                targetWord: "permanent and unrecoverable harm to the planet's fundamental climate systems",
                options: [
                    { id: "A", text: "Temporary environmental setbacks", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecological disruption", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Irreversible damage", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Recoverable environmental harm", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 58,
                sentence: "The mass extinction of essential pollinator species such as bees and butterflies could cause permanent destruction that no human technology or intervention can ever undo to global food production systems that the entirety of human civilisation depends upon for basic survival.",
                targetWord: "permanent destruction that no human technology or intervention can ever undo",
                options: [
                    { id: "A", text: "Significant but temporary harm", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Irreversible damage", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "C", text: "Manageable ecological disruption", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Recoverable biodiversity loss", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 59,
                sentence: "Protecting and preserving the natural environment is fundamentally a moral duty shared across generations, obligating those alive today to safeguard the planet's resources and ecosystems so that those born in the future can enjoy an equal or better quality of life, meaning that the critical decisions made today will directly and profoundly determine the environmental inheritance available to our children and grandchildren.",
                targetWord: "a moral duty shared across generations, obligating those alive today to safeguard the planet's resources and ecosystems so that those born in the future can enjoy an equal or better quality of life",
                options: [
                    { id: "A", text: "Environmental legislation", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Ecological conservation duty", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Intergenerational responsibility", isCorrect: true, feedback: "Correct! This is the right term." },
                    { id: "D", text: "Sustainable development obligation", isCorrect: false, feedback: "Incorrect." }
                ]
            },
            {
                id: 60,
                sentence: "The profound and deeply important concept of the obligation of the present generation to act as responsible stewards of the Earth's natural systems for the direct benefit of those who will come after them fundamentally compels current policymakers and business leaders to look well beyond short-term economic gains and carefully consider the long-term environmental and ecological legacy they will inevitably leave behind.",
                targetWord: "the obligation of the present generation to act as responsible stewards of the Earth's natural systems for the direct benefit of those who will come after them",
                options: [
                    { id: "A", text: "Carbon neutrality commitment", isCorrect: false, feedback: "Incorrect." },
                    { id: "B", text: "Environmental legislation duty", isCorrect: false, feedback: "Incorrect." },
                    { id: "C", text: "Ecological conservation pledge", isCorrect: false, feedback: "Incorrect." },
                    { id: "D", text: "Intergenerational responsibility", isCorrect: true, feedback: "Correct! This is the right term." }
                ]
            }
        ],
        contextTetris: [
            {
                "id": 1,
                "set_name": "Speaking Context Tetris",
                "instruction": "Drag the correct term to complete each sentence.",
                "word_bank": [
                    "pollution",
                    "drop litter",
                    "recycle",
                    "climate change",
                    "global warming",
                    "endangered animals",
                    "deforestation",
                    "natural disasters",
                    "go green",
                    "cut down on"
                ],
                "items": [
                    {
                        "item_id": 1,
                        "gap_sentence": "I think ___ is honestly one of the most urgent and frightening issues facing our generation right now because we can already see how dramatically it is affecting weather patterns all over the world.",
                        "answer": "climate change"
                    },
                    {
                        "item_id": 2,
                        "gap_sentence": "It really annoys me when I see people just ___ in the street or in the park — there are bins everywhere, so there is absolutely no excuse for that kind of careless behaviour.",
                        "answer": "drop litter"
                    },
                    {
                        "item_id": 3,
                        "gap_sentence": "My family made a conscious decision to ___ last year, and since then we have been cycling more, using reusable shopping bags, and trying to buy local produce whenever possible.",
                        "answer": "go green"
                    },
                    {
                        "item_id": 4,
                        "gap_sentence": "I watched an incredibly powerful documentary recently about ___, and I was genuinely shocked to discover just how many species are currently on the verge of disappearing forever from our planet.",
                        "answer": "endangered animals"
                    },
                    {
                        "item_id": 5,
                        "gap_sentence": "Where I come from, we occasionally experience quite severe ___ like flooding and storms, so environmental protection is something that people in my community take very personally and seriously.",
                        "answer": "natural disasters"
                    },
                    {
                        "item_id": 6,
                        "gap_sentence": "I've been making a real effort lately to ___ on the amount of single-use plastic I use every day by carrying my own reusable bottle and coffee cup wherever I go.",
                        "answer": "cut down on"
                    },
                    {
                        "item_id": 7,
                        "gap_sentence": "The thing that worries me most about ___ is that the polar ice caps are melting at such an alarming rate, and if that continues, coastal cities around the world could eventually be completely underwater.",
                        "answer": "global warming"
                    },
                    {
                        "item_id": 8,
                        "gap_sentence": "I think it's really important that everyone tries to ___ their household waste properly by separating glass, paper, and plastic, because it genuinely makes a significant difference to how much ends up in landfill.",
                        "answer": "recycle"
                    },
                    {
                        "item_id": 9,
                        "gap_sentence": "In my opinion, ___ in tropical regions like the Amazon is absolutely devastating because those rainforests are home to an incredible proportion of the world's total plant and animal species.",
                        "answer": "deforestation"
                    },
                    {
                        "item_id": 10,
                        "gap_sentence": "Air ___ in the city where I grew up has become increasingly serious over the past decade, and I genuinely worry about the long-term health effects it must be having on the people who live there.",
                        "answer": "pollution"
                    }
                ]
            }
,
            {
                "id": 2,
                "set_name": "Band 7 Speaking Context Tetris",
                "instruction": "Drag the correct term to complete each sentence.",
                "word_bank": [
                    "renewable energy",
                    "carbon footprint",
                    "environmentally friendly",
                    "raise awareness",
                    "biodiversity",
                    "make a difference",
                    "sustainable",
                    "take responsibility",
                    "environmentally conscious",
                    "natural habitat"
                ],
                "items": [
                    {
                        "item_id": 11,
                        "gap_sentence": "I genuinely believe that investing heavily in ___ sources like solar and wind power is the single most important and impactful step that governments around the world can take right now to seriously combat the growing climate crisis.",
                        "answer": "renewable energy"
                    },
                    {
                        "item_id": 12,
                        "gap_sentence": "I try my best to make ___ choices in my daily life, such as buying products with minimal packaging and choosing companies that I know genuinely care about their environmental impact.",
                        "answer": "environmentally friendly"
                    },
                    {
                        "item_id": 13,
                        "gap_sentence": "It absolutely breaks my heart to see so many wild animals being pushed out of their ___ because humans keep expanding into untouched wilderness areas for the sake of agriculture and property development.",
                        "answer": "natural habitat"
                    },
                    {
                        "item_id": 14,
                        "gap_sentence": "I think social media platforms have actually played a really powerful and positive role in helping to ___ about critical environmental issues, particularly among younger generations who spend so much time online.",
                        "answer": "raise awareness"
                    },
                    {
                        "item_id": 15,
                        "gap_sentence": "I know some people feel completely overwhelmed and think their personal actions simply don't matter, but I honestly believe that if enough individuals make small consistent changes, they really can ___ to the overall health of the planet.",
                        "answer": "make a difference"
                    },
                    {
                        "item_id": 16,
                        "gap_sentence": "The protection of ___ — meaning the extraordinary variety of life that exists on our planet — is something I feel incredibly passionate about because every single species plays a unique and irreplaceable role in keeping ecosystems functioning properly.",
                        "answer": "biodiversity"
                    },
                    {
                        "item_id": 17,
                        "gap_sentence": "Living a truly ___ lifestyle doesn't mean you have to make enormous or uncomfortable sacrifices — it's really more about making thoughtful, long-term decisions about how you consume and what you choose to support.",
                        "answer": "sustainable"
                    },
                    {
                        "item_id": 18,
                        "gap_sentence": "It frustrates me enormously when large and profitable corporations simply refuse to ___ for the serious environmental damage their operations cause and instead shift all the blame onto individual consumers.",
                        "answer": "take responsibility"
                    },
                    {
                        "item_id": 19,
                        "gap_sentence": "I think young people today are genuinely far more ___ than any previous generation, largely because we have grown up witnessing the very real and visible consequences of climate change happening all around us.",
                        "answer": "environmentally conscious"
                    },
                    {
                        "item_id": 20,
                        "gap_sentence": "I always try to reduce my personal ___ by taking public transport instead of driving, eating less meat, and being much more thoughtful about the products I buy and the companies I choose to support.",
                        "answer": "carbon footprint"
                    }
                ]
            },
            {
                "id": 3,
                "set_name": "Band 8+ Speaking Context Tetris",
                "instruction": "Drag the correct term to complete each sentence.",
                "word_bank": [
                    "environmental impact",
                    "vicious cycle",
                    "turn a blind eye",
                    "at the expense of",
                    "bear the brunt of",
                    "a drop in the ocean",
                    "wake-up call",
                    "strike a balance",
                    "in the long run",
                    "it goes without saying"
                ],
                "items": [
                    {
                        "item_id": 21,
                        "gap_sentence": "___ that clean air, safe drinking water, and a stable climate are not luxuries but absolute fundamental human rights — yet millions of the world's most vulnerable people are currently being denied all three because of reckless and largely unregulated industrial activity.",
                        "answer": "it goes without saying"
                    },
                    {
                        "item_id": 22,
                        "gap_sentence": "The truly devastating Australian bushfires of 2019 and 2020 should have served as an unmistakable ___ for world leaders everywhere, but I think most governments have still not responded with anywhere near the level of urgency that the situation so clearly demands.",
                        "answer": "wake-up call"
                    },
                    {
                        "item_id": 23,
                        "gap_sentence": "I think the greatest and most complex challenge facing modern governments is learning how to genuinely ___ between pursuing necessary economic development and fulfilling their equally important obligation to protect the natural environment for future generations.",
                        "answer": "strike a balance"
                    },
                    {
                        "item_id": 24,
                        "gap_sentence": "It is a deeply troubling and profoundly unjust reality that developing nations — which have contributed the least to creating the climate crisis — are consistently the ones who ___ its most catastrophic and devastating consequences.",
                        "answer": "bear the brunt of"
                    },
                    {
                        "item_id": 25,
                        "gap_sentence": "We simply cannot keep choosing to ___ to the catastrophic destruction of our oceans, forests, and atmosphere and naively hope that these incredibly complex problems will somehow resolve themselves without urgent and decisive collective action.",
                        "answer": "turn a blind eye"
                    },
                    {
                        "item_id": 26,
                        "gap_sentence": "For far too long and across far too many decades, powerful nations have recklessly pursued rapid economic growth ___ the natural environment, and we are now beginning to see the full and truly frightening scale of the long-term consequences of that approach.",
                        "answer": "at the expense of"
                    },
                    {
                        "item_id": 27,
                        "gap_sentence": "Poverty forces desperate communities to overexploit whatever natural resources they can access just to survive, which then leads directly to more severe environmental damage, which in turn leads to deeper poverty — it is a truly devastating ___ that is extraordinarily difficult to break without massive structural intervention.",
                        "answer": "vicious cycle"
                    },
                    {
                        "item_id": 28,
                        "gap_sentence": "Investing in renewable energy infrastructure and green technology may appear extremely expensive and financially challenging in the short term, but ___ it will save governments and economies truly enormous amounts of money while simultaneously and meaningfully protecting the planet.",
                        "answer": "in the long run"
                    },
                    {
                        "item_id": 29,
                        "gap_sentence": "I sometimes feel that my individual efforts to live more sustainably and reduce my environmental impact are honestly just ___ compared to the sheer industrial scale of the pollution and destruction being caused by large multinational corporations every single day.",
                        "answer": "a drop in the ocean"
                    },
                    {
                        "item_id": 30,
                        "gap_sentence": "I think every single company operating today should be legally required to comprehensively assess and publicly report the full ___ of their products and operations before they are permitted to bring anything new to the market.",
                        "answer": "environmental impact"
                    }
                ]
            }        ],
        speakToUnlock: []
    }
};
