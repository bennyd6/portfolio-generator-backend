const axios = require('axios');

// 👉 Replace with your own Gemini API key

module.exports = async function parseWithGemini(resumeText) {
  const prompt = `
Extract the following details from the resume text:

1. Name
2. Email & Phone
3. Education
4. Skills
5. Work Experience
6. Projects
7. Links (GitHub, LinkedIn, etc.)

Return the result strictly as a **minified JSON object** with keys:
"name", "email", "phone", "education", "skills", "work_experience", "projects", "links".

Resume Text:
"""${resumeText}"""
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('No JSON found in Gemini response');

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Gemini API Error:', err.message);
    throw new Error('Failed to parse resume with Gemini');
  }
};
