const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Rota para obter o perfil do aluno
router.get('/perfil/:id', alunoController.getAlunoProfile);

// Rota para listar as aulas de um aluno
router.get('/aulas/:id', alunoController.getAlunoAulas);

// Rota para listar as notificações de um aluno
router.get('/notificacoes/:id', alunoController.getAlunoNotificacoes);

// Rota para o aluno submeter uma avaliação
router.post('/avaliacao', alunoController.postAvaliacao);

module.exports = router;
