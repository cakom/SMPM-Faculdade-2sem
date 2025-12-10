// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

/**
 * @swagger
 * /api/registro:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     description: Cria um novo usuário no sistema com senha criptografada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *               role:
 *                 type: string
 *                 enum: [admin, tecnico, operador]
 *                 example: operador
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário criado com sucesso!
 *                 usuario:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Autenticação]
 *     description: Autentica um usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email ou senha incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 */
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