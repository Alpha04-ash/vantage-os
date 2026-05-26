const fs = require('fs');
const path = require('path');

function getApiKeyFromFile() {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('NEXT_PUBLIC_GEMINI_API_KEY=')) {
          return trimmed.split('NEXT_PUBLIC_GEMINI_API_KEY=')[1].replace(/^"|"$/g, '').trim();
        }
      }
    }
  } catch (e) {
    console.error('Failed to read .env file directly:', e);
  }
  return null;
}

async function testJson() {
  const key = getApiKeyFromFile();
  if (!key) {
    console.error('No API Key found!');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Return a JSON array of 3 strings: "one", "two", "three". Do not write any other text.' }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Candidate Text:', data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testJson();
