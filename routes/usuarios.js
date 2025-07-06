const express = require('express');
const router = express.Router();

// Importa o novo controller
const usuariosController = require('../controllers/usuariosController');

// Define as rotas para apontar para as funções do controller
router.post('/register', usuariosController.registerUser);
router.post('/login', usuariosController.loginUser);

module.exports = router;
