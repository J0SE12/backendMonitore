const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller para registar um novo utilizador
exports.registerUser = async (req, res, next) => {
    const { nome, email, senha, papel } = req.body;

    if (!nome || !email || !senha || !papel) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Verifica se o email já existe
        const [existingUser] = await connection.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email já está em uso' });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Insere o novo utilizador
        const [result] = await connection.query(
            'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
            [nome, email, senhaCriptografada, papel]
        );

        res.status(201).json({ message: 'Utilizador registado com sucesso', userId: result.insertId });

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// Controller para fazer login de um utilizador
exports.loginUser = async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }

        const user = users[0];
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Cria o token JWT
        const token = jwt.sign(
            { id: user.id, papel: user.papel },
            '42', // Substitua '42' por uma chave secreta mais segura, guardada numa variável de ambiente
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login bem-sucedido',
            token: token,
            id: user.id,
            papel: user.papel
        });


        // Controller para buscar todos os alunos
exports.getAllAlunos = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT id, nome FROM usuarios WHERE papel = 'aluno' ORDER BY nome ASC`
        );
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};