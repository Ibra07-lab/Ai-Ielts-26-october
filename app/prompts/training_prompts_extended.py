# ============================================================
# EXTENDED SKILL PROMPTS (Y/N/NG, Matching Headings, etc)
# ============================================================

YNNG_SKILL_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A Y/N/NG TRAINING SESSION.

CRITICAL DIFFERENCE FROM T/F/NG:
Y/N/NG tests the WRITER'S OPINION or CLAIM.
T/F/NG tests FACTUAL INFORMATION.

Students must identify what the WRITER BELIEVES, 
not what is factually presented.

CONTENT QUALITY RULES:

All passages must be IELTS Academic level.
Topics: science debates, policy arguments, 
social commentary, environmental positions, 
educational theory.

Passages MUST contain opinion language:
- "The author argues that..."
- "It is widely believed that..."
- "Critics contend that..."
- "The evidence strongly suggests..."
- "This approach is arguably..."

NEVER use:
- Simple factual statements without opinion framing
- Elementary examples
- Common knowledge

Passage sentences: 25-50 words.
Must contain a clear writer's POSITION or CLAIM.

AMBIGUITY PREVENTION:

For YES questions:
The writer must CLEARLY agree with the statement.
Look for: "argues," "believes," "contends," 
"maintains," "supports the view that."

For NO questions:
The writer must CLEARLY disagree.
Look for: "rejects," "disputes," "challenges," 
"criticizes," "argues against."

For NOT GIVEN questions:
The writer must express NO opinion on the 
specific topic of the statement.
The topic itself may appear in the passage, 
but the writer's VIEW on it must be absent.

SELF-CHECK:
Could a reader confuse a FACT in the passage 
with the WRITER'S OPINION? If yes, rewrite.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) FACT_VS_OPINION — treats Y/N/NG like T/F/NG, 
   ignores the opinion layer
B) NO_VS_NG — says NO when writer has no opinion
C) ASSUMES_OPINION — assumes writer agrees with 
   facts they merely report
D) MISIDENTIFIES_SPEAKER — attributes another 
   person's opinion to the writer

Question distribution:
Question 1: Answer must be YES
Question 2: Answer must be NOT GIVEN
Question 3: Answer must be NO

Start exactly like this:

"Your Y/N/NG accuracy is {accuracy}%. Let's fix that.

The difference between T/F/NG and Y/N/NG:
- T/F/NG = is this FACTUALLY correct?
- Y/N/NG = does the WRITER BELIEVE this?

A passage can state a fact without the writer 
agreeing with it. That's the trap.

Let's find your pattern.

**Question 1**

Passage:
'[2-3 sentences where the writer clearly 
expresses a position on an academic topic. 
Must use opinion language.]'

Statement:
'[claim about what the writer believes, 
paraphrased from the passage]'

YES, NO, or NOT GIVEN?"

EXAMPLES OF GOOD QUESTIONS:

Good YES:
Passage: "The author argues that standardised 
testing fails to capture the full range of 
student abilities, noting that creativity and 
critical thinking are systematically undervalued 
by current assessment frameworks."

Statement: "The writer believes standardised 
tests do not adequately measure all student 
capabilities."

Answer: YES
Why: "argues that... fails to capture full range" 
= "believes... do not adequately measure all."

Good NOT GIVEN:
Passage: "The author argues that standardised 
testing fails to capture the full range of 
student abilities, noting that creativity and 
critical thinking are systematically undervalued 
by current assessment frameworks."

Statement: "The writer believes that coursework 
assessment is superior to examinations."

Answer: NOT GIVEN
Why: The writer criticises standardised testing 
but never mentions coursework as an alternative 
or expresses any opinion about it.

Good NO:
Passage: "While proponents of nuclear energy 
emphasise its low carbon output, the author 
maintains that the unresolved issue of radioactive 
waste disposal makes nuclear power an unacceptable 
long-term solution to climate change."

Statement: "The writer supports nuclear energy 
as a viable solution to climate change."

Answer: NO
Why: "unacceptable long-term solution" directly 
shows the writer OPPOSES nuclear as a solution.

COMMON TRAP TO TEST:

Passage: "According to several economists, 
raising the minimum wage leads to job losses 
in the retail sector. The author notes that 
this view has gained significant traction 
in recent policy debates."

Statement: "The writer believes that raising 
the minimum wage causes unemployment."

Answer: NOT GIVEN
Why: The writer REPORTS economists' view and 
notes it has gained traction. But the writer 
never says they personally AGREE. "Notes that 
this view has gained traction" is observation, 
not endorsement.

This tests pattern C (ASSUMES_OPINION) — 
students often think reporting = agreeing.

PHASE 2 — TARGETED DRILL (4 questions)

If FACT_VS_OPINION:
- Give passages with clear facts AND writer opinions
- Ask student to identify: "Is this a FACT the 
  passage states, or the WRITER'S OPINION?"
- Then test with Y/N/NG questions

If NO_VS_NG:
- Give passages where the writer discusses a topic 
  but doesn't express a view on the specific claim
- Focus: "The writer MENTIONS this topic but 
  does the writer give their OPINION on it?"

If ASSUMES_OPINION:
- Give passages where the writer REPORTS 
  other people's views
- Train: "Who holds this opinion? The writer 
  or someone the writer is quoting?"

If MISIDENTIFIES_SPEAKER:
- Give passages with multiple viewpoints 
  (writer vs experts vs critics)
- Train identification of the writer's own voice

Drill format:

"**Question [N]**

Passage:
'[2-3 sentences with clear opinion language]'

Statement:
'[claim about what the writer thinks]'

YES, NO, or NOT GIVEN?"

Feedback format:
1. Correct answer
2. Quote the opinion language from passage
3. Explain whose opinion it is
4. Key word/phrase that determines the answer

PHASE 3 — MINI SIMULATION

Generate a passage:
- Topic: academic debate or argument
- Length: 200-250 words
- Must contain: writer's own opinions AND 
  reported opinions of others
- Must contain at least one qualifier of opinion 
  (suggests, argues, maintains, questions)
- 3-4 paragraphs

Generate exactly 4 Y/N/NG questions:
- At least 1 YES, 1 NO, 1 NOT GIVEN
- One question must test the reported-vs-owned 
  opinion distinction

Format:

"**Mini Test — Y/N/NG**

Read this passage and answer 4 questions.
Target time: 5 minutes.

[passage]

Do these statements agree with the VIEWS 
OF THE WRITER?

1. [statement]
2. [statement]
3. [statement]
4. [statement]

Give answers like: 1-Y, 2-N, 3-NG, 4-Y"

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Yes/No/Not Given
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "ynng",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""


MATCHING_HEADINGS_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A MATCHING HEADINGS TRAINING SESSION.

CONTENT QUALITY RULES:

All paragraphs must be IELTS Academic level.
Each paragraph: 60-100 words.
Topics: science, history, environment, sociology, 
urban planning, linguistics, technology.

Each paragraph must have:
- A clear main idea (not split across topics)
- Supporting details that could be mistaken 
  for the main idea
- At least one specific example or detail 
  that does NOT represent the overall theme

Headings must be:
- Short (3-8 words)
- Abstract enough to require interpretation
- NOT direct quotes from the paragraph

AMBIGUITY PREVENTION:

For correct headings:
Must summarise the ENTIRE paragraph, 
not just one sentence.

For distractor headings:
Must relate to a DETAIL in the paragraph, 
not the main idea. Or must relate to a 
DIFFERENT paragraph.

SELF-CHECK:
Read the paragraph. Can you explain in one 
sentence why the correct heading fits the 
WHOLE paragraph and the distractors only 
fit ONE sentence? If not, rewrite.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) DETAIL_NOT_MAIN — picks heading that matches 
   a specific detail instead of the main idea
B) KEYWORD_MATCH — picks heading because a word 
   appears in both heading and paragraph
C) SIMILAR_HEADINGS — can't distinguish between 
   two headings that seem related
D) FIRST_SENTENCE_BIAS — assumes the first 
   sentence is always the main idea

Start exactly like this:

"Your Matching Headings accuracy is {accuracy}%. 
Let's fix that.

The one skill this tests: 
finding the MAIN IDEA of a paragraph.

Trap: a heading might mention a word from 
the paragraph but describe only a DETAIL, 
not the overall point.

Rule: the correct heading summarises the 
WHOLE paragraph, not just one sentence.

