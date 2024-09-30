const mysql = require('mysql2/promise');

async function conectarBD() {
    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection;
    }

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'Jose', // Substitua pelo seu nome de usuário
        password: 'teka5751', // Substitua pela sua senha
        database: 'monitore' // Substitua pelo nome do seu banco de dados
    });

    console.log('Conectou no MySQL!');
    global.connection = connection;

    return global.connection;
}

async function testarConexao() {
    try {
        const conn = await conectarBD();
        
        // Consulta para obter a versão do MySQL
        const [rows] = await conn.query('SELECT VERSION() AS version');
        
        console.log('Conexão bem-sucedida! Versão do MySQL:', rows[0].version);
    } catch (error) {
        console.error('Erro na conexão com o banco de dados:', error);
    }
}

// Executa o teste
testarConexao();

//teste