const express = require('express');
const router = express.Router();
const db = require('../db'); // Módulo que contém as funções de banco de dados
const bcrypt = require('bcrypt'); // Para criptografar senhas
const jwt = require('jsonwebtoken'); // Para gerar o token de autenticação

// Rota de Registro de Novo Usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha, papel } = req.body; // `papel` pode ser "aluno", "professor", etc.

  try {
    const conn = await db.createConnection();
    
    // Verifica se o e-mail já está cadastrado
    const [existingUser] = await conn.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email já está em uso' });
    }
    
    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Insere o novo usuário no banco de dados
    const [result] = await conn.query(
      `INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)`,
      [nome, email, senhaCriptografada, papel]
    );

    // Retorna uma mensagem de sucesso
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  console.log(">>>  "+email+" "+senha);

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

    console.log(">>>  "+usuario.senha);


    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    console.log(">>> senha correta  id: "+usuario.id+", papel: "+usuario.papel);


    // Cria um token JWT
    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },"42",
      { expiresIn: '1h' }
    );

    // Retorna o token, o id do usuário e o papel para o frontend
    res.status(200).json({
      message: 'Login bem-sucedido',
      token: token,
      id: usuario.id,
      papel: usuario.papel
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