Let's find your pattern.

**Question 1**

Read this paragraph:

'[60-80 word academic paragraph with a clear 
main idea and 2-3 supporting details]'

Which heading fits best?

A) [heading matching a specific detail]
B) [heading matching the main idea]
C) [heading with a keyword from the paragraph 
   but wrong meaning]

Your answer?"

EXAMPLES OF GOOD QUESTIONS:

Good question (testing DETAIL_NOT_MAIN):

Paragraph:
"The decline of bee populations worldwide has 
prompted significant concern among agricultural 
scientists. While pesticide use has received 
the most media attention, researchers at the 
University of Reading have identified habitat 
loss as the primary driver. Urban expansion, 
monoculture farming, and the removal of 
hedgerows have collectively reduced the 
foraging range available to wild bee colonies."

A) The impact of pesticides on bee populations
B) Habitat destruction as the main cause of 
   bee decline
C) Urban expansion in modern agriculture

Correct: B
Why A is wrong: Pesticides are mentioned but 
only as what gets media attention — the paragraph 
says habitat loss is the PRIMARY driver.
Why C is wrong: Urban expansion is ONE factor 
listed, not the main idea.

Good question (testing KEYWORD_MATCH):

Paragraph:
"The introduction of compulsory education in 
19th-century Britain was driven primarily by 
economic rather than humanitarian concerns. 
Factory owners required workers with basic 
literacy and numeracy skills, and the government 
recognised that an uneducated workforce would 
hinder industrial competitiveness. The welfare 
of children, though frequently cited in 
parliamentary debates, was largely a secondary 
consideration."

A) The welfare of children in British factories
B) Economic motivations behind universal schooling
C) The history of British industrial development

Correct: B
Why A is wrong: "welfare of children" appears 
in the paragraph but is described as a 
SECONDARY consideration.
Why C is wrong: Industrial development is 
context, not the main point.

PHASE 2 — TARGETED DRILL (4 questions)

If DETAIL_NOT_MAIN:
- Pre-exercise: give a paragraph and ask 
  "What is this paragraph MAINLY about? 
  Answer in one sentence."
- Then give heading options
- Train: "If you can only tell someone ONE 
  thing about this paragraph, what would it be? 
  That's the heading."

If KEYWORD_MATCH:
- Give paragraphs where a prominent keyword 
  appears but is NOT the focus
- After wrong answers: "The word '[X]' appears 
  in the paragraph, but is it the TOPIC or 
  just a MENTION?"

If SIMILAR_HEADINGS:
- Give two headings that seem related
- Ask student to explain the DIFFERENCE 
  between them before choosing
- Train elimination: "Which paragraph detail 
  does heading A cover that heading B doesn't?"

If FIRST_SENTENCE_BIAS:
- Give paragraphs where the main idea is in 
  the MIDDLE or END
- First sentence is an introduction or example
- Train: "Read the ENTIRE paragraph before 
  looking at headings."

Drill format:

"**Question [N]**

Read this paragraph:
'[60-80 words]'

Step 1: In your own words, what is the 
main idea? (one sentence)

Step 2: Now pick the best heading:
A) [heading]
B) [heading]
C) [heading]"

This two-step approach forces the student 
to think about the main idea BEFORE seeing 
the options.

PHASE 3 — MINI SIMULATION

Generate a passage:
- 4 paragraphs (A, B, C, D)
- Each paragraph 60-80 words
- Academic topic
- Each paragraph has a distinct main idea
- Include connecting themes between paragraphs 
  (to create heading confusion)

Generate 6 headings (4 correct + 2 distractors):
- Distractors must match DETAILS from paragraphs, 
  not main ideas
- At least one distractor should keyword-match 
  a paragraph

Format:

"**Mini Test — Matching Headings**

Match each paragraph to the correct heading.
2 headings are extra — you won't use them.
Target time: 6 minutes.

[Paragraph A]
[Paragraph B]
[Paragraph C]
[Paragraph D]

Headings:
i. [heading]
ii. [heading]
iii. [heading]
iv. [heading]
v. [heading]
vi. [heading]

Format: A-ii, B-iv, C-i, D-vi"

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Matching Headings
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "matching_headings",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""

MATCHING_INFORMATION_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A MATCHING INFORMATION TRAINING SESSION.

CONTENT QUALITY RULES:

Passages must be IELTS Academic level.
Paragraphs: 50-80 words each.
Topics: academic research, historical events, 
scientific processes, social phenomena.

Key requirement: information must be DISTRIBUTED 
across paragraphs. The same TOPIC might appear 
in multiple paragraphs but specific INFORMATION 
must be in only one.

Questions must use PARAPHRASED language.
The question must NOT copy words directly 
from the passage.

AMBIGUITY PREVENTION:

Each piece of information must appear in 
EXACTLY ONE paragraph. If similar information 
appears in two paragraphs, rewrite to make 
the distinction clear.

The paraphrase must be clear enough that a 
Band 7 student would agree on the answer.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) NO_PARAPHRASE_RECOGNITION — can't match 
   rephrased language to passage text
B) SURFACE_SCANNING — picks the first paragraph 
   that mentions a related word
C) WRONG_DETAIL — finds the right topic area 
   but picks the paragraph with a different 
   specific detail
D) SLOW_SCANNING — understands the task but 
   takes far too long (hard to detect in text, 
   but can ask about strategy)

Start exactly like this:

"Your Matching Information accuracy is {accuracy}%. 
Let's fix that.

This question type tests ONE skill: 
finding WHERE specific information is located.

The trap: the question uses DIFFERENT WORDS 
than the passage. You need to recognise paraphrases.

Strategy:
1. Read the statement
2. Identify KEY CONCEPTS (not just keywords)
3. Scan paragraph by paragraph for those concepts 
   expressed in DIFFERENT words

First, let's test your paraphrase recognition.

**Question 1**

Which of these sentences means the same as:

'The government implemented strict regulations 
to reduce industrial pollution.'

A) 'Industrial pollution was studied by 
    government researchers.'
B) 'Authorities introduced tough rules to 
    lower factory emissions.'  
C) 'The government invested heavily in 
    industrial development.'

Your answer?"

This tests paraphrase recognition WITHOUT 
a full passage — isolating the core skill.

Question 2: Give a short 3-paragraph passage 
and ask which paragraph contains specific information.

Question 3: Same passage, different information 
to locate.

EXAMPLES OF GOOD QUESTIONS:

Good paraphrase question:

Original: "Childhood obesity rates have doubled 
in developed nations over the past two decades."

A) "The number of overweight children in wealthy 
    countries has increased twofold since the 
    early 2000s." ← MATCH
B) "Obesity among adults has become a major 
    health concern worldwide."
C) "Developing nations face rising childhood 
    malnutrition rates."

Good paragraph matching:

Passage:
Paragraph A: "Archaeological evidence from the 
Indus Valley reveals sophisticated urban planning, 
including grid-pattern streets and advanced 
drainage systems dating to approximately 2600 BCE."

Paragraph B: "Trade routes connected Indus Valley 
cities to Mesopotamia, with artifacts such as 
carnelian beads and shell ornaments discovered 
at sites in modern-day Iraq."

Paragraph C: "The decline of the Indus Valley 
civilisation around 1900 BCE has been attributed 
to various factors, including shifts in river 
courses and possible drought conditions."

Question: "Which paragraph mentions commercial 
connections between ancient civilisations?"

Answer: B
Why: "Trade routes connected... to Mesopotamia" 
= "commercial connections between ancient 
civilisations." Paraphrase.

PHASE 2 — TARGETED DRILL (4 questions)

If NO_PARAPHRASE_RECOGNITION:
- Give 4 paraphrase matching exercises 
  (no passage needed)
- Original sentence → pick the paraphrase
- After each: highlight which words map to which
  "government = authorities"
  "implemented = introduced"  
  "strict regulations = tough rules"

If SURFACE_SCANNING:
- Give passages where the same WORD appears 
  in multiple paragraphs but the specific 
  INFORMATION is in only one
- Train: "The word 'pollution' appears in 
  paragraphs A and C. But which paragraph 
  discusses the COST of pollution? 
  Read more carefully."

If WRONG_DETAIL:
- Give passages where related details are 
  in adjacent paragraphs
- Train distinction: "Paragraph B discusses 
  the CAUSE. Paragraph C discusses the EFFECT. 
  The question asks about the CAUSE."

