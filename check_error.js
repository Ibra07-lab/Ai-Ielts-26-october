/**
 * Quick script to check the full error response from the API
 */

async function checkError() {
    console.log("🔍 Checking for error details in API response\n");

    const endpoint = "http://localhost:8002/task1/evaluate";
    
    const payload = {
        essay: "The bar chart show the average daily water consumption per person in five cities in 2010 and 2020, it is measured by litres per day. Overall, it is clear that water consumption was decreased in most of the cities during the ten years.",
        question: "The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020.",
        student_name: "Test Student",
        chart_type: "Bar Chart",
        image_url: null,
        include_teacher_feedback: true,
        include_markdown: true
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        console.log("✅ Response received!");
        console.log("\n🔍 Error Information:");
        console.log("   - teacher_feedback_status:", data.teacher_feedback_status);
        console.log("   - teacher_feedback_message:", data.teacher_feedback_message || "No message provided");
        console.log("   - teacher_feedback:", data.teacher_feedback === null ? "null" : "exists");
        
        if (data.teacher_feedback_message) {
            console.log("\n❌ ERROR MESSAGE:");
            console.log("   " + data.teacher_feedback_message);
        }

        if (data.timing) {
            console.log("\n⏱️ Timing:");
            console.log("   - Examiner:", data.timing.examiner + "s");
            console.log("   - Teacher:", data.timing.teacher + "s");
            if (data.timing.explanations) {
                console.log("   - Explanations:", data.timing.explanations + "s");
            }
        }

        // Save for inspection
        const fs = require('fs');
        fs.writeFileSync('error_response.json', JSON.stringify(data, null, 2));
        console.log("\n💾 Full response saved to: error_response.json");

    } catch (error) {
        console.log("❌ Request failed:", error.message);
    }
}

checkError().catch(console.error);
