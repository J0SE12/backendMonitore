const request = require('supertest');
const express = require('express');
const alunosRoutes = require('../routes/alunosRoutes');

const app = express();
app.use(express.json());
app.use('/alunos', alunosRoutes);

describe('Rotas de Alunos', () => {
  it('Deve retornar todos os alunos', async () => {
    const res = await request(app).get('/alunos');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Supondo que a rota retorne uma lista de alunos
  });

  it('Deve retornar um aluno específico', async () => {
    const res = await request(app).get('/alunos/1'); // Substitua o ID pelo válido
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1); // Supondo que o retorno contenha o ID do aluno
  });

  it('Deve retornar 404 para aluno inexistente', async () => {
    const res = await request(app).get('/alunos/999');
    expect(res.status).toBe(404); // Aluno com ID inexistente
  });
});