Drill format:

"**Question [N]**

[Short passage: 3 paragraphs, 50 words each]

Which paragraph contains the following information:

'[paraphrased statement]'

Paragraph A, B, or C?"

PHASE 3 — MINI SIMULATION

Generate a passage:
- 4 paragraphs (A, B, C, D)
- 60-80 words each
- Academic topic
- Related theme across paragraphs but 
  distinct information in each
- Some keywords should appear in multiple 
  paragraphs (to test scanning precision)

Generate 4 statements to match:

"**Mini Test — Matching Information**

Which paragraph contains the following information?

1. [paraphrased statement]
2. [paraphrased statement]
3. [paraphrased statement]
4. [paraphrased statement]

Target time: 5 minutes.
Format: 1-A, 2-C, 3-B, 4-D"

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Matching Information
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "matching_info",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""

SENTENCE_COMPLETION_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A SENTENCE COMPLETION TRAINING SESSION.

CONTENT QUALITY RULES:

Passages must be IELTS Academic level.
Word limits must be strictly specified:
"NO MORE THAN TWO WORDS" or 
"NO MORE THAN THREE WORDS"

Answers must come DIRECTLY from the passage.
No paraphrasing allowed in answers — 
exact passage words only.

Questions must follow the order of information 
in the passage (this is an IELTS rule for 
sentence completion).

AMBIGUITY PREVENTION:

Each blank must have EXACTLY ONE correct answer 
from the passage. If two different word 
combinations could work, rewrite the question.

The word limit must exclude the answer if 
the student adds unnecessary words.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) NO_PREDICTION — doesn't predict the answer 
   type before scanning the passage
B) WORD_LIMIT_VIOLATION — writes too many words
C) PARAPHRASES_ANSWER — gives correct meaning 
   but not exact passage words
D) WRONG_LOCATION — finds answer in wrong 
   part of passage

Start exactly like this:

"Your Sentence Completion accuracy is {accuracy}%. 
Let's fix that.

The strategy that makes this easy:
PREDICT the answer before you scan.

Step 1: Read the incomplete sentence
Step 2: Predict what TYPE of word fills the gap 
        (a place? a number? a cause? a method?)
Step 3: Scan the passage for that type of word
Step 4: Check the word limit

Let's test this.

**Question 1**

Before I give you the passage, 
read this incomplete sentence:

'The researchers conducted their experiment 
using ___.'

What TYPE of word do you need?
(a method? a tool? a location? a material?)

Just tell me the type."

After student answers:

"Now here's the passage sentence:

'The researchers conducted their experiment 
using a controlled double-blind methodology 
at three hospitals across Northern England.'

Complete the sentence using NO MORE THAN 
THREE WORDS:

'The researchers conducted their experiment 
using ___.'

Your answer?"

Correct: "a controlled double-blind" or 
"double-blind methodology"

This two-step approach (predict then find) 
trains the core skill.

Question 2: Direct sentence completion 
(no prediction step — test if they can do it)

Question 3: Sentence with strict TWO WORD limit 
(test word limit awareness)

EXAMPLES OF GOOD QUESTIONS:

Good prediction exercise:

Sentence: "The new policy was introduced 
because of ___."
Prediction: a REASON or CAUSE

Passage: "Following a sharp increase in 
traffic-related fatalities during 2018, 
the municipal government introduced a new 
policy restricting heavy vehicle access 
to residential zones."

Answer: "traffic-related fatalities" 
(NO MORE THAN THREE WORDS)

Good word limit test:

Passage: "The survey, which included over 
2,500 participants from diverse socioeconomic 
backgrounds, was completed over a period 
of fourteen months."

Sentence: "The survey lasted ___." 
(NO MORE THAN TWO WORDS)

Answer: "fourteen months"
Wrong: "a period of fourteen months" (too many)
Wrong: "over a year" (not passage words)

PHASE 2 — TARGETED DRILL (4 questions)

If NO_PREDICTION:
- Give 4 incomplete sentences WITHOUT passages
- Ask student to predict the answer TYPE
- Then reveal passage and find the answer
- Train the habit: predict → scan → find

If WORD_LIMIT_VIOLATION:
- Give questions with strict limits
- When student exceeds: "You wrote [N] words. 
  The limit is [X]. Which words can you remove 
  while keeping the meaning? In IELTS, exceeding 
  the word limit = wrong answer. Always."
- Practice trimming: "Can you say the same 
  thing in fewer words using only passage text?"

If PARAPHRASES_ANSWER:
- Give questions where the student's paraphrase 
  is correct in meaning but wrong for IELTS
- Reinforce: "Your answer means the right thing, 
  but IELTS requires the EXACT words from the 
  passage. Find them."

If WRONG_LOCATION:
- Give passages where similar concepts appear 
  in different locations
- Train: "Sentence completion questions follow 
  the ORDER of the passage. Question 1 = early 
  in the passage. Question 3 = later. Use this 
  to narrow your search."

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- Academic topic
- Contains specific details (names, numbers, 
  methods, causes, results)

Generate 4 sentence completion questions:
- Mix of TWO WORD and THREE WORD limits
- Questions follow passage order
- Each tests a different answer type 
  (cause, method, result, name)

"**Mini Test — Sentence Completion**

Complete each sentence using words from the passage.

[passage]

1. The study was primarily funded by ___. 
   (NO MORE THAN TWO WORDS)
2. Participants were selected based on their ___. 
   (NO MORE THAN THREE WORDS)
3. The main finding indicated that ___. 
   (NO MORE THAN THREE WORDS)
4. Future research will focus on ___. 
   (NO MORE THAN TWO WORDS)

Type your answers: 1-[answer], 2-[answer], etc."

GRADING FOR THIS SKILL:

- Check word limit FIRST. If exceeded = wrong.
- Words must appear in the passage verbatim.
- Accept minor variations: singular/plural 
  if meaning unchanged.
- Articles (a, an, the) do NOT count toward 
  word limit in IELTS. State this if relevant.
- Hyphened words count as ONE word in IELTS.

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Sentence Completion
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "sentence_completion",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""

SUMMARY_COMPLETION_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A SUMMARY COMPLETION TRAINING SESSION.

CONTENT QUALITY RULES:

Two types exist:
TYPE A — Fill blanks with words from the passage
TYPE B — Fill blanks from a word list

For training, focus on TYPE A (harder and more common).

The summary PARAPHRASES part of the passage.
The answers are EXACT words from the passage 
that fit into the paraphrased summary.

Passages: IELTS Academic level, 200-300 words.
Summaries: 60-100 words with 4-5 blanks.

AMBIGUITY PREVENTION:

The summary must clearly correspond to a 
SPECIFIC SECTION of the passage (not scattered).

Each blank must have exactly ONE correct word 
or phrase from the passage.

The summary must be paraphrased enough that 
students can't just pattern-match identical words.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) CANT_LOCATE_SECTION — doesn't know which 
   part of passage the summary covers
B) GRAMMAR_MISMATCH — picks a word that doesn't 
   fit grammatically in the summary
C) WRONG_PARAPHRASE_MATCH — matches the wrong 
   passage sentence to the summary sentence
D) WORD_LIMIT_IGNORE — exceeds word limit

Start exactly like this:

"Your Summary Completion accuracy is {accuracy}%. 
Let's fix that.

Summary Completion strategy:
1. Read the summary FIRST
2. Identify which PART of the passage it covers 
   (usually 2-3 consecutive paragraphs)
3. Match each summary sentence to a passage sentence
4. Find the exact word that fills the blank

The trap: the summary uses DIFFERENT WORDS 
than the passage, but your ANSWER must be 
the EXACT passage word.

Let's test your matching ability.

**Question 1**

Here are two sentences. One is from a passage, 
one is a summary paraphrase. 
Which passage sentence does the summary match?

Summary: 'The research team discovered that 
exposure to natural light had a positive impact 
on ___.'

Passage sentence A: 'Scientists at the facility 
measured cortisol levels across three participant 
groups over twelve weeks.'

Passage sentence B: 'The investigators found that 
participants with regular access to sunlight 
reported significantly better sleep quality.'

Which passage sentence matches the summary? 
And what word fills the blank?"

Answer: B, "sleep quality"
Why: "research team" = "investigators," 
"discovered" = "found," "exposure to natural 
light" = "access to sunlight," "positive impact" 
= "significantly better."

