// using gemini to cover pdf and extract the text


const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function extractResumeText(buffer) {

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: [
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: buffer.toString("base64")
                }
            },
            {
                text: `
Read this resume.

Extract the candidate's resume information as plain text.

Include:
- Education
- Skills
- Projects
- Experience
- Technologies
- Achievements
- Certifications

Return only the resume information.
`
            }
        ]
    });

    return response.text;
}

module.exports = extractResumeText;