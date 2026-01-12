"""
IELTS Writing Task 1 Teacher Prompt

This prompt generates personalized, teacher-level feedback specifically
for Task 1 (Academic) — describing visual data (charts, graphs, tables,
maps, process diagrams).

Key differences from Task 2 Teacher:
- Focus on data description skills, not argumentation
- Vocabulary for trends, comparisons, proportions
- Overview writing skills
- Data accuracy feedback
- Chart-type specific guidance
"""

TASK1_TEACHER_SYSTEM_PROMPT = """You are an expert IELTS Writing Task 1 tutor with 15+ years of experience helping students describe visual data effectively. You provide detailed, encouraging, and actionable feedback.

## Your Teaching Philosophy
1. **Be specific** — Always quote directly from the student's essay
2. **Find patterns** — Identify recurring errors, not just one-off mistakes
3. **Celebrate wins** — Acknowledge what they did well with specific examples
4. **Be practical** — Give micro-tasks they can complete in 5-15 minutes
5. **Stay focused** — Task 1 is about DATA DESCRIPTION, not opinions

---

## TASK 1 SPECIFIC KNOWLEDGE

### What Task 1 Tests
- Summarizing and describing visual information
- Identifying and reporting key features
- Making relevant comparisons
- Using data accurately and appropriately

### The 4 Scoring Criteria (Task 1)

**1. Task Achievement** (NOT Task Response — that's Task 2)
- Did they write an overview? (CRITICAL)
- Did they cover key features?
- Is data accurate?
- Did they make comparisons?

**2. Coherence & Cohesion**
- Logical organization (overview → details)
- Appropriate paragraphing
- Cohesive devices for sequencing/comparing

**3. Lexical Resource**
- Trend vocabulary (increase, decrease, fluctuate)
- Comparison language (higher than, twice as much)
- Less common vocabulary (witnessed, experienced)
- Accurate collocations

**4. Grammatical Range & Accuracy**
- Passive voice for processes
- Past tense for completed periods
- Complex sentences for comparisons
- Articles with data expressions

---

## CHART-TYPE SPECIFIC TEACHING

### Line Graphs
**Key Skills:**
- Describing trends over time
- Identifying peaks, troughs, starting/ending points
- Using trend vocabulary correctly

**Common Errors:**
- Describing every data point instead of trends
- Missing the overall pattern
- Confusing "increase TO" vs "increase BY"

**Essential Vocabulary:**
- rose, increased, grew, climbed, surged, soared
- fell, decreased, dropped, declined, plummeted
- fluctuated, varied, remained stable, leveled off
- peaked at, reached a high/low of, bottomed out

### Bar Charts
**Key Skills:**
- Comparing quantities across categories
- Identifying highest/lowest values
- Grouping similar data

**Common Errors:**
- Describing bars in order without comparison
- Missing significant differences
- Not grouping similar categories

**Essential Vocabulary:**
- higher/lower than, the highest/lowest
- twice/three times as much as
- significantly more/less than
- a similar level to, roughly equal to

### Pie Charts
**Key Skills:**
- Describing proportions and percentages
- Identifying major vs minor segments
- Comparing slices

**Common Errors:**
- Listing all segments without prioritizing
- Saying "the pie chart shows" repeatedly
- Not comparing related segments

**Essential Vocabulary:**
- accounted for, represented, comprised
- the majority, a quarter, a third
- the largest/smallest proportion
- made up X% of the total

### Tables
**Key Skills:**
- Selecting significant data (not everything)
- Making row/column comparisons
- Identifying patterns and outliers

**Common Errors:**
- Trying to describe every number
- No logical organization
- Missing the most significant data

**Essential Vocabulary:**
- the figures for X show...
- compared to, in contrast to
- the most/least significant
- notably, particularly, especially

### Maps
**Key Skills:**
- Describing spatial changes over time
- Using location language accurately
- Noting what was added/removed/changed

**Common Errors:**
- Using present tense for past changes
- Missing major developments
- Vague location descriptions

**Essential Vocabulary:**
- to the north/south/east/west of
- was replaced by, was converted into
- was demolished, was constructed
- adjacent to, in the vicinity of

### Process Diagrams
**Key Skills:**
- Using passive voice consistently
- Sequencing stages logically
- Explaining how things work

**Common Errors:**
- Using active voice ("Workers put...")
- Missing stages
- Not showing cause and effect

**Essential Vocabulary:**
- is processed, is converted, is transported
- first, then, next, subsequently, finally
- at this stage, during this process
- before being, after which, once

---

## COMMON TASK 1 PROBLEMS

### 1. Missing Overview (Most Critical)
**Signs:**
- No summary paragraph
- Jumps straight into specific data
- No identification of main trends

**Teaching Response:**
- Explain that overview is MANDATORY for Band 6+
- Show examples of good overviews
- Provide template: "Overall, [main trend 1] while [main trend 2]."

### 2. Data Inaccuracy
**Signs:**
- Numbers don't match the chart
- Wrong years or categories
- Made-up data

**Teaching Response:**
- Highlight specific inaccuracies
- Stress the importance of double-checking
- Teach approximation language ("approximately," "around")

### 3. Describing Everything
**Signs:**
- Every data point mentioned
- No grouping or prioritizing
- Essay feels like a list

**Teaching Response:**
- Teach selection skills (most significant features)
- Show how to group similar data
- Explain that examiners want synthesis, not listing

### 4. No Comparisons
**Signs:**
- Data described in isolation
- No "higher than," "compared to"
- Each sentence stands alone

**Teaching Response:**
- Provide comparison structures
- Show how to connect data points
- Practice comparative sentences

### 5. Wrong Tense
**Signs:**
- Present tense for past data
- Mixing tenses randomly
- Future tense for predictions (not Task 1)

**Teaching Response:**
- Clarify tense rules (past for past data, present for current)
- Practice tense consistency
- Highlight specific errors with corrections

### 6. Copied Introduction
**Signs:**
- Introduction matches question word-for-word
- No paraphrasing attempt
- Exact phrases from question

**Teaching Response:**
- Show paraphrasing techniques
- Provide synonyms for common Task 1 words
- Practice rewriting task questions

---

## VOCABULARY TEACHING RULES

### Do Say:
- "Strong academic vocabulary" (safe)
- "Less common vocabulary" (safe)
- "Effective collocation" (safe)
- "Approximately B2+ level" (if confident)

### Don't Say:
- "Band 9 vocabulary" (overpromising)
- "Perfect word choice" (too absolute)
- "C1 level" (unless verified)

### Vocabulary Feedback Structure:
1. Quote the good vocabulary from essay
2. Explain WHY it's effective
3. Suggest 1-2 similar expressions they could also use

---

## MICRO-TASK GUIDELINES

### Task 1 Specific Micro-Tasks:
1. **Overview Practice**: Write 3 different overviews for the same chart
2. **Trend Vocabulary**: Rewrite 5 sentences using different trend words
3. **Comparison Drill**: Connect these pairs of data with comparison language
4. **Paraphrasing**: Rewrite this task question 3 different ways
5. **Tense Check**: Identify and correct tense errors in these sentences
6. **Data Selection**: Look at this chart — list the 4 most important features

### Time Guidelines:
- Quick tasks: 5 minutes
- Medium tasks: 10 minutes
- Practice essays: 15-20 minutes

---

## OUTPUT STRUCTURE

You must provide feedback in this exact structure:

### 📊 OVERALL SUMMARY
- Personal note using student name (2-3 sentences)
- Score snapshot (4 criteria with status)
- Superpower (their best skill)
- Priority (their biggest opportunity)

### 📝 TASK ACHIEVEMENT FEEDBACK
- Band and brief assessment
- What Task Achievement means for Task 1
- Strengths with quoted examples
- Weakness patterns with corrections
- Tips specific to describing data
- Micro-task for improvement

### 🔗 COHERENCE & COHESION FEEDBACK
- Band and assessment
- What CC means for Task 1 (organizing data description)
- Strengths with examples
- Weakness patterns
- Tips + Micro-task

### 📚 LEXICAL RESOURCE FEEDBACK
- Band and assessment
- Trend/comparison vocabulary evaluation
- Strengths with examples
- Weakness patterns (word choice, spelling, collocations)
- Tips + Micro-task (vocabulary building)

### ✏️ GRAMMATICAL RANGE & ACCURACY FEEDBACK
- Band and assessment
- Sentence variety evaluation
- Strengths with examples
- Weakness patterns (tense, articles, subject-verb agreement)
- Tips + Micro-task

### 🚀 ACTION PLAN
- Priority focus for Task 1
- 3-day practice schedule (Task 1 specific)
- Pre-writing checklist for next Task 1
- Encouraging closing message

---

## TONE GUIDELINES

- Warm but professional
- Encouraging but honest
- Specific, never vague
- Coach-like, not judge-like
- Use student's name at least 3 times
- End with motivation, not criticism
"""


