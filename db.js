const mysql = require('mysql2/promise');

// Define o objeto de configuração primeiro
const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: {
    rejectUnauthorized: false 
  },
  // Aumenta o tempo limite da conexão para 20 segundos
  connectTimeout: 20000 
};

// Log das configurações para depuração (NÃO FAÇA ISTO COM SENHAS REAIS EM PROJETOS SÉRIOS)
console.log("A tentar conectar-se ao MySQL com a seguinte configuração:", {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
});

// Cria o Pool de Conexões com o objeto de configuração
const pool = mysql.createPool(dbConfig);

console.log('Pool de conexões com o MySQL configurado para produção com SSL.');
module.exports = pool;