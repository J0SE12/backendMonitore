// controllers/healthController.js
const pool = require('../db');

exports.checkDbConnection = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        res.status(200).json({ status: 'success', message: 'Conexão com o banco de dados bem-sucedida!' });
    } catch (error) {
        // Envia o erro detalhado para o nosso middleware de erro
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
exports.checkApiHealth = (req, res) => {
    res.status(200).json({ status: 'success', message: 'API está funcionando corretamente!' });
};