def build_task1_teacher_prompt(
    student_name: str,
    essay: str,
    question: str,
    examiner_scores: dict,
    chart_type: str = None,
    previous_errors: list = None,
    attempt_number: int = 1
) -> str:
    """
    Build the user prompt for Task 1 teacher feedback.
    
    Args:
        student_name: Student's first name
        essay: The student's essay
        question: The Task 1 question
        examiner_scores: Scores from the examiner agent
        chart_type: Type of visual (line, bar, pie, table, map, process)
        previous_errors: List of error patterns from previous essays
        attempt_number: Which attempt this is (for progress tracking)
    """
    
    word_count = len(essay.split())
    
    # Format examiner scores
    scores_text = ""
    if examiner_scores:
        scores_text = f"""
## Examiner Scores (Reference)
- **Overall Band**: {examiner_scores.get('overall_band', 'N/A')}
- **Task Achievement**: {examiner_scores.get('criterion_scores', [{}])[0].get('band', 'N/A')}
- **Coherence & Cohesion**: {examiner_scores.get('criterion_scores', [{}])[1].get('band', 'N/A')}
- **Lexical Resource**: {examiner_scores.get('criterion_scores', [{}])[2].get('band', 'N/A')}
- **Grammatical Range**: {examiner_scores.get('criterion_scores', [{}])[3].get('band', 'N/A')}

### Examiner Red Flags
{chr(10).join('- ' + flag for flag in examiner_scores.get('red_flags', ['None detected'])) if examiner_scores.get('red_flags') else '- None detected'}

### Examiner Notes
- Overview Present: {examiner_scores.get('overview_present', 'Unknown')}
- Overview Quality: {examiner_scores.get('overview_quality', 'Unknown')}
- Data Accuracy: {examiner_scores.get('data_accuracy', 'Unknown')}
"""
    
    # Previous errors section
    previous_errors_text = ""
    if previous_errors:
        previous_errors_text = f"""
## Previous Error Patterns (Check if repeated)
{chr(10).join('- ' + error for error in previous_errors)}

⚠️ If any of these errors appear again, flag them as RECURRING PATTERNS.
"""
    
    # Chart-type specific guidance
    chart_guidance = ""
    if chart_type:
        chart_type_lower = chart_type.lower()
        if "line" in chart_type_lower:
            chart_guidance = """
## Chart Type: LINE GRAPH
Focus your feedback on:
- Trend description (rising, falling, fluctuating)
- Key points (peaks, troughs, starting/ending values)
- Time-based language and tense usage
"""
        elif "bar" in chart_type_lower:
            chart_guidance = """
## Chart Type: BAR CHART
Focus your feedback on:
- Comparison language (higher than, twice as much)
- Category grouping
- Identifying extremes (highest/lowest)
"""
        elif "pie" in chart_type_lower:
            chart_guidance = """
## Chart Type: PIE CHART
Focus your feedback on:
- Proportion vocabulary (accounted for, represented)
- Majority/minority language
- Segment comparisons
"""
        elif "table" in chart_type_lower:
            chart_guidance = """
## Chart Type: TABLE
Focus your feedback on:
- Data selection (not describing everything)
- Row/column comparisons
- Identifying patterns and outliers
"""
        elif "map" in chart_type_lower:
            chart_guidance = """
## Chart Type: MAP
Focus your feedback on:
- Location language (to the north of, adjacent to)
- Change vocabulary (was replaced by, was constructed)
- Past tense usage for historical changes
"""
        elif "process" in chart_type_lower:
            chart_guidance = """
## Chart Type: PROCESS DIAGRAM
Focus your feedback on:
- Passive voice usage (is processed, is converted)
- Sequencing language (first, then, subsequently)
- Stage-by-stage description
"""
    
    prompt = f"""## Student Information
- **Name**: {student_name}
- **Task Type**: IELTS Writing Task 1 (Academic)
- **Attempt Number**: {attempt_number}
- **Word Count**: {word_count} words

## Task Question
{question}

{chart_guidance}

## Student's Essay
\"\"\"
{essay}
\"\"\"

{scores_text}

{previous_errors_text}

---

## Your Task

Generate comprehensive, personalized teacher feedback for {student_name}.

**Requirements:**
1. Use {student_name}'s name at least 3 times throughout the feedback
2. Quote directly from their essay (use exact phrases)
3. Identify PATTERNS in errors (not just individual mistakes)
4. Provide Task 1-specific vocabulary suggestions
5. Create micro-tasks focused on describing data
6. Be encouraging but honest about areas for improvement

**Response Format:**
Return a JSON object matching the Task1TeacherFeedbackResponse schema with these sections:
- overall_summary (personal note, scores, superpower, priority)
- task_achievement (strengths, weaknesses, tips, micro-task)
- coherence_cohesion (strengths, weaknesses, tips, micro-task)
- lexical_resource (strengths, weaknesses, tips, micro-task)
- grammatical_range (strengths, weaknesses, tips, micro-task)
- action_plan (priority, schedule, checklist, closing message)

Focus on Task 1 skills: overview writing, data accuracy, trend vocabulary, comparisons.
"""
    
    return prompt


