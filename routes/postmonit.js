const express = require('express');
const router = express.Router();
const db = require('../db'); // Assumindo que o arquivo db exporta a função `createConnection`


// Rota para criar uma nova disciplina
router.post('/disciplinas/criar', async (req, res) => {
    const { nome, descricao, monitorId } = req.body;

    if (!nome || !descricao || !monitorId) {
        return res.status(400).json({ message: 'Nome, descrição e ID do monitor são obrigatórios.' });
    }

    try {
        const conn = await db.createConnection(); // Criação da conexão aqui
        await conn.query(
            `INSERT INTO disciplinas (nome, descricao, monitor_id) VALUES (?, ?, ?)`,
            [nome, descricao, monitorId]
        );
        
        conn.end(); // Fechando a conexão

        res.status(201).json({ message: 'Disciplina criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar disciplina:', error.message);
        res.status(500).json({ message: 'Erro ao criar disciplina' });
    }
});

// Rota para criar uma nova sala
router.post('/salas/criar', async (req, res) => {
    const { nome, capacidade, localizacao } = req.body;

    if (!nome || !capacidade || !localizacao) {
        return res.status(400).json({ message: 'Nome, capacidade e localização são obrigatórios.' });
    }

    try {
        const conn = await db.createConnection(); // Criação da conexão aqui
        await conn.query(
            `INSERT INTO salas_de_aula (nome, capacidade, localizacao) VALUES (?, ?, ?)`,
            [nome, capacidade, localizacao]
        );
        
        conn.end(); // Fechando a conexão

        res.status(201).json({ message: 'Sala criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar sala:', error.message);
        res.status(500).json({ message: 'Erro ao criar sala' });
    }
});

module.exports = router;