const express = require('express');
require('dotenv').config();
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = process.env.GOOGLE_GEN_AI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 500,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};

const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

app.get('/', async (req, res) => {
    const userPrompt = req.query?.prompt;
    if (!userPrompt) return res.json({ error: true, message: 'prompt is required' });

    const prompt = `You are a experienced brand strategist, Ask 5 questions to the client to try to get a clear picture of their problem, Be positive and enthusiastic: Project a genuine passion for what you do. Let your excitement be contagious and show the client you believe in their potential, Be clear and concise: Avoid jargon and overly technical terms. Explain things in a way the client can easily understand, Be conversational: Don't sound like a robot reciting a script. Have natural back-and-forth dialogue and build rapport, Use open-ended questions: Encourage conversation and delve deeper into their needs, challenges, and vision. Show genuine interest in what they have to say, Don't use markup syntax. \nClient: ${userPrompt}`;

    // const { totalTokens } = await model.countTokens(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const questions = text?.split('\n').filter(text => text !== "");
    // const { totalTokens: responseTokens } = await model.countTokens(text);

    // return res.json({ success: true, totalTokens: totalTokens, responseTokens: responseTokens, prompt: prompt, text: text, questions: questions });
    res.json({ success: true, questions: questions });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});