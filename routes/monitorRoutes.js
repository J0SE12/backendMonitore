const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

// === ROTAS DE GET ===
router.get('/perfil/:id', monitorController.getMonitorProfile);
router.get('/disciplinas', monitorController.getAllDisciplinas); // Supondo que você queira uma rota para listar todas
router.get('/salas', monitorController.getAllSalas); // Supondo que você queira uma rota para listar todas
router.get('/avaliacoes/:id', monitorController.getMonitorAvaliacoes);

// === ROTAS DE POST ===
router.post('/disciplinas/criar', monitorController.createDisciplina);
router.post('/salas/criar', monitorController.createSala);
router.post('/presencas/criar', monitorController.createPresenca);

module.exports = router;