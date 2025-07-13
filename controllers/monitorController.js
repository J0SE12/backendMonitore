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

// Controller para buscar as disciplinas de um monitor específico
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

// Controller para buscar todas as avaliações de um monitor específico
exports.getMonitorAvaliacoes = async (req, res, next) => {
    const monitorId = parseInt(req.params.id, 10);
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
          `SELECT av.id as avaliacao_id, av.feedback, av.criado_em, u.nome as aluno_nome 
           FROM avaliacao_monitores av
           JOIN usuarios u ON av.aluno_id = u.id
           WHERE av.monitor_id = ? ORDER BY av.criado_em DESC`,
          [monitorId]
        );
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
    // 1. Recebendo todos os dados do front-end
    const { nome, capacidade, localizacao, dia_da_semana, hora_inicio, hora_fim } = req.body;

    // 2. Validação para garantir que todos os campos necessários foram enviados
    if (!nome || !capacidade || !localizacao || !dia_da_semana || !hora_inicio || !hora_fim) {
        return res.status(400).json({ message: 'Todos os campos, incluindo o horário, são obrigatórios.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        // 3. Inicia uma transação para garantir que ambas as operações (criar sala e criar horário) sejam bem-sucedidas.
        await connection.beginTransaction();

        // 4. Primeiro, insere a nova sala na tabela 'salas_de_aula'
        const [resultSala] = await connection.query(
            'INSERT INTO salas_de_aula (nome, capacidade, localizacao) VALUES (?, ?, ?)',
            [nome, capacidade, localizacao]
        );
        
        // 5. Pega o ID da sala que acabamos de criar
        const salaId = resultSala.insertId;

        // 6. Em seguida, insere o horário na tabela 'horarios_disponiveis', associando-o ao ID da sala
        await connection.query(
            'INSERT INTO horarios_disponiveis (sala_de_aula_id, dia_da_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?)',
            [salaId, dia_da_semana, hora_inicio, hora_fim]
        );

        // 7. Se tudo deu certo, confirma as alterações no banco de dados
        await connection.commit();
        
        res.status(201).json({ message: 'Sala e horário disponíveis criados com sucesso!' });

    } catch (error) {
        // 8. Se ocorrer qualquer erro, desfaz todas as alterações
        if (connection) await connection.rollback();
        next(error); // Encaminha o erro para o handler de erros do Express
    } finally {
        // 9. Libera a conexão com o banco de dados
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


    
