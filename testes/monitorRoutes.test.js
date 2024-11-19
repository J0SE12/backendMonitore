const request = require('supertest');
const express = require('express');
const monitorRoutes = require('../routes/monitorRoutes');

const app = express();
app.use(express.json());
app.use('/monitor', monitorRoutes);

describe('Rotas de Monitor', () => {
  it('Deve retornar uma lista de monitores', async () => {
    const res = await request(app).get('/monitor');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Deve retornar informações de um monitor específico', async () => {
    const res = await request(app).get('/monitor/4'); // Substitua pelo ID válido
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('Deve deletar um monitor', async () => {
    const res = await request(app).delete('/monitor/4'); // Substitua pelo ID válido
    expect(res.status).toBe(204); // Supondo que a deleção seja bem-sucedida
  });
});
