const mysql = require('mysql2/promise');

async function conectarBD() {
    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection;
    }

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'Jose', // Substitua pelo seu nome de usuário
        password: 'teka5751', 
        database: 'monitore' 
    });



    console.log('Conectou no MySQL!');
    global.connection = connection;

    return global.connection;
}

async function criarUsuario(nome, email, senhaHash, papel) {
    const conn = await conectarBD();
    const sql = 'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)';
    const [result] = await conn.query(sql, [nome, email, senhaHash, papel]);
    return { success: true, message: 'Usuário criado com sucesso!', userId: result.insertId };
}


async function criarSala(nome, capacidade, localizacao, horarios) {
    const conn = await conectarBD();
    const sql = 'INSERT INTO salas_de_aula (nome, capacidade, localizacao) VALUES (?, ?, ?)';
    const [result] = await conn.query(sql, [nome, capacidade, localizacao]);

    const salaId = result.insertId;

    if (horarios && Array.isArray(horarios)) {
        for (const horario of horarios) {
            await conn.query(
                'INSERT INTO horarios_disponiveis (sala_de_aula_id, dia_da_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?)',
                [salaId, horario.dia_da_semana, horario.hora_inicio, horario.hora_fim]
            );
        }
    }

    return { success: true, message: 'Sala de aula criada com sucesso!' };
}

async function criarAssunto(nome, descricao, monitor_id) {
    const conn = await conectarBD();
    const sql = 'INSERT INTO disciplinas (nome, descricao, monitor_id) VALUES (?, ?, ?)';
    await conn.query(sql, [nome, descricao, monitor_id]);
    return { success: true, message: 'Assunto criado com sucesso!' };
}

async function listarDisciplinas() {
    const conn = await conectarBD();
    const [disciplinas] = await conn.query('SELECT * FROM disciplinas');
    return disciplinas;
}

async function listarSalas() {
    const conn = await conectarBD();
    const [salas] = await conn.query('SELECT * FROM salas_de_aula');
    return salas;
}

// Conectar ao banco de dados
conectarBD();

module.exports = {
    criarSala,
    criarAssunto,
    listarDisciplinas,
    listarSalas,
    criarUsuario
};
