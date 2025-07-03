const request = require('supertest');
const app = require('../app');
const db = require('../db');

jest.mock('../db');

describe('Testes da API de Monitores (/api/monitor)', () => {

    let mockQuery;
    let mockEnd;

    beforeEach(() => {
        mockQuery = jest.fn();
        mockEnd = jest.fn();
        // Apenas a função exportada e usada precisa ser simulada
        db.createConnection.mockResolvedValue({ query: mockQuery, end: mockEnd });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // === Testes de GET (de monitorRoutes.js) ===
    describe('GET /api/monitor/perfil/:id', () => {
        it('deve retornar o perfil do monitor quando encontrado', async () => {
            const mockMonitor = { id: 1, nome: 'Monitor Chefe', papel: 'monitor' };
            mockQuery.mockResolvedValue([[mockMonitor]]);

            const response = await request(app).get('/api/monitor/perfil/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMonitor);
            expect(mockEnd).toHaveBeenCalled(); 
        });

        it('deve retornar 404 se o monitor não for encontrado', async () => {
            mockQuery.mockResolvedValue([[]]);

            const response = await request(app).get('/api/monitor/perfil/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Monitor não encontrado');
        });
    });

    // === Testes de POST (de postmonit.js) ===
    describe('POST /api/monitor/disciplinas/criar', () => {
        it('deve criar uma nova disciplina com sucesso', async () => {
            mockQuery.mockResolvedValue([{}]); 

            // CORREÇÃO: Usando o prefixo de rota correto
            const response = await request(app)
                .post('/api/monitor/disciplinas/criar')
                .send({ nome: 'Nova Disciplina', descricao: 'Descrição', monitorId: 1 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Disciplina criada com sucesso!');
        });

        it('deve retornar 400 se faltarem dados para criar a disciplina', async () => {
            const response = await request(app)
                .post('/api/monitor/disciplinas/criar')
                .send({ nome: 'Incompleto' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Nome, descrição e ID do monitor são obrigatórios.');
        });
    });

    describe('POST /api/monitor/salas/criar', () => {
        it('deve criar uma nova sala com sucesso', async () => {
            mockQuery.mockResolvedValue([{}]);

            const response = await request(app)
                .post('/api/monitor/salas/criar')
                .send({ nome: 'Sala 303', capacidade: 50, localizacao: 'Bloco C' });
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Sala criada com sucesso!');
        });
    });
});
    it('deve retornar 400 se faltarem dados para criar a sala', async () => {
            const response = await request(app)
                .post('/api/monitor/salas/criar')
                .send({ nome: 'Sala Incompleta' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Nome, capacidade e localização são obrigatórios.');
        });
    

    // === Testes de POST (de alunosRoutes.js) ===
    describe('POST /api/alunos/presencas/criar', () => {
        it('deve registrar a presença de um aluno em uma aula', async () => {
            mockQuery.mockResolvedValue([{}]);

            const response = await request(app)
                .post('/api/alunos/presencas/criar')
                .send({ aulaId: 1, alunoId: 1, presente: true });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Presença registrada com sucesso!');
        });

        it('deve retornar 400 se faltarem dados obrigatórios', async () => {
            const response = await request(app)
                .post('/api/alunos/presencas/criar')
                .send({ aulaId: 1, alunoId: 1 });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('ID da aula, ID do aluno e presença (true/false) são obrigatórios.');
        });
    });
    describe('POST /api/alunos/avaliacao', () => {
        it('deve registrar uma avaliação de monitor com sucesso', async () => {
            mockQuery.mockResolvedValue([{}]);

            const response = await request(app)
                .post('/api/alunos/avaliacao')
                .send({ alunoId: 1, monitorId: 1, feedback: 'Ótimo monitor!' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Avaliação registrada com sucesso!');
        });

        it('deve retornar 400 se faltarem dados obrigatórios', async () => {
            const response = await request(app)
                .post('/api/alunos/avaliacao')
                .send({ alunoId: 1, monitorId: 1 });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Aluno ID, Monitor ID e Feedback são obrigatórios');
        });
    });