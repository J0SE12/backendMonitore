// Em routes/monitorRoutes.js
const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

// === ROTAS DE GET ===
router.get('/perfil/:id', monitorController.getMonitorProfile);
router.get('/disciplinas', monitorController.getAllDisciplinas); // Lista todas as disciplinas
router.get('/disciplinas/:id', monitorController.getMinhasDisciplinas); // Lista as disciplinas de um monitor específico
router.get('/salas', monitorController.getAllSalas);
router.get('/avaliacoes/:id', monitorController.getMonitorAvaliacoes);

// === ROTAS DE POST ===
router.post('/disciplinas/criar', monitorController.createDisciplina);
router.post('/salas/criar', monitorController.createSala);
router.post('/presencas/criar', monitorController.createPresenca);

module.exports = router;