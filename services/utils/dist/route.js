import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
router.post('/upload', async (req, res) => {
    try {
        // console.log("req at upload route in utils service")
        // console.log("req.body ",req.body);
        const { buffer, public_id } = req.body; // public id so that we can remove the old resume or profile if user is updating to new
        if (public_id) { // to delete the old one if do exists 
            await cloudinary.uploader.destroy(public_id);
        }
        const cloud = await cloudinary.uploader.upload(buffer);
        res.status(200).json({ url: cloud.secure_url, public_id: cloud.public_id });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
router.post('/carrier', async (req, res) => {
    try {
        const { skills } = req.body;
        if (!skills) {
            return res.status(400).json({ "message": "skills are required for getting guidence" });
        }
        const prompt = `
            Based on the following skills: ${skills}.
            Please act as a career advisor and generate a career path suggestion.
            Your entire response must be in a valid JSON format. Do not include any text or markdown
            formatting outside of the JSON structure.
            The JSON object should have the following structure:
            {
            "summary": "A brief, encouraging summary of the user's skill set and their general job
            title.",
            "jobOptions": [
            {
            "title": "The name of the job role.",
            "responsibilities": "A description of what the user would do in this role.",
            "why": "An explanation of why this role is a good fit for their skills."
            }
            ],
            "skillsToLearn": [
            {
            "category": "A general category for skill improvement (e.g., 'Deepen Your Existing Stack
            Mastery', 'DevOps & Cloud').",
            "skills": [
            {
            "title": "The name of the skill to learn.",
            "why": "Why learning this skill is important.",
            "how": "Specific examples of how to learn or apply this skill."
            }
            ]
            }
            ],
            "learningApproach": {
            "title": "How to Approach Learning",
            "points": ["A bullet point list of actionable advice for learning."]
            }
            }
            `;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        let jsonResponse;
        try {
            const rawText = response.text?.replace(/```json/g, "").replace(/```/g, "").trim();
            if (!rawText) {
                throw new Error("Ai didn't return a valid json response");
            }
            jsonResponse = JSON.parse(rawText);
            res.status(200).json(jsonResponse);
        }
        catch (error) {
            return res.status(500).json({ "error": "Ai didn't return a valid json response" });
        }
    }
    catch (error) {
        console.log("error in ai service ", error.message);
        res.status(500).json({ error: error.message });
    }
});
export default router;
