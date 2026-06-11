import multer from 'multer';
import express from 'express';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

async function parsePDF(buffer) {
    const data = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
    const pdf = await loadingTask.promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        pages.push(text);
    }
    return pages.join('\n');
}

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (req.file.originalname.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            return res.status(200).json({ text: result.value });
        }
        if (req.file.originalname.endsWith('.pdf')) {
            const text = await parsePDF(req.file.buffer);
            return res.status(200).json({ text });
        }
        if (req.file.originalname.endsWith('.txt')) {
            return res.status(200).json({ text: req.file.buffer.toString('utf-8') });
        }
        return res.status(400).json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' });
    } catch (error) {
        console.error('Parse error:', error.message);
        return res.status(500).json({ error: 'Error processing file' });
    }
});

export default router;
