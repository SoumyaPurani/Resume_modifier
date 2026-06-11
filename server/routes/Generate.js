import express from 'express';
import generateCompletion from '../services/ai.js';
import SystemPrompt from '../services/prompt.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: 'Missing resumeText or jobDescription in request body' });
    } else {
        try {
            let data ;
            try {
                data = await readFile(path.join(__dirname, '../data/master-repo.md'), 'utf-8');
            } catch (err) {
                    if (err.code === 'ENOENT') {
                    data = await readFile(path.join(__dirname, '../data/master-repo.template.md'), 'utf-8');
                    } else {
                        console.error(err);
                        return res.status(500).json({ error: 'Error reading master-repo.md' });
                    }
            }
            const userMessage = `Here is the candidate's resume:\n\n${resumeText}\n\nHere is the job description:\n\n${jobDescription}\n\nHere is the master repository of the candidate's experience:\n\n${data}\n\nUsing the above information, generate a tailored resume in JSON format that highlights the most relevant experience, skills, and projects for the given job description. Follow the specified schema and output rules precisely.`;

            const aiContent = await generateCompletion(SystemPrompt, userMessage);
            const jsonStart = aiContent.indexOf('{');
            const jsonEnd = aiContent.lastIndexOf('}');
            if (jsonStart === -1 || jsonEnd === -1) {
                return res.status(502).json({ error: 'AI response does not contain valid JSON' });
            }

            const jsonString = aiContent.substring(jsonStart, jsonEnd + 1);
            let jsonResponse;

            try {
                jsonResponse = JSON.parse(jsonString);
            } catch (parseError) {
                console.error('Error parsing AI response JSON:', parseError);
                return res.status(502).json({ error: 'Error parsing AI response JSON' });
            }
            res.status(200).json(jsonResponse);
        } 
     catch (error) {
        res.status(500).json({ error: 'Error processing request' });
    }
    }
});


export default router;