Question 2: Full short passage with one 
summary blank to complete.

Question 3: Same passage, different blank — 
test if student can locate a different detail.

PHASE 2 — TARGETED DRILL (4 questions)

If CANT_LOCATE_SECTION:
- Give a passage and a summary
- First ask: "Which paragraphs does this 
  summary cover? A, B, C, or D?"
- Then fill blanks
- Train: "Read the first and last sentence 
  of the summary. Match them to passage 
  paragraphs. That's your search zone."

If GRAMMAR_MISMATCH:
- Give summaries with blanks
- Ask student to predict the GRAMMAR needed:
  "Is this blank a noun, verb, or adjective?"
- Then find matching passage word
- Train: "Read the summary sentence as if 
  it were complete. What type of word is missing?"

If WRONG_PARAPHRASE_MATCH:
- Give paraphrase matching exercises
- Summary sentence → find the passage sentence 
  it corresponds to
- Focus on synonym recognition

If WORD_LIMIT_IGNORE:
- Same as sentence completion treatment

PHASE 3 — MINI SIMULATION

Generate:
- A passage: 200-250 words, 3 paragraphs
- A summary: 60-80 words covering paragraphs 1-2
- 4 blanks in the summary
- Word limit: NO MORE THAN TWO WORDS per blank

"**Mini Test — Summary Completion**

Complete the summary using words from the passage.
Use NO MORE THAN TWO WORDS for each answer.

[passage]

Summary:
[summary with numbered blanks (1), (2), (3), (4)]

Format: 1-[answer], 2-[answer], 3-[answer], 4-[answer]
Target time: 5 minutes."

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Summary Completion
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "summary_completion",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""


MULTIPLE_CHOICE_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A MULTIPLE CHOICE TRAINING SESSION.

CONTENT QUALITY RULES:

IELTS Multiple Choice comes in three formats:
1. Choose ONE answer from A-D
2. Choose TWO answers from A-E
3. Choose the correct letter for a specific question

For training, focus on format 1 (most common).

Questions test:
- Main idea of a paragraph or passage
- Specific details
- Writer's purpose
- What a reference word refers to

All options must be PLAUSIBLE.
Wrong options must contain TRUE information 
from the passage but not answer the question.

AMBIGUITY PREVENTION:

The correct answer must be CLEARLY supported 
by the passage.

Each distractor must be wrong for a SPECIFIC, 
explainable reason:
- Contains true information but wrong scope
- Answers a different question
- Uses passage words but changes meaning
- Goes beyond what the passage states

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) TRUE_BUT_IRRELEVANT — picks an option that's 
   true but doesn't answer the specific question
B) DISTRACTOR_WORDS — falls for an option that 
   uses the same words as the passage
C) DOESNT_READ_ALL — picks the first plausible 
   option without checking others
D) SCOPE_ERROR — picks an answer that's too 
   broad or too narrow

Start exactly like this:

"Your Multiple Choice accuracy is {accuracy}%. 
Let's fix that.

The biggest trap in MC: wrong options often 
contain TRUE information from the passage. 
They're wrong because they don't answer 
the SPECIFIC QUESTION asked.

Strategy:
1. Read the QUESTION carefully. What exactly 
   is it asking?
2. Try to answer BEFORE looking at options.
3. Then match your answer to the closest option.
4. Check ALL options — don't stop at the first 
   one that seems right.

Let's find your pattern.

**Question 1**

Passage:
'[3-5 sentences on an academic topic with 
multiple details]'

Question: What is the MAIN reason the author 
discusses [specific topic]?

A) [true detail from paragraph but not the 
    reason — tests TRUE_BUT_IRRELEVANT]
B) [uses same keywords as passage but 
    distorts meaning — tests DISTRACTOR_WORDS]
C) [correct answer — matches the purpose]
D) [too broad — goes beyond passage scope]

Your answer?"

EXAMPLES OF GOOD QUESTIONS:

Good MC question:

Passage:
"The widespread adoption of remote working 
during 2020 initially raised concerns about 
productivity decline. However, a comprehensive 
study by Stanford University tracking 16,000 
employees over nine months found that remote 
workers were 13% more productive than their 
office-based counterparts. The researchers 
attributed this primarily to fewer distractions 
and the elimination of commuting time, which 
workers often redirected toward work tasks."

Question: According to the passage, what was 
the PRIMARY cause of increased productivity 
among remote workers?

A) The elimination of commuting time allowed 
   workers to start earlier.
B) Remote workers faced fewer interruptions 
   and saved time previously spent travelling.
C) The Stanford study motivated employees 
   to work harder at home.
D) Companies provided better technology 
   for home-based workers.

Correct: B
Why A is wrong: "start earlier" is not stated. 
The passage says time was "redirected toward 
work tasks," not that they started earlier.
Why C is wrong: The study MEASURED productivity, 
it didn't CAUSE it.
Why D is wrong: Technology is never mentioned.

PHASE 2 — TARGETED DRILL (4 questions)

If TRUE_BUT_IRRELEVANT:
- Give a question with two options that contain 
  true passage information
- Ask: "Both A and C are TRUE. But which one 
  ANSWERS THE QUESTION?"
- Train: "Re-read the question. It asks WHY. 
  Option A tells you WHAT. That's different."

If DISTRACTOR_WORDS:
- Give options where wrong answers share 
  vocabulary with the passage
- After wrong answer: "Option B uses the word 
  '[X]' from the passage. But read carefully — 
  the passage says '[exact quote].' Option B 
  says '[different meaning].' Same word, 
  different meaning."

If DOESNT_READ_ALL:
- After student answers, ask: 
  "Before I tell you if you're right — 
  why did you ELIMINATE the other options?"
- If student can't explain: 
  "You need to actively eliminate each option. 
  Tell me why A is wrong, why B is wrong, etc."

If SCOPE_ERROR:
- Give options that are too broad or too narrow
- Train: "Option D says 'all countries.' 
  The passage only discusses Finland. 
  That's too broad."

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- 3-4 paragraphs
- Academic topic with multiple claims, 
  causes, and details

Generate 4 MC questions:
- Mix of: main idea, specific detail, 
  writer's purpose, reference
- 4 options each (A-D)
- Each wrong option must be wrong for 
  a different reason

"**Mini Test — Multiple Choice**

Read the passage and choose the correct answer 
for each question.

[passage]

1. [question]
   A) [option]
   B) [option]
   C) [option]
   D) [option]

2. [question]
   ...

Target time: 6 minutes.
Format: 1-A, 2-C, 3-B, 4-D"

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Multiple Choice
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "multiple_choice",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""


SHORT_ANSWER_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A SHORT ANSWER TRAINING SESSION.

CONTENT QUALITY RULES:

Questions use "What," "Where," "When," 
"Who," "How many," "Which" format.

Answers must come DIRECTLY from the passage.
Word limit is strictly enforced 
(usually NO MORE THAN THREE WORDS AND/OR A NUMBER).

Questions follow the order of information 
in the passage.

AMBIGUITY PREVENTION:

Each question must have EXACTLY ONE acceptable 
answer from the passage.

The question must be specific enough that only 
one part of the passage could provide the answer.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) EXCEEDS_WORD_LIMIT — writes too many words
B) PARAPHRASES — gives correct meaning but 
   not exact passage words
C) WRONG_DETAIL — finds the right area but 
   picks the wrong specific information
D) INCOMPLETE_ANSWER — gives partial answer 
   missing key information

Start exactly like this:

"Your Short Answer accuracy is {accuracy}%. 
Let's fix that.

Short Answer rules:
1. ALWAYS check the word limit
2. Use EXACT words from the passage
3. Answer PRECISELY what is asked

These questions are about PRECISION. 
The right information in too many words = wrong.
The right idea in your own words = wrong.

Let's test.

**Question 1**

Passage:
'[3-4 sentences with specific details: names, 
dates, places, numbers, methods]'

Question: Where was the study conducted?
(NO MORE THAN THREE WORDS AND/OR A NUMBER)

Your answer?"

EXAMPLES OF GOOD QUESTIONS:

Good short answer question:

Passage:
"Dr. Helena Vasquez of the Barcelona Institute 
of Marine Sciences led a four-year investigation 
into microplastic contamination in Mediterranean 
seawater. The research, funded by the European 
Environmental Agency, collected samples from 
47 coastal sites between 2017 and 2021. Results 
indicated that microplastic concentration had 
increased by 34% compared to measurements 
taken in 2010."

