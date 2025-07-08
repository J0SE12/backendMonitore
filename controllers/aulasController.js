const pool = require('../db');

// Controller para um monitor criar uma nova aula
exports.createAula = async (req, res, next) => {
    const { disciplina_id, monitor_id, horario_id, titulo_aula, vagas_disponiveis } = req.body;
    if (!disciplina_id || !monitor_id || !horario_id || !titulo_aula || !vagas_disponiveis) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO aulas (disciplina_id, monitor_id, horario_id, titulo_aula, vagas_disponiveis) VALUES (?, ?, ?, ?, ?)',
            [disciplina_id, monitor_id, horario_id, titulo_aula, vagas_disponiveis]
        );
        res.status(201).json({ message: 'Aula criada com sucesso!', aulaId: result.insertId });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Controller para um aluno ver todas as aulas disponíveis
exports.getAllAulas = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(`
            SELECT 
                a.id_aula, a.titulo_aula, a.vagas_disponiveis,
                d.nome AS disciplina_nome,
                u.nome AS monitor_nome,
                s.nome AS sala_nome, s.localizacao,
                h.dia_da_semana, h.hora_inicio, h.hora_fim
            FROM aulas a
            JOIN disciplinas d ON a.disciplina_id = d.id_dsc
            JOIN usuarios u ON a.monitor_id = u.id
            JOIN horarios_disponiveis h ON a.horario_id = h.id_hor
            JOIN salas_de_aula s ON h.sala_de_aula_id = s.id_sala
            WHERE a.vagas_disponiveis > 0
            ORDER BY h.dia_da_semana, h.hora_inicio
        `);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Controller para um aluno se inscrever numa aula
exports.inscreverAluno = async (req, res, next) => {
    const { aula_id, aluno_id } = req.body;
    if (!aula_id || !aluno_id) {
        return res.status(400).json({ message: 'ID da aula e ID do aluno são obrigatórios.' });
    }
    let connection;
    try {
        connection = await pool.getConnection();
        // Transação para garantir que a vaga seja decrementada e a inscrição seja feita de forma atómica
        await connection.beginTransaction();
        await connection.query('INSERT INTO inscricoes (aula_id, aluno_id) VALUES (?, ?)', [aula_id, aluno_id]);
        await connection.query('UPDATE aulas SET vagas_disponiveis = vagas_disponiveis - 1 WHERE id_aula = ?', [aula_id]);
        await connection.commit();
        res.status(201).json({ message: 'Inscrição realizada com sucesso!' });
    } catch (error) {
        if (connection) await connection.rollback();
        // Trata o erro de inscrição duplicada
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Você já está inscrito nesta aula.' });
        }
        next(error);
    } finally {
        if (connection) connection.release();
    }
};