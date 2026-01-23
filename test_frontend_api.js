/**
 * Diagnostic Script: Test what data the frontend receives from Task 1 API
 */

const SAMPLE_ESSAY = `The bar chart show the average daily water consumption per person in five cities in 2010 and 2020, it is measured by litres per day. Overall, it is clear that water consumption was decreased in most of the cities during the ten years. City D is the city which had the highest water use in both years, and City C use the lowest water in 2010. In 2010, City D had the highest number with about 240 litres per person in a day. City B and City E was after that, which was around 210 and 200 litres. City A consume nearly 180 litres, while City C was the lowest one with about 160 litres per day. In 2020, water usage fall in four cities from their 2010 levels. City D remained the highest but dropped to approximately 220 litres. City B fell to about 190 litres. City A decreased slightly to around 175 litres, while City C declined to roughly 155 litres. Only City E showed an increase, rising from 200 to about 205 litres.`;

const SAMPLE_QUESTION = "The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020, measured in litres per person per day. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";

async function testFrontendAPI() {
    console.log("🔍 Testing Frontend API Call (simulating what WritingTask.tsx does)\n");
    console.log("=" * 60);

    const endpoint = "http://localhost:8002/task1/evaluate";
    
    const payload = {
        essay: SAMPLE_ESSAY.trim(),
        question: SAMPLE_QUESTION,
        student_name: "Test Student",
        chart_type: "Bar Chart",
        image_url: "/charts/task1_bar_water_use_2010_2020.png",
        previous_errors: null,
        attempt_number: 1,
        include_teacher_feedback: true,
        include_markdown: true
    };

    console.log("📡 Sending request to:", endpoint);
    console.log("📝 Payload:");
    console.log("   - Essay length:", payload.essay.split(' ').length, "words");
    console.log("   - include_teacher_feedback:", payload.include_teacher_feedback);
    console.log("   - include_markdown:", payload.include_markdown);
    console.log("\n⏳ Waiting for response...\n");

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.log("❌ Response Status:", response.status);
            const errorText = await response.text();
            console.log("❌ Error:", errorText.substring(0, 300));
            return;
        }

        const data = await response.json();

        console.log("✅ SUCCESS - Response received!");
        console.log("\n📊 Response Structure:");
        console.log("=====================================");
        
        // Check top-level fields
        console.log("\n🔹 Top-level fields:");
        console.log("   - success:", data.success);
        console.log("   - task_type:", data.task_type);
        console.log("   - word_count:", data.word_count);
        console.log("   - teacher_feedback_status:", data.teacher_feedback_status);
        
        // Check scores
        if (data.scores) {
            console.log("\n🔹 Scores object:");
            console.log("   - overall_band:", data.scores.overall_band);
            console.log("   - criterion_scores:", data.scores.criterion_scores?.length, "criteria");
        }

        // Check teacher_feedback
        if (data.teacher_feedback) {
            console.log("\n🔹 Teacher Feedback object:");
            console.log("   - Has task_achievement:", !!data.teacher_feedback.task_achievement);
            console.log("   - Has coherence_cohesion:", !!data.teacher_feedback.coherence_cohesion);
            console.log("   - Has lexical_resource:", !!data.teacher_feedback.lexical_resource);
            console.log("   - Has grammatical_range:", !!data.teacher_feedback.grammatical_range);

            // Check one criterion in detail
            if (data.teacher_feedback.coherence_cohesion) {
                const cc = data.teacher_feedback.coherence_cohesion;
                console.log("\n🔹 Coherence & Cohesion Details:");
                console.log("   - band:", cc.band);
                console.log("   - status:", cc.status);
                console.log("   - Has score_explanation:", !!cc.score_explanation);
                console.log("   - Has strengths:", !!cc.strengths, `(${cc.strengths?.length || 0} items)`);
                console.log("   - Has weakness_patterns:", !!cc.weakness_patterns, `(${cc.weakness_patterns?.length || 0} items)`);

                // Show a sample weakness
                if (cc.weakness_patterns && cc.weakness_patterns.length > 0) {
                    const weakness = cc.weakness_patterns[0];
                    console.log("\n   📝 Sample Weakness:");
                    console.log("      - pattern_name:", weakness.pattern_name);
                    console.log("      - description:", weakness.description);
                    console.log("      - score_impact:", weakness.score_impact || weakness.impact);
                }

                // Show a sample strength
                if (cc.strengths && cc.strengths.length > 0) {
                    const strength = cc.strengths[0];
                    console.log("\n   ✨ Sample Strength:");
                    console.log("      - quote:", strength.quote);
                    console.log("      - explanation:", strength.explanation);
                }
            }
        } else {
            console.log("\n❌ NO TEACHER_FEEDBACK in response!");
        }

        // Check feedback_markdown
        if (data.feedback_markdown) {
            console.log("\n🔹 Markdown Feedback:");
            console.log("   - Length:", data.feedback_markdown.length, "chars");
            console.log("   - Preview:", data.feedback_markdown.substring(0, 100) + "...");
        } else {
            console.log("\n❌ NO MARKDOWN FEEDBACK in response!");
        }

        // Simulate what WritingTask.tsx does
        console.log("\n\n🎨 SIMULATING FRONTEND DATA TRANSFORMATION");
        console.log("==========================================");
        
        const result = {
            evaluation: {
                ...data.scores,
                word_count: SAMPLE_ESSAY.split(/\s+/).length,
                word_count_ok: true,
                teacher_feedback_status: data.teacher_feedback_status,
                feedback_markdown: data.feedback_markdown || null,
                teacher_feedback: data.teacher_feedback || null,
                timing: data.timing || { examiner: 15.0, teacher: 30.0 }
            },
        };

        console.log("\n🔹 After transformation:");
        console.log("   - result.evaluation.overall_band:", result.evaluation.overall_band);
        console.log("   - result.evaluation.teacher_feedback exists:", !!result.evaluation.teacher_feedback);
        console.log("   - result.evaluation.teacher_feedback_status:", result.evaluation.teacher_feedback_status);

        // Test criterion data extraction (simulating WritingFeedback.tsx)
        if (result.evaluation.teacher_feedback) {
            const coherenceData = result.evaluation.teacher_feedback.coherence_cohesion;
            console.log("\n🔹 Extracted Coherence Data:");
            console.log("   - Has data:", !!coherenceData);
            console.log("   - Has score_explanation:", !!coherenceData?.score_explanation);
            console.log("   - Has strengths:", !!coherenceData?.strengths);
            console.log("   - Has weakness_patterns:", !!coherenceData?.weakness_patterns);
        }

        console.log("\n\n✅ Diagnostic Complete!");
        console.log("==========================================");

        // Save full response for inspection
        const fs = require('fs');
        fs.writeFileSync('diagnostic_api_response.json', JSON.stringify(data, null, 2));
        console.log("\n💾 Full response saved to: diagnostic_api_response.json");

    } catch (error) {
        console.log("❌ ERROR:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log("\n⚠️  The API server is not running on port 8002!");
            console.log("   Start it with: cd backend && python -m uvicorn main:app --reload --port 8002");
        }
    }
}

// Run the test
testFrontendAPI().catch(console.error);
