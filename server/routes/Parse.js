import multer from 'multer';
import express from 'express';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (req.file) {
            if(req.file.originalname.endsWith('.docx')) {
                const result = await mammoth.extractRawText({ buffer: req.file.buffer });
                res.status(200).json({ text: result.value });
            } else if(req.file.originalname.endsWith('.pdf')) {
                const data = await pdfParse(req.file.buffer);
                res.status(200).json({ text: data.text });
            } else if(req.file.originalname.endsWith('.txt')) {
                res.status(200).json({ text: req.file.buffer.toString('utf-8') });
            } else {
                res.status(400).json({ error: 'Unsupported file type' });
            }
        } else {
            res.status(400).json({ error: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

export default router;