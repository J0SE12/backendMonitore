// Importa a biblioteca mysql2, que tem suporte a Promises,
// tornando o código mais moderno e limpo (sem callbacks).
const mysql = require('mysql2/promise');

// Cria o Pool de Conexões.
// Em vez de criar uma nova conexão para cada requisição, o pool mantém
// um conjunto de conexões prontas para serem reutilizadas.
const pool = mysql.createPool({
  host: 'localhost',
        port: 3306,
        user: 'Jose', 
        password: 'teka5751', 
        database: 'monitore' , // O nome do banco de dados do projeto
  waitForConnections: true,
  connectionLimit: 10,      // Número máximo de conexões que o pool pode ter
  queueLimit: 0             // Limite de requisições na fila (0 = sem limite)
});

// Mensagem para confirmar que o pool foi criado ao iniciar o servidor
console.log('Pool de conexões com o MySQL criado e pronto para uso.');

// Exportamos a variável 'pool' para que os outros arquivos (controllers)
// possam usá-la para fazer consultas ao banco de dados.
module.exports = pool;
