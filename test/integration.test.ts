import request from 'supertest';
import app from '../src/server';

let gameId: string;

describe('WORDLE FULL FLOW (VG TEST)', () => {

    it('starts a new game', async () => {
        const res = await request(app)
            .post('/api/new-game')
            .send({ length: 5, unique: false });

        expect(res.status).toBe(200);
        expect(res.body.gameId).toBeDefined();

        gameId = res.body.gameId;
    });

    it('accepts guess', async () => {
        const res = await request(app)
            .post('/api/guess')
            .send({
                gameId,
                guess: 'TESTA'
            });

        expect(res.status).toBe(200);
        expect(res.body.feedback).toBeDefined();
    });

    it('can submit highscore', async () => {
        const res = await request(app)
            .post('/api/highscore')
            .send({
                name: 'VGTEST',
                time: 1234,
                guesses: 3,
                length: 5
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

});