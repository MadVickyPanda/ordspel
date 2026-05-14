"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const expressApp_1 = __importDefault(require("../src/expressApp"));
describe('Wordle API', () => {
    it('starts a new game', async () => {
        const res = await (0, supertest_1.default)(expressApp_1.default)
            .post('/api/new-game')
            .send({ length: 5, unique: false });
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });
    it('accepts guess', async () => {
        await (0, supertest_1.default)(expressApp_1.default)
            .post('/api/new-game')
            .send({ length: 5, unique: false });
        const res = await (0, supertest_1.default)(expressApp_1.default)
            .post('/api/guess')
            .send({ guess: 'TESTA' });
        expect(res.status).toBe(200);
        expect(res.body.feedback).toBeDefined();
    });
});
