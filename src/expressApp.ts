import express, { Request, Response } from 'express';
import path from 'path';
import db from './database';
import apiRouter from './routes/api';
import highscoreService from './services/highscoreService';

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(process.cwd(), 'src/public');
const viewsPath = path.join(process.cwd(), 'src/views');

app.use(express.static(publicPath));

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', viewsPath);

// API ROUTE
app.use('/api', apiRouter);

// FRONTEND
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// ABOUT PAGE
app.get('/about', (req: Request, res: Response) => {
    res.render('about', { activePage: 'about' });
});

// HIGHSCORES (SERVER-SIDED + FILTER)
app.get('/highscores', async (req: Request, res: Response) => {
    try {
        const length = req.query.length
            ? Number(req.query.length)
            : undefined;

        const scores = await highscoreService.getHighscores(length);

        res.render('highscores', {
            scores,
            selectedLength: length || 'all',
            activePage: 'highscores'
        });
    } catch (err) {
        res.status(500).send('DB error');
    }
});

export default app;