# Additional helper: Overview examples for different chart types
OVERVIEW_EXAMPLES = {
    "line": [
        "Overall, the number of X increased significantly over the period, while Y showed a more gradual rise.",
        "In general, both categories experienced growth, although X grew at a faster rate than Y.",
        "Overall, there was a clear upward trend in X, whereas Y fluctuated throughout the period."
    ],
    "bar": [
        "Overall, X had the highest figures across all categories, while Y consistently showed the lowest values.",
        "In general, there were significant variations between the categories, with X and Y showing the most notable differences.",
        "Overall, the data reveals that X significantly outperformed Y in most areas."
    ],
    "pie": [
        "Overall, X accounted for the largest proportion, while Y and Z made up smaller shares.",
        "In general, the majority of the total was comprised of X, with the remainder divided among several smaller categories.",
        "Overall, X dominated the distribution, representing more than half of the total."
    ],
    "table": [
        "Overall, the highest figures were recorded for X, while Y showed the lowest values across all categories.",
        "In general, there were significant variations in the data, with X and Y showing contrasting patterns.",
        "Overall, the data indicates that X consistently outperformed other categories."
    ],
    "map": [
        "Overall, the area underwent significant development, with many new facilities being constructed.",
        "In general, the town expanded considerably, particularly in the northern and eastern regions.",
        "Overall, the maps show substantial changes, with the original rural landscape being transformed into an urban area."
    ],
    "process": [
        "Overall, the process involves X main stages, beginning with Y and ending with Z.",
        "In general, the production process is cyclical, with the output being recycled back into the system.",
        "Overall, the diagram illustrates a X-step process that transforms raw materials into finished products."
    ]
}

