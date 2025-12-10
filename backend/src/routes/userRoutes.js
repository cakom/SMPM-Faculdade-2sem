// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Usuários]
 *     description: Cria um novo usuário no sistema
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
 *                 example: Maria Santos
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *               role:
 *                 type: string
 *                 enum: [admin, tecnico, operador]
 *                 example: tecnico
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */
router.post("/", async (req, res) => {
    try {
        // Criptografa a senha antes de salvar
        const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);
        
        const user = await User.create({
            ...req.body,
            senha: senhaCriptografada
        });
        
        // Remove senha da resposta
        const userResponse = user.toObject();
        delete userResponse.senha;
        
        res.json(userResponse);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Usuários]
 *     description: Retorna uma lista de todos os usuários cadastrados (sem senhas)
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro no servidor
 */
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select('-senha');  // Não retorna senhas
        res.json(users);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     description: Retorna os dados de um usuário específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-senha');
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Usuários]
 *     description: Atualiza os dados de um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, tecnico, operador]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put("/:id", async (req, res) => {
    try {
        // Se estiver atualizando senha, criptografa
        if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-senha');
        
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Usuários]
 *     description: Remove um usuário do sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário deletado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.json({ message: "Usuário deletado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;