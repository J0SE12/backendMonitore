const express = require('express');
const router = express.Router();
const pool = require('../db');


// Rota para criar um novo usuário
router.post('/criarusuario', async (req, res) => {
    const { nome, email, senha, papel } = req.body;
  
    try {
      // Verifique se o usuário já existe
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Usuário já existe' });
      }
  
      // Crie um novo usuário
      const senhaHash = await bcrypt.hash(senha, 10);
      await pool.query('INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)', [nome, email, senhaHash, papel]);
  
      res.status(201).json({ success: true, message: 'Usuário criado com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ success: false, message: 'Erro ao criar o usuário' });
    }
  });
  
  module.exports = router;