// Importa a biblioteca mysql2, que tem suporte a Promises
const mysql = require('mysql2/promise');

// Cria o Pool de Conexões usando variáveis de ambiente.
// Este é o formato correto para ambientes de produção como o Render.
// O Render irá preencher os valores de process.env com as variáveis
// que você configurar no painel dele.
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  // A linha abaixo pode ser necessária dependendo do provedor do banco de dados (como PlanetScale ou Railway)
  // para garantir uma conexão segura.
  // ssl: {"rejectUnauthorized":true} 
});

// Mensagem para confirmar que o pool foi criado ao iniciar o servidor
console.log('Pool de conexões com o MySQL configurado para produção.');

// Exportamos a variável 'pool' para ser usada pelos controllers.
module.exports = pool;
