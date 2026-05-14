"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./routes/api"));
const highscoreService_1 = __importDefault(require("./services/highscoreService"));
const app = (0, express_1.default)();
// MIDDLEWARE
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const publicPath = path_1.default.join(process.cwd(), 'src/public');
const viewsPath = path_1.default.join(process.cwd(), 'src/views');
app.use(express_1.default.static(publicPath));
// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', viewsPath);
// API ROUTE
app.use('/api', api_1.default);
// FRONTEND
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
// ABOUT PAGE
app.get('/about', (req, res) => {
    res.render('about', { activePage: 'about' });
});
// HIGHSCORES (SERVER-SIDED + FILTER)
app.get('/highscores', async (req, res) => {
    try {
        const length = req.query.length
            ? Number(req.query.length)
            : undefined;
        const scores = await highscoreService_1.default.getHighscores(length);
        res.render('highscores', {
            scores,
            selectedLength: length || 'all',
            activePage: 'highscores'
        });
    }
    catch (err) {
        res.status(500).send('DB error');
    }
});
exports.default = app;
