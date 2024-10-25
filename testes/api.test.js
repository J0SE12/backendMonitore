const request = require('supertest');
const express = require('express');
const app = express();

// Middleware para simular seu servidor Express
app.use(express.json());

// Simulação das rotas
app.get('/notificacoes/:id', (req, res) => {
    const alunoId = req.params.id;

    const notificacoes = [
        { id: 1, mensagem: "Sua próxima aula de Física I será amanhã às 10h." },
        { id: 2, mensagem: "Lembre-se de entregar o trabalho de Matemática até sexta-feira." }
    ];

    res.status(200).json(notificacoes);
});

app.post('/avaliacao', (req, res) => {
    const { monitorId, feedback } = req.body;

    if (!monitorId || !feedback) {
        return res.status(400).json({ message: 'Monitor ID e feedback são obrigatórios' });
    }

    res.status(201).json({ message: 'Avaliação registrada com sucesso!' });
});

// Testes
describe('API de Notificações e Avaliação', () => {
    it('deve retornar notificações para um aluno', async () => {
        const res = await request(app).get('/notificacoes/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2); // Verifica se existem 2 notificações
    });

    it('deve registrar uma avaliação de monitor', async () => {
        const res = await request(app)
            .post('/avaliacao')
            .send({ monitorId: 1, feedback: 'Ótimo monitor!' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Avaliação registrada com sucesso!');
    });

    it('deve retornar 400 ao tentar registrar avaliação sem dados obrigatórios', async () => {
        const res = await request(app)
            .post('/avaliacao')
            .send({}); // Enviando dados vazios

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Monitor ID e feedback são obrigatórios');
    });
});
