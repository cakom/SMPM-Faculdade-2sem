// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

// POST /api/registro - Registrar novo usuário
router.post("/registro", async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        // Verifica se email já existe
        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Cria novo usuário
        const novoUsuario = await User.create({
            nome,
            email,
            senha: senhaCriptografada,
            role: role || 'operador'
        });

        // Remove senha da resposta
        const userResponse = novoUsuario.toObject();
        delete userResponse.senha;

        res.status(201).json({ 
            mensagem: 'Usuário criado com sucesso!',
            usuario: userResponse
        });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
});

// POST /api/login - Login de usuário
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Busca usuário pelo email
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }

        // Compara senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }

        // Cria token JWT (válido por 7 dias)
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, role: usuario.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove senha da resposta
        const userResponse = usuario.toObject();
        delete userResponse.senha;

        res.json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: userResponse
        });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao fazer login' });
    }
});

module.exports = router;