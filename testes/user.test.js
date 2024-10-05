const request = require('supertest');
const app = require('../app'); // Importe a aplicação Express

describe('POST /criarusuario', () => {
  it('deve criar um novo usuário com sucesso', async () => {
    const response = await request(app)
      .post('/criarusuario')
      .send({
        nome: 'Novo Usuário',
        email: 'novo_usuario@example.com',
        senha: 'senhaSegura',
        papel: 'aluno',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Usuário criado com sucesso');
  });

  it('deve retornar erro se o usuário já existir', async () => {
    const response = await request(app)
      .post('/criarusuario')
      .send({
        nome: 'Novo Usuário',
        email: 'novo_usuario@example.com',
        senha: 'senhaSegura',
        papel: 'aluno',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Usuário já existe');
  });
});