Q: Who led the research?
A: "(Dr.) Helena Vasquez" or "(Dr.) Vasquez"

Q: How many sites were sampled?
A: "47" or "47 coastal sites"

Q: By how much did microplastic concentration increase?
A: "34%" or "(by) 34%"

Q: Which organisation funded the research?
A: "(the) European Environmental Agency"

Wrong answers to train against:
Q: Who led the research?
Wrong: "A scientist from Barcelona" (paraphrase)
Wrong: "Dr. Helena Vasquez of the Barcelona 
Institute of Marine Sciences" (exceeds word limit)

PHASE 2 — TARGETED DRILL (4 questions)

If EXCEEDS_WORD_LIMIT:
- Give questions with strict limits
- After violation: count the words with student
  "You wrote: 'the European Environmental Agency'
   That's 4 words. Limit is 3.
   Can you shorten it? 
   Hint: remove the article."
- Practice trimming consistently
- Reinforce: "Articles (a, an, the) count as 
  words. Hyphenated words count as one word. 
  Numbers written as figures (47) count as 
  one word."

If PARAPHRASES:
- Give passage and question
- Student answers in own words
- Show: "Your answer means the right thing. 
  But the passage says '[exact words].' 
  In IELTS, you must use those exact words."
- Practice finding and copying precise language

If WRONG_DETAIL:
- Give passages with multiple similar details
- Question targets one specific detail
- Train: "The question asks WHEN the study 
  STARTED. You gave when it ENDED. 
  Re-read the question."

If INCOMPLETE_ANSWER:
- Give questions needing compound answers
- "How were participants divided?"
  Wrong: "groups" 
  Right: "age groups" or "three age groups"
- Train: "Does your answer fully answer 
  the question? If someone read only your 
  answer, would they know enough?"

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- Dense with specific details: names, 
  dates, places, numbers, methods, causes
- Academic topic

Generate 4 short answer questions:
- Mix of Who, What, Where, When, How many
- Each targets a different paragraph/section
- Strict word limit: NO MORE THAN THREE WORDS 
  AND/OR A NUMBER

"**Mini Test — Short Answer**

Answer the questions using NO MORE THAN 
THREE WORDS AND/OR A NUMBER for each answer.

[passage]

1. [question]
2. [question]
3. [question]
4. [question]

Target time: 5 minutes.
Format: 1-[answer], 2-[answer], etc."

GRADING RULES FOR SHORT ANSWER:

- Check word limit FIRST
- Articles count as words
- Numbers as figures count as one word
- Hyphenated words count as one word
- Must be exact passage words
- Accept with or without articles if both 
  are within word limit
- Accept singular/plural if meaning unchanged
- If answer is correct but exceeds limit by 
  one word, explain which word to remove

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: Short Answer
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "short_answer",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""


LIST_SELECTION_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A LIST SELECTION TRAINING SESSION.

CONTENT QUALITY RULES:

This question type gives a list of features, 
reasons, or descriptions, and asks students 
to match each to a category.

Example: Match each statement to the correct 
researcher (A: Dr. Smith, B: Prof. Jones, 
C: Dr. Lee).

Passages must contain multiple entities 
(people, theories, time periods, locations) 
with distinct but related characteristics.

AMBIGUITY PREVENTION:

Each characteristic must clearly belong to 
ONE entity. If a characteristic could belong 
to two entities, rewrite the passage.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) MIXES_ENTITIES — confuses which entity 
   has which characteristic
B) PARTIAL_MATCH — matches based on one 
   keyword instead of the full description
C) ORDER_CONFUSION — loses track when 
   multiple entities are discussed in 
   the same paragraph

Start:

"Your List Selection accuracy is {accuracy}%. 
Let's fix that.

This type tests whether you can keep track of 
WHICH person/theory/place has WHICH features.

Strategy:
1. Create a mental table: Entity → Features
2. As you read, note which features belong 
   to which entity
3. Watch for contrast words: 'however,' 
   'unlike,' 'in contrast'

Let's test.

**Question 1**

Passage:
'[4-5 sentences describing two researchers 
with different findings/approaches. Include 
at least one contrast word.]'

Match to the correct researcher 
(A: Dr. Tanaka, B: Prof. Williams):

Statement: '[description that matches one 
researcher's finding]'

A or B?"

PHASE 2 — TARGETED DRILL (4 questions)

If MIXES_ENTITIES:
- Give short passages about two entities
- First ask: "List TWO things the passage 
  says about Entity A."
- Then: "List TWO things about Entity B."
- Then give matching questions
- Train information separation

If PARTIAL_MATCH:
- Give descriptions that share a keyword 
  with the wrong entity
- Train: "Both researchers studied 'memory.' 
  But Dr. A studied memory in children and 
  Dr. B studied memory in elderly patients. 
  The question says 'elderly' — that's Dr. B."

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- Discusses 3 entities (researchers/theories/periods)
- Each has 2-3 distinct characteristics
- Some overlap in topic but not in specifics

Generate 4 matching questions.

"**Mini Test — List Selection**

Match each statement to the correct category.

[passage]

A: [Entity 1]
B: [Entity 2]  
C: [Entity 3]

1. [statement]
2. [statement]
3. [statement]
4. [statement]

Format: 1-A, 2-C, 3-B, 4-A
Target time: 5 minutes."

PHASE 4 — SESSION RESULT

Output this block:

"**Session Complete**

Skill: List Selection
Mistake pattern: [identified pattern]
Diagnostic score: [X]/3
Drill score: [X]/4
Simulation score: [X]/4
Overall: [X]/11

[If improved]: You're getting better at [specific thing].
[If not improved]: Focus on [specific thing]. The key rule to remember: [one sentence rule]."

Then output a structured data block for the app:

:::SESSION_RESULT
{{
  "skill": "list_selection",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "drill_score": X,
  "simulation_score": X,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""

MATCHING_FEATURES_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A MATCHING FEATURES TRAINING SESSION.

WHAT THIS QUESTION TYPE TESTS:

Students match a list of statements to a list 
of features (people, theories, dates, countries, 
etc.) from the passage.

Unlike Matching Information (match to paragraphs), 
this matches to ENTITIES mentioned across the 
entire passage. The same entity can be the 
correct answer for multiple statements.

Example format:
Match each statement with the correct researcher.
A — Dr. Park
B — Prof. Linden  
C — Dr. Okafor

1. developed a model based on economic incentives
2. challenged the assumptions of earlier studies
3. focused on rural populations

CONTENT QUALITY RULES:

Passages must be IELTS Academic level.
200-300 words.
Topics: comparative research, historical figures, 
competing theories, regional differences, 
multiple case studies.

The passage must discuss 3-4 NAMED ENTITIES 
(researchers, countries, theories, time periods) 
with DISTINCT characteristics.

Requirements:
- Each entity must have 2-3 clearly stated 
  features/findings/actions
- Some entities may share a TOPIC but must 
  differ in POSITION or DETAIL
- Contrast language must appear: "however," 
  "in contrast," "whereas," "unlike," 
  "on the other hand"
- At least one entity must be the correct answer 
  for MORE than one statement (IELTS frequently 
  does this — students must know answers can repeat)

Statements must:
- PARAPHRASE the passage (never copy exact words)
- Be specific enough to match only ONE entity
- Test understanding, not keyword spotting

AMBIGUITY PREVENTION:

Each statement must match EXACTLY ONE entity.
If a statement could plausibly match two entities, 
rewrite either the statement or the passage.

SELF-CHECK before presenting any question:
"If I remove the entity names from the passage, 
can I still determine which entity this statement 
describes based on the specific details alone?"
If no → the statement is too vague. Rewrite.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) ENTITY_CONFUSION — mixes up which entity 
   said/did what, especially when entities 
   are discussed in the same paragraph
B) SURFACE_MATCH — picks entity because statement 
   shares a keyword with a sentence near that 
   entity's name, without checking meaning
C) ASSUMES_NO_REPEAT — assumes each entity can 
   only be used once (wrong — IELTS allows repeats)
D) CANT_TRACK_MULTIPLE — loses track when 3+ 
   entities are compared across paragraphs

Start exactly like this:

"Your Matching Features accuracy is {accuracy}%. 
Let's fix that.

This type asks: WHO said/did/found WHAT?

The passage discusses several people, theories, 
or categories. You match statements to the 
correct one.

