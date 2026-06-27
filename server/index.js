import './env.js';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import MasterRepoRouter from './routes/MasterRepo.js';
import ParseRouter from './routes/Parse.js';
import GenerateRouter from './routes/Generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/api/master-repo', MasterRepoRouter);
app.use('/api/parse-resume', ParseRouter);
app.use('/api/generate-resume', GenerateRouter);

app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});

const distPath = path.join(__dirname, '../dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
