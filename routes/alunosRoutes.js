const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa o módulo que contém as funções de banco de dados

// Rota para obter o perfil do aluno
// Rota para obter o perfil do aluno
router.get('/perfil/:id', async (req, res) => {
    const alunoId = parseInt(req.params.id, 10); // Converte para número

    try {
        const conn = await db.createConnection;
        const [rows] = await conn.query(
            `SELECT id, nome, email, papel, criado_em, atualizado_em 
             FROM usuarios 
             WHERE id = ? AND papel = 'aluno'`,
            [alunoId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter perfil do aluno:', error.message); // Mensagem detalhada
        res.status(500).json({ message: 'Erro ao obter perfil do aluno' });
    }
});

// Rota para listar notificações do aluno (exemplo fictício)
router.get('/notificacoes/:id', async (req, res) => {
    const alunoId = req.params.id;

    try {
        // Dados fictícios de notificações para testes
        const notificacoes = [
            { id: 1, mensagem: "Sua próxima aula de Física I será amanhã às 10h." },
            { id: 2, mensagem: "Lembre-se de entregar o trabalho de Matemática até sexta-feira." }
        ];

        res.status(200).json(notificacoes);
    } catch (error) {
        console.error('Erro ao obter notificações:', error);
        res.status(500).json({ message: 'Erro ao obter notificações' });
    }
});

// Rota para avaliar um monitor
router.post('/avaliacao', async (req, res) => {
    const { monitorId, feedback } = req.body;

    if (!monitorId || !feedback) {
        return res.status(400).json({ message: 'Monitor ID e feedback são obrigatórios' });
    }

    try {
        const conn = await db.conectarBD();
        await conn.query(
            `INSERT INTO avaliacao_monitores (monitor_id, feedback) VALUES (?, ?)`,
            [monitorId, feedback]
        );

        res.status(201).json({ message: 'Avaliação registrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar avaliação:', error);
        res.status(500).json({ message: 'Erro ao registrar avaliação' });
    }
});

module.exports = router;
