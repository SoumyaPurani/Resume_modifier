import './env.js';
import cors from 'cors';
import express from 'express';
import MasterRepoRouter from './routes/MasterRepo.js';
import ParseRouter from './routes/Parse.js';
import GenerateRouter from './routes/Generate.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json({ limit: '10mb' }));
app.use('/api/master-repo', MasterRepoRouter);
app.use('/api/parse-resume', ParseRouter);
app.use('/api/generate-resume', GenerateRouter);

app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});