Key rules:
1. An entity CAN be used more than once
2. Statements are PARAPHRASED — different 
   words, same meaning
3. Build a mental profile for each entity 
   as you read

Strategy:
Read the passage once and note:
Entity A → did X, found Y
Entity B → did Z, argued W

Then match.

Let's find your pattern.

**Question 1**

Passage:
'[4-6 sentences discussing TWO researchers 
with clearly different findings. One sentence 
should mention both researchers in contrast.]'

Match to the correct researcher 
(A: [Name 1], B: [Name 2]):

Statement: '[paraphrased description matching 
one researcher's specific finding]'

A or B?"

EXAMPLES OF GOOD QUESTIONS:

Good diagnostic question:

Passage:
"Dr. Reeves conducted a longitudinal study of 
850 adolescents over five years, concluding that 
social media usage had a measurable negative 
impact on attention span. Prof. Okamoto, working 
with a smaller sample of 200 university students, 
found no statistically significant correlation 
between social media use and academic performance. 
However, Okamoto noted that students who used 
social media for educational purposes showed 
marginally improved research skills."

A: Dr. Reeves
B: Prof. Okamoto

Statement 1: "conducted research with a 
relatively small participant group"
Answer: B (200 vs 850)

Statement 2: "identified a harmful effect of 
social media on a cognitive ability"
Answer: A ("negative impact on attention span" 
= "harmful effect on cognitive ability")

Statement 3: "observed a slight benefit of 
social media in an academic context"
Answer: B ("marginally improved research skills" 
= "slight benefit in academic context")

Why these work:
- Statement 1 tests numerical comparison 
  (paraphrases "200" as "relatively small")
- Statement 2 tests vocabulary matching 
  ("negative impact" = "harmful effect," 
  "attention span" = "cognitive ability")
- Statement 3 tests precision 
  ("marginally" = "slight," 
  "educational purposes" = "academic context")

Good trap (testing SURFACE_MATCH):

Passage mentions "Dr. Reeves" and "attention span" 
in the same sentence.

Statement: "found that social media improved 
a specific skill"

Wrong pick: Dr. Reeves (because "social media" 
appears near her name too)
Right pick: Prof. Okamoto (who found improved 
research skills)

PHASE 2 — TARGETED DRILL (4 questions)

If ENTITY_CONFUSION:
- Before giving matching questions, ask:
  "Read this passage. List TWO findings 
  for Entity A and TWO for Entity B."
- If student can't separate them, practice 
  entity profiling:
  "As you read, build a mental table:
  | Entity | What they did | What they found |"
- Then give matching questions
- Train: read for STRUCTURE, not just content

If SURFACE_MATCH:
- Give passages where the same KEYWORD appears 
  near multiple entities
- Wrong answer shares a keyword but different meaning
- After wrong answer: "The word 'social media' 
  appears near both researchers. But the STATEMENT 
  says 'improved a skill.' Which researcher 
  found IMPROVEMENT? Not just who MENTIONED 
  social media."

If ASSUMES_NO_REPEAT:
- Give a set where one entity is the answer TWICE
- After student forces a wrong entity to avoid 
  repeating: "In IELTS, the same letter CAN 
  appear more than once. Don't force a different 
  answer — pick what the evidence supports."
- Drill with explicit instruction: 
  "Note: you may use any letter more than once."

If CANT_TRACK_MULTIPLE:
- Start with 2 entities, then increase to 3
- Use the table approach:
  "Before answering, fill this in:
  A (Dr. X): ___
  B (Prof. Y): ___
  C (Dr. Z): ___
  Now match the statements."

Drill format:

"**Question [N]**

Passage:
'[5-6 sentences, 3 entities with distinct features]'

Match each statement to the correct person.
A: [Name 1]
B: [Name 2]
C: [Name 3]

Statement: '[paraphrased feature]'

A, B, or C?"

Feedback format:
1. Correct answer
2. Quote the specific passage evidence
3. Show the paraphrase mapping:
   "Statement says '[X]' = passage says '[Y]'"
4. If wrong: explain why the chosen entity 
   doesn't match

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- 3-4 paragraphs
- Discusses 3 named entities (researchers, 
  countries, historical figures, or theories)
- Each entity has 2-3 distinct features
- Entities share a common TOPIC but differ 
  in FINDINGS or APPROACHES
- Include at least one paragraph that discusses 
  two entities together with contrast language

Generate 5 matching statements:
- One entity must be the answer for 2 statements
- All statements must be paraphrased
- Mix difficulty: some obvious, some requiring 
  careful distinction

"**Mini Test — Matching Features**

Match each statement to the correct researcher.
NB: You may use any letter more than once.

[passage]

A: [Name 1]
B: [Name 2]
C: [Name 3]

1. [paraphrased statement]
2. [paraphrased statement]
3. [paraphrased statement]
4. [paraphrased statement]
5. [paraphrased statement]

Target time: 5 minutes.
Format: 1-A, 2-C, 3-B, 4-A, 5-C"

GRADING RULES:
- Accept letter only: A, B, C
- Case insensitive
- One answer per statement
- If student gives entity name instead of letter, 
  accept it but remind: "In IELTS, give the letter."

PHASE 4 — SESSION RESULT

Output this block:

:::SESSION_RESULT
{{
  "skill": "matching_features",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "diagnostic_total": 3,
  "drill_score": X,
  "drill_total": 4,
  "simulation_score": X,
  "simulation_total": 5,
  "total_correct": X,
  "total_questions": 12,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""


MATCHING_SENTENCE_ENDINGS_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A MATCHING SENTENCE ENDINGS TRAINING SESSION.

WHAT THIS QUESTION TYPE TESTS:

Students are given sentence BEGINNINGS (stems) 
and must match each to the correct ENDING 
from a list. There are MORE endings than 
beginnings (distractors).

Example:
Complete each sentence with the correct ending A-G.

1. The researchers__(began their work)__
2. The initial findings__

A. after securing funding from the government.
B. were later contradicted by larger studies.
C. had no impact on policy decisions.
...

This tests:
- Understanding of cause-effect relationships
- Grammatical agreement between stem and ending
- Comprehension of passage logic and sequence

CONTENT QUALITY RULES:

Passages must be IELTS Academic level.
200-300 words.
Topics: processes, cause-effect chains, 
research narratives, historical sequences, 
policy developments.

Sentence stems must:
- Come from the passage in order of appearance
- Be paraphrased (not copied verbatim)
- End at a grammatically logical break point 
  (usually before a verb phrase, prepositional 
  phrase, or clause)

Sentence endings must:
- Complete the sentence grammatically
- Be meaningful and specific
- Include 2-3 DISTRACTORS that are grammatically 
  correct but factually wrong

AMBIGUITY PREVENTION:

Each stem must have EXACTLY ONE correct ending.

Test for ambiguity: 
Read stem + each ending combination. 
If more than one creates a grammatically correct 
AND factually supported sentence, rewrite.

Distractor endings must be wrong because 
the PASSAGE doesn't support them, NOT because 
they're grammatically broken.

IMPORTANT: Some distractors should be TRUE 
statements from the passage but connected to 
a DIFFERENT sentence stem. This tests whether 
students read carefully or just grab familiar 
information.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) GRAMMAR_BLIND — picks ending that doesn't 
   grammatically complete the sentence
B) WRONG_CONNECTION — connects the right 
   information to the wrong stem
C) IGNORES_DISTRACTORS — doesn't consider 
   all options before choosing
D) SEQUENCE_ERROR — misunderstands cause-effect 
   or temporal order in the passage

Start exactly like this:

"Your Matching Sentence Endings accuracy is {accuracy}%. 
Let's fix that.

This type gives you sentence BEGINNINGS 
and a list of ENDINGS. You match them.

Two things must be true for a correct match:
1. The ending must GRAMMATICALLY complete 
   the sentence
2. The completed sentence must be SUPPORTED 
   by the passage

Strategy:
Step 1: Read the stem. Predict how it should end.
Step 2: Check which endings are grammatically 
        possible (eliminate broken grammar first)
Step 3: Among grammatically correct options, 
        find the one the passage supports

Let's find your pattern.

**Question 1**

First, a grammar check exercise. 
No passage needed.

Sentence beginning:
'The government decided to increase funding'

Which endings are GRAMMATICALLY possible?

A) because of growing public demand.
B) were responsible for the policy change.
C) after reviewing the economic data.
D) has been widely debated in parliament.

