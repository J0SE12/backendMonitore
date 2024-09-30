const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para criar um novo assunto
router.post('/cadastrar-assunto', async (req, res) => {
    const { nome, descricao, monitor_id } = req.body;

    if (!nome || !descricao || !monitor_id) {
        return res.status(400).json({ message: 'Nome, descrição e ID do monitor são obrigatórios.' });
    }

    try {
        // Inserir o assunto no banco de dados
        await pool.query(
            'INSERT INTO disciplinas (nome, descricao, monitor_id) VALUES (?, ?, ?)',
            [nome, descricao, monitor_id]
        );

        res.status(200).json({ success: true, message: 'Assunto cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar assunto:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar assunto' });
    }
});

module.exports = router;