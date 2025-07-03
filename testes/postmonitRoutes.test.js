const request = require('supertest');
const express = require('express');
const postmonitRoutes = require('../routes/postmonit');

const app = express();
app.use(express.json());
app.use('./postmonit', postmonitRoutes);

describe('Rotas de Postagem de Monitoramento', () => {
  it('Deve criar um novo monitoramento', async () => {
    const res = await request(app)
      .post('/postmonit')
      .send({ titulo: 'Monitoramento 1', descricao: 'Descrição do monitoramento' });

    expect(res.status).toBe(201); // Supondo que um novo monitoramento seja criado
    expect(res.body).toHaveProperty('id'); // O retorno deve conter o ID do monitoramento
  });

  it('Deve retornar 400 ao criar monitoramento sem dados obrigatórios', async () => {
    const res = await request(app).post('/postmonit').send({});
    expect(res.status).toBe(400); // Supondo que falhe por falta de dados
    expect(res.body).toHaveProperty('message');
  });
});
