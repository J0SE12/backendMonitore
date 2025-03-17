var express = require('express');
var router = express.Router();
var db = require('../db'); // Assumindo que o arquivo db exporta a função `createConnection`

// Rota para obter o perfil do monitor
router.get('/perfil/:id', async (req, res) => {
    const monitorId = parseInt(req.params.id, 10);

    try {
        const conn = await db.createConnection(); // Criação da conexão aqui
        const [rows] = await conn.query(
            `SELECT id, nome, email, papel, criado_em, atualizado_em 
             FROM usuarios 
             WHERE id = ? AND papel = 'monitor'`,
            [monitorId]
        );
        
        conn.end(); // Fechando a conexão

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Monitor não encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter perfil do monitor:', error.message);
        res.status(500).json({ message: 'Erro ao obter perfil do monitor' });
    }
});




// Rota para listar todas as disciplinas
router.get('/disciplinas', async (req, res) => {
    try {
        const conn = await db.createConnection(); // Criação da conexão aqui
        const [rows] = await conn.query(`SELECT * FROM disciplinas`);
        
        conn.end(); // Fechando a conexão

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar disciplinas:', error.message);
        res.status(500).json({ message: 'Erro ao listar disciplinas' });
    }
});

// Rota para listar todas as salas
router.get('/salas', async (req, res) => {
    try {
        const conn = await db.createConnection(); // Criação da conexão aqui
        const [rows] = await conn.query(`SELECT * FROM salas_de_aula`);
        
        conn.end(); // Fechando a conexão

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar salas:', error.message);
        res.status(500).json({ message: 'Erro ao listar salas' });
    }
});

// Rota para listar todas as avaliações dos monitores
router.get('/avaliacoes/monitores', async (req, res) => {
    try {
        const conn = await db.createConnection(); // Criação da conexão aqui
        const [rows] = await conn.query(
            `SELECT am.id, am.monitor_id, am.feedback, am.criado_em, u.nome AS monitor_nome
             FROM avaliacao_monitores am
             JOIN usuarios u ON am.monitor_id = u.id`
        );
        
        conn.end(); // Fechando a conexão

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar avaliações dos monitores:', error.message);
        res.status(500).json({ message: 'Erro ao listar avaliações dos monitores' });
    }
});

// Rota para listar todos os monitores
router.get('/monitores', async (req, res) => {
    try {
        const conn = await db.createConnection();
        const [rows] = await conn.query(
            `SELECT id, nome, email FROM usuarios WHERE role = 'monitor'`
        );
        conn.end();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar monitores:', error.message);
        res.status(500).json({ message: 'Erro ao buscar monitores' });
    }
});


router.get('/presencas/:alunoId', async (req, res) => {
    const { alunoId } = req.params;
    try {
        const conn = await db.createConnection(); // Certifique-se de que a conexão está aberta
        const [rows] = await conn.query('SELECT * FROM presencas WHERE aluno_id = ?', [alunoId]);

        conn.end(); // Fechar a conexão após a consulta

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Nenhuma presença encontrada para o aluno.' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar presenças do aluno:', error);
        res.status(500).json({ message: 'Erro ao listar presenças do aluno' });
    }
});


module.exports = router;
