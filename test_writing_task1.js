/**
 * Test script for IELTS Writing Task 1 endpoints
 */

console.log("🧪 Testing IELTS Writing Task 1 API Endpoints\n");
console.log("=" * 50);

// Test 1: Get a Writing Prompt
async function testGetWritingPrompt() {
    console.log("📝 TEST 1: Getting Writing Task 1 Prompt");
    try {
        const response = await fetch('http://localhost:4000/writing/prompt/1');
        const data = await response.json();
        
        if (response.ok) {
            console.log("✅ SUCCESS - Prompt received:");
            console.log("   Task Type:", data.taskType);
            console.log("   Prompt:", data.prompt.substring(0, 100) + "...");
            return data;
        } else {
            console.log("❌ FAILED - Status:", response.status);
            console.log("   Error:", data);
        }
    } catch (error) {
        console.log("❌ ERROR:", error.message);
    }
    console.log("");
}

// Test 2: Get a Specific Test Prompt (Test ID 5 - Water Consumption)
async function testGetSpecificPrompt() {
    console.log("📊 TEST 2: Getting Specific Test Prompt (Test ID 5)");
    try {
        const response = await fetch('http://localhost:4000/writing/prompt/1?test_id=5');
        const data = await response.json();
        
        if (response.ok) {
            console.log("✅ SUCCESS - Specific prompt received:");
            console.log("   Task Type:", data.taskType);
            console.log("   Prompt:", data.prompt);
            return data;
        } else {
            console.log("❌ FAILED - Status:", response.status);
        }
    } catch (error) {
        console.log("❌ ERROR:", error.message);
    }
    console.log("");
}

// Test 3: Submit a Writing Task 1 Essay
async function testSubmitWriting() {
    console.log("📤 TEST 3: Submitting Writing Task 1 Essay");
    
    const sampleEssay = {
        userId: 1,
        taskType: 1,
        prompt: "The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020.",
        content: `The bar chart compares the average daily water consumption per person in five cities between 2010 and 2020.

Overall, all cities showed an increase in water consumption over the ten-year period. New York had the highest consumption in both years, while Tokyo had the lowest.

In 2010, New York consumed approximately 200 litres per person daily, followed by London at around 150 litres. Paris and Berlin consumed similar amounts at about 120 and 100 litres respectively. Tokyo had the lowest consumption at roughly 80 litres per person.

By 2020, all cities had increased their consumption. New York rose to about 250 litres, maintaining its position as the highest consumer. London increased to approximately 180 litres, while Paris rose to 140 litres. Berlin showed the most significant growth, reaching 130 litres. Tokyo, despite having the smallest increase, reached 100 litres per person daily.

In conclusion, water consumption increased across all cities, with Berlin showing the most dramatic rise and Tokyo maintaining the most conservative usage pattern.`
    };

    try {
        const response = await fetch('http://localhost:4000/writing/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sampleEssay)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log("✅ SUCCESS - Essay submitted and evaluated:");
            console.log("   Submission ID:", data.id);
            console.log("   Band Score:", data.bandScore);
            console.log("   Grammar Feedback:", data.grammarFeedback.substring(0, 80) + "...");
            console.log("   Vocabulary Feedback:", data.vocabularyFeedback.substring(0, 80) + "...");
            console.log("   Structure Feedback:", data.structureFeedback.substring(0, 80) + "...");
            return data;
        } else {
            console.log("❌ FAILED - Status:", response.status);
            console.log("   Error:", data);
        }
    } catch (error) {
        console.log("❌ ERROR:", error.message);
    }
    console.log("");
}

// Test 4: Get Writing Sessions for a User
async function testGetWritingSessions() {
    console.log("📋 TEST 4: Getting Writing Sessions for User");
    try {
        const response = await fetch('http://localhost:4000/users/1/writing/sessions');
        const data = await response.json();
        
        if (response.ok) {
            console.log("✅ SUCCESS - Sessions retrieved:");
            console.log("   Number of sessions:", data.sessions.length);
            if (data.sessions.length > 0) {
                const latest = data.sessions[0];
                console.log("   Latest session:");
                console.log("     ID:", latest.id);
                console.log("     Task Type:", latest.taskType);
                console.log("     Band Score:", latest.bandScore);
                console.log("     Created:", latest.createdAt);
            }
            return data;
        } else {
            console.log("❌ FAILED - Status:", response.status);
        }
    } catch (error) {
        console.log("❌ ERROR:", error.message);
    }
    console.log("");
}

// Run all tests
async function runAllTests() {
    console.log("🚀 Starting Writing Task 1 API Tests...\n");
    
    await testGetWritingPrompt();
    await testGetSpecificPrompt();
    await testSubmitWriting();
    await testGetWritingSessions();
    
    console.log("🏁 All tests completed!");
}

// Execute tests
runAllTests().catch(console.error);