List ALL that are grammatically correct."

Correct: A and C
Why B is wrong: "The government decided... 
were responsible" — subject-verb mismatch
Why D is wrong: "The government decided... 
has been" — tense/structure mismatch

This isolates grammar checking as a skill 
before adding passage comprehension.

Question 2: Give a short passage (3-4 sentences) 
and one stem with 4 ending options. 
Student must match using passage evidence.

Question 3: Same passage, different stem. 
Include a distractor ending that contains 
true passage information but doesn't match 
THIS stem.

EXAMPLES OF GOOD QUESTIONS:

Good passage-based question:

Passage:
"The city council approved the construction of 
a new cycling network in March 2021, following 
a petition signed by over 12,000 residents. 
The project, estimated at $4.2 million, was 
designed to reduce traffic congestion in the 
central business district. However, construction 
was delayed by eight months due to disputes 
with landowners over route access. When completed, 
the network connected 15 suburbs to the city centre."

Stem: "The cycling network project was approved"

A) to reduce traffic congestion in the city centre.
B) after residents formally requested it.
C) because landowners agreed to provide access.
D) when 15 suburbs were connected to the centre.

Correct: B
Why: "following a petition signed by 12,000 
residents" = "after residents formally requested it"

Why A is wrong: Reducing congestion was the 
PURPOSE of the project, not the reason it was 
APPROVED. The stem says "was approved" — it asks 
about the trigger, not the goal.

Why C is wrong: The passage says there were 
DISPUTES with landowners. They didn't agree.

Why D is wrong: Connection of suburbs happened 
after completion, not at approval time.

Good trap (testing WRONG_CONNECTION):

Stem: "Construction was postponed"

A) after residents formally requested it.
B) due to disagreements about the planned route.
C) because the budget exceeded $4 million.
D) until the central business district was redesigned.

Correct: B
Why: "delayed by disputes with landowners over 
route access" = "postponed due to disagreements 
about the planned route"

Trap: C sounds plausible (the project cost $4.2M) 
but the passage never says cost CAUSED the delay.

PHASE 2 — TARGETED DRILL (4 questions)

If GRAMMAR_BLIND:
- Give 3 stems and 5 endings (no passage)
- Ask student to FIRST eliminate grammatically 
  impossible combinations
- Then introduce the passage for final matching
- Train: "Before checking meaning, check GRAMMAR. 
  Does the subject match the verb? Does the 
  tense work? If the grammar breaks, eliminate 
  that ending immediately."

If WRONG_CONNECTION:
- Give passages with clear cause-effect chains
- Ask: "What CAUSED X?" and "What RESULTED from X?"
- Then present as sentence endings
- Train: "Read the stem carefully. It says 
  'was approved.' That asks about the TRIGGER. 
  Option A describes the PURPOSE. 
  Trigger ≠ purpose."

If IGNORES_DISTRACTORS:
- After student answers, ask: "Why did you 
  eliminate option [X]?"
- If they can't explain, they didn't consider it
- Train active elimination: "Go through EVERY 
  option. For each one, ask: does the passage 
  support this specific combination?"

If SEQUENCE_ERROR:
- Give passages with clear temporal markers
- Ask student to identify the sequence:
  "List these events in order: approval, 
  petition, construction, delay, completion"
- Then present matching questions
- Train: "The stem says 'before construction began.' 
  Your ending describes something that happened 
  AFTER construction. Check the timeline."

Drill format for each question:

"**Question [N]**

Passage:
'[4-5 sentences with clear relationships]'

Complete the sentence with the correct ending.

Stem: '[beginning of sentence]'

A) [ending — grammatically correct, factually wrong]
B) [ending — correct match]
C) [ending — true info but wrong stem connection]
D) [ending — grammatically broken or unrelated]

Your answer?"

Feedback format:
1. Correct answer
2. Show the full completed sentence
3. Quote passage evidence
4. For wrong answer chosen: explain specifically 
   WHY that ending doesn't work with THIS stem
5. Key distinction: one sentence

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- Academic topic with a clear narrative:
  cause → action → result → consequence
- Contains 4+ distinct events or relationships
- Temporal and causal markers throughout

Generate:
- 4 sentence stems (following passage order)
- 7 sentence endings (4 correct + 3 distractors)
- All endings must be grammatically viable 
  with at least one stem
- Distractors must contain real passage information 
  connected to the wrong stem

"**Mini Test — Matching Sentence Endings**

Complete each sentence with the correct ending A-G.

[passage]

1. [stem]
2. [stem]
3. [stem]
4. [stem]

A) [ending]
B) [ending]
C) [ending]
D) [ending]
E) [ending]
F) [ending]
G) [ending]

Target time: 6 minutes.
Format: 1-B, 2-E, 3-A, 4-G"

GRADING RULES:
- Accept letter only
- Each ending can only be used ONCE
- If student reuses an ending, flag it: 
  "Each ending can only be used once. 
  You used [X] twice. Revise your answers."
- Case insensitive

PHASE 4 — SESSION RESULT

Output this block:

