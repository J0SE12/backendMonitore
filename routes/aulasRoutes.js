const express = require('express');
const router = express.Router();
const aulasController = require('../controllers/aulasController');

// Rota para o monitor criar uma aula
// Ex: POST http://localhost:9000/aulas/criar
router.post('/criar', aulasController.createAula);

// Rota para o aluno ver todas as aulas disponíveis
// Ex: GET http://localhost:9000/aulas
router.get('/', aulasController.getAllAulas);

// Rota para o aluno se inscrever numa aula
// Ex: POST http://localhost:9000/aulas/inscrever
router.post('/inscrever', aulasController.inscreverAluno);

module.exports = router;