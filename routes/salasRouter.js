// routes/salasRouter.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Ajuste conforme o caminho correto para o seu arquivo de configuração do banco de dados

// Rota para criar uma nova sala de aula
router.post('/criarsala', async (req, res) => {
  const { nome, capacidade, localizacao, horarios } = req.body;

  try {
      const [result] = await pool.query(
          'INSERT INTO salas_de_aula (nome, capacidade, localizacao) VALUES (?, ?, ?)',
          [nome, capacidade, localizacao]
      );

      const salaId = result.insertId;

      if (horarios && Array.isArray(horarios)) {
          for (const horario of horarios) {
              await pool.query(
                  'INSERT INTO horarios_disponiveis (sala_de_aula_id, dia_da_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?)',
                  [salaId, horario.dia_da_semana, horario.hora_inicio, horario.hora_fim]
              );
          }
      }

      res.status(200).json({ success: true, message: 'Sala de aula criada com sucesso!' });
  } catch (error) {
      console.error('Erro ao criar sala de aula:', error);
      res.status(500).json({ success: false, message: 'Erro ao criar sala de aula' });
  }
});

module.exports = router;
