import { ai } from '../../config/aiAgent.js'

export const generateAiSuggestions = async ({ title, hostname, keywords = [], localSuggestions = [] }) => {
    const prompt =
        `
Generate exactly 10 readable URL short code suggestions.

Title:
${title}

Hostname:
${hostname}

Keywords:
${keywords.join(", ")}

Existing Suggestions:
${localSuggestions.join(", ")}
Do NOT use any of these:
${localSuggestions.join(", ")}

Rules:
- lowercase only
- hyphen separated
- maximum 25 characters
- don't repeat existing suggestions
- output ONLY a JSON array

Example:
["indias-latent","latent-indians","latent-epsiod-No."]
    `;
    const response = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt
    })
    
    return JSON.parse(response.output_text);
}