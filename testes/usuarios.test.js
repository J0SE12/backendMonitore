const request = require('supertest');
const app = require('../app'); // Importa sua aplicação Express principal
const db = require('../db'); // Importa o módulo do banco para simular
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Simula (mock) completamente os módulos. O Jest interceptará qualquer chamada
// a estes módulos e usará nossa simulação em vez do código real.
jest.mock('../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Testes das Rotas de Usuários (/usuarios)', () => {
    
    // Limpa todas as simulações e seus históricos após cada teste para evitar interferência
    afterEach(() => {
        jest.clearAllMocks();
    });

    // === Testes para a rota /register ===
    describe('POST /usuarios/register', () => {
        it('deve registrar um novo usuário com sucesso e retornar 201', async () => {
            // --- Cenário ---
            // 1. A consulta ao BD para ver se o email existe retorna um array vazio.
            // 2. A inserção no BD é bem-sucedida e retorna o ID do novo usuário.
            const mockQuery = jest.fn()
                .mockResolvedValueOnce([[]]) // Simula a verificação de email (não encontrado)
                .mockResolvedValueOnce([{ insertId: 1 }]); // Simula o INSERT (sucesso)
            
            db.createConnection.mockResolvedValue({ query: mockQuery });
            bcrypt.hash.mockResolvedValue('senhaCriptografada123'); // Simula a criptografia

            // --- Execução ---
            const response = await request(app)
                .post('/usuarios/register')
                .send({
                    nome: 'Teste User',
                    email: 'teste@example.com',
                    senha: 'password123',
                    papel: 'aluno'
                });

            // --- Verificação ---
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'Usuário registrado com sucesso',
                userId: 1
            });
            expect(db.createConnection).toHaveBeenCalledTimes(1);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });

        it('deve retornar 409 se o email já estiver em uso', async () => {
            // --- Cenário ---
            // A consulta ao BD encontra um usuário com o mesmo email.
            db.createConnection.mockResolvedValue({
                query: jest.fn().mockResolvedValue([[{ id: 1, email: 'existente@example.com' }]])
            });

            // --- Execução ---
            const response = await request(app)
                .post('/usuarios/register')
                .send({
                    nome: 'Outro User',
                    email: 'existente@example.com',
                    senha: 'password123',
                    papel: 'aluno'
                });

            // --- Verificação ---
            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Email já está em uso');
        });
    });

    // === Testes para a rota /login ===
    describe('POST /usuarios/login', () => {
        it('deve fazer login com sucesso e retornar um token JWT', async () => {
            // --- Cenário ---
            // 1. A consulta ao BD encontra o usuário.
            // 2. A comparação de senha com bcrypt retorna true.
            // 3. A geração do token JWT retorna um token fake.
            const mockUser = { id: 1, email: 'login@example.com', senha: 'hashedPassword', papel: 'aluno' };
            
            db.createConnection.mockResolvedValue({ query: jest.fn().mockResolvedValue([[mockUser]]) });
            bcrypt.compare.mockResolvedValue(true); // Senha correta
            jwt.sign.mockReturnValue('fake.jwt.token');

            // --- Execução ---
            const response = await request(app)
                .post('/usuarios/login')
                .send({ email: 'login@example.com', senha: 'password123' });

            // --- Verificação ---
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Login bem-sucedido',
                token: 'fake.jwt.token',
                id: mockUser.id,
                papel: mockUser.papel
            });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.senha);
            expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id, papel: mockUser.papel }, "42", { expiresIn: '1h' });
        });

        it('deve retornar 401 se a senha estiver incorreta', async () => {
            // --- Cenário ---
            // 1. A consulta ao BD encontra o usuário.
            // 2. A comparação de senha com bcrypt retorna false.
            const mockUser = { id: 1, email: 'login@example.com', senha: 'hashedPassword', papel: 'aluno' };

            db.createConnection.mockResolvedValue({ query: jest.fn().mockResolvedValue([[mockUser]]) });
            bcrypt.compare.mockResolvedValue(false); // Senha incorreta

            // --- Execução ---
            const response = await request(app)
                .post('/usuarios/login')
                .send({ email: 'login@example.com', senha: 'wrongpassword' });

            // --- Verificação ---
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Senha incorreta');
        });

        it('deve retornar 404 se o usuário não for encontrado', async () => {
            // --- Cenário ---
            // A consulta ao BD retorna um array vazio.
            db.createConnection.mockResolvedValue({ query: jest.fn().mockResolvedValue([[]]) });

            // --- Execução ---
            const response = await request(app)
                .post('/usuarios/login')
                .send({ email: 'notfound@example.com', senha: 'password123' });

            // --- Verificação ---
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Usuário não encontrado');
        });
    });
});
