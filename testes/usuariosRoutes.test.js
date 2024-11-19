const request = require('supertest');
const express = require('express');
const usuariosRoutes = require('../routes/usuarios');

const app = express();
app.use(express.json());
app.use('/usuarios', usuariosRoutes);

describe('Rotas de Usuários', () => {
  it('Deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/usuarios/register')
      .send({ nome: 'Teste', email: 'teste@exemplo.com', senha: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('Deve retornar erro ao registrar usuário com dados incompletos', async () => {
    const res = await request(app).post('/usuarios/register').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
