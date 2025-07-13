const pool = require('../db'); // Importa o POOL

// === FUNÇÕES DE GET (BUSCAR DADOS) ===

exports.getMonitorProfile = async (req, res, next) => {
  const monitorId = parseInt(req.params.id, 10);
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT id, nome, email, papel FROM usuarios WHERE id = ? AND papel = 'monitor'`,
      [monitorId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Monitor não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

exports.getAllDisciplinas = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM disciplinas');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

exports.getAllSalas = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM salas_de_aula');
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Adicione aqui os outros controllers de GET se houver...

// === FUNÇÕES DE POST (CRIAR DADOS) ===

exports.createDisciplina = async (req, res, next) => {
    const { nome, descricao, monitorId } = req.body;
    if (!nome || !descricao || !monitorId) {
        return res.status(400).json({ message: 'Nome, descrição e ID do monitor são obrigatórios.' });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO disciplinas (nome, descricao, monitor_id) VALUES (?, ?, ?)`,
            [nome, descricao, monitorId]
        );
        res.status(201).json({ message: 'Disciplina criada com sucesso!' });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

exports.createSala = async (req, res, next) => {
    const { nome, capacidade, localizacao } = req.body;
    if (!nome || !capacidade || !localizacao) {
        return res.status(400).json({ message: 'Nome, capacidade e localização são obrigatórios.' });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO salas_de_aula (nome, capacidade, localizacao) VALUES (?, ?, ?)`,
            [nome, capacidade, localizacao]
        );
        res.status(201).json({ message: 'Sala criada com sucesso!' });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

exports.createPresenca = async (req, res, next) => {
    const { aulaId, alunoId, presente } = req.body;
    if (!aulaId || !alunoId || typeof presente !== 'boolean') {
        return res.status(400).json({ message: 'ID da aula, ID do aluno e presença (true/false) são obrigatórios.' });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO presencas (aula_id, aluno_id, presente) VALUES (?, ?, ?)`,
            [aulaId, alunoId, presente]
        );
        res.status(201).json({ message: 'Presença registrada com sucesso!' });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Controller para buscar todas as avaliações de um monitor específico
exports.getMonitorAvaliacoes = async (req, res, next) => {
  const monitorId = parseInt(req.params.id, 10);
  let connection;

  try {
    connection = await pool.getConnection();
    
    // Esta consulta busca as avaliações e também o nome do aluno que a fez,
    // o que é muito útil para exibir na interface.
    const [rows] = await connection.query(
      `SELECT 
         av.id as avaliacao_id, 
         av.feedback, 
         av.criado_em, 
         u.nome as aluno_nome 
       FROM avaliacao_monitores av
       JOIN usuarios u ON av.aluno_id = u.id
       WHERE av.monitor_id = ?
       ORDER BY av.criado_em DESC`, // Ordena da mais recente para a mais antiga
      [monitorId]
    );
    
    exports.getMinhasDisciplinas = async (req, res, next) => {
    const monitorId = parseInt(req.params.id, 10);
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM disciplinas WHERE monitor_id = ?', [monitorId]);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};


    // Retorna a lista de avaliações (pode ser um array vazio, o que não é um erro)
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};