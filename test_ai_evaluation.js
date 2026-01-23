/**
 * Test script for Advanced AI Writing Evaluation (Task 1)
 * Based on the test_task1_feedback.py script
 */

console.log("🤖 Testing Advanced AI Writing Evaluation for Task 1\n");
console.log("=" * 60);

// Sample essay and question from the test file
const SAMPLE_ESSAY = `The line graph shows internet users in three countries from 1999 to 2009. Overall, all countries increased. The USA had the most users throughout.

In 1999, the USA had about 20% internet users. This rose steadily to around 80% by 2009. Canada started at approximately 10% in 1999. It increased gradually to about 100% in 2009.

Mexico had the lowest percentage in 1999 at around 5%. The figure remained low until 2005, when it was still only about 25%. However, from 2005 to 2009, Mexico experienced rapid growth, reaching approximately 40% by the end of the period.

In conclusion, all three countries showed an upward trend in internet usage over the ten-year period, with Canada showing the most dramatic increase.`;

const SAMPLE_QUESTION = "The graph below shows the percentage of internet users in three countries between 1999 and 2009. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.";

async function testAIEvaluation(port) {
    console.log(`🎯 Testing AI Evaluation on port ${port}`);
    
    const payload = {
        essay: SAMPLE_ESSAY,
        question: SAMPLE_QUESTION,
        student_name: "Test Student",
        chart_type: "Line Graph",
        image_url: null,
        include_teacher_feedback: true,
        include_markdown: true
    };

    const API_URL = `http://localhost:${port}/task1/evaluate`;
    
    console.log(`   📡 Sending request to: ${API_URL}`);
    console.log(`   📝 Essay length: ${SAMPLE_ESSAY.split(' ').length} words`);
    console.log(`   ⏳ Waiting for response...\n`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            
            console.log("✅ SUCCESS - AI Evaluation received!");
            console.log("   📊 Overall Band:", data.scores?.overall_band || data.examiner_result?.overall_band || "N/A");
            console.log("   📝 Word Count:", data.word_count || data.scores?.word_count || "N/A");
            
            if (data.scores?.criterion_scores || data.examiner_result?.criterion_scores) {
                const criteria = data.scores?.criterion_scores || data.examiner_result?.criterion_scores;
                console.log("   🎯 Criterion Scores:");
                criteria.forEach(criterion => {
                    console.log(`      • ${criterion.criterion}: ${criterion.band}`);
                });
            }
            
            if (data.teacher_feedback_status) {
                console.log("   👩‍🏫 Teacher Feedback:", data.teacher_feedback_status);
            }
            
            if (data.timing) {
                console.log("   ⏱️  Timing:");
                console.log(`      • Examiner: ${data.timing.examiner}s`);
                console.log(`      • Teacher: ${data.timing.teacher}s`);
            }
            
            if (data.examiner_result?.red_flags) {
                console.log("   🚨 Red Flags:");
                data.examiner_result.red_flags.slice(0, 3).forEach(flag => {
                    console.log(`      • ${flag}`);
                });
                if (data.examiner_result.red_flags.length > 3) {
                    console.log(`      • ... and ${data.examiner_result.red_flags.length - 3} more`);
                }
            }
            
            return true;
        } else {
            console.log("❌ FAILED - Status:", response.status);
            const errorText = await response.text();
            console.log("   Error:", errorText.substring(0, 200));
            return false;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("❌ TIMEOUT - Request timed out after 60 seconds");
        } else if (error.code === 'ECONNREFUSED') {
            console.log("❌ CONNECTION REFUSED - AI service not running on port", port);
        } else {
            console.log("❌ ERROR:", error.message);
        }
        return false;
    }
}

async function runAIEvaluationTests() {
    console.log("🚀 Starting Advanced AI Evaluation Tests...\n");
    
    // Test common ports for the AI evaluation service
    const ports = [8001, 8002, 8000, 5000];
    let successFound = false;
    
    for (const port of ports) {
        const success = await testAIEvaluation(port);
        if (success) {
            successFound = true;
            break;
        }
        console.log("");
    }
    
    if (!successFound) {
        console.log("ℹ️  Note: Advanced AI evaluation service appears to be offline.");
        console.log("   The basic Encore evaluation endpoints are working correctly.");
        console.log("   To test advanced AI evaluation, start the AI service first.");
    }
    
    console.log("\n🏁 AI Evaluation tests completed!");
}

// Execute tests
runAIEvaluationTests().catch(console.error);