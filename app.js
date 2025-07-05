var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

// Importações de Rotas

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios'); // Usando a rota de usuários correta
var testAPIRouter = require("./routes/testAPI");
var alunoRouter = require('./routes/alunosRoutes');
var monitorRoutes = require('./routes/monitorRoutes');

// Inicializa a aplicação Express
var app = express();

// Configuração do View Engine (mantida, embora não seja usada pela API JSON)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configuração do CORS
const allowedOrigins = [
  'https://FrontMonitore.azurestaticapps.net',
  'http://localhost:3000'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middlewares Padrão
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Definição das Rotas da API
app.use('/', indexRouter);
app.use('/testAPI', testAPIRouter);
app.use('/usuarios', usersRouter); // Rota para registro e login
app.use('/aluno', alunoRouter);     // Rotas específicas para alunos
app.use('/api/monitor', monitorRoutes); // Rotas específicas para monitores

// =================================================================
// Middleware para Capturar Rotas Não Encontradas (404)
// Se nenhuma das rotas acima corresponder, esta será acionada.
// =================================================================
app.use(function(req, res, next) {
  next(createError(404, 'Endpoint não encontrado'));
});

// =================================================================
// Middleware de Tratamento de Erros (Nosso Novo Gerenciador Central)
// Este é o manipulador de erros que substitui o padrão.
// Ele captura todos os erros enviados por `next(error)` nos controllers.
// =================================================================
app.use(function(err, req, res, next) {
  // Loga o erro completo no console do servidor para depuração
  console.error('ERRO CAPTURADO:', err.message);

  // Define um status de erro padrão
  const statusCode = err.status || 500;

  // Envia uma resposta de erro padronizada em formato JSON
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Ocorreu um erro inesperado no servidor.'
  });
});

module.exports = app;