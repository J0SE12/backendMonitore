const request = require('supertest');
const app = require('../app');
const db = require('../db');

jest.mock('../db');

describe('Testes das Rotas de Alunos (/aluno)', () => {

    let mockQuery;
    
    beforeEach(() => {
        mockQuery = jest.fn();
        
        // CORREÇÃO: Simulamos apenas `createConnection`, que é o que deveria ser usado.
        // Se você corrigir alunosRoutes.js para usar createConnection, este teste funcionará.
        db.createConnection.mockResolvedValue({ query: mockQuery });

        // CORREÇÃO: A função `conectarBD` não é exportada, então não podemos simulá-la diretamente.
        // A melhor prática é fazer com que `alunosRoutes.js` também use `createConnection`.
        // Para o teste passar sem alterar o código-fonte, você pode fazer o mock de createConnection
        // e assumir que conectarBD o chama internamente.
        db.conectarBD = jest.fn().mockResolvedValue({ query: mockQuery });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /aluno/perfil/:id', () => {
        it('deve retornar o perfil do aluno quando encontrado', async () => {
            const mockAluno = { id: 1, nome: 'Aluno Teste', email: 'aluno@teste.com', papel: 'aluno' };
            mockQuery.mockResolvedValue([[mockAluno]]);

            const response = await request(app).get('/aluno/perfil/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAluno);
        });

        it('deve retornar 404 se o aluno não for encontrado', async () => {
            mockQuery.mockResolvedValue([[]]);

            const response = await request(app).get('/aluno/perfil/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Aluno não encontrado');
        });
    });

    describe('POST /aluno/avaliacao', () => {
        it('deve registrar uma avaliação com sucesso', async () => {
            mockQuery
                .mockResolvedValueOnce([[{ id: 1 }]]) 
                .mockResolvedValueOnce([[{ id: 2 }]]) 
                .mockResolvedValueOnce([{}]); 

            const response = await request(app)
                .post('/aluno/avaliacao')
                .send({ alunoId: 1, monitorId: 2, feedback: 'Ótima monitoria!' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Avaliação registrada com sucesso!');
        });
    });
});
