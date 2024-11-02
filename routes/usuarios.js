// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Módulo que contém as funções de banco de dados
const bcrypt = require('bcrypt'); // Para comparar senhas criptografadas
const jwt = require('jsonwebtoken'); // Para gerar o token de autenticação

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const conn = await db.createConnection();
    const [rows] = await conn.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const usuario = rows[0];

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Cria um token JWT
    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },
      process.env.JWT_SECRET, // Certifique-se de definir a variável de ambiente JWT_SECRET
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
