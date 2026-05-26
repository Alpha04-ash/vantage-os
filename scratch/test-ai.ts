import { generateSynapseResponse, generateMacroeconomicNews } from "../src/services/aiOracle";

async function test() {
  console.log("=== VANTAGE AI DIAGNOSTIC SYSTEM ===");
  console.log("process.env.NEXT_PUBLIC_GEMINI_API_KEY:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  console.log("process.env.GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
  
  try {
    console.log("\n1. Testing Synapse AI Tutor query...");
    const tutorResponse = await generateSynapseResponse("Explain ARR and CAC optimal ratios", 100);
    console.log("Response:", tutorResponse);
    
    console.log("\n2. Testing Macroeconomic News alert query...");
    const newsResponse = await generateMacroeconomicNews("BTC", 76000);
    console.log("Response:", JSON.stringify(newsResponse, null, 2));
    
  } catch (error) {
    console.error("Diagnostic failure:", error);
  }
}

test();
