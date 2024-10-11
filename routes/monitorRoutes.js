const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para obter o perfil do monitor
router.get('/perfil/:id', async (req, res) => {
    const monitorId = parseInt(req.params.id, 10);

    try {
        const conn = await db.createConnection();
        const [rows] = await conn.query(
            `SELECT id, nome, email, papel, criado_em, atualizado_em 
             FROM usuarios 
             WHERE id = ? AND papel = 'monitor'`,
            [monitorId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Monitor não encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter perfil do monitor:', error.message);
        res.status(500).json({ message: 'Erro ao obter perfil do monitor' });
    }
});

// Rota para criar uma nova sala
router.post('/salas', async (req, res) => {
    const { nome, capacidade, localizacao } = req.body;

    if (!nome || !capacidade || !localizacao) {
        return res.status(400).json({ message: 'Nome, capacidade e localização são obrigatórios.' });
    }

    try {
        const conn = await db.createConnection();
        await conn.query(
            `INSERT INTO salas_de_aula (nome, capacidade, localizacao) VALUES (?, ?, ?)`,
            [nome, capacidade, localizacao]
        );

        res.status(201).json({ message: 'Sala criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar sala:', error.message);
        res.status(500).json({ message: 'Erro ao criar sala' });
    }
});

// Rota para criar uma nova disciplina
router.post('/disciplinas', async (req, res) => {
    const { nome, descricao, monitorId } = req.body;

    if (!nome || !descricao || !monitorId) {
        return res.status(400).json({ message: 'Nome, descrição e ID do monitor são obrigatórios.' });
    }

    try {
        const conn = await db.createConnection();
        await conn.query(
            `INSERT INTO disciplinas (nome, descricao, monitor_id) VALUES (?, ?, ?)`,
            [nome, descricao, monitorId]
        );

        res.status(201).json({ message: 'Disciplina criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar disciplina:', error.message);
        res.status(500).json({ message: 'Erro ao criar disciplina' });
    }
});

// Rota para listar todas as disciplinas
router.get('/disciplinas', async (req, res) => {
    try {
        const conn = await db.createConnection();
        const [rows] = await conn.query(`SELECT * FROM disciplinas`);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar disciplinas:', error.message);
        res.status(500).json({ message: 'Erro ao listar disciplinas' });
    }
});

// Rota para listar todas as salas
router.get('/salas', async (req, res) => {
    try {
        const conn = await db.createConnection();
        const [rows] = await conn.query(`SELECT * FROM salas_de_aula`);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar salas:', error.message);
        res.status(500).json({ message: 'Erro ao listar salas' });
    }
});

// Rota para listar todas as avaliações dos monitores
router.get('/avaliacoes/monitores', async (req, res) => {
    try {
        const conn = await db.conectarBD(); // Use a função de conexão correta
        const [rows] = await conn.query(
            `SELECT am.id, am.monitor_id, am.feedback, am.criado_em, u.nome AS monitor_nome
             FROM avaliacao_monitores am
             JOIN usuarios u ON am.monitor_id = u.id`
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar avaliações dos monitores:', error.message);
        res.status(500).json({ message: 'Erro ao listar avaliações dos monitores' });
    }
});

module.exports = router;
