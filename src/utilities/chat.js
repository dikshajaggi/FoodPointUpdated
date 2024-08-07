/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai")

const apiKey = "AIzaSyCyv6A2H7WJ13hCPDppL6gfOc3794bbqfo"
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
})

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
}

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
]

async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
        ],
    })

    const result = await chatSession.sendMessage(prompt)
    const response = result.response
    const formattedResponse = response.text()
    .replace(/\*\*([^*]+)\*\*/g, '\n**$1**\n')  
    .replace(/\* ([^*]+)/g, '\n* $1')  
    .replace(/\*\*\d+\./g, '\n$&') 

    const lines = formattedResponse.split('\n').filter(line => line.trim() !== '');
    return lines;
}

export default run