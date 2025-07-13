const express = require('express');
const router = express.Router();
const aulasController = require('../controllers/aulasController');

router.post('/criar', aulasController.createAula);
router.get('/', aulasController.getAllAulas);
router.post('/inscrever', aulasController.inscreverAluno);
router.get('/horarios', aulasController.getHorariosDisponiveis);

module.exports = router;