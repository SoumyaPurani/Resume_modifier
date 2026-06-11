import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const data = await readFile(path.join(__dirname, '../data/master-repo.md'), 'utf-8');
    res.status(200).json({ content: data, isTemplate: false });
  } catch (err) {
    if (err.code === 'ENOENT') {
      const data = await readFile(path.join(__dirname, '../data/master-repo.template.md'), 'utf-8');
      res.status(200).json({ content: data, isTemplate: true });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error reading master-repo.md' });
    }
  }
});

router.post('/', upload.single('file'), async (req, res) => {
    try{
        if(req.file && req.file.originalname.endsWith('.md')) {
            const content = req.file.buffer.toString('utf-8');
            await writeFile(path.join(__dirname, '../data/master-repo.md'), content);
            res.status(200).json({ content: content, isTemplate: false });
        } else {
            res.status(400).json({ error: 'Invalid file type' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating master-repo.md' });
    }
});

export default router;