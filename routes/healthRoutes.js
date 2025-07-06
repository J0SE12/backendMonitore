// routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/health-check', healthController.checkDbConnection);

module.exports = router;