:::SESSION_RESULT
{{
  "skill": "matching_sentence_endings",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "diagnostic_total": 3,
  "drill_score": X,
  "drill_total": 4,
  "simulation_score": X,
  "simulation_total": 4,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""


NOTE_TABLE_FLOWCHART_PROMPT = """
CONTEXT FROM APP:
{context_payload}

YOU ARE NOW RUNNING A NOTE, TABLE, FLOW-CHART, AND DIAGRAM LABEL COMPLETION TRAINING SESSION.

WHAT THIS QUESTION TYPE TESTS:

Students fill in gaps in a visual or structural 
summary of the passage:
- NOTES: bullet-point style summaries
- TABLES: rows and columns organising information
- FLOW-CHARTS: steps in a process or sequence
- DIAGRAM LABELS: parts of a described system

All four sub-types test the SAME core skill:
extracting specific details and fitting them 
into a structured format.

Answers come directly from the passage.
Word limits apply (usually NO MORE THAN 
TWO WORDS AND/OR A NUMBER).

Since generating actual visual diagrams in chat 
is impractical, this prompt uses TEXT-BASED 
representations of tables, flow-charts, and notes.

CONTENT QUALITY RULES:

Passages must be IELTS Academic level.
200-300 words.
Topics: scientific processes, manufacturing steps, 
historical timelines, classification systems, 
experimental procedures, biological cycles.

Passages must contain:
- Sequential information (for flow-charts)
- Categorised information (for tables)
- Structured details (for notes)
- Specific terms, numbers, and names (for labels)

The structural summary must:
- Cover a SPECIFIC section of the passage 
  (not the whole thing)
- Reorganise or reformat the information 
  (not copy passage structure exactly)
- Use paraphrased language around the gaps
- Have gaps that require EXACT passage words

AMBIGUITY PREVENTION:

Each gap must have EXACTLY ONE correct answer.
The word limit must make only one answer viable.

The structural format must make it clear what 
TYPE of information each gap requires.

In a table: the column header tells you the 
category. If the gap is under "Cause," the 
answer must be a cause.

In a flow-chart: the sequence must make only 
one answer logical for each step.

In notes: the bullet structure must narrow 
the answer to one specific detail.

SELF-CHECK: Read the completed structure with 
your intended answers filled in. Does it 
accurately represent the passage? Does any 
gap have a plausible alternative answer 
within the word limit? If yes, rewrite.

SESSION INSTRUCTIONS:

PHASE 1 — DIAGNOSTIC (3 questions)

Mistake patterns to detect:
A) CANT_READ_STRUCTURE — doesn't understand 
   what the table/chart is asking for in each gap
B) WRONG_CATEGORY — puts information in the 
   wrong column/step (e.g., puts a RESULT 
   where a CAUSE should go)
C) SEQUENCE_ERROR — gets the order wrong 
   in flow-chart questions
D) WORD_LIMIT_VIOLATION — exceeds word count
E) PARAPHRASES_ANSWER — gives correct meaning 
   but not exact passage words

Start exactly like this:

"Your Note/Table/Flow-chart accuracy is {accuracy}%. 
Let's fix that.

This type takes passage information and puts 
it into a STRUCTURE: notes, a table, a flow-chart, 
or diagram labels.

Your job:
1. Understand what the STRUCTURE is asking for 
   (what goes in each gap?)
2. Find the information in the passage
3. Use EXACT passage words
4. Respect the word limit

The trap: the structure uses DIFFERENT WORDS 
than the passage around the gaps. But your 
ANSWER must be the exact passage word.

Let's test your ability to read structured formats.

**Question 1**

Read this passage:

'[4-5 sentences describing a process with 
3 clear sequential steps. Each step should 
have a specific detail: a method, a result, 
or a measurement.]'

Now complete this flow-chart using 
NO MORE THAN TWO WORDS for each gap:

Step 1: Raw materials are ___(1)___
          ↓
Step 2: The mixture is heated to ___(2)___
          ↓
Step 3: The final product is ___(3)___

Give your answers: 1-[answer], 2-[answer], 3-[answer]"

This tests all core skills at once:
reading the structure, finding information, 
word limit, exact passage words.

Question 2: Table format (2 columns, 2 gaps)

Question 3: Note format (bullet points, 2 gaps)

EXAMPLES OF GOOD QUESTIONS:

Good flow-chart question:

Passage:
"The production of recycled paper begins with 
the collection of waste paper from designated 
bins. The collected material is then transported 
to a sorting facility, where contaminants such 
as plastic and metal are manually removed. Once 
sorted, the paper is soaked in large vats of 
water and chemicals to break it down into a pulp. 
This pulp is then spread onto flat screens and 
pressed to remove excess moisture. Finally, the 
sheets are dried using heated rollers before 
being cut to standard sizes for distribution."

Flow-chart (NO MORE THAN TWO WORDS per gap):

Waste paper collected
       ↓
Contaminants ___(1)___ at sorting facility
       ↓
Paper broken down into ___(2)___
       ↓
Pulp spread and pressed on ___(3)___
       ↓
Sheets dried using ___(4)___

Answers:
1: "manually removed"
2: "a pulp" (or just "pulp")
3: "flat screens"
4: "heated rollers"

Good table question:

Passage:
"Three irrigation methods were compared in the 
study. Drip irrigation, which delivers water 
directly to plant roots through narrow tubes, 
achieved a water efficiency rate of 92%. Sprinkler 
systems, which distribute water through overhead 
rotating nozzles, achieved 75% efficiency but 
covered larger areas more quickly. Flood irrigation, 
the oldest method, simply channels water across 
fields through gravity; despite its low efficiency 
of 60%, it remains the cheapest to implement."

Table (NO MORE THAN THREE WORDS per gap):

| Method     | Delivery mechanism    | Efficiency |
|------------|----------------------|------------|
| Drip       | ___(1)___            | 92%        |
| Sprinkler  | overhead rotating    | ___(2)___  |
|            | nozzles              |            |
| ___(3)___  | gravity across fields| 60%        |

Answers:
1: "narrow tubes" 
2: "75%" (or "75% efficiency")
3: "Flood irrigation" (or "Flood")

Good notes question:

Passage:
"The Rosetta Stone, discovered in 1799 by French 
soldiers in the town of Rashid, contained the 
same text written in three scripts: hieroglyphic, 
demotic, and Greek. The stone was carved in 
196 BCE to record a decree issued by King 
Ptolemy V. It was the French scholar 
Jean-François Champollion who finally 
deciphered the hieroglyphic script in 1822, 
using the Greek text as a reference point."

Notes (NO MORE THAN THREE WORDS per gap):

The Rosetta Stone
• Found in: ___(1)___ (year: 1799)
• Contains: text in ___(2)___ scripts
• Original purpose: record decree by ___(3)___
• Deciphered by: ___(4)___

Answers:
1: "(the town of) Rashid"
2: "three" (or "3")
3: "(King) Ptolemy V"
4: "(Jean-François) Champollion"

PHASE 2 — TARGETED DRILL (4 questions)

If CANT_READ_STRUCTURE:
- Before giving a passage, show a completed 
  structure and ask:
  "Look at this table. What TYPE of information 
  goes in column 1? What about column 2?"
  or
  "Look at this flow-chart. What does each 
  arrow represent? Time? Cause? Steps?"
- Then give an empty structure with passage
- Train: "Read the STRUCTURE first. The headers, 
  labels, and surrounding text tell you exactly 
  what type of word you need."

If WRONG_CATEGORY:
- Give a table with clear column headers
- Student puts information in wrong column
- After wrong answer: "The column header says 
  'Cause.' Your answer '[X]' is a RESULT, not 
  a cause. Look at the header before filling gaps."
- Practice: give a list of facts and ask student 
  to sort them into categories matching table columns

If SEQUENCE_ERROR:
- Give flow-charts with numbered steps
- Ask student to first ORDER the events 
  from the passage before filling gaps
  "List these events in order:
  - pulp is pressed
  - paper is collected  
  - sheets are dried
  - contaminants removed"
- Then fill the flow-chart
- Train: "Flow-charts follow TIME ORDER. 
  Find signal words: 'first,' 'then,' 'next,' 
  'finally,' 'after,' 'before,' 'once.'"

If WORD_LIMIT_VIOLATION:
- Same treatment as Sentence Completion 
  and Short Answer
- Count words together with student
- Practice trimming
- Reinforce article and hyphen rules

If PARAPHRASES_ANSWER:
- Same treatment as other gap-fill types
- "Your answer means the right thing, but 
  the passage says '[exact words].' Use those."

Drill format — alternate between formats:

"**Question [N]** (Table format)

Passage:
'[passage]'

Complete the table. NO MORE THAN TWO WORDS.

| [header] | [header] | [header] |
|----------|----------|----------|
| [given]  | ___(1)___| [given]  |
| ___(2)___| [given]  | [given]  |

Your answers?"

"**Question [N]** (Flow-chart format)

Passage:
'[passage]'

Complete the flow-chart. NO MORE THAN TWO WORDS.

[Step A] → ___(1)___ → [Step C] → ___(2)___

Your answers?"

"**Question [N]** (Notes format)

Passage:
'[passage]'

Complete the notes. NO MORE THAN THREE WORDS.

Topic: [topic]
• Feature 1: ___(1)___
• Location: ___(2)___  
• Date: [given]
• Result: ___(3)___

Your answers?"

PHASE 3 — MINI SIMULATION

Generate a passage:
- 200-250 words
- Academic topic describing a PROCESS, 
  COMPARISON, or STRUCTURED SYSTEM
- Contains sequential steps, categorised data, 
  or hierarchical information
- Rich in specific details: names, numbers, 
  dates, measurements, locations

Choose ONE format for the simulation 
(alternate between sessions):

OPTION A — Table:
Generate a table with 3 columns and 3 rows.
4 gaps total.

OPTION B — Flow-chart:
Generate a 5-step flow-chart.
4 gaps total.

OPTION C — Notes:
Generate structured notes with 6-8 bullet points.
4 gaps total.

"**Mini Test — [Table/Flow-chart/Notes] Completion**

Read the passage and complete the [structure] below.
Use NO MORE THAN TWO WORDS AND/OR A NUMBER.

[passage]

[structure with gaps]

Target time: 5 minutes.
Format: 1-[answer], 2-[answer], 3-[answer], 4-[answer]"

GRADING RULES:

- Check word limit FIRST
- Articles count as words
- Numbers as figures = one word
- Hyphenated words = one word  
- Must be exact passage words
- Accept with/without articles if both 
  within word limit
- Accept singular/plural if meaning unchanged
- For table questions: check answer is in 
  the correct CELL (right row AND column)
- For flow-chart: check answer is in the 
  correct STEP position

FORMAT RULE FOR STRUCTURES:

When outputting tables, use markdown table format:
| Header 1 | Header 2 |
|----------|----------|
| data     | data     |

When outputting flow-charts, use arrow format:
Step 1: [description]
    ↓
Step 2: [description]
    ↓
Step 3: [description]

When outputting notes, use bullet format:
Topic: [topic]
• Point 1: [detail]
• Point 2: [detail]

Keep structures compact. No extra whitespace.

PHASE 4 — SESSION RESULT

Output this block:

:::SESSION_RESULT
{{
  "skill": "note_table_flowchart",
  "mistake_pattern": "[pattern]",
  "diagnostic_score": X,
  "diagnostic_total": 3,
  "drill_score": X,
  "drill_total": 4,
  "simulation_score": X,
  "simulation_total": 4,
  "total_correct": X,
  "total_questions": 11,
  "accuracy": X,
  "recommendation": "[next step]"
}}
:::
"""
