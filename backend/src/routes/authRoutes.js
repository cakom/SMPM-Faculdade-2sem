// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-aqui";

/**
 * @swagger
 * /api/auth/register:
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
 *       400:
 *         description: Email já cadastrado
 *       500:
 *         description: Erro no servidor
 */
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Dados obrigatórios não informados" });
    }

    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await User.create({
      nome,
      email,
      senha: senhaCriptografada,
      role: role || "operador",
    });

    const userResponse = novoUsuario.toObject();
    delete userResponse.senha;

    res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      usuario: userResponse,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
});

/**
 * @swagger
 * /api/auth/login:
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
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha incorretos
 *       500:
 *         description: Erro no servidor
 */
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = usuario.toObject();
    delete userResponse.senha;

    res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: userResponse,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

module.exports = router;