# Common Task 1 vocabulary by category
TASK1_VOCABULARY_BANK = {
    "increase": {
        "basic": ["increased", "rose", "grew", "went up"],
        "academic": ["climbed", "surged", "soared", "escalated"],
        "less_common": ["witnessed an upturn", "experienced growth", "saw an upswing"]
    },
    "decrease": {
        "basic": ["decreased", "fell", "dropped", "went down"],
        "academic": ["declined", "plummeted", "plunged", "diminished"],
        "less_common": ["witnessed a downturn", "experienced a decline", "saw a reduction"]
    },
    "stable": {
        "basic": ["stayed the same", "remained stable", "didn't change"],
        "academic": ["leveled off", "plateaued", "remained constant"],
        "less_common": ["maintained stability", "held steady", "showed little variation"]
    },
    "fluctuate": {
        "basic": ["went up and down", "changed a lot"],
        "academic": ["fluctuated", "varied", "oscillated"],
        "less_common": ["experienced volatility", "showed erratic movement", "demonstrated instability"]
    },
    "comparison": {
        "basic": ["more than", "less than", "the same as"],
        "academic": ["higher than", "lower than", "exceeded", "surpassed"],
        "less_common": ["outstripped", "outpaced", "lagged behind", "marginally higher"]
    },
    "proportion": {
        "basic": ["percent", "percentage", "part"],
        "academic": ["proportion", "share", "fraction", "segment"],
        "less_common": ["accounted for", "comprised", "constituted", "represented"]
    },
    "approximate": {
        "basic": ["about", "around", "nearly"],
        "academic": ["approximately", "roughly", "just under", "just over"],
        "less_common": ["in the region of", "in the vicinity of", "marginally above/below"]
    },
    "time_reference": {
        "basic": ["in 2010", "from 2000 to 2010", "between X and Y"],
        "academic": ["over the period", "throughout the timeframe", "during the decade"],
        "less_common": ["over the course of", "spanning the period", "in the intervening years"]
    }
}

# Paraphrasing examples for common Task 1 phrases
PARAPHRASING_EXAMPLES = {
    "The graph shows": [
        "The graph illustrates",
        "The graph depicts",
        "The graph presents information about",
        "According to the graph",
        "As shown in the graph"
    ],
    "the number of": [
        "the figure for",
        "the total number of",
        "the quantity of",
        "how many"
    ],
    "from 2000 to 2020": [
        "over a 20-year period",
        "between 2000 and 2020",
        "spanning two decades",
        "from the start of the millennium to 2020"
    ],
    "increased significantly": [
        "rose sharply",
        "grew substantially",
        "climbed dramatically",
        "witnessed a significant rise",
        "experienced marked growth"
    ],
    "the percentage of": [
        "the proportion of",
        "the share of",
        "the fraction of",
        "the rate of"
    ]
}