import request from 'supertest';
import app from '../src/expressApp';

let gameId: string;

describe('Wordle API', () => {

    // ======================
    // START GAME
    // ======================
    it('starts a new game', async () => {
        const res = await request(app)
            .post('/api/new-game')
            .send({ length: 5, unique: false });

        expect(res.status).toBe(200);
        expect(res.body.gameId).toBeDefined();

        gameId = res.body.gameId;
    });

    // GUESS
    it('accepts guess', async () => {
        const res = await request(app)
            .post('/api/guess')
            .send({
                gameId,
                guess: 'TESTA'
            });

        expect(res.status).toBe(200);
        expect(res.body.feedback).toBeDefined();
        expect(Array.isArray(res.body.feedback)).toBe(true);
    });

});