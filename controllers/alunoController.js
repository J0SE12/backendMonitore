const pool = require('../db');

// Controller para buscar o perfil do aluno
exports.getAlunoProfile = async (req, res, next) => {
  const alunoId = parseInt(req.params.id, 10);
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      // Removida a senha da consulta por segurança
      `SELECT id, nome, email, papel, criado_em, atualizado_em FROM usuarios WHERE id = ? AND papel = 'aluno'`,
      [alunoId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

// Controller para buscar as aulas do aluno
exports.getAlunoAulas = async (req, res, next) => {
    const alunoId = parseInt(req.params.id, 10);
    let connection;
    try {
        connection = await pool.getConnection();
        // Esta consulta é complexa e pode ser otimizada no futuro
        const [rows] = await connection.query(
            `SELECT a.id_sala, a.nome AS sala_nome, a.localizacao, h.dia_da_semana, h.hora_inicio, h.hora_fim, d.nome AS disciplina
             FROM presencas p
             JOIN salas_de_aula a ON a.id_sala = p.aula_id
             JOIN horarios_disponiveis h ON h.sala_de_aula_id = a.id_sala
             JOIN disciplinas d ON d.id_dsc = a.id_sala
             WHERE p.aluno_id = ?`,
            [alunoId]
        );
        // É melhor retornar um array vazio do que 404 se o aluno não tiver aulas
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Controller para buscar as notificações do aluno
exports.getAlunoNotificacoes = async (req, res, next) => {
    const alunoId = req.params.id;
    try {
        // Lógica para buscar notificações reais do banco de dados
        // Por enquanto, usando dados fictícios como no seu exemplo
        const notificacoes = [
            { id: 1, mensagem: "Sua próxima aula de Física I será amanhã às 10h." },
            { id: 2, mensagem: "Lembre-se de entregar o trabalho de Matemática até sexta-feira." }
        ];
        res.status(200).json(notificacoes);
    } catch (error) {
        next(error);
    }
};

// Controller para o aluno registrar uma avaliação de um monitor
exports.postAvaliacao = async (req, res, next) => {
    const { alunoId, monitorId, feedback } = req.body;

    if (!alunoId || !monitorId || !feedback) {
        return res.status(400).json({ message: 'Aluno ID, Monitor ID e Feedback são obrigatórios' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        // A lógica de verificação de aluno/monitor pode ser removida se a integridade
        // do banco de dados (chaves estrangeiras) já garantir isso.
        await connection.query(
            `INSERT INTO avaliacao_monitores (aluno_id, monitor_id, feedback) VALUES (?, ?, ?)`,
            [alunoId, monitorId, feedback]
        );
        res.status(201).json({ message: 'Avaliação registrada com sucesso!' });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};